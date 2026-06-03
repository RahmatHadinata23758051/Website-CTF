package middleware

import (
	"time"

	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// RateLimitByIP returns a Fiber middleware that rate-limits requests by client IP.
// key: label for the rate limit action (e.g. "login", "register")
// limit: max requests allowed in the window
// window: time window duration
// message: error message to display when rate-limited
func RateLimitByIP(key string, limit int64, window time.Duration, message string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ip := utils.ClientIP(c)
		rlKey := services.RateLimitKey(key, "ip", ip)
		result := services.CheckRateLimit(rlKey, limit, window)
		if !result.Allowed {
			return utils.SendError(c, message, fiber.StatusTooManyRequests)
		}
		return c.Next()
	}
}

// RateLimitByUser returns a Fiber middleware that rate-limits requests by authenticated user_id.
// Must be placed AFTER RequireAuth so that c.Locals("user_id") is populated.
// key: label for the rate limit action (e.g. "password", "upload")
// limit: max requests allowed in the window
// window: time window duration
// message: error message to display when rate-limited
func RateLimitByUser(key string, limit int64, window time.Duration, message string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, ok := c.Locals("user_id").(string)
		if !ok || userID == "" {
			// No user context — skip rate limiting (auth middleware will reject)
			return c.Next()
		}
		rlKey := services.RateLimitKey(key, "user", userID)
		result := services.CheckRateLimit(rlKey, limit, window)
		if !result.Allowed {
			return utils.SendError(c, message, fiber.StatusTooManyRequests)
		}
		return c.Next()
	}
}

// RateLimitSubmit returns a Fiber middleware for per-user-per-slug flag submission limiting.
// Must be placed AFTER RequireAuth.
// limit: max submissions in the window
// window: time window duration
func RateLimitSubmit(limit int64, window time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, ok := c.Locals("user_id").(string)
		if !ok || userID == "" {
			return c.Next()
		}
		slug := c.Params("slug")
		if slug == "" {
			return c.Next()
		}
		rlKey := services.RateLimitKey("submit", "user", userID, "challenge", slug)
		result := services.CheckRateLimit(rlKey, limit, window)
		if !result.Allowed {
			return utils.SendError(c, "Too many flag submissions. Please slow down and try again later.", fiber.StatusTooManyRequests)
		}
		return c.Next()
	}
}
