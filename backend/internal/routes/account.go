package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupAccountRoutes mounts authenticated profile and password settings.
func SetupAccountRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewAccountHandler()

	// Authenticated routes
	router.Patch("/account/profile", middleware.RequireAuth(cfg), handler.UpdateProfile)
	router.Patch("/account/password", middleware.RequireAuth(cfg), handler.ChangePassword)
}
