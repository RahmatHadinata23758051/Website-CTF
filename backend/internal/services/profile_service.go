package services

import (
	"errors"
	"time"

	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/repositories"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProfileService struct {
	profileRepo    *repositories.ProfileRepository
	scoreboardRepo *repositories.ScoreboardRepository
}

func NewProfileService(profileRepo *repositories.ProfileRepository, scoreboardRepo *repositories.ScoreboardRepository) *ProfileService {
	return &ProfileService{
		profileRepo:    profileRepo,
		scoreboardRepo: scoreboardRepo,
	}
}

type ProfileUserDTO struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type ProfileStatsDTO struct {
	Rank                 *int  `json:"rank"`
	TotalPoints          int64 `json:"total_points"`
	TotalSolves          int64 `json:"total_solves"`
	TotalCategoriesSolved int64 `json:"total_categories_solved"`
}

type ProfileSummaryDTO struct {
	User              ProfileUserDTO                    `json:"user"`
	Stats             ProfileStatsDTO                   `json:"stats"`
	RecentSolves      []repositories.SolvedChallengeRow `json:"recent_solves"`
	SolvedChallenges  []repositories.SolvedChallengeRow `json:"solved_challenges"`
	CategoryBreakdown []repositories.CategoryBreakdownRow `json:"category_breakdown"`
}

func (s *ProfileService) GetProfileSummary(userID uuid.UUID) (*ProfileSummaryDTO, error) {
	// 1. Fetch user identity
	db := database.DB
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// 2. Fetch solved challenges, recent solves, and category breakdown
	solvedChallenges, err := s.profileRepo.GetSolvedChallenges(userID)
	if err != nil {
		return nil, err
	}

	recentSolves, err := s.profileRepo.GetRecentSolves(userID)
	if err != nil {
		return nil, err
	}

	categoryBreakdown, err := s.profileRepo.GetCategoryBreakdown(userID)
	if err != nil {
		return nil, err
	}

	// Make sure fields default to empty array in JSON instead of null
	if categoryBreakdown == nil {
		categoryBreakdown = []repositories.CategoryBreakdownRow{}
	}
	if recentSolves == nil {
		recentSolves = []repositories.SolvedChallengeRow{}
	}
	if solvedChallenges == nil {
		solvedChallenges = []repositories.SolvedChallengeRow{}
	}

	// 3. Compute stats
	var totalPoints int64 = 0
	var totalSolves int64 = int64(len(solvedChallenges))
	var totalCategoriesSolved int64 = 0

	// Count unique solved categories
	categoriesMap := make(map[string]bool)
	for _, solve := range solvedChallenges {
		totalPoints += int64(solve.Points)
		categoriesMap[solve.Category] = true
	}
	totalCategoriesSolved = int64(len(categoriesMap))

	// 4. Calculate rank from scoreboard
	scoreboardRows, err := s.scoreboardRepo.CalculateScoreboard()
	var rank *int = nil
	if err == nil {
		for i, row := range scoreboardRows {
			if row.UserID == userID {
				rankVal := i + 1
				rank = &rankVal
				break
			}
		}
	}

	return &ProfileSummaryDTO{
		User: ProfileUserDTO{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      user.Role,
			CreatedAt: user.CreatedAt,
		},
		Stats: ProfileStatsDTO{
			Rank:                 rank,
			TotalPoints:          totalPoints,
			TotalSolves:          totalSolves,
			TotalCategoriesSolved: totalCategoriesSolved,
		},
		RecentSolves:      recentSolves,
		SolvedChallenges:  solvedChallenges,
		CategoryBreakdown: categoryBreakdown,
	}, nil
}
