package handlers

import (
	"errors"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// SubmissionHandler handles challenge flag check actions.
type SubmissionHandler struct {
	service *services.SubmissionService
}

// NewSubmissionHandler creates a new handler instance.
func NewSubmissionHandler(cfg *config.Config) *SubmissionHandler {
	subRepo := repositories.NewSubmissionRepository()
	challengeRepo := repositories.NewChallengeRepository()
	service := services.NewSubmissionService(subRepo, challengeRepo, cfg)
	return &SubmissionHandler{service: service}
}

// SubmitFlag handles post endpoints comparing flags, logging audits, and rewarding competitor points.
func (h *SubmissionHandler) SubmitFlag(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return utils.SendError(c, "Challenge slug is required", fiber.StatusBadRequest)
	}

	// 1. Authenticate user locals presence
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok || userIDStr == "" {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	// 2. Parse request payloads
	req := new(validators.FlagSubmissionRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
	}

	// 3. Validate empty flag check
	if errMsg := req.Validate(); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	// Retrieve client meta properties
	ipAddress := c.IP()
	userAgent := c.Get("User-Agent")

	// 4. Process submission business actions
	res, err := h.service.ProcessSubmission(slug, userIDStr, req.Flag, ipAddress, userAgent)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, "Challenge not found", fiber.StatusNotFound)
		}
		if err.Error() == "rules_not_accepted" {
			return utils.SendError(c, "You must accept the platform rules before submitting flags", fiber.StatusForbidden)
		}
		if err.Error() == "rate_limit_exceeded" {
			return utils.SendError(c, "Too many submissions. Please wait 1 minute.", fiber.StatusTooManyRequests)
		}
		return utils.SendError(c, "Failed to submit flag", fiber.StatusInternalServerError)
	}

	// 5. Renders customized success profiles including top-level correctness flags
	if res.Correct {
		msg := "Correct flag. Challenge solved."
		if res.AlreadySolved {
			msg = "Correct flag. Challenge already solved."
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"correct": true,
			"message": msg,
			"data": fiber.Map{
				"points":         res.Points,
				"already_solved": res.AlreadySolved,
			},
		})
	}

	// Wrong flag payload
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"correct": false,
		"message": "Incorrect flag.",
		"data":    nil,
	})
}
