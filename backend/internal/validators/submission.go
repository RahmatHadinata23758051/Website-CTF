package validators

import "strings"

// FlagSubmissionRequest represents the request body for flag submission attempts.
type FlagSubmissionRequest struct {
	Flag string `json:"flag"`
}

// Validate checks whether the submitted flag is empty.
func (r *FlagSubmissionRequest) Validate() string {
	r.Flag = strings.TrimSpace(r.Flag)
	if r.Flag == "" {
		return "Flag is required"
	}
	return ""
}
