package repositories

import (
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SubmissionRepository defines database operations for submissions and solves.
type SubmissionRepository struct{}

// NewSubmissionRepository returns a new instance.
func NewSubmissionRepository() *SubmissionRepository {
	return &SubmissionRepository{}
}

// CreateSubmission records a competitor's flag attempt for audit purposes.
func (r *SubmissionRepository) CreateSubmission(sub *models.Submission) error {
	db := database.DB
	return db.Create(sub).Error
}

// FindSolve checks if a solve record already exists for the competitor and challenge.
func (r *SubmissionRepository) FindSolve(userID uuid.UUID, challengeID uuid.UUID) (*models.Solve, error) {
	db := database.DB
	var solve models.Solve

	err := db.Where("user_id = ? AND challenge_id = ?", userID, challengeID).First(&solve).Error
	if err != nil {
		return nil, err
	}
	return &solve, nil
}

// CreateSolve inserts a new solve record inside a GORM transaction to ensure atomic execution.
func (r *SubmissionRepository) CreateSolve(userID uuid.UUID, challengeID uuid.UUID) error {
	db := database.DB

	return db.Transaction(func(tx *gorm.DB) error {
		// Double check to prevent race condition insertions
		var count int64
		if err := tx.Model(&models.Solve{}).Where("user_id = ? AND challenge_id = ?", userID, challengeID).Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return nil // Already solved in another session
		}

		solve := models.Solve{
			UserID:      userID,
			ChallengeID: challengeID,
			SolvedAt:    time.Now(),
		}
		return tx.Create(&solve).Error
	})
}
