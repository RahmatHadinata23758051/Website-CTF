package utils

import "github.com/gofiber/fiber/v2"

// ClientIP safely extracts the real client IP from a Fiber context.
// Uses c.IP() which respects Fiber's trusted proxy config.
// Do NOT blindly use X-Forwarded-For unless trusted proxies are explicitly configured.
func ClientIP(c *fiber.Ctx) string {
	ip := c.IP()
	if ip == "" {
		return "unknown"
	}
	return ip
}
