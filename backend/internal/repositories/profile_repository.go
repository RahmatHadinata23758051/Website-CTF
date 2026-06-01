package repositories

import (
	"time"

	"ctf-platform/backend/internal/database"
	"github.com/google/uuid"
)

type ProfileRepository struct{}

func NewProfileRepository() *ProfileRepository {
	return &ProfileRepository{}
}

type SolvedChallengeRow struct {
	ChallengeID uuid.UUID `gorm:"column:challenge_id" json:"challenge_id"`
	Title       string    `gorm:"column:title" json:"title"`
	Slug        string    `gorm:"column:slug" json:"slug"`
	Category    string    `gorm:"column:category" json:"category"`
	Difficulty  string    `gorm:"column:difficulty" json:"difficulty"`
	Points      int       `gorm:"column:points" json:"points"`
	SolvedAt    time.Time `gorm:"column:solved_at" json:"solved_at"`
}

type CategoryBreakdownRow struct {
	Category string `gorm:"column:category" json:"category"`
	Solves   int64  `gorm:"column:solves" json:"solves"`
	Points   int64  `gorm:"column:points" json:"points"`
}

// GetSolvedChallenges retrieves all challenges solved by a user, ordered by solved_at DESC.
func (r *ProfileRepository) GetSolvedChallenges(userID uuid.UUID) ([]SolvedChallengeRow, error) {
	db := database.DB
	var rows []SolvedChallengeRow

	err := db.Table("solves").
		Select("solves.challenge_id, challenges.title, challenges.slug, challenges.category, challenges.difficulty, challenges.points, solves.solved_at").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("solves.user_id = ? AND challenges.is_active = ?", userID, true).
		Order("solves.solved_at DESC").
		Find(&rows).Error

	return rows, err
}

// GetRecentSolves retrieves the latest 10 solves for a user, ordered by solved_at DESC.
func (r *ProfileRepository) GetRecentSolves(userID uuid.UUID) ([]SolvedChallengeRow, error) {
	db := database.DB
	var rows []SolvedChallengeRow

	err := db.Table("solves").
		Select("solves.challenge_id, challenges.title, challenges.slug, challenges.category, challenges.difficulty, challenges.points, solves.solved_at").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("solves.user_id = ? AND challenges.is_active = ?", userID, true).
		Order("solves.solved_at DESC").
		Limit(10).
		Find(&rows).Error

	return rows, err
}

// GetCategoryBreakdown computes the user's solved challenges breakdown grouped by category.
func (r *ProfileRepository) GetCategoryBreakdown(userID uuid.UUID) ([]CategoryBreakdownRow, error) {
	db := database.DB
	var rows []CategoryBreakdownRow

	err := db.Table("solves").
		Select("challenges.category, COUNT(solves.challenge_id) as solves, SUM(challenges.points) as points").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("solves.user_id = ? AND challenges.is_active = ?", userID, true).
		Group("challenges.category").
		Order("points DESC, solves DESC").
		Find(&rows).Error

	return rows, err
}
