package handlers

import (
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type StatsHandler struct {
	service *services.StatsService
}

func NewStatsHandler() *StatsHandler {
	repo := repositories.NewStatsRepository()
	service := services.NewStatsService(repo)
	return &StatsHandler{service: service}
}

// GetOverview handles GET /api/stats/overview
func (h *StatsHandler) GetOverview(c *fiber.Ctx) error {
	stats, err := h.service.GetOverviewStats()
	if err != nil {
		return utils.SendError(c, "Failed to retrieve overview statistics", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Overview stats retrieved successfully", stats)
}
