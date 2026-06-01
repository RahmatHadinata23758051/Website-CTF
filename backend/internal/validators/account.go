package validators

import (
	"strings"
)

// UpdateProfileRequest represents fields to update display name.
type UpdateProfileRequest struct {
	Name string `json:"name"`
}

func (r *UpdateProfileRequest) Validate() string {
	r.Name = strings.TrimSpace(r.Name)

	if r.Name == "" {
		return "Name is required"
	}

	if len(r.Name) < 2 || len(r.Name) > 60 {
		return "Name must be between 2 and 60 characters long"
	}

	return ""
}

// ChangePasswordRequest represents fields to change password.
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
	ConfirmPassword string `json:"confirm_password"`
}

func (r *ChangePasswordRequest) Validate() string {
	if r.CurrentPassword == "" {
		return "Current password is required"
	}

	if r.NewPassword == "" {
		return "New password is required"
	}

	if r.ConfirmPassword == "" {
		return "Confirm password is required"
	}

	if r.NewPassword != r.ConfirmPassword {
		return "New password confirmation does not match"
	}

	if len(r.NewPassword) < 8 {
		return "New password must be at least 8 characters long"
	}

	return ""
}
