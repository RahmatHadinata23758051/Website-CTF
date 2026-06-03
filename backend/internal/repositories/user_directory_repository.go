package repositories

import (
	"strings"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
)

// UserDirectoryRepository handles queries for the public user directory.
type UserDirectoryRepository struct{}

// NewUserDirectoryRepository returns a new repository instance.
func NewUserDirectoryRepository() *UserDirectoryRepository {
	return &UserDirectoryRepository{}
}

// UserDirectoryRow is a flat struct populated by the aggregated JOIN query.
type UserDirectoryRow struct {
	ID          string `gorm:"column:id"`
	Name        string `gorm:"column:name"`
	TotalPoints int64  `gorm:"column:total_points"`
	TotalSolves int64  `gorm:"column:total_solves"`
}

// FindUsers returns a paginated list of public user directory entries.
// Excludes banned users, admin users, and does not expose email/role/passwords.
// Search is performed only on display name.
func (r *UserDirectoryRepository) FindUsers(search string, page, limit int) ([]UserDirectoryRow, int64, error) {
	db := database.DB

	// Count base query (without joins for performance)
	countQ := db.Model(&models.User{}).
		Where("is_banned = ?", false).
		Where("role = ?", "user").
		Where("deleted_at IS NULL")
	if search != "" {
		term := "%" + strings.ToLower(strings.TrimSpace(search)) + "%"
		countQ = countQ.Where("LOWER(name) LIKE ?", term)
	}
	var total int64
	if err := countQ.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Paginated aggregated query
	offset := (page - 1) * limit
	dataQ := db.Model(&models.User{}).
		Select(`
			users.id AS id,
			users.name AS name,
			COALESCE(SUM(challenges.points), 0) AS total_points,
			COUNT(solves.id) AS total_solves
		`).
		Joins("LEFT JOIN solves ON solves.user_id = users.id").
		Joins("LEFT JOIN challenges ON challenges.id = solves.challenge_id AND challenges.is_active = true").
		Where("users.is_banned = ?", false).
		Where("users.role = ?", "user").
		Where("users.deleted_at IS NULL").
		Group("users.id, users.name").
		Order("total_points DESC, users.name ASC").
		Limit(limit).
		Offset(offset)
	if search != "" {
		term := "%" + strings.ToLower(strings.TrimSpace(search)) + "%"
		dataQ = dataQ.Where("LOWER(users.name) LIKE ?", term)
	}

	var rows []UserDirectoryRow
	err := dataQ.Scan(&rows).Error
	return rows, total, err
}
