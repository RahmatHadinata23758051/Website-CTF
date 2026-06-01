package handlers

import (
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ProfileHandler struct {
	service *services.ProfileService
}

func NewProfileHandler() *ProfileHandler {
	profileRepo := repositories.NewProfileRepository()
	scoreboardRepo := repositories.NewScoreboardRepository()
	service := services.NewProfileService(profileRepo, scoreboardRepo)
	return &ProfileHandler{service: service}
}

// GetProfileSummary handles GET /api/profile/summary
func (h *ProfileHandler) GetProfileSummary(c *fiber.Ctx) error {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	summary, err := h.service.GetProfileSummary(userID)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "Competitor profile not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve profile summary", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Profile summary retrieved successfully", summary)
}
