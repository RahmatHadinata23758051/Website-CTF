package services

import (
	"errors"
	"time"

	"ctf-platform/backend/internal/repositories"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PublicUserProfileService assembles a privacy-safe public profile for a given user.
type PublicUserProfileService struct {
	repo           *repositories.PublicUserProfileRepository
	scoreboardRepo *repositories.ScoreboardRepository
}

func NewPublicUserProfileService(
	repo *repositories.PublicUserProfileRepository,
	scoreboardRepo *repositories.ScoreboardRepository,
) *PublicUserProfileService {
	return &PublicUserProfileService{repo: repo, scoreboardRepo: scoreboardRepo}
}

// ── DTOs — strictly no email, role, password_hash, ban fields ────────────────

// PublicProfileUserDTO contains only public-safe identity fields.
type PublicProfileUserDTO struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// PublicProfileStatsDTO contains public competitive statistics.
type PublicProfileStatsDTO struct {
	Rank                 *int  `json:"rank"`
	TotalPoints          int64 `json:"total_points"`
	TotalSolves          int64 `json:"total_solves"`
	TotalCategoriesSolved int64 `json:"total_categories_solved"`
}

// PublicProfileSummaryDTO is the root response DTO for GET /api/users/:id/profile.
type PublicProfileSummaryDTO struct {
	User              PublicProfileUserDTO                `json:"user"`
	Stats             PublicProfileStatsDTO               `json:"stats"`
	RecentSolves      []repositories.SolvedChallengeRow  `json:"recent_solves"`
	SolvedChallenges  []repositories.SolvedChallengeRow  `json:"solved_challenges"`
	CategoryBreakdown []repositories.CategoryBreakdownRow `json:"category_breakdown"`
}

// ErrPublicUserNotFound is returned when the target user is not found, is an admin, or is banned.
var ErrPublicUserNotFound = errors.New("user not found")

// GetPublicProfile builds a public-safe profile for the given user ID.
func (s *PublicUserProfileService) GetPublicProfile(targetID uuid.UUID) (*PublicProfileSummaryDTO, error) {
	// 1. Fetch public identity (excludes admin/banned/deleted users)
	user, err := s.repo.FindPublicUser(targetID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPublicUserNotFound
		}
		return nil, err
	}

	// 2. Fetch solved challenges, recent solves, category breakdown
	solvedChallenges, err := s.repo.GetPublicSolvedChallenges(targetID)
	if err != nil {
		return nil, err
	}
	recentSolves, err := s.repo.GetPublicRecentSolves(targetID)
	if err != nil {
		return nil, err
	}
	categoryBreakdown, err := s.repo.GetPublicCategoryBreakdown(targetID)
	if err != nil {
		return nil, err
	}

	// Ensure JSON arrays never serialize as null
	if solvedChallenges == nil {
		solvedChallenges = []repositories.SolvedChallengeRow{}
	}
	if recentSolves == nil {
		recentSolves = []repositories.SolvedChallengeRow{}
	}
	if categoryBreakdown == nil {
		categoryBreakdown = []repositories.CategoryBreakdownRow{}
	}

	// 3. Compute aggregate stats
	var totalPoints int64
	categoriesMap := make(map[string]bool)
	for _, s := range solvedChallenges {
		totalPoints += int64(s.Points)
		categoriesMap[s.Category] = true
	}
	totalSolves := int64(len(solvedChallenges))
	totalCategoriesSolved := int64(len(categoriesMap))

	// 4. Determine rank from scoreboard (only users with solves are ranked)
	var rank *int
	scoreboardRows, err := s.scoreboardRepo.CalculateScoreboard()
	if err == nil {
		for i, row := range scoreboardRows {
			if row.UserID == targetID {
				r := i + 1
				rank = &r
				break
			}
		}
	}

	return &PublicProfileSummaryDTO{
		User: PublicProfileUserDTO{
			ID:        user.ID,
			Name:      user.Name,
			CreatedAt: user.CreatedAt,
		},
		Stats: PublicProfileStatsDTO{
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
