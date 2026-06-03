package middleware

import (
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// RequireAcceptedRules restricts access to users who have accepted the platform rules.
// Must be chained AFTER RequireAuth.
func RequireAcceptedRules() fiber.Handler {
	return func(c *fiber.Ctx) error {
		accepted, ok := c.Locals("accepted_rules").(bool)
		if !ok || !accepted {
			return utils.SendError(c, "You must accept the platform rules before accessing this resource", fiber.StatusForbidden)
		}
		return c.Next()
	}
}

