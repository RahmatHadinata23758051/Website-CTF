package handlers

import (
	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
)

// UploadHandler manages physical challenge attachment uploads.
type UploadHandler struct {
	service *services.UploadService
}

// NewUploadHandler creates a new UploadHandler with default storage directory path.
func NewUploadHandler() *UploadHandler {
	service := services.NewUploadService("./storage")
	return &UploadHandler{service: service}
}

// UploadChallengeAttachment handles POST /api/admin/uploads/challenge-attachment
func (h *UploadHandler) UploadChallengeAttachment(c *fiber.Ctx) error {
	// Parse file from form request multipart/form-data
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return utils.SendError(c, "file parameter is required in form-data", fiber.StatusBadRequest)
	}

	// Validate file size and extension checks
	if errMsg := validators.ValidateUploadFile(fileHeader.Filename, fileHeader.Size); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	// Open the physical multi-part file content stream
	file, err := fileHeader.Open()
	if err != nil {
		return utils.SendError(c, "Failed to parse attachment stream", fiber.StatusInternalServerError)
	}
	defer file.Close()

	// Delegate processing and local storage to the UploadService
	relativeURL, uniqueName, err := h.service.SaveChallengeAttachment(fileHeader.Filename, file)
	if err != nil {
		return utils.SendError(c, "Failed to persist attachment: "+err.Error(), fiber.StatusInternalServerError)
	}

	// Return secure upload success metadata
	return utils.SendSuccess(c, "Attachment uploaded successfully", fiber.Map{
		"attachment_url": relativeURL,
		"filename":       uniqueName,
		"size":           fileHeader.Size,
		"content_type":   fileHeader.Header.Get("Content-Type"),
	})
}
