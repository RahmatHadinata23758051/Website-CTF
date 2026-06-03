package services

import (
	"log"
	"strings"
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/google/uuid"
)

// AdminChallengeDTO is the safe admin-facing challenge representation.
// SECURITY: flag_hash is explicitly excluded.
type AdminChallengeDTO struct {
	ID            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	Slug          string    `json:"slug"`
	Description   string    `json:"description"`
	Category      string    `json:"category"`
	Difficulty    string    `json:"difficulty"`
	Points        int       `json:"points"`
	AttachmentURL *string   `json:"attachment_url"`
	ExternalLink  *string   `json:"external_link"`
	IsActive      bool      `json:"is_active"`
	ScoringType   string    `json:"scoring_type"`
	InitialPoints int       `json:"initial_points"`
	MinimumPoints int       `json:"minimum_points"`
	Decay         int       `json:"decay"`
	SolveCount    int       `json:"solve_count"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// AdminChallengeStatusDTO is the minimal response for PATCH /status.
type AdminChallengeStatusDTO struct {
	ID       uuid.UUID `json:"id"`
	Title    string    `json:"title"`
	Slug     string    `json:"slug"`
	IsActive bool      `json:"is_active"`
}

// AdminChallengeService orchestrates admin challenge CRUD with security enforcement.
type AdminChallengeService struct {
	repo     *repositories.AdminChallengeRepository
	flagSalt string
}

// NewAdminChallengeService returns a new service instance.
func NewAdminChallengeService(repo *repositories.AdminChallengeRepository, flagSalt string) *AdminChallengeService {
	return &AdminChallengeService{repo: repo, flagSalt: flagSalt}
}// toDTO maps a challenge model to a safe DTO without flag_hash.
func (s *AdminChallengeService) toDTO(c *models.Challenge) AdminChallengeDTO {
	var attachmentURL *string
	if c.AttachmentURL != "" {
		attachmentURL = &c.AttachmentURL
	}
	var externalLink *string
	if c.ExternalLink != "" {
		externalLink = &c.ExternalLink
	}

	solveCount, _ := GetValidSolveCount(database.DB, c.ID)

	return AdminChallengeDTO{
		ID:            c.ID,
		Title:         c.Title,
		Slug:          c.Slug,
		Description:   c.Description,
		Category:      c.Category,
		Difficulty:    c.Difficulty,
		Points:        c.Points,
		AttachmentURL: attachmentURL,
		ExternalLink:  externalLink,
		IsActive:      c.IsActive,
		ScoringType:   c.ScoringType,
		InitialPoints: c.InitialPoints,
		MinimumPoints: c.MinimumPoints,
		Decay:         c.Decay,
		SolveCount:    solveCount,
		CreatedAt:     c.CreatedAt,
		UpdatedAt:     c.UpdatedAt,
	}
}

// GetAll returns all challenges (active and inactive) as safe DTOs.
func (s *AdminChallengeService) GetAll() ([]AdminChallengeDTO, error) {
	challenges, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	dtos := make([]AdminChallengeDTO, 0, len(challenges))
	for _, c := range challenges {
		dtos = append(dtos, s.toDTO(&c))
	}
	return dtos, nil
}

// GetByID returns one challenge by UUID as a safe DTO.
func (s *AdminChallengeService) GetByID(id uuid.UUID) (*AdminChallengeDTO, error) {
	c, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	dto := s.toDTO(c)
	return &dto, nil
}

// Create validates, hashes the flag, and persists a new challenge.
func (s *AdminChallengeService) Create(req *validators.AdminChallengeRequest) (*AdminChallengeDTO, error) {
	// Auto-generate slug if not provided
	slug := strings.TrimSpace(req.Slug)
	if slug == "" {
		slug = validators.GenerateSlugFromTitle(req.Title)
	}

	// Enforce slug uniqueness
	exists, err := s.repo.SlugExists(slug, nil)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrSlugConflict
	}

	attachmentURL := ""
	if req.AttachmentURL != nil {
		attachmentURL = *req.AttachmentURL
	}
	externalLink := ""
	if req.ExternalLink != nil {
		externalLink = *req.ExternalLink
	}

	scoringType := req.ScoringType
	if scoringType == "" {
		scoringType = "static"
	}

	initialPoints := req.InitialPoints
	minimumPoints := req.MinimumPoints
	decay := req.Decay
	points := req.Points

	if scoringType == "static" {
		initialPoints = req.Points
		minimumPoints = req.Points
		decay = 0
	} else {
		points = req.InitialPoints
	}

	challenge := &models.Challenge{
		Title:         strings.TrimSpace(req.Title),
		Slug:          slug,
		Description:   strings.TrimSpace(req.Description),
		Category:      strings.TrimSpace(req.Category),
		Difficulty:    strings.TrimSpace(req.Difficulty),
		Points:        points,
		FlagHash:      utils.HashFlag(strings.TrimSpace(req.Flag), s.flagSalt), // SECURITY: hash before store
		AttachmentURL: attachmentURL,
		ExternalLink:  externalLink,
		IsActive:      req.IsActive,
		ScoringType:   scoringType,
		InitialPoints: initialPoints,
		MinimumPoints: minimumPoints,
		Decay:         decay,
	}

	if err := s.repo.Create(challenge); err != nil {
		return nil, err
	}

	// Recalculate points with new configuration
	if err := RecalculateChallengePoints(database.DB, challenge.ID); err != nil {
		log.Printf("[SCORING] Warning: failed to recalculate challenge points: %v\n", err)
	}

	// Fetch updated values
	updated, err := s.repo.FindByID(challenge.ID)
	if err == nil {
		challenge = updated
	}

	dto := s.toDTO(challenge)
	return &dto, nil
}

// Update applies all fields to an existing challenge.
// If flag is provided and non-empty, the flag_hash is replaced.
// If flag is omitted, the existing flag_hash is preserved unchanged.
func (s *AdminChallengeService) Update(id uuid.UUID, req *validators.AdminChallengeRequest) (*AdminChallengeDTO, error) {
	challenge, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Resolve slug
	slug := strings.TrimSpace(req.Slug)
	if slug == "" {
		slug = validators.GenerateSlugFromTitle(req.Title)
	}

	// Check slug uniqueness (exclude current record)
	exists, err := s.repo.SlugExists(slug, &id)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrSlugConflict
	}

	challenge.Title = strings.TrimSpace(req.Title)
	challenge.Slug = slug
	challenge.Description = strings.TrimSpace(req.Description)
	challenge.Category = strings.TrimSpace(req.Category)
	challenge.Difficulty = strings.TrimSpace(req.Difficulty)
	challenge.IsActive = req.IsActive

	scoringType := req.ScoringType
	if scoringType == "" {
		scoringType = "static"
	}

	initialPoints := req.InitialPoints
	minimumPoints := req.MinimumPoints
	decay := req.Decay

	if scoringType == "static" {
		challenge.Points = req.Points
		initialPoints = req.Points
		minimumPoints = req.Points
		decay = 0
	} else {
		initialPoints = req.InitialPoints
		minimumPoints = req.MinimumPoints
		decay = req.Decay
	}

	challenge.ScoringType = scoringType
	challenge.InitialPoints = initialPoints
	challenge.MinimumPoints = minimumPoints
	challenge.Decay = decay

	// Only re-hash flag if a new one is explicitly provided
	if strings.TrimSpace(req.Flag) != "" {
		challenge.FlagHash = utils.HashFlag(strings.TrimSpace(req.Flag), s.flagSalt)
	}
	// Otherwise keep existing challenge.FlagHash unchanged

	if req.AttachmentURL != nil {
		challenge.AttachmentURL = *req.AttachmentURL
	} else {
		challenge.AttachmentURL = ""
	}
	if req.ExternalLink != nil {
		challenge.ExternalLink = *req.ExternalLink
	} else {
		challenge.ExternalLink = ""
	}

	if err := s.repo.Update(challenge); err != nil {
		return nil, err
	}

	// Recalculate points with new configuration
	if err := RecalculateChallengePoints(database.DB, challenge.ID); err != nil {
		log.Printf("[SCORING] Warning: failed to recalculate challenge points: %v\n", err)
	}

	// Fetch updated values
	updated, err := s.repo.FindByID(challenge.ID)
	if err == nil {
		challenge = updated
	}

	dto := s.toDTO(challenge)
	return &dto, nil
}

// UpdateStatus toggles is_active on a challenge.
func (s *AdminChallengeService) UpdateStatus(id uuid.UUID, isActive bool) (*AdminChallengeStatusDTO, error) {
	challenge, err := s.repo.UpdateStatus(id, isActive)
	if err != nil {
		return nil, err
	}
	return &AdminChallengeStatusDTO{
		ID:       challenge.ID,
		Title:    challenge.Title,
		Slug:     challenge.Slug,
		IsActive: challenge.IsActive,
	}, nil
}

// Delete performs a soft delete (is_active = false) to preserve submission history.
func (s *AdminChallengeService) Delete(id uuid.UUID) error {
	// Confirm exists before deleting
	if _, err := s.repo.FindByID(id); err != nil {
		return err
	}
	return s.repo.SoftDelete(id)
}

// ErrSlugConflict is returned when a slug is already taken.
var ErrSlugConflict = &slugConflictError{}

type slugConflictError struct{}

func (e *slugConflictError) Error() string {
	return "slug already exists"
}
