package handlers

import (
	"errors"

	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// ChallengeHandler handles requests for CTF challenges.
type ChallengeHandler struct {
	service *services.ChallengeService
}

// NewChallengeHandler creates a new handler instance.
func NewChallengeHandler() *ChallengeHandler {
	repo := repositories.NewChallengeRepository()
	service := services.NewChallengeService(repo)
	return &ChallengeHandler{service: service}
}

// GetChallenges handles listing and searching active challenges.
func (h *ChallengeHandler) GetChallenges(c *fiber.Ctx) error {
	category := c.Query("category")
	difficulty := c.Query("difficulty")
	search := c.Query("search")

	// Retrieve optional user ID populated by OptionalAuth middleware
	userIDStr, _ := c.Locals("user_id").(string)

	challenges, err := h.service.GetChallengeList(userIDStr, category, difficulty, search)
	if err != nil {
		return utils.SendError(c, "Failed to retrieve challenges", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenges retrieved successfully", fiber.Map{
		"challenges": challenges,
	})
}

// GetChallengeBySlug handles retrieving a single active challenge details.
func (h *ChallengeHandler) GetChallengeBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return utils.SendError(c, "Challenge slug is required", fiber.StatusBadRequest)
	}

	userIDStr, _ := c.Locals("user_id").(string)

	challenge, err := h.service.GetChallengeDetail(slug, userIDStr)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve challenge details", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Challenge retrieved successfully", fiber.Map{
		"challenge": challenge,
	})
}
