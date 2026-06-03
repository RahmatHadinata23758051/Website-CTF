package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/repositories"
	"ctf-platform/backend/internal/utils"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

// SubmissionResponse represents the DTO returned upon flag submission attempts.
type SubmissionResponse struct {
	Correct       bool `json:"correct"`
	Points        int  `json:"points"`
	AlreadySolved bool `json:"already_solved"`
}

// SubmissionService processes competitor attempts and atomic solves.
type SubmissionService struct {
	subRepo       *repositories.SubmissionRepository
	challengeRepo *repositories.ChallengeRepository
	cfg           *config.Config
}

// NewSubmissionService returns a new service instance.
func NewSubmissionService(
	subRepo *repositories.SubmissionRepository,
	challengeRepo *repositories.ChallengeRepository,
	cfg *config.Config,
) *SubmissionService {
	return &SubmissionService{
		subRepo:       subRepo,
		challengeRepo: challengeRepo,
		cfg:           cfg,
	}
}

// ProcessSubmission verifies flags, executes rate limits, audits attempts, and updates solves.
func (s *SubmissionService) ProcessSubmission(
	slug string,
	userIDStr string,
	submittedFlag string,
	ipAddress string,
	userAgent string,
) (*SubmissionResponse, error) {
	// 1. Parse user UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, errors.New("invalid_user_format")
	}

	// 1b. Check user rules acceptance
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return nil, err
	}
	if user.AcceptedRulesAt == nil {
		return nil, errors.New("rules_not_accepted")
	}

	// 2. Fetch active challenge by slug
	challenge, err := s.challengeRepo.FindBySlug(slug)
	if err != nil {
		return nil, gormErrorMapper(err)
	}

	// 3. Optional Redis Rate Limiting (Max 10 per competitor, per challenge, per minute)
	if database.RedisClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()

		rateLimitKey := fmt.Sprintf("rate:submit:%s:%s", userID.String(), challenge.ID.String())
		count, err := database.RedisClient.Get(ctx, rateLimitKey).Int64()
		if err != nil && err != redis.Nil {
			log.Printf("[RATE LIMIT] Warning: Redis query exception: %v\n", err)
		}

		if count >= 10 {
			return nil, errors.New("rate_limit_exceeded")
		}

		// Increment limit counter with 1-minute expiration
		pipe := database.RedisClient.TxPipeline()
		pipe.Incr(ctx, rateLimitKey)
		pipe.Expire(ctx, rateLimitKey, 60*time.Second)
		if _, err := pipe.Exec(ctx); err != nil {
			log.Printf("[RATE LIMIT] Warning: Redis write exception: %v\n", err)
		}
	}

	// 4. Evaluate flag correctness via Salted SHA-256
	hashedInput := utils.HashFlag(submittedFlag, s.cfg.FlagSalt)
	isCorrect := (hashedInput == challenge.FlagHash)

	// 5. Store attempt inside the submissions audit logs table
	submissionAttempt := models.Submission{
		UserID:        userID,
		ChallengeID:   challenge.ID,
		SubmittedFlag: submittedFlag,
		IsCorrect:     isCorrect,
		IPAddress:     ipAddress,
		UserAgent:     userAgent,
		CreatedAt:     time.Now(),
	}
	if err := s.subRepo.CreateSubmission(&submissionAttempt); err != nil {
		return nil, errors.New("failed_to_log_submission")
	}

	// 6. Handle Solve logic
	if isCorrect {
		// Check if user already solved it
		existingSolve, _ := s.subRepo.FindSolve(userID, challenge.ID)
		if existingSolve != nil {
			return &SubmissionResponse{
				Correct:       true,
				Points:        challenge.Points,
				AlreadySolved: true,
			}, nil
		}

		// Insert solve record atomically
		if err := s.subRepo.CreateSolve(userID, challenge.ID); err != nil {
			return nil, errors.New("failed_to_register_solve")
		}

		// Recalculate points for this challenge
		if err := RecalculateChallengePoints(database.DB, challenge.ID); err != nil {
			log.Printf("[SCORING] Warning: failed to recalculate challenge points: %v\n", err)
		}

		// Fetch the updated challenge to return the correct points
		if updated, err := s.challengeRepo.FindBySlug(slug); err == nil {
			challenge = updated
		}

		return &SubmissionResponse{
			Correct:       true,
			Points:        challenge.Points,
			AlreadySolved: false,
		}, nil
	}

	// Incorrect flag return
	return &SubmissionResponse{
		Correct:       false,
		Points:        0,
		AlreadySolved: false,
	}, nil
}

func gormErrorMapper(err error) error {
	return err
}
