package routes

import (
	"time"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// adminMutationRL is a shorthand for the admin mutation rate limit middleware.
// 60 mutation actions per admin user per hour.
func adminMutationRL() fiber.Handler {
	return middleware.RateLimitByUser("admin:mutation", 60, time.Hour, "Too many admin actions. Please try again later.")
}

// SetupAdminRoutes mounts all admin-only challenge management routes.
// All routes require: valid JWT (RequireAuth) + role=admin (RequireAdmin).
func SetupAdminRoutes(router fiber.Router, cfg *config.Config) {
	adminHandler := handlers.NewAdminChallengeHandler(cfg)

	// Admin route group with two-layer auth guard
	admin := router.Group("/admin",
		middleware.RequireAuth(cfg),
		middleware.RequireAdmin(),
	)

	// User management — GET endpoints are not mutation-rate-limited
	adminUserHandler := handlers.NewAdminUserHandler()
	users := admin.Group("/users")
	users.Get("/", adminUserHandler.ListUsers)
	users.Get("/:id", adminUserHandler.GetUserDetail)
	users.Patch("/:id/role", adminMutationRL(), adminUserHandler.UpdateUserRole)
	users.Patch("/:id/ban", adminMutationRL(), adminUserHandler.BanUser)
	users.Patch("/:id/unban", adminMutationRL(), adminUserHandler.UnbanUser)

	// Submission & Solve monitoring (admin only, read-only — no mutation limit)
	adminSubHandler := handlers.NewAdminSubmissionHandler()
	admin.Get("/submissions/stats", adminSubHandler.GetSubmissionStats)
	admin.Get("/submissions", adminSubHandler.ListSubmissions)
	admin.Get("/solves", adminSubHandler.ListSolves)

	// Challenge CRUD management
	challenges := admin.Group("/challenges")
	challenges.Get("/", adminHandler.ListChallenges)
	challenges.Get("/:id", adminHandler.GetChallenge)
	challenges.Post("/", adminMutationRL(), adminHandler.CreateChallenge)
	challenges.Put("/:id", adminMutationRL(), adminHandler.UpdateChallenge)
	challenges.Patch("/:id/status", adminMutationRL(), adminHandler.UpdateChallengeStatus)
	challenges.Delete("/:id", adminMutationRL(), adminHandler.DeleteChallenge)

	// File attachment uploads — 10 uploads per admin per hour
	uploadHandler := handlers.NewUploadHandler()
	admin.Post("/uploads/challenge-attachment",
		middleware.RateLimitByUser("upload", 10, time.Hour, "Too many upload attempts. Please try again later."),
		uploadHandler.UploadChallengeAttachment,
	)

	// Hints management CRUD (admin-only mutations)
	adminHintHandler := handlers.NewHintHandler()
	admin.Get("/challenges/:challenge_id/hints", adminHintHandler.GetAdminHints)
	admin.Post("/challenges/:challenge_id/hints", adminMutationRL(), adminHintHandler.CreateHint)
	admin.Put("/hints/:id", adminMutationRL(), adminHintHandler.UpdateHint)
	admin.Patch("/hints/:id/status", adminMutationRL(), adminHintHandler.UpdateHintStatus)
	admin.Delete("/hints/:id", adminMutationRL(), adminHintHandler.DeleteHint)
}

