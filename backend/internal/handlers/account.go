package handlers

import (
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type AccountHandler struct {
	service *services.AccountService
}

func NewAccountHandler() *AccountHandler {
	accountRepo := repositories.NewAccountRepository()
	service := services.NewAccountService(accountRepo)
	return &AccountHandler{service: service}
}

// UpdateProfile handles PATCH /api/account/profile
func (h *AccountHandler) UpdateProfile(c *fiber.Ctx) error {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	var req validators.UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
	}

	if errMsg := req.Validate(); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	updatedUser, err := h.service.UpdateProfile(userID, req.Name)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "Competitor profile not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to update profile settings", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Account profile updated successfully", fiber.Map{
		"user": updatedUser,
	})
}

// ChangePassword handles PATCH /api/account/password
func (h *AccountHandler) ChangePassword(c *fiber.Ctx) error {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	var req validators.ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
	}

	if errMsg := req.Validate(); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	err = h.service.ChangePassword(userID, req.CurrentPassword, req.NewPassword)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "Competitor profile not found", fiber.StatusNotFound)
		}
		if err.Error() == "current password is incorrect" {
			return utils.SendError(c, "Current password is incorrect", fiber.StatusBadRequest)
		}
		return utils.SendError(c, "Failed to change password securely", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Password changed successfully", nil)
}

// AcceptRules handles POST /api/account/accept-rules
func (h *AccountHandler) AcceptRules(c *fiber.Ctx) error {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	acceptedAt, err := h.service.AcceptRules(userID)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "Competitor profile not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to accept platform rules", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Rules accepted successfully", fiber.Map{
		"accepted_rules_at": acceptedAt,
	})
}
