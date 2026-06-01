package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupProfileRoutes mounts profile endpoints.
func SetupProfileRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewProfileHandler()

	// Authenticated profile route
	router.Get("/profile/summary", middleware.RequireAuth(cfg), handler.GetProfileSummary)
}
