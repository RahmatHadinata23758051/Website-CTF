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

// SolveSeriesPoint holds a cumulative scoreboard point value at a specific timestamp.
type SolveSeriesPoint struct {
	Timestamp time.Time `json:"timestamp"`
	Points    int       `json:"points"`
}

// PlayerProgressionDTO represents the cumulative score progression profile over time for a player.
type PlayerProgressionDTO struct {
	UserID      uuid.UUID          `json:"user_id"`
	Name        string             `json:"name"`
	Rank        int                `json:"rank"`
	TotalPoints int64              `json:"total_points"`
	TotalSolves int64              `json:"total_solves"`
	Series      []SolveSeriesPoint `json:"series"`
}

// GetScoreboardProgression calculates the progressive solves points progression over time for the Top 10 players.
func (s *ScoreboardService) GetScoreboardProgression() ([]PlayerProgressionDTO, error) {
	// 1. Fetch current scoreboard (uses cache or direct pg calculate)
	board, err := s.GetScoreboard()
	if err != nil {
		return nil, err
	}

	// Slice Top 10 players
	limit := len(board)
	if limit > 10 {
		limit = 10
	}
	topPlayers := board[:limit]

	progressions := make([]PlayerProgressionDTO, 0, len(topPlayers))

	for _, p := range topPlayers {
		// 2. Fetch raw solves timeline
		timeline, err := s.repo.GetUserSolvesTimeline(p.UserID)
		if err != nil {
			return nil, err
		}

		series := make([]SolveSeriesPoint, 0, len(timeline))
		cumulativePoints := 0

		for _, row := range timeline {
			cumulativePoints += row.Points
			series = append(series, SolveSeriesPoint{
				Timestamp: row.SolvedAt,
				Points:    cumulativePoints,
			})
		}

		progressions = append(progressions, PlayerProgressionDTO{
			UserID:      p.UserID,
			Name:        p.Name,
			Rank:        p.Rank,
			TotalPoints: p.TotalPoints,
			TotalSolves: p.TotalSolves,
			Series:      series,
		})
	}

	return progressions, nil
}
