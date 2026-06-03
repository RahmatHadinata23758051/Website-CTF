package repositories

import (
	"time"

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

// AcceptRules updates the competitor's accepted_rules_at timestamp.
func (r *AccountRepository) AcceptRules(userID uuid.UUID, acceptedAt time.Time) error {
	db := database.DB
	return db.Model(&models.User{}).Where("id = ?", userID).Update("accepted_rules_at", acceptedAt).Error
}
