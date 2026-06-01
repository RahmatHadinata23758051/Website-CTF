package handlers

import (
	"strconv"

	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// AdminUserHandler coordinates HTTP handlers for admin user management actions.
type AdminUserHandler struct {
	service *services.AdminUserService
}

// NewAdminUserHandler creates a new handler instance.
func NewAdminUserHandler() *AdminUserHandler {
	return &AdminUserHandler{
		service: services.NewAdminUserService(),
	}
}

// ListUsers handles GET /api/admin/users (admin only).
func (h *AdminUserHandler) ListUsers(c *fiber.Ctx) error {
	search := c.Query("search")
	role := c.Query("role")
	status := c.Query("status")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	if limit < 1 {
		limit = 20
	}

	users, total, totalPages, err := h.service.ListUsers(search, role, status, page, limit)
	if err != nil {
		return utils.SendError(c, "Failed to retrieve users", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Admin users retrieved successfully", fiber.Map{
		"users": users,
		"pagination": fiber.Map{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
		},
	})
}

// GetUserDetail handles GET /api/admin/users/:id (admin only).
func (h *AdminUserHandler) GetUserDetail(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
	}

	user, err := h.service.GetUserByID(id)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "User not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, "Failed to retrieve user details", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "User details retrieved successfully", fiber.Map{
		"user": user,
	})
}

// UpdateUserRole handles PATCH /api/admin/users/:id/role (admin only).
func (h *AdminUserHandler) UpdateUserRole(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
	}

	actorIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}
	actorID, err := uuid.Parse(actorIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	req := new(validators.UpdateRoleRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
	}

	if errMsg := req.Validate(); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	user, err := h.service.UpdateUserRole(actorID, id, req.Role)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "User not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, err.Error(), fiber.StatusBadRequest)
	}

	return utils.SendSuccess(c, "User role updated successfully", fiber.Map{
		"user": user,
	})
}

// BanUser handles PATCH /api/admin/users/:id/ban (admin only).
func (h *AdminUserHandler) BanUser(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
	}

	actorIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}
	actorID, err := uuid.Parse(actorIDStr)
	if err != nil {
		return utils.SendError(c, "Missing or invalid authorization token", fiber.StatusUnauthorized)
	}

	req := new(validators.BanUserRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.SendError(c, "Invalid request payload format", fiber.StatusBadRequest)
	}

	if errMsg := req.Validate(); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	user, err := h.service.BanUser(actorID, id, req.Reason)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "User not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, err.Error(), fiber.StatusBadRequest)
	}

	return utils.SendSuccess(c, "User banned successfully", fiber.Map{
		"user": user,
	})
}

// UnbanUser handles PATCH /api/admin/users/:id/unban (admin only).
func (h *AdminUserHandler) UnbanUser(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, "Invalid user ID", fiber.StatusBadRequest)
	}

	user, err := h.service.UnbanUser(id)
	if err != nil {
		if err.Error() == "user not found" {
			return utils.SendError(c, "User not found", fiber.StatusNotFound)
		}
		return utils.SendError(c, err.Error(), fiber.StatusBadRequest)
	}

	return utils.SendSuccess(c, "User unbanned successfully", fiber.Map{
		"user": user,
	})
}
