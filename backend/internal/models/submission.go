package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Submission logs every single flag input attempt from users for security auditing.
type Submission struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;index;" json:"user_id"`
	ChallengeID   uuid.UUID `gorm:"type:uuid;not null;index;" json:"challenge_id"`
	SubmittedFlag string    `gorm:"size:255;not null;" json:"submitted_flag"`
	IsCorrect     bool      `gorm:"not null;" json:"is_correct"`
	IPAddress     string    `gorm:"size:100;" json:"ip_address,omitempty"`
	UserAgent     string    `gorm:"size:512;" json:"user_agent,omitempty"`
	CreatedAt     time.Time `json:"created_at"`

	// GORM Associations
	User      User      `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Challenge Challenge `gorm:"foreignKey:ChallengeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

// BeforeCreate hook to generate a UUID if not already set.
func (s *Submission) BeforeCreate(tx *gorm.DB) (err error) {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}
