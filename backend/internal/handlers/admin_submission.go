package handlers

import (
	"strconv"

	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// AdminSubmissionHandler coordinates HTTP handlers for admin submission monitoring.
type AdminSubmissionHandler struct {
	service *services.AdminSubmissionService
}

// NewAdminSubmissionHandler creates a new handler instance.
func NewAdminSubmissionHandler() *AdminSubmissionHandler {
	return &AdminSubmissionHandler{
		service: services.NewAdminSubmissionService(),
	}
}

// ListSubmissions handles GET /api/admin/submissions (admin only).
func (h *AdminSubmissionHandler) ListSubmissions(c *fiber.Ctx) error {
	search := c.Query("search")
	userID := c.Query("user_id")
	challengeID := c.Query("challenge_id")
	correct := c.Query("correct")
	from := c.Query("from")
	to := c.Query("to")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.Query("limit", "25"))
	if limit < 1 {
		limit = 25
	}
	if limit > 100 {
		limit = 100
	}

	submissions, total, totalPages, err := h.service.ListSubmissions(
		search, userID, challengeID, correct, from, to, page, limit,
	)
	if err != nil {
		return utils.SendError(c, "Failed to retrieve submissions", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Admin submissions retrieved successfully", fiber.Map{
		"submissions": submissions,
		"pagination": fiber.Map{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
		},
	})
}

// ListSolves handles GET /api/admin/solves (admin only).
func (h *AdminSubmissionHandler) ListSolves(c *fiber.Ctx) error {
	search := c.Query("search")
	userID := c.Query("user_id")
	challengeID := c.Query("challenge_id")
	category := c.Query("category")
	from := c.Query("from")
	to := c.Query("to")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.Query("limit", "25"))
	if limit < 1 {
		limit = 25
	}
	if limit > 100 {
		limit = 100
	}

	solves, total, totalPages, err := h.service.ListSolves(
		search, userID, challengeID, category, from, to, page, limit,
	)
	if err != nil {
		return utils.SendError(c, "Failed to retrieve solves", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Admin solves retrieved successfully", fiber.Map{
		"solves": solves,
		"pagination": fiber.Map{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
		},
	})
}

// GetSubmissionStats handles GET /api/admin/submissions/stats (admin only).
func (h *AdminSubmissionHandler) GetSubmissionStats(c *fiber.Ctx) error {
	stats, err := h.service.GetSubmissionStats()
	if err != nil {
		return utils.SendError(c, "Failed to retrieve submission stats", fiber.StatusInternalServerError)
	}

	return utils.SendSuccess(c, "Admin submission stats retrieved successfully", stats)
}
