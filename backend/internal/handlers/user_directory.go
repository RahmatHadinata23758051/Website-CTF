package handlers

import (
	"strconv"

	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// UserDirectoryHandler handles public user directory requests.
type UserDirectoryHandler struct {
	service *services.UserDirectoryService
}

// NewUserDirectoryHandler creates a new handler instance.
func NewUserDirectoryHandler() *UserDirectoryHandler {
	repo := repositories.NewUserDirectoryRepository()
	service := services.NewUserDirectoryService(repo)
	return &UserDirectoryHandler{service: service}
}

// GetUsers handles paginated user directory listing with optional name search.
func (h *UserDirectoryHandler) GetUsers(c *fiber.Ctx) error {
	search := c.Query("search", "")

	pageStr := c.Query("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limitStr := c.Query("limit", "20")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 20
	}
	if limit > 50 {
		limit = 50
	}

	result, err := h.service.GetUsers(search, page, limit)
	if err != nil {
		return utils.SendError(c, "Failed to retrieve users", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Users retrieved successfully", result)
}
