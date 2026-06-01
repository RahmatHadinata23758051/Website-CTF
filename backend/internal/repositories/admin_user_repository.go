package repositories

import (
	"strings"
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
)

// AdminUserRow represents user details along with score/solve count aggregates.
type AdminUserRow struct {
	ID           uuid.UUID  `json:"id"`
	Name         string     `json:"name"`
	Email        string     `json:"email"`
	Role         string     `json:"role"`
	IsBanned     bool       `json:"is_banned"`
	BannedAt     *time.Time `json:"banned_at"`
	BannedReason *string    `json:"banned_reason"`
	TotalPoints  int64      `json:"total_points"`
	TotalSolves  int64      `json:"total_solves"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// AdminUserRepository coordinates query actions for user accounts management.
type AdminUserRepository struct{}

// NewAdminUserRepository creates a new repository instance.
func NewAdminUserRepository() *AdminUserRepository {
	return &AdminUserRepository{}
}

// ListUsers retrieves a filtered, paginated list of users with total points and solve counts.
func (r *AdminUserRepository) ListUsers(search, role, status string, page, limit int) ([]AdminUserRow, int64, error) {
	db := database.DB

	// Build the count query first
	countQuery := db.Model(&models.User{}).Where("deleted_at IS NULL")
	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		countQuery = countQuery.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ?", searchTerm, searchTerm)
	}
	if role != "" {
		countQuery = countQuery.Where("role = ?", role)
	}
	if status != "" {
		if status == "banned" {
			countQuery = countQuery.Where("is_banned = ?", true)
		} else if status == "active" {
			countQuery = countQuery.Where("is_banned = ?", false)
		}
	}

	var total int64
	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Build the main scan query
	query := db.Table("users").
		Select(`
			users.id, 
			users.name, 
			users.email, 
			users.role, 
			users.is_banned, 
			users.banned_at, 
			users.banned_reason, 
			users.created_at, 
			users.updated_at, 
			COALESCE(SUM(challenges.points), 0) as total_points, 
			COUNT(solves.challenge_id) as total_solves
		`).
		Joins("LEFT JOIN solves ON solves.user_id = users.id").
		Joins("LEFT JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL AND challenges.is_active = ?", true).
		Where("users.deleted_at IS NULL")

	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(users.name) LIKE ? OR LOWER(users.email) LIKE ?", searchTerm, searchTerm)
	}
	if role != "" {
		query = query.Where("users.role = ?", role)
	}
	if status != "" {
		if status == "banned" {
			query = query.Where("users.is_banned = ?", true)
		} else if status == "active" {
			query = query.Where("users.is_banned = ?", false)
		}
	}

	query = query.Group(`
		users.id, 
		users.name, 
		users.email, 
		users.role, 
		users.is_banned, 
		users.banned_at, 
		users.banned_reason, 
		users.created_at, 
		users.updated_at
	`)

	offset := (page - 1) * limit
	var users []AdminUserRow
	err := query.Order("users.created_at DESC").Offset(offset).Limit(limit).Scan(&users).Error

	return users, total, err
}

// GetUserByID retrieves a single user row by UUID.
func (r *AdminUserRepository) GetUserByID(id uuid.UUID) (*AdminUserRow, error) {
	db := database.DB

	// Ensure the user exists first (throws record not found if they don't)
	var rawUser models.User
	if err := db.Where("id = ? AND deleted_at IS NULL", id).First(&rawUser).Error; err != nil {
		return nil, err
	}

	var user AdminUserRow
	err := db.Table("users").
		Select(`
			users.id, 
			users.name, 
			users.email, 
			users.role, 
			users.is_banned, 
			users.banned_at, 
			users.banned_reason, 
			users.created_at, 
			users.updated_at, 
			COALESCE(SUM(challenges.points), 0) as total_points, 
			COUNT(solves.challenge_id) as total_solves
		`).
		Joins("LEFT JOIN solves ON solves.user_id = users.id").
		Joins("LEFT JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL AND challenges.is_active = ?", true).
		Where("users.id = ? AND users.deleted_at IS NULL", id).
		Group(`
			users.id, 
			users.name, 
			users.email, 
			users.role, 
			users.is_banned, 
			users.banned_at, 
			users.banned_reason, 
			users.created_at, 
			users.updated_at
		`).
		Scan(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// UpdateUserRole changes a user's role field in PostgreSQL.
func (r *AdminUserRepository) UpdateUserRole(id uuid.UUID, role string) error {
	db := database.DB
	return db.Model(&models.User{}).Where("id = ? AND deleted_at IS NULL", id).Update("role", role).Error
}

// BanUser updates user to banned status.
func (r *AdminUserRepository) BanUser(id uuid.UUID, reason string, bannedAt time.Time) error {
	db := database.DB
	return db.Model(&models.User{}).Where("id = ? AND deleted_at IS NULL", id).Updates(map[string]interface{}{
		"is_banned":     true,
		"banned_at":     bannedAt,
		"banned_reason": reason,
	}).Error
}

// UnbanUser restores user to active status.
func (r *AdminUserRepository) UnbanUser(id uuid.UUID) error {
	db := database.DB
	return db.Model(&models.User{}).Where("id = ? AND deleted_at IS NULL", id).Updates(map[string]interface{}{
		"is_banned":     false,
		"banned_at":     nil,
		"banned_reason": nil,
	}).Error
}

// CountActiveAdmins counts active, non-banned administrators.
func (r *AdminUserRepository) CountActiveAdmins() (int64, error) {
	db := database.DB
	var count int64
	err := db.Model(&models.User{}).Where("role = ? AND is_banned = ? AND deleted_at IS NULL", "admin", false).Count(&count).Error
	return count, err
}
