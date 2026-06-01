package repositories

import (
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
)

type AdminSubmissionRepository struct{}

func NewAdminSubmissionRepository() *AdminSubmissionRepository {
	return &AdminSubmissionRepository{}
}

// ListSubmissions queries flag submission attempts with preloaded user and challenge data.
func (r *AdminSubmissionRepository) ListSubmissions(
	search string,
	userIDStr string,
	challengeIDStr string,
	correctStr string,
	fromDateStr string,
	toDateStr string,
	page int,
	limit int,
) ([]models.Submission, int64, error) {
	var submissions []models.Submission
	var total int64

	db := database.DB.Model(&models.Submission{})

	// Joins or Preloads
	db = db.Preload("User").Preload("Challenge")

	// Apply Filters
	if userIDStr != "" {
		if uID, err := uuid.Parse(userIDStr); err == nil {
			db = db.Where("user_id = ?", uID)
		}
	}
	if challengeIDStr != "" {
		if cID, err := uuid.Parse(challengeIDStr); err == nil {
			db = db.Where("challenge_id = ?", cID)
		}
	}
	if correctStr == "true" {
		db = db.Where("is_correct = ?", true)
	} else if correctStr == "false" {
		db = db.Where("is_correct = ?", false)
	}

	if fromDateStr != "" {
		if parsedTime, err := time.Parse("2006-01-02", fromDateStr); err == nil {
			db = db.Where("created_at >= ?", parsedTime)
		}
	}
	if toDateStr != "" {
		if parsedTime, err := time.Parse("2006-01-02", toDateStr); err == nil {
			// Extend to end of day
			parsedTime = parsedTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			db = db.Where("created_at <= ?", parsedTime)
		}
	}

	if search != "" {
		// Join with users and challenges to search
		db = db.Joins("JOIN users ON users.id = submissions.user_id").
			Joins("JOIN challenges ON challenges.id = submissions.challenge_id").
			Where("users.name ILIKE ? OR users.email ILIKE ? OR challenges.title ILIKE ? OR challenges.slug ILIKE ?", 
				"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Count total
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Pagination & Order
	offset := (page - 1) * limit
	err := db.Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&submissions).Error

	return submissions, total, err
}

// ListSolves queries dynamic competitor solve records with preloaded user and challenge data.
func (r *AdminSubmissionRepository) ListSolves(
	search string,
	userIDStr string,
	challengeIDStr string,
	category string,
	fromDateStr string,
	toDateStr string,
	page int,
	limit int,
) ([]models.Solve, int64, error) {
	var solves []models.Solve
	var total int64

	db := database.DB.Model(&models.Solve{})

	// Preloads
	db = db.Preload("User").Preload("Challenge")

	// Apply Filters
	if userIDStr != "" {
		if uID, err := uuid.Parse(userIDStr); err == nil {
			db = db.Where("user_id = ?", uID)
		}
	}
	if challengeIDStr != "" {
		if cID, err := uuid.Parse(challengeIDStr); err == nil {
			db = db.Where("challenge_id = ?", cID)
		}
	}
	if category != "" {
		db = db.Joins("JOIN challenges ON challenges.id = solves.challenge_id").
			Where("challenges.category = ?", category)
	}

	if fromDateStr != "" {
		if parsedTime, err := time.Parse("2006-01-02", fromDateStr); err == nil {
			db = db.Where("solved_at >= ?", parsedTime)
		}
	}
	if toDateStr != "" {
		if parsedTime, err := time.Parse("2006-01-02", toDateStr); err == nil {
			parsedTime = parsedTime.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			db = db.Where("solved_at <= ?", parsedTime)
		}
	}

	if search != "" {
		// Join for search
		db = db.Joins("JOIN users ON users.id = solves.user_id").
			Joins("JOIN challenges ON challenges.id = solves.challenge_id").
			Where("users.name ILIKE ? OR users.email ILIKE ? OR challenges.title ILIKE ? OR challenges.slug ILIKE ?",
				"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Count total
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Pagination & Order
	offset := (page - 1) * limit
	err := db.Order("solved_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&solves).Error

	return solves, total, err
}
