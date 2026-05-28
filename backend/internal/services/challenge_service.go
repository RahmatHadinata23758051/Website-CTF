package services

import (
	"time"

	"ctf-platform/backend/internal/repositories"

	"github.com/google/uuid"
)

// ChallengeListDTO represents a brief, secure challenge profile for grids.
type ChallengeListDTO struct {
	ID         uuid.UUID `json:"id"`
	Title      string    `json:"title"`
	Slug       string    `json:"slug"`
	Category   string    `json:"category"`
	Difficulty string    `json:"difficulty"`
	Points     int       `json:"points"`
	IsSolved   bool      `json:"is_solved"`
}

// ChallengeDetailDTO represents a detailed, secure challenge profile.
type ChallengeDetailDTO struct {
	ID            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	Slug          string    `json:"slug"`
	Description   string    `json:"description"`
	Category      string    `json:"category"`
	Difficulty    string    `json:"difficulty"`
	Points        int       `json:"points"`
	AttachmentURL string    `json:"attachment_url,omitempty"`
	ExternalLink  string    `json:"external_link,omitempty"`
	IsSolved      bool      `json:"is_solved"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ChallengeService coordinates GORM models mapping to DTOs.
type ChallengeService struct {
	repo *repositories.ChallengeRepository
}

// NewChallengeService returns a service instance.
func NewChallengeService(repo *repositories.ChallengeRepository) *ChallengeService {
	return &ChallengeService{repo: repo}
}

// GetChallengeList handles query filters and determines the solve state per challenge.
func (s *ChallengeService) GetChallengeList(userIDStr string, category, difficulty, search string) ([]ChallengeListDTO, error) {
	challenges, err := s.repo.FindAllActive(category, difficulty, search)
	if err != nil {
		return nil, err
	}

	var userUUID uuid.UUID
	hasUser := false
	if userIDStr != "" {
		if parsed, err := uuid.Parse(userIDStr); err == nil {
			userUUID = parsed
			hasUser = true
		}
	}

	dtoList := make([]ChallengeListDTO, 0, len(challenges))
	for _, c := range challenges {
		isSolved := false
		if hasUser {
			solved, err := s.repo.IsSolved(userUUID, c.ID)
			if err == nil {
				isSolved = solved
			}
		}

		dtoList = append(dtoList, ChallengeListDTO{
			ID:         c.ID,
			Title:      c.Title,
			Slug:       c.Slug,
			Category:   c.Category,
			Difficulty: c.Difficulty,
			Points:     c.Points,
			IsSolved:   isSolved,
		})
	}

	return dtoList, nil
}

// GetChallengeDetail fetches details of a challenge and checks optional solved state.
func (s *ChallengeService) GetChallengeDetail(slug string, userIDStr string) (*ChallengeDetailDTO, error) {
	c, err := s.repo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}

	var userUUID uuid.UUID
	hasUser := false
	if userIDStr != "" {
		if parsed, err := uuid.Parse(userIDStr); err == nil {
			userUUID = parsed
			hasUser = true
		}
	}

	isSolved := false
	if hasUser {
		solved, err := s.repo.IsSolved(userUUID, c.ID)
		if err == nil {
			isSolved = solved
		}
	}

	return &ChallengeDetailDTO{
		ID:            c.ID,
		Title:         c.Title,
		Slug:          c.Slug,
		Description:   c.Description,
		Category:      c.Category,
		Difficulty:    c.Difficulty,
		Points:        c.Points,
		AttachmentURL: c.AttachmentURL,
		ExternalLink:  c.ExternalLink,
		IsSolved:      isSolved,
		CreatedAt:     c.CreatedAt,
		UpdatedAt:     c.UpdatedAt,
	}, nil
}
