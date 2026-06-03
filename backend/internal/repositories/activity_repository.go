package repositories

import (
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
)

// ActivityRepository handles queries for public activity feed data.
type ActivityRepository struct{}

// NewActivityRepository returns a new repository instance.
func NewActivityRepository() *ActivityRepository {
	return &ActivityRepository{}
}

// RecentSolveRow is a flat struct populated by the JOIN query.
type RecentSolveRow struct {
	SolveID       string `gorm:"column:solve_id"`
	SolvedAt      string `gorm:"column:solved_at"`
	UserID        string `gorm:"column:user_id"`
	UserName      string `gorm:"column:user_name"`
	ChallengeID   string `gorm:"column:challenge_id"`
	ChallengeTitle string `gorm:"column:challenge_title"`
	ChallengeSlug  string `gorm:"column:challenge_slug"`
	Category       string `gorm:"column:category"`
	Points         int    `gorm:"column:points"`
}

// FindRecentSolves returns the most recent solve records,
// excluding banned users and admin accounts.
func (r *ActivityRepository) FindRecentSolves(limit int) ([]RecentSolveRow, error) {
	db := database.DB

	var rows []RecentSolveRow
	err := db.Model(&models.Solve{}).
		Select(`
			solves.id          AS solve_id,
			solves.solved_at   AS solved_at,
			users.id           AS user_id,
			users.name         AS user_name,
			challenges.id      AS challenge_id,
			challenges.title   AS challenge_title,
			challenges.slug    AS challenge_slug,
			challenges.category AS category,
			challenges.points  AS points
		`).
		Joins("JOIN users ON users.id = solves.user_id").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id").
		Where("users.is_banned = ?", false).
		Where("users.role = ?", "user").
		Where("users.deleted_at IS NULL").
		Where("challenges.is_active = ?", true).
		Order("solves.solved_at DESC").
		Limit(limit).
		Scan(&rows).Error

	return rows, err
}
