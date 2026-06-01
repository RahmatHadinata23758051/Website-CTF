package services

import (
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/repositories"

	"github.com/google/uuid"
)

type AdminSubmissionService struct {
	repo *repositories.AdminSubmissionRepository
}

func NewAdminSubmissionService() *AdminSubmissionService {
	return &AdminSubmissionService{
		repo: repositories.NewAdminSubmissionRepository(),
	}
}

// AdminSubmissionUserDTO defines a safe user model representation for admin logs.
type AdminSubmissionUserDTO struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
}

// AdminSubmissionChallengeDTO defines challenge metadata tags.
type AdminSubmissionChallengeDTO struct {
	ID       uuid.UUID `json:"id"`
	Title    string    `json:"title"`
	Slug     string    `json:"slug"`
	Category string    `json:"category"`
	Points   int       `json:"points"`
}

// AdminSubmissionResponse models a single flag attempt.
type AdminSubmissionResponse struct {
	ID                    uuid.UUID                  `json:"id"`
	User                  AdminSubmissionUserDTO     `json:"user"`
	Challenge             AdminSubmissionChallengeDTO `json:"challenge"`
	IsCorrect             bool                       `json:"is_correct"`
	SubmittedFlagRedacted string                     `json:"submitted_flag_redacted"`
	CreatedAt             time.Time                  `json:"created_at"`
}

// AdminSolveResponse maps solved challenge instances.
type AdminSolveResponse struct {
	ID        uuid.UUID                  `json:"id"`
	User      AdminSubmissionUserDTO     `json:"user"`
	Challenge AdminSubmissionChallengeDTO `json:"challenge"`
	SolvedAt  time.Time                  `json:"solved_at"`
	CreatedAt time.Time                  `json:"created_at"` // Set same as SolvedAt
}

// TopWrongSubmitter counts incorrect attempts.
type TopWrongSubmitter struct {
	UserID     uuid.UUID `json:"user_id"`
	Name       string    `json:"name"`
	WrongCount int64     `json:"wrong_count"`
}

// MostAttemptedChallenge counts challenge attempts.
type MostAttemptedChallenge struct {
	ChallengeID  uuid.UUID `json:"challenge_id"`
	Title        string    `json:"title"`
	AttemptCount int64     `json:"attempt_count"`
}

// AdminSubmissionStatsResponse groups scoreboard analytics.
type AdminSubmissionStatsResponse struct {
	TotalSubmissions        int64                    `json:"total_submissions"`
	CorrectSubmissions      int64                    `json:"correct_submissions"`
	WrongSubmissions        int64                    `json:"wrong_submissions"`
	TotalSolves             int64                    `json:"total_solves"`
	UniqueSubmitters        int64                    `json:"unique_submitters"`
	TopWrongSubmitters      []TopWrongSubmitter      `json:"top_wrong_submitters"`
	MostAttemptedChallenges []MostAttemptedChallenge `json:"most_attempted_challenges"`
}

// ListSubmissions queries submissions and returns clean, redacted DTO lists.
func (s *AdminSubmissionService) ListSubmissions(
	search string,
	userIDStr string,
	challengeIDStr string,
	correctStr string,
	fromDateStr string,
	toDateStr string,
	page int,
	limit int,
) ([]AdminSubmissionResponse, int64, int, error) {
	rawSubmissions, total, err := s.repo.ListSubmissions(
		search,
		userIDStr,
		challengeIDStr,
		correctStr,
		fromDateStr,
		toDateStr,
		page,
		limit,
	)
	if err != nil {
		return nil, 0, 0, err
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	if totalPages < 1 {
		totalPages = 1
	}

	responses := make([]AdminSubmissionResponse, 0, len(rawSubmissions))
	for _, sub := range rawSubmissions {
		responses = append(responses, AdminSubmissionResponse{
			ID: sub.ID,
			User: AdminSubmissionUserDTO{
				ID:    sub.User.ID,
				Name:  sub.User.Name,
				Email: sub.User.Email,
			},
			Challenge: AdminSubmissionChallengeDTO{
				ID:       sub.Challenge.ID,
				Title:    sub.Challenge.Title,
				Slug:     sub.Challenge.Slug,
				Category: sub.Challenge.Category,
				Points:   sub.Challenge.Points,
			},
			IsCorrect:             sub.IsCorrect,
			SubmittedFlagRedacted: "[redacted]",
			CreatedAt:             sub.CreatedAt,
		})
	}

	return responses, total, totalPages, nil
}

// ListSolves queries solves list and returns DTO lists.
func (s *AdminSubmissionService) ListSolves(
	search string,
	userIDStr string,
	challengeIDStr string,
	category string,
	fromDateStr string,
	toDateStr string,
	page int,
	limit int,
) ([]AdminSolveResponse, int64, int, error) {
	rawSolves, total, err := s.repo.ListSolves(
		search,
		userIDStr,
		challengeIDStr,
		category,
		fromDateStr,
		toDateStr,
		page,
		limit,
	)
	if err != nil {
		return nil, 0, 0, err
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	if totalPages < 1 {
		totalPages = 1
	}

	responses := make([]AdminSolveResponse, 0, len(rawSolves))
	for _, slv := range rawSolves {
		responses = append(responses, AdminSolveResponse{
			ID: slv.ID,
			User: AdminSubmissionUserDTO{
				ID:    slv.User.ID,
				Name:  slv.User.Name,
				Email: slv.User.Email,
			},
			Challenge: AdminSubmissionChallengeDTO{
				ID:       slv.Challenge.ID,
				Title:    slv.Challenge.Title,
				Slug:     slv.Challenge.Slug,
				Category: slv.Challenge.Category,
				Points:   slv.Challenge.Points,
			},
			SolvedAt:  slv.SolvedAt,
			CreatedAt: slv.SolvedAt,
		})
	}

	return responses, total, totalPages, nil
}

// GetSubmissionStats aggregates counts, top metrics, and attempts.
func (s *AdminSubmissionService) GetSubmissionStats() (*AdminSubmissionStatsResponse, error) {
	var totalSubmissions int64
	var correctSubmissions int64
	var wrongSubmissions int64
	var totalSolves int64
	var uniqueSubmitters int64

	// Count total submissions
	if err := database.DB.Model(&models.Submission{}).Count(&totalSubmissions).Error; err != nil {
		return nil, err
	}

	// Count correct submissions
	if err := database.DB.Model(&models.Submission{}).Where("is_correct = ?", true).Count(&correctSubmissions).Error; err != nil {
		return nil, err
	}

	// Count wrong submissions
	if err := database.DB.Model(&models.Submission{}).Where("is_correct = ?", false).Count(&wrongSubmissions).Error; err != nil {
		return nil, err
	}

	// Count total solves
	if err := database.DB.Model(&models.Solve{}).Count(&totalSolves).Error; err != nil {
		return nil, err
	}

	// Count unique submitters
	if err := database.DB.Model(&models.Submission{}).Distinct("user_id").Count(&uniqueSubmitters).Error; err != nil {
		return nil, err
	}

	// Top wrong submitters (limit 5)
	var topWrong []TopWrongSubmitter
	err := database.DB.Table("submissions").
		Select("submissions.user_id, users.name, COUNT(submissions.id) as wrong_count").
		Joins("JOIN users ON users.id = submissions.user_id").
		Where("submissions.is_correct = ?", false).
		Group("submissions.user_id, users.name").
		Order("wrong_count DESC").
		Limit(5).
		Scan(&topWrong).Error
	if err != nil {
		return nil, err
	}

	// Ensure topWrong is not nil (default to empty slice for JSON serialization consistency)
	if topWrong == nil {
		topWrong = make([]TopWrongSubmitter, 0)
	}

	// Most attempted challenges (limit 5)
	var mostAttempted []MostAttemptedChallenge
	err = database.DB.Table("submissions").
		Select("submissions.challenge_id, challenges.title, COUNT(submissions.id) as attempt_count").
		Joins("JOIN challenges ON challenges.id = submissions.challenge_id").
		Group("submissions.challenge_id, challenges.title").
		Order("attempt_count DESC").
		Limit(5).
		Scan(&mostAttempted).Error
	if err != nil {
		return nil, err
	}

	if mostAttempted == nil {
		mostAttempted = make([]MostAttemptedChallenge, 0)
	}

	return &AdminSubmissionStatsResponse{
		TotalSubmissions:        totalSubmissions,
		CorrectSubmissions:      correctSubmissions,
		WrongSubmissions:        wrongSubmissions,
		TotalSolves:             totalSolves,
		UniqueSubmitters:        uniqueSubmitters,
		TopWrongSubmitters:      topWrong,
		MostAttemptedChallenges: mostAttempted,
	}, nil
}
