package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupUserDirectoryRoutes mounts the public user directory and public user profile endpoints.
func SetupUserDirectoryRoutes(router fiber.Router, cfg *config.Config) {
	dirHandler := handlers.NewUserDirectoryHandler()
	profileHandler := handlers.NewPublicUserProfileHandler()

	// GET /api/users — authenticated + accepted rules; excludes banned/admin accounts.
	router.Get("/users",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		dirHandler.GetUsers,
	)

	// GET /api/users/:id/profile — public profile for a specific player.
	// Returns 404 for admin users, banned users, and missing users.
	router.Get("/users/:id/profile",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		profileHandler.GetPublicProfile,
	)
}

