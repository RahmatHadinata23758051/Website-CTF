package routes

import (
	"time"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupSubmissionRoutes maps the protected flag check actions to handlers.
func SetupSubmissionRoutes(router fiber.Router, cfg *config.Config) {
	handler := handlers.NewSubmissionHandler(cfg)

	router.Post("/challenges/:slug/submit",
		middleware.RequireAuth(cfg),
		middleware.RequireAcceptedRules(),
		middleware.RateLimitSubmit(10, time.Minute),
		middleware.RateLimitSubmit(30, 10*time.Minute),
		handler.SubmitFlag,
	)
}

