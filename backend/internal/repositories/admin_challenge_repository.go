package repositories

import (
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
)

// AdminChallengeRepository provides privileged GORM queries for challenge management.
type AdminChallengeRepository struct{}

// NewAdminChallengeRepository returns a new repository instance.
func NewAdminChallengeRepository() *AdminChallengeRepository {
	return &AdminChallengeRepository{}
}

// FindAll retrieves all challenges (active and inactive) without filters.
func (r *AdminChallengeRepository) FindAll() ([]models.Challenge, error) {
	db := database.DB
	var challenges []models.Challenge
	err := db.Order("created_at DESC").Find(&challenges).Error
	return challenges, err
}

// FindByID retrieves a single challenge by UUID (active or inactive).
func (r *AdminChallengeRepository) FindByID(id uuid.UUID) (*models.Challenge, error) {
	db := database.DB
	var challenge models.Challenge
	err := db.Where("id = ?", id).First(&challenge).Error
	if err != nil {
		return nil, err
	}
	return &challenge, nil
}

// SlugExists checks whether a slug is already taken by a different challenge.
func (r *AdminChallengeRepository) SlugExists(slug string, excludeID *uuid.UUID) (bool, error) {
	db := database.DB
	var count int64
	query := db.Model(&models.Challenge{}).Where("slug = ?", slug)
	if excludeID != nil {
		query = query.Where("id != ?", *excludeID)
	}
	err := query.Count(&count).Error
	return count > 0, err
}

// Create inserts a new challenge record.
func (r *AdminChallengeRepository) Create(challenge *models.Challenge) error {
	return database.DB.Create(challenge).Error
}

// Update saves all fields on an existing challenge record.
func (r *AdminChallengeRepository) Update(challenge *models.Challenge) error {
	return database.DB.Save(challenge).Error
}

// UpdateStatus toggles the is_active field only.
func (r *AdminChallengeRepository) UpdateStatus(id uuid.UUID, isActive bool) (*models.Challenge, error) {
	db := database.DB
	var challenge models.Challenge
	if err := db.Where("id = ?", id).First(&challenge).Error; err != nil {
		return nil, err
	}
	challenge.IsActive = isActive
	if err := db.Save(&challenge).Error; err != nil {
		return nil, err
	}
	return &challenge, nil
}

// SoftDelete sets is_active = false to preserve submission history.
func (r *AdminChallengeRepository) SoftDelete(id uuid.UUID) error {
	db := database.DB
	var challenge models.Challenge
	if err := db.Where("id = ?", id).First(&challenge).Error; err != nil {
		return err
	}
	challenge.IsActive = false
	return db.Save(&challenge).Error
}
