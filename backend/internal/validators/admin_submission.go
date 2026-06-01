package validators

import (
	"regexp"
	"time"
)

var dateRegex = regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)

// ValidateDate checks if a string is a valid YYYY-MM-DD date.
func ValidateDate(dateStr string) bool {
	if dateStr == "" {
		return true
	}
	if !dateRegex.MatchString(dateStr) {
		return false
	}
	_, err := time.Parse("2006-01-02", dateStr)
	return err == nil
}
