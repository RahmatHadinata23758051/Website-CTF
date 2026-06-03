package middleware

import (
	"strings"
	"time"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// UserClaims defines the structured fields stored inside the token.
type UserClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken creates a signed JWT for the authenticated competitor.
func GenerateToken(userID, email, role string, cfg *config.Config) (string, error) {
	claims := UserClaims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 24 hours validity
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWTSecret))
}

// RequireAuth protects routes by requiring a valid JWT in header or cookie.
func RequireAuth(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var tokenStr string

		// 1. Try extracting from Authorization Header (Bearer <token>)
		authHeader := c.Get("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		}

		// 2. Fall back to Cookie if headers are empty
		if tokenStr == "" {
			tokenStr = c.Cookies("session_token")
		}

		if tokenStr == "" {
			return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
		}

		// 3. Parse and check token authenticity
		token, err := jwt.ParseWithClaims(tokenStr, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "invalid token signing method")
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
		}

		// 4. Retrieve claims and push to Context Locals
		claims, ok := token.Claims.(*UserClaims)
		if !ok {
			return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
		}

		// Check user status in database dynamically
		var user models.User
		if err := database.DB.Select("id, role, is_banned, accepted_rules_at").Where("id = ?", claims.UserID).First(&user).Error; err != nil {
			return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
		}

		if user.IsBanned {
			return utils.SendError(c, "Account is banned", fiber.StatusForbidden)
		}

		c.Locals("user_id", user.ID.String())
		c.Locals("email", claims.Email)
		c.Locals("role", user.Role)
		c.Locals("accepted_rules", user.AcceptedRulesAt != nil)

		return c.Next()
	}
}

// OptionalAuth parses JWT if present, but does not reject the request if it is missing or invalid.
func OptionalAuth(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var tokenStr string

		// 1. Try extracting from Authorization Header (Bearer <token>)
		authHeader := c.Get("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		}

		// 2. Fall back to Cookie if headers are empty
		if tokenStr == "" {
			tokenStr = c.Cookies("session_token")
		}

		if tokenStr == "" {
			return c.Next() // Simply continue without context user ID
		}

		// 3. Parse and check token authenticity
		token, err := jwt.ParseWithClaims(tokenStr, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "invalid token signing method")
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			return c.Next() // Simply continue if token is invalid/expired
		}

		// 4. Retrieve claims and push to Context Locals
		claims, ok := token.Claims.(*UserClaims)
		if ok {
			var user models.User
			if err := database.DB.Select("id, role, is_banned, accepted_rules_at").Where("id = ?", claims.UserID).First(&user).Error; err == nil {
				if user.IsBanned {
					return utils.SendError(c, "Account is banned", fiber.StatusForbidden)
				}
				c.Locals("user_id", user.ID.String())
				c.Locals("email", claims.Email)
				c.Locals("role", user.Role)
				c.Locals("accepted_rules", user.AcceptedRulesAt != nil)
			}
		}

		return c.Next()
	}
}

// RequireAdmin restricts routes to admin role only.
func RequireAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		role, ok := c.Locals("role").(string)
		if !ok || role != "admin" {
			return utils.SendError(c, "Admin access required", fiber.StatusForbidden)
		}
		return c.Next()
	}
}

