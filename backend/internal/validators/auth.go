package validators

import (
	"regexp"
	"strings"
)

// Email regex pattern for validation — supports standard and internal dev domains (e.g. .local)
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,10}$`)

// RegisterRequest represents fields needed to register a competitor.
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validate RegisterRequest. Returns error string if invalid, or empty string.
func (r *RegisterRequest) Validate() string {
	r.Name = strings.TrimSpace(r.Name)
	r.Email = strings.TrimSpace(strings.ToLower(r.Email))

	if r.Name == "" {
		return "Name is required"
	}

	if len(r.Name) < 3 || len(r.Name) > 50 {
		return "Name must be between 3 and 50 characters long"
	}

	if !emailRegex.MatchString(r.Email) {
		return "Please provide a valid email address"
	}

	if len(r.Password) < 6 {
		return "Password must be at least 6 characters long"
	}

	return ""
}

// LoginRequest represents fields needed to sign in a competitor.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validate LoginRequest.
func (l *LoginRequest) Validate() string {
	l.Email = strings.TrimSpace(strings.ToLower(l.Email))

	if !emailRegex.MatchString(l.Email) {
		return "Please provide a valid email address"
	}

	if l.Password == "" {
		return "Password is required"
	}

	return ""
}
