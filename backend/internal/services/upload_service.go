package services

import (
	"crypto/rand"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"ctf-platform/backend/internal/validators"
)

// UploadService manages saving challenge attachments to the secure local filesystem.
type UploadService struct {
	storageDir string
}

// NewUploadService returns a new instance of UploadService.
func NewUploadService(storageDir string) *UploadService {
	return &UploadService{storageDir: storageDir}
}

// SaveChallengeAttachment saves an uploaded file safely on disk with a secure, unique filename.
func (s *UploadService) SaveChallengeAttachment(originalName string, fileReader io.Reader) (string, string, error) {
	// Sanitize original filename first
	sanitizedOriginal := validators.SanitizeFilename(originalName)

	// Extract stem and extension
	ext := strings.ToLower(filepath.Ext(sanitizedOriginal))
	stem := strings.TrimSuffix(sanitizedOriginal, ext)

	// Generate safe unique filename format: timestamp-randomslug-originalstem.ext
	timestamp := time.Now().Format("20060102-150405")
	
	// Create random slug
	randBytes := make([]byte, 3)
	if _, err := rand.Read(randBytes); err != nil {
		return "", "", fmt.Errorf("failed to generate secure random token: %w", err)
	}
	randomSlug := fmt.Sprintf("%x", randBytes)

	// Build target filename
	stemSlug := strings.ToLower(strings.ReplaceAll(stem, " ", "-"))
	uniqueName := fmt.Sprintf("%s-%s-%s%s", timestamp, randomSlug, stemSlug, ext)

	// Synchronously ensure storage directory exists
	targetDir := filepath.Join(s.storageDir, "uploads", "challenges")
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return "", "", fmt.Errorf("failed to create storage directories: %w", err)
	}

	// Create physical file
	targetPath := filepath.Join(targetDir, uniqueName)
	outFile, err := os.OpenFile(targetPath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return "", "", fmt.Errorf("failed to create destination file: %w", err)
	}
	defer outFile.Close()

	// Stream reader to physical file
	if _, err := io.Copy(outFile, fileReader); err != nil {
		return "", "", fmt.Errorf("failed to write file content to disk: %w", err)
	}

	// Build safe public relative URL representation
	relativeURL := fmt.Sprintf("/uploads/challenges/%s", uniqueName)

	return relativeURL, uniqueName, nil
}
