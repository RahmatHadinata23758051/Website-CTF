package repositories

import (
	"strings"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
)

// ChallengeRepository defines active GORM queries for challenges.
type ChallengeRepository struct{}

// NewChallengeRepository returns a new repository instance.
func NewChallengeRepository() *ChallengeRepository {
	return &ChallengeRepository{}
}

// FindAllActive retrieves all active challenges matching optional search filters.
func (r *ChallengeRepository) FindAllActive(category, difficulty, search string) ([]models.Challenge, error) {
	db := database.DB
	var challenges []models.Challenge

	query := db.Where("is_active = ?", true)

	// Apply optional category filter
	if category != "" {
		query = query.Where("LOWER(category) = LOWER(?)", strings.TrimSpace(category))
	}

	// Apply optional difficulty filter
	if difficulty != "" {
		query = query.Where("LOWER(difficulty) = LOWER(?)", strings.TrimSpace(difficulty))
	}

	// Apply optional search filter on title or description
	if search != "" {
		searchTerm := "%" + strings.ToLower(strings.TrimSpace(search)) + "%"
		query = query.Where("LOWER(title) LIKE ? OR LOWER(description) LIKE ?", searchTerm, searchTerm)
	}

	// Order by points ascending, then category
	err := query.Order("points ASC, category ASC").Find(&challenges).Error
	return challenges, err
}

// FindBySlug retrieves a single active challenge by its slug.
func (r *ChallengeRepository) FindBySlug(slug string) (*models.Challenge, error) {
	db := database.DB
	var challenge models.Challenge

	err := db.Where("slug = ? AND is_active = ?", slug, true).First(&challenge).Error
	if err != nil {
		return nil, err
	}
	return &challenge, nil
}

// IsSolved checks whether the given user ID has resolved the specific challenge.
func (r *ChallengeRepository) IsSolved(userID uuid.UUID, challengeID uuid.UUID) (bool, error) {
	db := database.DB
	var count int64

	err := db.Model(&models.Solve{}).
		Where("user_id = ? AND challenge_id = ?", userID, challengeID).
		Count(&count).Error

	return count > 0, err
}
