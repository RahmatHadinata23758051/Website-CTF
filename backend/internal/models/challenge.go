package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Challenge represents a CTF challenge loaded in the system.
type Challenge struct {
	ID            uuid.UUID      `gorm:"type:uuid;primaryKey;" json:"id"`
	Title         string         `gorm:"size:255;not null;" json:"title"`
	Slug          string         `gorm:"size:255;not null;unique;index;" json:"slug"`
	Description   string         `gorm:"type:text;not null;" json:"description"`
	Category      string         `gorm:"size:100;not null;index;" json:"category"`
	Difficulty    string         `gorm:"size:50;not null;" json:"difficulty"`
	Points        int            `gorm:"not null;default:0;" json:"points"`
	FlagHash      string         `gorm:"size:255;not null;" json:"-"` // SECURITY CRITICAL: Never expose flag hash to client
	AttachmentURL string         `gorm:"size:512;" json:"attachment_url,omitempty"`
	ExternalLink  string         `gorm:"size:512;" json:"external_link,omitempty"`
	IsActive      bool           `gorm:"not null;default:true;index;" json:"is_active"`
	ScoringType   string         `gorm:"size:50;not null;default:'static';" json:"scoring_type"`
	InitialPoints int            `gorm:"not null;default:0;" json:"initial_points"`
	MinimumPoints int            `gorm:"not null;default:0;" json:"minimum_points"`
	Decay         int            `gorm:"not null;default:0;" json:"decay"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate hook to generate a UUID if not already set.
func (c *Challenge) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}
