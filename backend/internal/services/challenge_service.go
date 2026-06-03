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
	SolveCount int64     `json:"solve_count"`
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
	SolveCount    int64     `json:"solve_count"`
	AttachmentURL *string   `json:"attachment_url"`
	ExternalLink  *string   `json:"external_link"`
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

		solveCount, _ := s.repo.CountSolves(c.ID)

		dtoList = append(dtoList, ChallengeListDTO{
			ID:         c.ID,
			Title:      c.Title,
			Slug:       c.Slug,
			Category:   c.Category,
			Difficulty: c.Difficulty,
			Points:     c.Points,
			SolveCount: solveCount,
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

	var attachmentURL *string
	if c.AttachmentURL != "" {
		attachmentURL = &c.AttachmentURL
	}

	var externalLink *string
	if c.ExternalLink != "" {
		externalLink = &c.ExternalLink
	}

	solveCount, _ := s.repo.CountSolves(c.ID)

	return &ChallengeDetailDTO{
		ID:            c.ID,
		Title:         c.Title,
		Slug:          c.Slug,
		Description:   c.Description,
		Category:      c.Category,
		Difficulty:    c.Difficulty,
		Points:        c.Points,
		SolveCount:    solveCount,
		AttachmentURL: attachmentURL,
		ExternalLink:  externalLink,
		IsSolved:      isSolved,
		CreatedAt:     c.CreatedAt,
		UpdatedAt:     c.UpdatedAt,
	}, nil
}
