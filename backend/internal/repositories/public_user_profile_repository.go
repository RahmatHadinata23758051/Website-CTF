package repositories

import (
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PublicUserProfileRepository fetches only public-safe profile data for another player.
type PublicUserProfileRepository struct{}

func NewPublicUserProfileRepository() *PublicUserProfileRepository {
	return &PublicUserProfileRepository{}
}

// PublicUserRow contains only public-safe identity fields — no email, role, password, or ban data.
type PublicUserRow struct {
	ID        uuid.UUID `gorm:"column:id"`
	Name      string    `gorm:"column:name"`
	CreatedAt time.Time `gorm:"column:created_at"`
}

// FindPublicUser returns a non-admin, non-banned user by ID.
// Returns gorm.ErrRecordNotFound if the user is not found, is an admin, or is banned.
func (r *PublicUserProfileRepository) FindPublicUser(userID uuid.UUID) (*PublicUserRow, error) {
	db := database.DB
	var user models.User

	err := db.
		Select("id, name, created_at").
		Where("id = ? AND role = ? AND is_banned = ? AND deleted_at IS NULL", userID, "user", false).
		First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}

	return &PublicUserRow{
		ID:        user.ID,
		Name:      user.Name,
		CreatedAt: user.CreatedAt,
	}, nil
}

// GetPublicSolvedChallenges retrieves all active challenges solved by a user, newest first.
func (r *PublicUserProfileRepository) GetPublicSolvedChallenges(userID uuid.UUID) ([]SolvedChallengeRow, error) {
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

// GetPublicRecentSolves retrieves the latest 10 active challenge solves for a user.
func (r *PublicUserProfileRepository) GetPublicRecentSolves(userID uuid.UUID) ([]SolvedChallengeRow, error) {
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

// GetPublicCategoryBreakdown computes per-category solve counts and points for a user.
func (r *PublicUserProfileRepository) GetPublicCategoryBreakdown(userID uuid.UUID) ([]CategoryBreakdownRow, error) {
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
