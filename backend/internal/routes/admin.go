package routes

import (
	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupAdminRoutes mounts all admin-only challenge management routes.
// All routes require: valid JWT (RequireAuth) + role=admin (RequireAdminRole).
func SetupAdminRoutes(router fiber.Router, cfg *config.Config) {
	adminHandler := handlers.NewAdminChallengeHandler(cfg)

	// Admin route group with two-layer auth guard
	admin := router.Group("/admin",
		middleware.RequireAuth(cfg),
		middleware.RequireAdminRole(),
	)

	// Challenge CRUD management
	challenges := admin.Group("/challenges")
	challenges.Get("/", adminHandler.ListChallenges)

	// File attachment uploads management
	uploadHandler := handlers.NewUploadHandler()
	admin.Post("/uploads/challenge-attachment", uploadHandler.UploadChallengeAttachment)

	// Hints management CRUD (admin-only)
	adminHintHandler := handlers.NewHintHandler()
	admin.Get("/challenges/:challenge_id/hints", adminHintHandler.GetAdminHints)
	admin.Post("/challenges/:challenge_id/hints", adminHintHandler.CreateHint)
	admin.Put("/hints/:id", adminHintHandler.UpdateHint)
	admin.Patch("/hints/:id/status", adminHintHandler.UpdateHintStatus)
	admin.Delete("/hints/:id", adminHintHandler.DeleteHint)
	challenges.Get("/:id", adminHandler.GetChallenge)
	challenges.Post("/", adminHandler.CreateChallenge)
	challenges.Put("/:id", adminHandler.UpdateChallenge)
	challenges.Patch("/:id/status", adminHandler.UpdateChallengeStatus)
	challenges.Delete("/:id", adminHandler.DeleteChallenge)
}
