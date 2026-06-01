package services

import (
	"errors"
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AccountService struct {
	accountRepo *repositories.AccountRepository
}

func NewAccountService(accountRepo *repositories.AccountRepository) *AccountService {
	return &AccountService{accountRepo: accountRepo}
}

type AccountUserDTO struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UpdateProfile updates the display name and returns the updated user details.
func (s *AccountService) UpdateProfile(userID uuid.UUID, name string) (*AccountUserDTO, error) {
	db := database.DB
	var user models.User

	// 1. Fetch user to verify existence
	if err := db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// 2. Perform name update
	if err := s.accountRepo.UpdateDisplayName(userID, name); err != nil {
		return nil, err
	}

	// 3. Fetch updated user details
	if err := db.First(&user, userID).Error; err != nil {
		return nil, err
	}

	return &AccountUserDTO{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, nil
}

// ChangePassword verifies the current password and hashes the new one before updating.
func (s *AccountService) ChangePassword(userID uuid.UUID, currentPassword, newPassword string) error {
	db := database.DB
	var user models.User

	// 1. Fetch GORM user
	if err := db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return err
	}

	// 2. Compare current password hash using bcrypt utility
	if !utils.CheckPasswordHash(currentPassword, user.PasswordHash) {
		return errors.New("current password is incorrect")
	}

	// 3. Hash new password using bcrypt
	newHash, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	// 4. Save new password hash
	return s.accountRepo.UpdatePasswordHash(userID, newHash)
}
