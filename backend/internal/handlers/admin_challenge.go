package handlers

import (
	"errors"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AdminChallengeHandler handles all admin challenge management requests.
type AdminChallengeHandler struct {
	service *services.AdminChallengeService
}

// NewAdminChallengeHandler creates a new handler with injected dependencies.
func NewAdminChallengeHandler(cfg *config.Config) *AdminChallengeHandler {
	repo := repositories.NewAdminChallengeRepository()
	service := services.NewAdminChallengeService(repo, cfg.FlagSalt)
	return &AdminChallengeHandler{service: service}
}

// ListChallenges handles GET /api/admin/challenges
// Returns all challenges (active and inactive). Never returns flag_hash.
func (h *AdminChallengeHandler) ListChallenges(c *fiber.Ctx) error {
	challenges, err := h.service.GetAll()
	if err != nil {
		return utils.SendError(c, "Failed to retrieve challenges", fiber.StatusInternalServerError)
	}
	return utils.SendSuccess(c, "Admin challenges retrieved successfully", fiber.Map{
		"challenges": challenges,
	})
}

// GetChallenge handles GET /api/admin/challenges/:id
// Returns a single challenge by UUID. Never returns flag_hash.
func (h *AdminChallengeHandler) GetChallenge(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid challenge ID", fiber.StatusBadRequest)
	}

	challenge, err := h.service.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve challenge", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenge retrieved successfully", fiber.Map{
		"challenge": challenge,
	})
}

// CreateChallenge handles POST /api/admin/challenges
// Accepts plaintext flag, hashes it before storage. Never returns flag_hash.
func (h *AdminChallengeHandler) CreateChallenge(c *fiber.Ctx) error {
	var req validators.AdminChallengeRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request body", fiber.StatusBadRequest)
	}

	if errMsg := validators.ValidateAdminChallengeCreate(&req); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	challenge, err := h.service.Create(&req)
	if err != nil {
		if errors.Is(err, services.ErrSlugConflict) {
			return utils.SendError(c, "Slug already exists. Choose a different title or provide a unique slug.", fiber.StatusConflict)
		}
		return utils.SendError(c, "Failed to create challenge", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenge created successfully", fiber.Map{
		"challenge": challenge,
	}, fiber.StatusCreated)
}

// UpdateChallenge handles PUT /api/admin/challenges/:id
// If flag field is provided and non-empty, re-hashes and updates flag_hash.
// If flag field is omitted, keeps existing flag_hash unchanged.
func (h *AdminChallengeHandler) UpdateChallenge(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid challenge ID", fiber.StatusBadRequest)
	}

	var req validators.AdminChallengeRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request body", fiber.StatusBadRequest)
	}

	if errMsg := validators.ValidateAdminChallengeUpdate(&req); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	challenge, err := h.service.Update(id, &req)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		if errors.Is(err, services.ErrSlugConflict) {
			return utils.SendError(c, "Slug already exists. Choose a different title or provide a unique slug.", fiber.StatusConflict)
		}
		return utils.SendError(c, "Failed to update challenge", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenge updated successfully", fiber.Map{
		"challenge": challenge,
	})
}

// UpdateChallengeStatus handles PATCH /api/admin/challenges/:id/status
// Activates or deactivates a challenge. Inactive challenges are hidden from public APIs.
func (h *AdminChallengeHandler) UpdateChallengeStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid challenge ID", fiber.StatusBadRequest)
	}

	var req validators.AdminChallengeStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request body", fiber.StatusBadRequest)
	}

	result, err := h.service.UpdateStatus(id, req.IsActive)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to update challenge status", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenge status updated successfully", fiber.Map{
		"challenge": result,
	})
}

// DeleteChallenge handles DELETE /api/admin/challenges/:id
// Performs a SOFT DELETE (is_active = false) to preserve submission and solve history.
func (h *AdminChallengeHandler) DeleteChallenge(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid challenge ID", fiber.StatusBadRequest)
	}

	if err := h.service.Delete(id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to delete challenge", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenge deleted successfully", nil)
}
