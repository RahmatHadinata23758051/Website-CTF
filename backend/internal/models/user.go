package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a competitor or admin in the system.
type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey;" json:"id"`
	Name         string         `gorm:"size:255;not null;unique;" json:"name"`
	Email        string         `gorm:"size:255;not null;unique;" json:"email"`
	PasswordHash string         `gorm:"size:255;not null;" json:"-"` // Never expose in JSON responses
	Role         string         `gorm:"size:50;not null;default:'user';" json:"role"`
	IsBanned     bool           `gorm:"not null;default:false;" json:"is_banned"`
	BannedAt     *time.Time     `json:"banned_at,omitempty"`
	BannedReason *string        `gorm:"size:255;" json:"banned_reason,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate hook to generate a UUID if not already set.
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
