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
	// 2. Highest total solves
	// 3. Earliest last_solve_time (NULLS LAST)
	// 4. Earliest first_solve_time (NULLS LAST)
	// 5. Older account (user_created_at ASC)
	// 6. User ID fallback (user_id ASC)
	err := db.Table("solves").
		Select("solves.user_id, users.name, SUM(challenges.points) as total_points, COUNT(solves.challenge_id) as total_solves, MAX(solves.solved_at) as last_solve_time, MIN(solves.solved_at) as first_solve_time, users.created_at as user_created_at").
		Joins("JOIN users ON users.id = solves.user_id AND users.deleted_at IS NULL").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("challenges.is_active = ? AND users.role = ? AND users.is_banned = ?", true, "user", false).
		Group("solves.user_id, users.name, users.created_at").
		Order("total_points DESC, total_solves DESC, last_solve_time ASC NULLS LAST, first_solve_time ASC NULLS LAST, users.created_at ASC, solves.user_id ASC").
		Find(&rows).Error

	return rows, err
}

// UserSolveTimelineRow represents a raw solve timestamp and corresponding points.
type UserSolveTimelineRow struct {
	Points   int       `gorm:"column:points"`
	SolvedAt time.Time `gorm:"column:solved_at"`
}

// GetUserSolvesTimeline retrieves all solved challenges and points for a given user,
// ordered by solve timestamp ascending.
func (r *ScoreboardRepository) GetUserSolvesTimeline(userID uuid.UUID) ([]UserSolveTimelineRow, error) {
	db := database.DB
	var rows []UserSolveTimelineRow

	err := db.Table("solves").
		Select("challenges.points, solves.solved_at").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("solves.user_id = ? AND challenges.is_active = ?", userID, true).
		Order("solves.solved_at ASC").
		Scan(&rows).Error

	return rows, err
}
