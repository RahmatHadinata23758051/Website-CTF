package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupChallengeRoutes mounts challenge details and grid endpoints.
func SetupChallengeRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewChallengeHandler()

	challenges := router.Group("/challenges")

	// Apply OptionalAuth so logged-in users get solved check calculated.
	// Browsing remains completely public for unregistered visitors.
	challenges.Get("/", middleware.OptionalAuth(cfg), handler.GetChallenges)
	challenges.Get("/:slug", middleware.OptionalAuth(cfg), handler.GetChallengeBySlug)
}
