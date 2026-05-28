package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Solve maps successful submissions. Each user can only solve a challenge once.
type Solve struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_challenge;" json:"user_id"`
	ChallengeID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_challenge;" json:"challenge_id"`
	SolvedAt    time.Time `json:"solved_at"`

	// GORM Associations
	User      User      `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Challenge Challenge `gorm:"foreignKey:ChallengeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

// BeforeCreate hook to generate a UUID if not already set.
func (s *Solve) BeforeCreate(tx *gorm.DB) (err error) {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	if s.SolvedAt.IsZero() {
		s.SolvedAt = time.Now()
	}
	return nil
}
