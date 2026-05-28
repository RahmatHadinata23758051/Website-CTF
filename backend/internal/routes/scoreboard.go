package routes

import (
	"ctf-platform/backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

// SetupScoreboardRoutes mounts the public ranked grids.
func SetupScoreboardRoutes(router fiber.Router) {
	handler := handlers.NewScoreboardHandler()

	// Public access - anyone can browse rankings
	router.Get("/scoreboard", handler.GetScoreboard)
}
