package validators

import "strings"

// AdminChallengeRequest defines the input contract for create/update admin challenge endpoints.
type AdminChallengeRequest struct {
	Title         string  `json:"title"`
	Slug          string  `json:"slug"`
	Description   string  `json:"description"`
	Category      string  `json:"category"`
	Difficulty    string  `json:"difficulty"`
	Points        int     `json:"points"`
	Flag          string  `json:"flag"`           // Plaintext flag - will be hashed, never stored or returned as-is
	AttachmentURL *string `json:"attachment_url"` // Optional
	ExternalLink  *string `json:"external_link"`  // Optional
	IsActive      bool    `json:"is_active"`
}

// AdminChallengeStatusRequest defines the input for PATCH /status endpoint.
type AdminChallengeStatusRequest struct {
	IsActive bool `json:"is_active"`
}

// ValidateAdminChallengeCreate validates required fields for create.
func ValidateAdminChallengeCreate(req *AdminChallengeRequest) string {
	if strings.TrimSpace(req.Title) == "" {
		return "title is required"
	}
	if strings.TrimSpace(req.Description) == "" {
		return "description is required"
	}
	if strings.TrimSpace(req.Category) == "" {
		return "category is required"
	}
	if strings.TrimSpace(req.Difficulty) == "" {
		return "difficulty is required"
	}
	if req.Points <= 0 {
		return "points must be a positive integer"
	}
	if strings.TrimSpace(req.Flag) == "" {
		return "flag is required for new challenges"
	}
	return ""
}

// ValidateAdminChallengeUpdate validates required fields for full update.
func ValidateAdminChallengeUpdate(req *AdminChallengeRequest) string {
	if strings.TrimSpace(req.Title) == "" {
		return "title is required"
	}
	if strings.TrimSpace(req.Description) == "" {
		return "description is required"
	}
	if strings.TrimSpace(req.Category) == "" {
		return "category is required"
	}
	if strings.TrimSpace(req.Difficulty) == "" {
		return "difficulty is required"
	}
	if req.Points <= 0 {
		return "points must be a positive integer"
	}
	// flag is optional on update - if omitted, keep existing flag_hash
	return ""
}

// GenerateSlugFromTitle produces a URL-safe slug from a challenge title.
func GenerateSlugFromTitle(title string) string {
	slug := strings.ToLower(strings.TrimSpace(title))
	var result strings.Builder
	prevDash := false
	for _, r := range slug {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			result.WriteRune(r)
			prevDash = false
		} else if !prevDash {
			result.WriteRune('-')
			prevDash = true
		}
	}
	return strings.Trim(result.String(), "-")
}
