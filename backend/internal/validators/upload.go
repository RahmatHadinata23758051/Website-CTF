package validators

import (
	"path/filepath"
	"regexp"
	"strings"
)

// Allowed extensions safelist for MVP
var allowedExtensions = map[string]bool{
	".zip":    true,
	".txt":    true,
	".pdf":    true,
	".png":    true,
	".jpg":    true,
	".jpeg":   true,
	".pcap":   true,
	".pcapng": true,
	".py":     true,
	".js":     true,
	".c":      true,
	".cpp":    true,
	".go":     true,
	".bin":    true,
}

// Max file size: 20 MB (20 * 1024 * 1024)
const MaxFileSize = 20 * 1024 * 1024

// ValidateUploadFile checks if extension and file size are allowed.
func ValidateUploadFile(filename string, size int64) string {
	if size <= 0 {
		return "file is empty"
	}
	if size > MaxFileSize {
		return "file exceeds maximum size limit of 20 MB"
	}

	ext := strings.ToLower(filepath.Ext(filename))
	if ext == "" || !allowedExtensions[ext] {
		return "file extension is not allowed for challenge uploads"
	}

	return ""
}

// SanitizeFilename removes any dangerous characters and path traversal segments.
func SanitizeFilename(filename string) string {
	// Extract the base name (prevents path traversal like ../)
	base := filepath.Base(filename)

	// Keep only safe characters: alphanumeric, dashes, underscores, and dots
	reg := regexp.MustCompile(`[^a-zA-Z0-9.\-_]`)
	sanitized := reg.ReplaceAllString(base, "")

	// Avoid leading dots or hidden files
	sanitized = strings.TrimLeft(sanitized, ".")

	if sanitized == "" {
		sanitized = "attachment"
	}

	return sanitized
}
