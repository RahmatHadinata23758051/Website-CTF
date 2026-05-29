package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

// SetupHintRoutes mounts all public challenge hint lookup routes.
func SetupHintRoutes(router fiber.Router, cfg *config.Config) {
	hintHandler := handlers.NewHintHandler()

	// Public challenges details hints retrieval
	router.Get("/challenges/:slug/hints", hintHandler.GetPublicHints)
}
