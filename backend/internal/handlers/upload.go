package handlers

import (
	"bytes"
	"io"
	"path/filepath"
	"strings"

	"ctf-platform/backend/internal/services"
	"ctf-platform/backend/internal/utils"
	"ctf-platform/backend/internal/validators"

	"github.com/gofiber/fiber/v2"
)

// headerReadSize is the number of bytes read from the file for MIME/magic detection.
const headerReadSize = 512

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
	// 1. Parse file from form request multipart/form-data
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return utils.SendError(c, "file parameter is required in form-data", fiber.StatusBadRequest)
	}

	// 2. Validate file size and extension
	if errMsg := validators.ValidateUploadFile(fileHeader.Filename, fileHeader.Size); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	// 3. Open the physical multipart file stream
	file, err := fileHeader.Open()
	if err != nil {
		return utils.SendError(c, "Failed to parse attachment stream", fiber.StatusInternalServerError)
	}
	defer file.Close()

	// 4. Read up to 512 bytes for header inspection (MIME/magic byte check)
	headerBuf := make([]byte, headerReadSize)
	n, readErr := file.Read(headerBuf)
	if readErr != nil && readErr != io.EOF {
		return utils.SendError(c, "Failed to read attachment content", fiber.StatusInternalServerError)
	}
	headerBuf = headerBuf[:n]

	// 5. Validate content via MIME sniffing and magic byte checks
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if errMsg := utils.ValidateFileContent(ext, headerBuf); errMsg != "" {
		return utils.SendError(c, errMsg, fiber.StatusBadRequest)
	}

	// 6. Reconstruct full reader: prepend the header bytes back to the stream
	fullReader := io.MultiReader(bytes.NewReader(headerBuf), file)

	// 7. Delegate processing and local storage to the UploadService
	relativeURL, uniqueName, err := h.service.SaveChallengeAttachment(fileHeader.Filename, fullReader)
	if err != nil {
		return utils.SendError(c, "Failed to persist attachment: "+err.Error(), fiber.StatusInternalServerError)
	}

	// 8. Return secure upload success metadata
	return utils.SendSuccess(c, "Attachment uploaded successfully", fiber.Map{
		"attachment_url": relativeURL,
		"filename":       uniqueName,
		"size":           fileHeader.Size,
	})
}
