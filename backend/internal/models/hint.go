package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Hint represents a security hint for a challenge to help users progress.
type Hint struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	ChallengeID uuid.UUID `gorm:"type:uuid;not null;index;" json:"challenge_id"`
	Content     string    `gorm:"type:text;not null;" json:"content"`
	Cost        int       `gorm:"not null;default:0;" json:"cost"` // Stored for scoring progression logic but not deducted in this phase
	OrderIndex  int       `gorm:"not null;default:0;index;" json:"order_index"`
	IsActive    bool      `gorm:"not null;default:true;index;" json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// BeforeCreate hook to generate a UUID if not already set.
func (h *Hint) BeforeCreate(tx *gorm.DB) (err error) {
	if h.ID == uuid.Nil {
		h.ID = uuid.New()
	}
	return nil
}
