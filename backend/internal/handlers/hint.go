package handlers

import (
	"errors"

	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type HintHandler struct {
	service *services.HintService
}

func NewHintHandler() *HintHandler {
	repo := repositories.NewHintRepository()
	service := services.NewHintService(repo)
	return &HintHandler{service: service}
}

// GetPublicHints handles GET /api/challenges/:slug/hints
func (h *HintHandler) GetPublicHints(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return utils.SendError(c, "Challenge slug parameter is required", fiber.StatusBadRequest)
	}

	hints, err := h.service.GetPublicHintsForChallenge(slug)
	if err != nil {
		if errors.Is(err, services.ErrChallengeNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve hints", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Hints retrieved successfully", fiber.Map{
		"hints": hints,
	})
}

// GetAdminHints handles GET /api/admin/challenges/:challenge_id/hints
func (h *HintHandler) GetAdminHints(c *fiber.Ctx) error {
	challengeID, err := uuid.Parse(c.Params("challenge_id"))
	if err != nil {
		return utils.SendError(c, "Invalid challenge UUID format", fiber.StatusBadRequest)
	}

	hints, err := h.service.GetAdminHintsForChallenge(challengeID)
	if err != nil {
		if errors.Is(err, services.ErrChallengeNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve admin hints", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Admin hints retrieved successfully", fiber.Map{
		"hints": hints,
	})
}

// CreateHint handles POST /api/admin/challenges/:challenge_id/hints
func (h *HintHandler) CreateHint(c *fiber.Ctx) error {
	challengeID, err := uuid.Parse(c.Params("challenge_id"))
	if err != nil {
		return utils.SendError(c, "Invalid challenge UUID format", fiber.StatusBadRequest)
	}

	var req validators.AdminHintRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request body payload", fiber.StatusBadRequest)
	}

	if errMsg := validators.ValidateAdminHint(&req); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	hint, err := h.service.CreateHint(challengeID, &req)
	if err != nil {
		if errors.Is(err, services.ErrChallengeNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to create hint", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Hint created successfully", fiber.Map{
		"hint": hint,
	}, fiber.StatusCreated)
}

// UpdateHint handles PUT /api/admin/hints/:id
func (h *HintHandler) UpdateHint(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid hint UUID format", fiber.StatusBadRequest)
	}

	var req validators.AdminHintRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request body payload", fiber.StatusBadRequest)
	}

	if errMsg := validators.ValidateAdminHint(&req); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	hint, err := h.service.UpdateHint(id, &req)
	if err != nil {
		if errors.Is(err, services.ErrHintNotFound) {
			return utils.SendError(c, "Hint not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to update hint", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Hint updated successfully", fiber.Map{
		"hint": hint,
	})
}

// UpdateHintStatus handles PATCH /api/admin/hints/:id/status
func (h *HintHandler) UpdateHintStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid hint UUID format", fiber.StatusBadRequest)
	}

	var req validators.AdminHintStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request body payload", fiber.StatusBadRequest)
	}

	hint, err := h.service.UpdateHintStatus(id, req.IsActive)
	if err != nil {
		if errors.Is(err, services.ErrHintNotFound) {
			return utils.SendError(c, "Hint not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to update hint status", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Hint status updated successfully", fiber.Map{
		"hint": hint,
	})
}

// DeleteHint handles DELETE /api/admin/hints/:id
func (h *HintHandler) DeleteHint(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid hint UUID format", fiber.StatusBadRequest)
	}

	if err := h.service.DeleteHint(id); err != nil {
		if errors.Is(err, services.ErrHintNotFound) {
			return utils.SendError(c, "Hint not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to delete hint", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Hint deleted successfully", nil)
}
