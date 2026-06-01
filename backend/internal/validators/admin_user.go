package validators

import (
	"strings"
)

// UpdateRoleRequest represents fields for admin modifying user role.
type UpdateRoleRequest struct {
	Role string `json:"role"`
}

// Validate checks if the role input is valid.
func (r *UpdateRoleRequest) Validate() string {
	r.Role = strings.TrimSpace(r.Role)
	if r.Role == "" {
		return "Role is required"
	}
	if r.Role != "user" && r.Role != "admin" {
		return "Invalid role. Role must be either 'user' or 'admin'"
	}
	return ""
}

// BanUserRequest represents fields for banning a user.
type BanUserRequest struct {
	Reason string `json:"reason"`
}

// Validate checks if the ban reason meets constraints.
func (r *BanUserRequest) Validate() string {
	r.Reason = strings.TrimSpace(r.Reason)
	if r.Reason == "" {
		return "Ban reason is required"
	}
	if len(r.Reason) < 3 || len(r.Reason) > 255 {
		return "Reason must be between 3 and 255 characters long"
	}
	return ""
}
