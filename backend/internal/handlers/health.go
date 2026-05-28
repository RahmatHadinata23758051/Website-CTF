package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// HealthCheck returns a success response to indicate the service is running.
func HealthCheck(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "CTF API is running",
		"data": fiber.Map{
			"status": "ok",
		},
	})
}
