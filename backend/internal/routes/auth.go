package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupAuthRoutes mounts user registration and session verification routes.
func SetupAuthRoutes(router fiber.Router, cfg *config.Config) {
	auth := router.Group("/auth")

	// Public routes
	auth.Post("/register", handlers.Register(cfg))
	auth.Post("/login", handlers.Login(cfg))
	auth.Post("/logout", handlers.Logout)

	// Protected routes (Require JWT session)
	auth.Get("/me", middleware.RequireAuth(cfg), handlers.GetMe)
}
