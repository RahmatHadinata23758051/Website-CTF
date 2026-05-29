package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

// SetupStatsRoutes mounts all public stats inquiry routes.
func SetupStatsRoutes(router fiber.Router, cfg *config.Config) {
	statsHandler := handlers.NewStatsHandler()

	// Public aggregate statistics
	router.Get("/stats/overview", statsHandler.GetOverview)
}
