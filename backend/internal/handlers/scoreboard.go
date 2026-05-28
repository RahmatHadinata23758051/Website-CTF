package handlers

import (
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// ScoreboardHandler handles requests for public competitor rankings.
type ScoreboardHandler struct {
	service *services.ScoreboardService
}

// NewScoreboardHandler creates a new handler instance.
func NewScoreboardHandler() *ScoreboardHandler {
	repo := repositories.NewScoreboardRepository()
	service := services.NewScoreboardService(repo)
	return &ScoreboardHandler{service: service}
}

// GetScoreboard retrieves public ranked competitor stats.
func (h *ScoreboardHandler) GetScoreboard(c *fiber.Ctx) error {
	scoreboard, err := h.service.GetScoreboard()
	if err != nil {
		return utils.SendError(c, "Failed to retrieve scoreboard data", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Scoreboard retrieved successfully", fiber.Map{
		"scoreboard": scoreboard,
	})
}
