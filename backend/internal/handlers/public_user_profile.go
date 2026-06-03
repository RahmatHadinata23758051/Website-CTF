package handlers

import (
	"errors"

	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// PublicUserProfileHandler serves GET /api/users/:id/profile.
type PublicUserProfileHandler struct {
	service *services.PublicUserProfileService
}

// NewPublicUserProfileHandler wires up the handler with its service dependencies.
func NewPublicUserProfileHandler() *PublicUserProfileHandler {
	repo := repositories.NewPublicUserProfileRepository()
	scoreboardRepo := repositories.NewScoreboardRepository()
	svc := services.NewPublicUserProfileService(repo, scoreboardRepo)
	return &PublicUserProfileHandler{service: svc}
}

// GetPublicProfile handles GET /api/users/:id/profile.
// Requires: auth + accepted rules (enforced by middleware in routes).
// Returns: public-safe profile — no email, role, password, ban data.
func (h *PublicUserProfileHandler) GetPublicProfile(c *fiber.Ctx) error {
	rawID := c.Params("id")
	targetID, err := uuid.Parse(rawID)
	if err != nil {
		return utils.SendError(c, "Invalid user ID format", fiber.StatusBadRequest)
	}

	profile, err := h.service.GetPublicProfile(targetID)
	if err != nil {
		if errors.Is(err, services.ErrPublicUserNotFound) {
			return utils.SendError(c, "User not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve user profile", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Public user profile retrieved successfully", profile)
}
