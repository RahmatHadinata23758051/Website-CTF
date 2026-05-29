package validators

import "strings"

// AdminHintRequest holds the validated payload fields for create and update hints endpoints.
type AdminHintRequest struct {
	Content    string `json:"content"`
	Cost       int    `json:"cost"`
	OrderIndex int    `json:"order_index"`
	IsActive   bool   `json:"is_active"`
}

// AdminHintStatusRequest defines the minimal payload for PATCH status route.
type AdminHintStatusRequest struct {
	IsActive bool `json:"is_active"`
}

// ValidateAdminHint checks required parameters and value constraints.
func ValidateAdminHint(req *AdminHintRequest) string {
	if strings.TrimSpace(req.Content) == "" {
		return "content is required and cannot be blank"
	}
	if req.Cost < 0 {
		return "cost must be a positive integer or zero"
	}
	if req.OrderIndex < 0 {
		return "order_index must be a positive integer or zero"
	}
	return ""
}
