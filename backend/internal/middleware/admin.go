package middleware

import (
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// RequireAdmin restricts access to users with role = "admin".
// Must be chained AFTER RequireAuth so that the role claim is already in Locals.
func RequireAdminRole() fiber.Handler {
	return func(c *fiber.Ctx) error {
		role, ok := c.Locals("role").(string)
		if !ok || role != "admin" {
			return utils.SendError(c, "Admin access required", fiber.StatusForbidden)
		}
		return c.Next()
	}
}
