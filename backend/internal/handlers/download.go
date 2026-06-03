package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"ctf-platform/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
)

// uploadsBaseDir is the canonical absolute base for challenge uploads.
// Set via NewDownloadHandler to allow easy testing.
var uploadsBaseDir string

// NewDownloadHandler registers the safe download handler and sets the base dir.
// Call once at startup with the absolute path to ./storage/uploads/challenges.
func NewDownloadHandler(baseDir string) fiber.Handler {
	// Resolve to absolute path so path.Join comparisons are reliable
	abs, err := filepath.Abs(baseDir)
	if err != nil {
		// Fall back to the raw value if Abs fails (should not happen in practice)
		abs = baseDir
	}
	uploadsBaseDir = abs
	return serveChallengeAttachment
}

// serveChallengeAttachment is the Fiber handler for GET /uploads/challenges/:filename.
//
// Security:
//  1. Sanitize the filename parameter (base name only, no path separators).
//  2. Reject path traversal attempts (/../, %2e%2e, etc.) — Fiber URL-decodes params.
//  3. Join against the absolute base directory.
//  4. Verify the resolved path is still inside the base directory.
//  5. Verify file exists and is not a directory.
//  6. Serve with safe headers:
//     - X-Content-Type-Options: nosniff
//     - Content-Disposition: attachment
//     - Cache-Control: private
func serveChallengeAttachment(c *fiber.Ctx) error {
	rawParam := c.Params("filename")

	// ── 1. Sanitize: use only the base name (strips any directory components) ──
	sanitized := filepath.Base(rawParam)

	// ── 2. Reject if sanitized name still contains traversal markers ─────────
	if strings.Contains(rawParam, "..") || strings.Contains(sanitized, "..") {
		return utils.SendError(c, "File not found", fiber.StatusNotFound)
	}
	// Reject if it became "." or empty after sanitization
	if sanitized == "." || sanitized == "" || sanitized == "/" {
		return utils.SendError(c, "File not found", fiber.StatusNotFound)
	}

	// ── 3. Build the target path ──────────────────────────────────────────────
	targetPath := filepath.Join(uploadsBaseDir, sanitized)

	// ── 4. Verify the resolved path is inside the base directory ─────────────
	cleanBase := filepath.Clean(uploadsBaseDir)
	cleanTarget := filepath.Clean(targetPath)
	if !strings.HasPrefix(cleanTarget, cleanBase+string(filepath.Separator)) {
		return utils.SendError(c, "File not found", fiber.StatusNotFound)
	}

	// ── 5. Verify file exists and is not a directory ──────────────────────────
	info, err := os.Stat(cleanTarget)
	if err != nil || info.IsDir() {
		return utils.SendError(c, "File not found", fiber.StatusNotFound)
	}

	// ── 6. Set safe response headers ─────────────────────────────────────────
	safeFilename := filepath.Base(cleanTarget)
	c.Set("X-Content-Type-Options", "nosniff")
	c.Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, safeFilename))
	c.Set("Cache-Control", "private, max-age=3600")
	c.Set("X-Frame-Options", "DENY")

	// ── 7. Send file ──────────────────────────────────────────────────────────
	return c.SendFile(cleanTarget)
}
