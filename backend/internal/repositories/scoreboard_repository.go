package repositories

import (
	"time"

	"ctf-platform/backend/internal/database"

	"github.com/google/uuid"
)

// ScoreboardRowRaw defines the GORM aggregate return model.
type ScoreboardRowRaw struct {
	UserID        uuid.UUID `gorm:"column:user_id"`
	Name          string    `gorm:"column:name"`
	TotalPoints   int64     `gorm:"column:total_points"`
	TotalSolves   int64     `gorm:"column:total_solves"`
	LastSolveTime time.Time `gorm:"column:last_solve_time"`
}

// ScoreboardRepository operates SQL aggregates on competitor statistics.
type ScoreboardRepository struct{}

// NewScoreboardRepository creates a new repository instance.
func NewScoreboardRepository() *ScoreboardRepository {
	return &ScoreboardRepository{}
}

// CalculateScoreboard performs relational joining between solves, users, and challenges,
// counting only active challenge points and solving timelines.
func (r *ScoreboardRepository) CalculateScoreboard() ([]ScoreboardRowRaw, error) {
	db := database.DB
	var rows []ScoreboardRowRaw

	// SQL Join logic grouping by competitor details and sorting by:
	// 1. Highest points
	// 2. Highest total solves (tiebreaker 1)
	// 3. Earliest solving time (tiebreaker 2)
	err := db.Table("solves").
		Select("solves.user_id, users.name, SUM(challenges.points) as total_points, COUNT(solves.challenge_id) as total_solves, MAX(solves.solved_at) as last_solve_time").
		Joins("JOIN users ON users.id = solves.user_id AND users.deleted_at IS NULL").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("challenges.is_active = ?", true).
		Group("solves.user_id, users.name").
		Order("total_points DESC, total_solves DESC, last_solve_time ASC").
		Find(&rows).Error

	return rows, err
}
