package services

import (
	"time"

	"ctf-platform/backend/internal/repositories"
)

// ActivityUserDTO is the public user info included in an activity entry.
type ActivityUserDTO struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// ActivityChallengeDTO is the public challenge info included in an activity entry.
type ActivityChallengeDTO struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Slug     string `json:"slug"`
	Category string `json:"category"`
	Points   int    `json:"points"`
}

// RecentSolveDTO represents a single public-safe activity record.
type RecentSolveDTO struct {
	User      ActivityUserDTO      `json:"user"`
	Challenge ActivityChallengeDTO `json:"challenge"`
	SolvedAt  time.Time           `json:"solved_at"`
}

// ActivityService coordinates activity data retrieval.
type ActivityService struct {
	repo *repositories.ActivityRepository
}

// NewActivityService returns a new service instance.
func NewActivityService(repo *repositories.ActivityRepository) *ActivityService {
	return &ActivityService{repo: repo}
}

// GetRecentSolves returns a public-safe list of recent solve activity.
func (s *ActivityService) GetRecentSolves(limit int) ([]RecentSolveDTO, error) {
	if limit <= 0 || limit > 20 {
		limit = 10
	}

	rows, err := s.repo.FindRecentSolves(limit)
	if err != nil {
		return nil, err
	}

	dtos := make([]RecentSolveDTO, 0, len(rows))
	for _, row := range rows {
		solvedAt, _ := time.Parse("2006-01-02T15:04:05Z", row.SolvedAt)
		if solvedAt.IsZero() {
			// fallback parse for SQLite/Postgres datetime variants
			solvedAt, _ = time.Parse("2006-01-02 15:04:05.999999999-07:00", row.SolvedAt)
		}
		if solvedAt.IsZero() {
			solvedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", row.SolvedAt)
		}
		if solvedAt.IsZero() {
			solvedAt, _ = time.Parse(time.RFC3339Nano, row.SolvedAt)
		}

		dtos = append(dtos, RecentSolveDTO{
			User: ActivityUserDTO{
				ID:   row.UserID,
				Name: row.UserName,
			},
			Challenge: ActivityChallengeDTO{
				ID:       row.ChallengeID,
				Title:    row.ChallengeTitle,
				Slug:     row.ChallengeSlug,
				Category: row.Category,
				Points:   row.Points,
			},
			SolvedAt: solvedAt,
		})
	}

	return dtos, nil
}
