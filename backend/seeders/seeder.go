package seeders

import (
	"log"

	"ctf-platform/backend/internal/models"
	"ctf-platform/backend/internal/utils"

	"gorm.io/gorm"
)

// Seed inserts initial test data for users and challenges.
func Seed(db *gorm.DB, flagSalt string) {
	log.Println("[SEEDER] Starting database seeding...")

	// 1. Seed Users
	seedUsers(db)

	// 2. Seed Challenges
	seedChallenges(db, flagSalt)

	log.Println("[SEEDER] Seeding process completed.")
}

func seedUsers(db *gorm.DB) {
	log.Println("[SEEDER] Checking users...")

	adminHash, _ := utils.HashPassword("admin123!")
	competitorHash, _ := utils.HashPassword("user123!")

	users := []models.User{
		{
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
			FlagHash:      utils.HashFlag("flag{c00k1es_ar3_del1c10us}", flagSalt),
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
			FlagHash:      utils.HashFlag("flag{rsa_n_and_e_are_public}", flagSalt),
			IsActive:      true,
		},
		{
			Title:         "Buffer Overflow 1",
			Slug:          "buffer-overflow-1",
			Description:   "Overflow the local buffer to rewrite the return instruction pointer and access the win function.",
			Category:      "Pwn",
			Difficulty:    "Medium",
			Points:        300,
			FlagHash:      utils.HashFlag("flag{b0f_r3t_2_w1n}", flagSalt),
			IsActive:      true,
		},
		{
			Title:         "Secure Vault",
			Slug:          "secure-vault",
			Description:   "Reverse engineer the custom binary file provided and bypass the internal license check routine.",
			Category:      "Reverse",
			Difficulty:    "Hard",
			Points:        500,
			FlagHash:      utils.HashFlag("flag{rev_4nd_d3comp1l3_master}", flagSalt),
			IsActive:      true,
		},
		{
			Title:         "EXIF Detective",
			Slug:          "exif-detective",
			Description:   "Inspect the metadata of the provided image file to locate the GPS coordinates where the flag was hidden.",
			Category:      "OSINT",
			Difficulty:    "Easy",
			Points:        100,
			FlagHash:      utils.HashFlag("flag{ex1f_daTa_n3v3r_l1es}", flagSalt),
			IsActive:      true,
		},
	}

	for _, ch := range challenges {
		var count int64
		db.Model(&models.Challenge{}).Where("slug = ?", ch.Slug).Count(&count)
		if count == 0 {
			if err := db.Create(&ch).Error; err != nil {
				log.Printf("[SEEDER] Warning: Failed to seed challenge %s: %v\n", ch.Title, err)
			} else {
				log.Printf("[SEEDER] Created challenge %s (%d pts)\n", ch.Title, ch.Points)
			}
		}
	}
}
