package utils

import (
	"bytes"
	"net/http"
	"strings"
)

// MZ Windows PE header (disallowed executable marker)
var mzHeader = []byte{0x4D, 0x5A}

// Magic byte signatures for binary formats
var (
	magicPNG    = []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}
	magicJPG    = []byte{0xFF, 0xD8, 0xFF}
	magicPDF    = []byte{0x25, 0x50, 0x44, 0x46} // %PDF
	magicZIP1   = []byte{0x50, 0x4B, 0x03, 0x04}
	magicZIP2   = []byte{0x50, 0x4B, 0x05, 0x06}
	magicZIP3   = []byte{0x50, 0x4B, 0x07, 0x08}
	magicPCAP1  = []byte{0xD4, 0xC3, 0xB2, 0xA1}
	magicPCAP2  = []byte{0xA1, 0xB2, 0xC3, 0xD4}
	magicPCAP3  = []byte{0x4D, 0x3C, 0xB2, 0xA1}
	magicPCAP4  = []byte{0xA1, 0xB2, 0x3C, 0x4D}
	magicPCAPNG = []byte{0x0A, 0x0D, 0x0D, 0x0A}
)

// blockedDetectedTypes are MIME types that must never be served or stored.
var blockedDetectedTypes = map[string]bool{
	"text/html":                  true,
	"image/svg+xml":              true,
	"application/x-msdownload":   true,
	"application/x-dosexec":      true,
}

// allowedMIMEForExt maps extension → set of acceptable detected MIME types.
// A nil/empty set means "accept any non-blocked type" (e.g. source code, bin).
var allowedMIMEForExt = map[string][]string{
	".png":   {"image/png"},
	".jpg":   {"image/jpeg"},
	".jpeg":  {"image/jpeg"},
	".pdf":   {"application/pdf"},
	".zip":   {"application/zip", "application/x-zip-compressed", "application/octet-stream"},
	".txt":   {"text/plain"},
	// source code and binary allow any non-blocked type (usually text/plain or octet-stream)
	".py":     nil,
	".js":     nil,
	".c":      nil,
	".cpp":    nil,
	".go":     nil,
	".bin":    nil,
	".pcap":   nil,
	".pcapng": nil,
}

// ValidateFileContent inspects the first 512 bytes of a file for:
//  1. MZ Windows PE header (blocks .exe disguised as anything)
//  2. Dangerous detected MIME type (HTML, SVG, msdownload)
//  3. Extension-to-MIME mismatch for strongly-typed binary formats
//  4. Magic byte mismatch for known binary formats
//
// Returns an empty string on success, or an error message on failure.
func ValidateFileContent(ext string, header []byte) string {
	ext = strings.ToLower(ext)

	// ── 1. Reject MZ (Windows PE) executable header ─────────────────────────
	if len(header) >= 2 && bytes.Equal(header[:2], mzHeader) {
		return "Uploaded file content does not match the allowed file type"
	}

	// ── 2. Detect MIME via Go stdlib ─────────────────────────────────────────
	buf := header
	if len(buf) > 512 {
		buf = buf[:512]
	}
	detected := http.DetectContentType(buf)
	// http.DetectContentType includes charset params — strip them
	if idx := strings.Index(detected, ";"); idx != -1 {
		detected = strings.TrimSpace(detected[:idx])
	}

	// ── 3. Reject dangerous detected MIME types unconditionally ─────────────
	if blockedDetectedTypes[detected] {
		return "Uploaded file content is not allowed"
	}

	// ── 4. Magic byte validation for known binary formats ────────────────────
	switch ext {
	case ".png":
		if !bytes.HasPrefix(header, magicPNG) {
			return "Uploaded file content does not match the expected .png format"
		}
	case ".jpg", ".jpeg":
		if !bytes.HasPrefix(header, magicJPG) {
			return "Uploaded file content does not match the expected .jpg format"
		}
	case ".pdf":
		if !bytes.HasPrefix(header, magicPDF) {
			return "Uploaded file content does not match the expected .pdf format"
		}
	case ".zip":
		if !bytes.HasPrefix(header, magicZIP1) && !bytes.HasPrefix(header, magicZIP2) && !bytes.HasPrefix(header, magicZIP3) {
			return "Uploaded file content does not match the expected .zip format"
		}
	case ".pcap":
		if !bytes.HasPrefix(header, magicPCAP1) && !bytes.HasPrefix(header, magicPCAP2) &&
			!bytes.HasPrefix(header, magicPCAP3) && !bytes.HasPrefix(header, magicPCAP4) {
			return "Uploaded file content does not match the expected .pcap format"
		}
	case ".pcapng":
		if !bytes.HasPrefix(header, magicPCAPNG) {
			return "Uploaded file content does not match the expected .pcapng format"
		}
	}

	// ── 5. Extension-to-MIME check for clearly typed formats ────────────────
	allowedMIMEs, hasRule := allowedMIMEForExt[ext]
	if hasRule && allowedMIMEs != nil {
		matched := false
		for _, m := range allowedMIMEs {
			if detected == m {
				matched = true
				break
			}
		}
		if !matched {
			return "Uploaded file content does not match the allowed file type"
		}
	}

	return ""
}

