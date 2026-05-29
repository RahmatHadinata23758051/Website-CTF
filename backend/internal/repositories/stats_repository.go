package repositories

import (
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
)

type StatsRepository struct{}

func NewStatsRepository() *StatsRepository {
	return &StatsRepository{}
}

// CategoryCount holds category aggregate results
type CategoryCount struct {
	Category       string `json:"name"`
	ChallengeCount int64  `json:"challenge_count"`
}

func (r *StatsRepository) CountActiveChallenges() (int64, error) {
	var count int64
	err := database.DB.Model(&models.Challenge{}).Where("is_active = ? AND deleted_at IS NULL", true).Count(&count).Error
	return count, err
}

func (r *StatsRepository) CountPlayers() (int64, error) {
	var count int64
	err := database.DB.Model(&models.User{}).Where("role = ? AND deleted_at IS NULL", "user").Count(&count).Error
	return count, err
}

func (r *StatsRepository) CountTotalSolves() (int64, error) {
	var count int64
	err := database.DB.Model(&models.Solve{}).Count(&count).Error
	return count, err
}

func (r *StatsRepository) GetCategoryBreakdown() ([]CategoryCount, error) {
	var results []CategoryCount
	err := database.DB.Model(&models.Challenge{}).
		Select("category, count(*) as challenge_count").
		Where("is_active = ? AND deleted_at IS NULL", true).
		Group("category").
		Scan(&results).Error
	return results, err
}
