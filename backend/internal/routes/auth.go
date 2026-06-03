package routes

import (
	"time"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupAuthRoutes mounts user registration and session verification routes.
func SetupAuthRoutes(router fiber.Router, cfg *config.Config) {
	auth := router.Group("/auth")

	// Public routes — rate limited by IP
	auth.Post("/register",
		middleware.RateLimitByIP("register", 30, time.Hour, "Too many registration attempts. Please try again later."),
		handlers.Register(cfg),
	)
	auth.Post("/login",
		middleware.RateLimitByIP("login:minute", 10, time.Minute, "Too many login attempts. Please try again later."),
		middleware.RateLimitByIP("login:hour", 30, time.Hour, "Too many login attempts. Please try again later."),
		handlers.Login(cfg),
	)
	auth.Post("/logout", handlers.Logout)

	// Protected routes (Require JWT session)
	auth.Get("/me", middleware.RequireAuth(cfg), handlers.GetMe)
}
