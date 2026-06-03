package services

import (
	"math"

	"ctf-platform/backend/internal/repositories"
)

// UserDirectoryDTO represents one public user entry.
// Never contains email, role, password_hash, IP, or flag data.
type UserDirectoryDTO struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Rank        *int   `json:"rank"`
	TotalPoints int64  `json:"total_points"`
	TotalSolves int64  `json:"total_solves"`
}

// UserDirectoryPagination holds paging metadata.
type UserDirectoryPagination struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

// UserDirectoryResult is the full paginated response payload.
type UserDirectoryResult struct {
	Users      []UserDirectoryDTO      `json:"users"`
	Pagination UserDirectoryPagination `json:"pagination"`
}

// UserDirectoryService coordinates user directory data retrieval.
type UserDirectoryService struct {
	repo *repositories.UserDirectoryRepository
}

// NewUserDirectoryService returns a new service instance.
func NewUserDirectoryService(repo *repositories.UserDirectoryRepository) *UserDirectoryService {
	return &UserDirectoryService{repo: repo}
}

// GetUsers returns paginated, public-safe user directory entries.
func (s *UserDirectoryService) GetUsers(search string, page, limit int) (*UserDirectoryResult, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}

	rows, total, err := s.repo.FindUsers(search, page, limit)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	if totalPages < 1 {
		totalPages = 1
	}

	// Compute absolute rank based on position in results
	// Rank = offset + index + 1; only assigned if user has points.
	offset := (page - 1) * limit
	dtos := make([]UserDirectoryDTO, 0, len(rows))
	for i, row := range rows {
		var rank *int
		if row.TotalPoints > 0 {
			r := offset + i + 1
			rank = &r
		}
		dtos = append(dtos, UserDirectoryDTO{
			ID:          row.ID,
			Name:        row.Name,
			Rank:        rank,
			TotalPoints: row.TotalPoints,
			TotalSolves: row.TotalSolves,
		})
	}

	return &UserDirectoryResult{
		Users: dtos,
		Pagination: UserDirectoryPagination{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}
