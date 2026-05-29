package services

import (
	"ctf-platform/backend/internal/repositories"
)

type StatsService struct {
	repo *repositories.StatsRepository
}

func NewStatsService(repo *repositories.StatsRepository) *StatsService {
	return &StatsService{repo: repo}
}

type OverviewStatsResponse struct {
	TotalChallenges   int64                         `json:"total_challenges"`
	TotalCategories   int                           `json:"total_categories"`
	TotalPlayers      int64                         `json:"total_players"`
	TotalSolves       int64                         `json:"total_solves"`
	ActiveChallenges   int64                         `json:"active_challenges"`
	ScoreboardEntries int64                         `json:"scoreboard_entries"`
	Categories        []repositories.CategoryCount  `json:"categories"`
}

func (s *StatsService) GetOverviewStats() (*OverviewStatsResponse, error) {
	activeChCount, err := s.repo.CountActiveChallenges()
	if err != nil {
		return nil, err
	}

	playersCount, err := s.repo.CountPlayers()
	if err != nil {
		return nil, err
	}

	solvesCount, err := s.repo.CountTotalSolves()
	if err != nil {
		return nil, err
	}

	breakdown, err := s.repo.GetCategoryBreakdown()
	if err != nil {
		return nil, err
	}

	categoriesCount := len(breakdown)

	return &OverviewStatsResponse{
		TotalChallenges:   activeChCount,
		TotalCategories:   categoriesCount,
		TotalPlayers:      playersCount,
		TotalSolves:       solvesCount,
		ActiveChallenges:   activeChCount,
		ScoreboardEntries: playersCount,
		Categories:        breakdown,
	}, nil
}
