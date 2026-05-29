package services

import (
	"errors"

	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/validators"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrHintNotFound      = errors.New("hint not found")
	ErrChallengeNotFound = errors.New("challenge not found")
)

type HintService struct {
	repo              *repositories.HintRepository
	challengeRepo     *repositories.ChallengeRepository
	adminChallRepo    *repositories.AdminChallengeRepository
}

func NewHintService(repo *repositories.HintRepository) *HintService {
	return &HintService{
		repo:           repo,
		challengeRepo:  repositories.NewChallengeRepository(),
		adminChallRepo: repositories.NewAdminChallengeRepository(),
	}
}

// GetPublicHintsForChallenge retrieves only active hints for active challenges by slug.
func (s *HintService) GetPublicHintsForChallenge(slug string) ([]models.Hint, error) {
	challenge, err := s.challengeRepo.FindBySlug(slug)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrChallengeNotFound
		}
		return nil, err
	}

	return s.repo.FindAllActiveForChallenge(challenge.ID)
}

// GetAdminHintsForChallenge retrieves all hints (active + inactive) by challenge ID.
func (s *HintService) GetAdminHintsForChallenge(challengeID uuid.UUID) ([]models.Hint, error) {
	_, err := s.adminChallRepo.FindByID(challengeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrChallengeNotFound
		}
		return nil, err
	}

	return s.repo.FindAllForChallenge(challengeID)
}

// CreateHint creates a new hint after verifying the challenge exists.
func (s *HintService) CreateHint(challengeID uuid.UUID, req *validators.AdminHintRequest) (*models.Hint, error) {
	_, err := s.adminChallRepo.FindByID(challengeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrChallengeNotFound
		}
		return nil, err
	}

	hint := &models.Hint{
		ChallengeID: challengeID,
		Content:     req.Content,
		Cost:        req.Cost,
		OrderIndex:  req.OrderIndex,
		IsActive:    req.IsActive,
	}

	if err := s.repo.Create(hint); err != nil {
		return nil, err
	}

	return hint, nil
}

// UpdateHint updates an existing hint's content and metadata.
func (s *HintService) UpdateHint(id uuid.UUID, req *validators.AdminHintRequest) (*models.Hint, error) {
	hint, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrHintNotFound
		}
		return nil, err
	}

	hint.Content = req.Content
	hint.Cost = req.Cost
	hint.OrderIndex = req.OrderIndex
	hint.IsActive = req.IsActive

	if err := s.repo.Update(hint); err != nil {
		return nil, err
	}

	return hint, nil
}

// UpdateHintStatus updates is_active for a specific hint.
func (s *HintService) UpdateHintStatus(id uuid.UUID, isActive bool) (*models.Hint, error) {
	hint, err := s.repo.UpdateStatus(id, isActive)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrHintNotFound
		}
		return nil, err
	}
	return hint, nil
}

// DeleteHint soft-deactivates or deletes the hint.
func (s *HintService) DeleteHint(id uuid.UUID) error {
	// Confirm existence first
	if _, err := s.repo.FindByID(id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrHintNotFound
		}
		return err
	}
	return s.repo.Delete(id)
}
