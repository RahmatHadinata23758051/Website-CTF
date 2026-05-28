package services

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/repositories"

	"github.com/google/uuid"
)

// ScoreboardRowDTO represents a clean public rank profile for the grid.
type ScoreboardRowDTO struct {
	Rank          int       `json:"rank"`
	UserID        uuid.UUID `json:"user_id"`
	Name          string    `json:"name"`
	TotalPoints   int64     `json:"total_points"`
	TotalSolves   int64     `json:"total_solves"`
	LastSolveTime time.Time `json:"last_solve_time"`
}

// ScoreboardService wraps calculation queries and schedules short-TTL Redis caching.
type ScoreboardService struct {
	repo *repositories.ScoreboardRepository
}

// NewScoreboardService returns a service instance.
func NewScoreboardService(repo *repositories.ScoreboardRepository) *ScoreboardService {
	return &ScoreboardService{repo: repo}
}

// GetScoreboard fetches ranks, calculates indices, and queries Redis cache states.
func (s *ScoreboardService) GetScoreboard() ([]ScoreboardRowDTO, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	cacheKey := "cache:scoreboard"

	// 1. Try resolving scoreboard from Redis cache if available
	if database.RedisClient != nil {
		cachedVal, err := database.RedisClient.Get(ctx, cacheKey).Result()
		if err == nil {
			var cachedList []ScoreboardRowDTO
			if err := json.Unmarshal([]byte(cachedVal), &cachedList); err == nil {
				return cachedList, nil
			}
		}
	}

	// 2. Fetch raw aggregate data from PostgreSQL
	rows, err := s.repo.CalculateScoreboard()
	if err != nil {
		return nil, err
	}

	// 3. Map aggregates to clean ranked DTO vectors
	dtoList := make([]ScoreboardRowDTO, 0, len(rows))
	for i, r := range rows {
		dtoList = append(dtoList, ScoreboardRowDTO{
			Rank:          i + 1, // 1-indexed ranks
			UserID:        r.UserID,
			Name:          r.Name,
			TotalPoints:   r.TotalPoints,
			TotalSolves:   r.TotalSolves,
			LastSolveTime: r.LastSolveTime,
		})
	}

	// 4. Cache compiled scoreboard inside Redis with a short 15-second TTL
	if database.RedisClient != nil && len(dtoList) > 0 {
		jsonBytes, err := json.Marshal(dtoList)
		if err == nil {
			if err := database.RedisClient.Set(ctx, cacheKey, string(jsonBytes), 15*time.Second).Err(); err != nil {
				log.Printf("[SCOREBOARD CACHE] Warning: failed to write cache: %v\n", err)
			}
		}
	}

	return dtoList, nil
}
