package services

import (
	"log"
	"math"

	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CalculateDynamicValue computes the decayed points for a challenge using CTFd formula.
func CalculateDynamicValue(initial, minimum, decay, solveCount int) int {
	if decay <= 0 {
		return initial
	}

	value := (float64(minimum-initial) / math.Pow(float64(decay), 2)) * math.Pow(float64(solveCount), 2)
	value += float64(initial)

	result := int(math.Ceil(value))
	if result < minimum {
		return minimum
	}

	return result
}

// GetValidSolveCount returns the count of valid solves for a challenge.
// Only counts solves from users with role = 'user', is_banned = false, and non-deleted.
func GetValidSolveCount(db *gorm.DB, challengeID uuid.UUID) (int, error) {
	var count int64
	err := db.Table("solves").
		Joins("JOIN users ON users.id = solves.user_id AND users.deleted_at IS NULL").
		Joins("JOIN challenges ON challenges.id = solves.challenge_id AND challenges.deleted_at IS NULL").
		Where("solves.challenge_id = ? AND users.role = 'user' AND users.is_banned = ? AND challenges.is_active = ?", challengeID, false, true).
		Count(&count).Error
	return int(count), err
}

// RecalculateChallengePoints computes and updates the points for a specific challenge.
func RecalculateChallengePoints(db *gorm.DB, challengeID uuid.UUID) error {
	var challenge models.Challenge
	if err := db.First(&challenge, "id = ?", challengeID).Error; err != nil {
		return err
	}

	var newPoints int
	if challenge.ScoringType == "dynamic" {
		solveCount, err := GetValidSolveCount(db, challengeID)
		if err != nil {
			return err
		}
		newPoints = CalculateDynamicValue(challenge.InitialPoints, challenge.MinimumPoints, challenge.Decay, solveCount)
		log.Printf("[SCORING] Recalculating dynamic challenge %s: solves=%d, current=%d, new=%d\n", challenge.Title, solveCount, challenge.Points, newPoints)
	} else {
		// Static challenge
		newPoints = challenge.InitialPoints
		log.Printf("[SCORING] Recalculating static challenge %s: points=%d\n", challenge.Title, newPoints)
	}

	if challenge.Points != newPoints {
		if err := db.Model(&challenge).Update("points", newPoints).Error; err != nil {
			return err
		}
	}
	return nil
}

// RecalculateAllChallenges runs recalculation for all challenges in the system.
func RecalculateAllChallenges(db *gorm.DB) error {
	var challenges []models.Challenge
	if err := db.Find(&challenges).Error; err != nil {
		return err
	}

	for _, c := range challenges {
		if err := RecalculateChallengePoints(db, c.ID); err != nil {
			log.Printf("[SCORING] Warning: Failed to recalculate challenge %s: %v\n", c.Title, err)
		}
	}
	return nil
}
