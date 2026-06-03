package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupHintRoutes mounts all public challenge hint lookup routes.
func SetupHintRoutes(router fiber.Router, cfg *config.Config) {
	hintHandler := handlers.NewHintHandler()

	router.Get("/challenges/:slug/hints",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		hintHandler.GetPublicHints,
	)
}
