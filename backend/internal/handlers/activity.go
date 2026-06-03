package handlers

import (
	"strconv"

	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// ActivityHandler handles public activity feed requests.
type ActivityHandler struct {
	service *services.ActivityService
}

// NewActivityHandler creates a new handler instance.
func NewActivityHandler() *ActivityHandler {
	repo := repositories.NewActivityRepository()
	service := services.NewActivityService(repo)
	return &ActivityHandler{service: service}
}

// GetRecentSolves returns the recent solve activity feed.
func (h *ActivityHandler) GetRecentSolves(c *fiber.Ctx) error {
	limitStr := c.Query("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}
	if limit > 20 {
		limit = 20
	}

	activities, err := h.service.GetRecentSolves(limit)
	if err != nil {
		return utils.SendError(c, "Failed to retrieve recent activity", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Recent solves retrieved successfully", fiber.Map{
		"activities": activities,
	})
}
