package repositories

import (
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type HintRepository struct {
	db *gorm.DB
}

func NewHintRepository() *HintRepository {
	return &HintRepository{db: database.DB}
}

func (r *HintRepository) FindAllActiveForChallenge(challengeID uuid.UUID) ([]models.Hint, error) {
	var hints []models.Hint
	err := r.db.Where("challenge_id = ? AND is_active = ?", challengeID, true).Order("order_index ASC").Find(&hints).Error
	return hints, err
}

func (r *HintRepository) FindAllForChallenge(challengeID uuid.UUID) ([]models.Hint, error) {
	var hints []models.Hint
	err := r.db.Where("challenge_id = ?", challengeID).Order("order_index ASC").Find(&hints).Error
	return hints, err
}

func (r *HintRepository) FindByID(id uuid.UUID) (*models.Hint, error) {
	var hint models.Hint
	err := r.db.First(&hint, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &hint, nil
}

func (r *HintRepository) Create(hint *models.Hint) error {
	return r.db.Create(hint).Error
}

func (r *HintRepository) Update(hint *models.Hint) error {
	return r.db.Save(hint).Error
}

func (r *HintRepository) UpdateStatus(id uuid.UUID, isActive bool) (*models.Hint, error) {
	hint, err := r.FindByID(id)
	if err != nil {
		return nil, err
	}
	hint.IsActive = isActive
	err = r.Update(hint)
	return hint, err
}

func (r *HintRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Hint{}, "id = ?", id).Error
}
