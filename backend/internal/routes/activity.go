package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupActivityRoutes mounts the activity feed endpoint.
func SetupActivityRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewActivityHandler()

	activity := router.Group("/activity")

	// Authenticated-only: requires valid JWT, bans excluded by RequireAuth middleware.
	activity.Get("/recent-solves",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		handler.GetRecentSolves,
	)
}
