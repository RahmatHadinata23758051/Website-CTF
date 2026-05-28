package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupSubmissionRoutes maps the protected flag check actions to handlers.
func SetupSubmissionRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewSubmissionHandler(cfg)

	// Flag submissions require full JWT validation.
	router.Post("/challenges/:slug/submit", middleware.RequireAuth(cfg), handler.SubmitFlag)
}
