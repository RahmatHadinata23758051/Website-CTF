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

	challenges := router.Group("/challenges",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
	)

	challenges.Get("/", handler.GetChallenges)
	challenges.Get("/:slug", handler.GetChallengeBySlug)
}
