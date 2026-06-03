package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupScoreboardRoutes mounts the protected ranked grids.
func SetupScoreboardRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewScoreboardHandler()

	router.Get("/scoreboard",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		handler.GetScoreboard,
	)
	router.Get("/scoreboard/progression",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		handler.GetScoreboardProgression,
	)
}
