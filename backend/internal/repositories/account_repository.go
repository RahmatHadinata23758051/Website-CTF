package repositories

import (
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
)

type AccountRepository struct{}

func NewAccountRepository() *AccountRepository {
	return &AccountRepository{}
}

// UpdateDisplayName updates the competitor's display name.
func (r *AccountRepository) UpdateDisplayName(userID uuid.UUID, name string) error {
	db := database.DB
	return db.Model(&models.User{}).Where("id = ?", userID).Update("name", name).Error
}

// UpdatePasswordHash updates the competitor's secure password hash.
func (r *AccountRepository) UpdatePasswordHash(userID uuid.UUID, hash string) error {
	db := database.DB
	return db.Model(&models.User{}).Where("id = ?", userID).Update("password_hash", hash).Error
}
