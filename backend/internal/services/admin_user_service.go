package services

import (
	"errors"
	"time"

	"ctf-platform/backend/internal/repositories"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AdminUserService coordinates core business rules for user account administration.
type AdminUserService struct {
	repo *repositories.AdminUserRepository
}

// NewAdminUserService instantiates a service container.
func NewAdminUserService() *AdminUserService {
	return &AdminUserService{
		repo: repositories.NewAdminUserRepository(),
	}
}

// ListUsers retrieves the paginated results matching input filters.
func (s *AdminUserService) ListUsers(search, role, status string, page, limit int) ([]repositories.AdminUserRow, int64, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	users, total, err := s.repo.ListUsers(search, role, status, page, limit)
	if err != nil {
		return nil, 0, 0, err
	}

	totalPages := int(total / int64(limit))
	if total%int64(limit) > 0 {
		totalPages++
	}
	if totalPages == 0 {
		totalPages = 1
	}

	return users, total, totalPages, nil
}

// GetUserByID fetches a single competitor detail.
func (s *AdminUserService) GetUserByID(id uuid.UUID) (*repositories.AdminUserRow, error) {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

// UpdateUserRole handles role updates with multi-admin lockout protections.
func (s *AdminUserService) UpdateUserRole(actorID, targetID uuid.UUID, newRole string) (*repositories.AdminUserRow, error) {
	if newRole != "user" && newRole != "admin" {
		return nil, errors.New("invalid role specified")
	}

	targetUser, err := s.repo.GetUserByID(targetID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	if targetUser.IsBanned {
		return nil, errors.New("cannot update role of a banned user")
	}

	// If downgrading an admin to user
	if targetUser.Role == "admin" && newRole == "user" {
		activeAdmins, err := s.repo.CountActiveAdmins()
		if err != nil {
			return nil, err
		}
		if activeAdmins <= 1 {
			return nil, errors.New("cannot downgrade the last active admin")
		}
	}

	if err := s.repo.UpdateUserRole(targetID, newRole); err != nil {
		return nil, err
	}

	return s.repo.GetUserByID(targetID)
}

// BanUser blocks a user, enforcing multi-admin safety controls.
func (s *AdminUserService) BanUser(actorID, targetID uuid.UUID, reason string) (*repositories.AdminUserRow, error) {
	targetUser, err := s.repo.GetUserByID(targetID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	if targetUser.IsBanned {
		return nil, errors.New("user is already banned")
	}

	// Prevent self-banning if actor is target
	if actorID == targetID {
		return nil, errors.New("cannot ban yourself")
	}

	// If target is an admin, check that we aren't banning the last active admin
	if targetUser.Role == "admin" {
		activeAdmins, err := s.repo.CountActiveAdmins()
		if err != nil {
			return nil, err
		}
		if activeAdmins <= 1 {
			return nil, errors.New("cannot ban the last active admin")
		}
	}

	if err := s.repo.BanUser(targetID, reason, time.Now()); err != nil {
		return nil, err
	}

	return s.repo.GetUserByID(targetID)
}

// UnbanUser restores a banned user back to active status.
func (s *AdminUserService) UnbanUser(targetID uuid.UUID) (*repositories.AdminUserRow, error) {
	targetUser, err := s.repo.GetUserByID(targetID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	if !targetUser.IsBanned {
		return nil, errors.New("user is not banned")
	}

	if err := s.repo.UnbanUser(targetID); err != nil {
		return nil, err
	}

	return s.repo.GetUserByID(targetID)
}
