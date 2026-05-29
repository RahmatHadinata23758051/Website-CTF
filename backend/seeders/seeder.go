package seeders

import (
	"log"

	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Seed inserts initial test data for users and challenges.
func Seed(db *gorm.DB, flagSalt string) {
	log.Println("[SEEDER] Starting database seeding...")

	// 1. Seed Users
	seedUsers(db)

	// 2. Seed Challenges
	seedChallenges(db, flagSalt)

	// 3. Seed Hints
	seedHints(db)

	log.Println("[SEEDER] Seeding process completed.")
}

func seedUsers(db *gorm.DB) {
	log.Println("[SEEDER] Checking users...")

	// DEVELOPMENT-ONLY credentials — do not use in production
	adminHash, _ := utils.HashPassword("admin123!")
	competitorHash, _ := utils.HashPassword("user123!")

	users := []models.User{
		{
			// Primary admin account for Phase 17 admin API testing
			Name:         "Admin",
			Email:        "admin@rblxsec.local",
			PasswordHash: adminHash,
			Role:         "admin",
		},
		{
			// Legacy admin account — kept for backwards compatibility
			Name:         "Admin Operator",
			Email:        "admin@ctf.com",
			PasswordHash: adminHash,
			Role:         "admin",
		},
		{
			Name:         "Competitor One",
			Email:        "competitor@ctf.com",
			PasswordHash: competitorHash,
			Role:         "user",
		},
	}

	for _, user := range users {
		var count int64
		db.Model(&models.User{}).Where("email = ?", user.Email).Count(&count)
		if count == 0 {
			if err := db.Create(&user).Error; err != nil {
				log.Printf("[SEEDER] Warning: Failed to seed user %s: %v\n", user.Email, err)
			} else {
				log.Printf("[SEEDER] Created user %s (%s)\n", user.Email, user.Role)
			}
		}
	}
}

func seedChallenges(db *gorm.DB, flagSalt string) {
	log.Println("[SEEDER] Checking challenges...")

	challenges := []models.Challenge{
		{
			Title:         "Web Cookie Monster",
			Slug:          "web-cookie-monster",
			Description:   "Check the storage cookies in your browser closely. The system administrator stored a secret token there.",
			Category:      "Web",
			Difficulty:    "Easy",
			Points:        100,
			FlagHash:      utils.HashFlag("iet{cookie_monster_found}", flagSalt),
			IsActive:      true,
			ExternalLink:  "http://localhost:8080/api/health",
		},
		{
			Title:         "RSA Basics",
			Slug:          "rsa-basics",
			Description:   "Decrypt this message: c = 24823, given p = 137, q = 139, e = 17. Find the message.",
			Category:      "Crypto",
			Difficulty:    "Easy",
			Points:        150,
			FlagHash:      utils.HashFlag("iet{rsa_basics_solved}", flagSalt),
			IsActive:      true,
		},
		{
			Title:         "Buffer Overflow 1",
			Slug:          "buffer-overflow-1",
			Description:   "Overflow the local buffer to rewrite the return instruction pointer and access the win function.",
			Category:      "Pwn",
			Difficulty:    "Medium",
			Points:        300,
			FlagHash:      utils.HashFlag("iet{buffer_overflow_beginner}", flagSalt),
			IsActive:      true,
		},
		{
			Title:         "Secure Vault",
			Slug:          "secure-vault",
			Description:   "Reverse engineer the custom binary file provided and bypass the internal license check routine.",
			Category:      "Reverse",
			Difficulty:    "Hard",
			Points:        500,
			FlagHash:      utils.HashFlag("iet{secure_vault_reversed}", flagSalt),
			IsActive:      true,
		},
		{
			Title:         "EXIF Detective",
			Slug:          "exif-detective",
			Description:   "Inspect the metadata of the provided image file to locate the GPS coordinates where the flag was hidden.",
			Category:      "OSINT",
			Difficulty:    "Easy",
			Points:        100,
			FlagHash:      utils.HashFlag("iet{exif_detective_found}", flagSalt),
			IsActive:      true,
		},
	}

	for _, ch := range challenges {
		var existing models.Challenge
		err := db.Where("slug = ?", ch.Slug).First(&existing).Error
		if err != nil {
			if err := db.Create(&ch).Error; err != nil {
				log.Printf("[SEEDER] Warning: Failed to seed challenge %s: %v\n", ch.Title, err)
			} else {
				log.Printf("[SEEDER] Created challenge %s (%d pts)\n", ch.Title, ch.Points)
			}
		} else {
			// Self-healing database GORM update for existing records
			existing.FlagHash = ch.FlagHash
			existing.Points = ch.Points
			existing.Description = ch.Description
			existing.Title = ch.Title
			existing.Category = ch.Category
			existing.Difficulty = ch.Difficulty
			existing.ExternalLink = ch.ExternalLink
			db.Save(&existing)
			log.Printf("[SEEDER] Updated existing challenge %s with standard CTF flag hashes\n", ch.Title)
		}
	}
}

func seedHints(db *gorm.DB) {
	log.Println("[SEEDER] Checking challenge hints...")

	// Find the challenges and map their slugs to IDs
	var challenges []models.Challenge
	db.Find(&challenges)
	slugToID := make(map[string]uuid.UUID)
	for _, c := range challenges {
		slugToID[c.Slug] = c.ID
	}

	// Dynamic Seed Hints templates
	hints := []struct {
		slug       string
		content    string
		cost       int
		orderIndex int
	}{
		// Web Cookie Monster hints
		{"web-cookie-monster", "Check browser storage before checking source code.", 0, 1},
		{"web-cookie-monster", "Cookies can hold more than session IDs.", 0, 2},
		// RSA Basics hints
		{"rsa-basics", "Small RSA parameters are often meant to be factored.", 0, 1},
		{"rsa-basics", "Look carefully at n and e.", 0, 2},
		// EXIF Detective hints
		{"exif-detective", "Metadata can reveal more than the image itself.", 0, 1},
	}

	for _, h := range hints {
		challengeID, ok := slugToID[h.slug]
		if !ok {
			continue
		}

		// Ensure we don't duplicate seed hints
		var count int64
		db.Model(&models.Hint{}).Where("challenge_id = ? AND content = ?", challengeID, h.content).Count(&count)
		if count == 0 {
			hint := models.Hint{
				ChallengeID: challengeID,
				Content:     h.content,
				Cost:        h.cost,
				OrderIndex:  h.orderIndex,
				IsActive:    true,
			}
			if err := db.Create(&hint).Error; err != nil {
				log.Printf("[SEEDER] Warning: Failed to seed hint for %s: %v\n", h.slug, err)
			} else {
				log.Printf("[SEEDER] Created hint for %s (order: %d)\n", h.slug, h.orderIndex)
			}
		}
	}
}
