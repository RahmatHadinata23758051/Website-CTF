package handlers

import (
	"time"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/middleware"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// Register handles user sign up.
func Register(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		req := new(validators.RegisterRequest)
		if err := c.BodyParser(req); err != nil {
			return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
		}

		// Validate fields
		if errMsg := req.Validate(); errMsg != "" {
			return utils.SendError(c, errMsg, fiber.StatusBadRequest)
		}

		db := database.DB

		// Check if user already exists
		var existingUser models.User
		err := db.Where("email = ?", req.Email).First(&existingUser).Error
		if err == nil {
			return utils.SendError(c, "Email is already registered", fiber.StatusBadRequest)
		}

		// Hash password
		passwordHash, err := utils.HashPassword(req.Password)
		if err != nil {
			return utils.SendError(c, "Failed to process user credentials", fiber.StatusInternalServerError)
		}

		// Create user record
		newUser := models.User{
			Name:         req.Name,
			Email:        req.Email,
			PasswordHash: passwordHash,
			Role:         "user", // Competitors are always 'user' by default
		}

		if err := db.Create(&newUser).Error; err != nil {
			return utils.SendError(c, "Failed to create competitor profile", fiber.StatusInternalServerError)
		}

		// Generate JWT
		token, err := middleware.GenerateToken(newUser.ID.String(), newUser.Email, newUser.Role, cfg)
		if err != nil {
			return utils.SendError(c, "Account created, but failed to generate session token", fiber.StatusInternalServerError)
		}

		// Set cookie
		c.Cookie(&fiber.Cookie{
			Name:     "session_token",
			Value:    token,
			Expires:  time.Now().Add(24 * time.Hour),
			HTTPOnly: true,
			Secure:   cfg.AppEnv == "production", // secure in prod
			SameSite: "Strict",
		})

		return utils.SendSuccess(c, "User registered successfully", fiber.Map{
			"token": token,
			"user": fiber.Map{
				"id":                newUser.ID,
				"name":              newUser.Name,
				"email":             newUser.Email,
				"role":              newUser.Role,
				"accepted_rules_at": newUser.AcceptedRulesAt,
			},
		}, fiber.StatusCreated)
	}
}

// Login signs in user using email and password.
func Login(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		req := new(validators.LoginRequest)
		if err := c.BodyParser(req); err != nil {
			return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
		}

		// Validate
		if errMsg := req.Validate(); errMsg != "" {
			return utils.SendError(c, errMsg, fiber.StatusBadRequest)
		}

		db := database.DB

		// Look up user
		var user models.User
		err := db.Where("email = ?", req.Email).First(&user).Error
		if err != nil {
			// SECURITY: generic error to prevent email harvesting
			return utils.SendError(c, "Invalid email or password", fiber.StatusUnauthorized)
		}

		// Check if user is banned
		if user.IsBanned {
			return utils.SendError(c, "Account is banned", fiber.StatusForbidden)
		}

		// Compare hash
		if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
			return utils.SendError(c, "Invalid email or password", fiber.StatusUnauthorized)
		}

		// Generate JWT
		token, err := middleware.GenerateToken(user.ID.String(), user.Email, user.Role, cfg)
		if err != nil {
			return utils.SendError(c, "Authentication successful, but session generation failed", fiber.StatusInternalServerError)
		}

		// Set cookie
		c.Cookie(&fiber.Cookie{
			Name:     "session_token",
			Value:    token,
			Expires:  time.Now().Add(24 * time.Hour),
			HTTPOnly: true,
			Secure:   cfg.AppEnv == "production",
			SameSite: "Strict",
		})

		return utils.SendSuccess(c, "Login successful", fiber.Map{
			"token": token,
			"user": fiber.Map{
				"id":                user.ID,
				"name":              user.Name,
				"email":             user.Email,
				"role":              user.Role,
				"accepted_rules_at": user.AcceptedRulesAt,
			},
		})
	}
}

// Logout clears the secure session cookie.
func Logout(c *fiber.Ctx) error {
	// Revoke cookie
	c.Cookie(&fiber.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour), // expire in the past
		HTTPOnly: true,
		SameSite: "Strict",
	})

	return utils.SendSuccess(c, "Logout successful", nil)
}

// GetMe retrieves current user profile.
func GetMe(c *fiber.Ctx) error {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	userUUID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	db := database.DB
	var user models.User
	if err := db.First(&user, userUUID).Error; err != nil {
		return utils.SendError(c, "Competitor profile not found", fiber.StatusNotFound)
	}

	// Format response nested inside user key exactly as required
	return utils.SendSuccess(c, "Authenticated user retrieved successfully", fiber.Map{
		"user": fiber.Map{
			"id":                user.ID,
			"name":              user.Name,
			"email":             user.Email,
			"role":              user.Role,
			"accepted_rules_at": user.AcceptedRulesAt,
			"created_at":        user.CreatedAt,
			"updated_at":        user.UpdatedAt,
		},
	})
}
