package database

import (
	"fmt"
	"log"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB holds the active connection pool.
var DB *gorm.DB

// InitDB connects to the Postgres instance and executes auto-migrations.
func InitDB(cfg *config.Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
	)

	// Configure default GORM logger to only output warnings/errors in prod, silent in testing if needed
	gormLogLevel := logger.Info
	if cfg.AppEnv == "production" {
		gormLogLevel = logger.Warn
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(gormLogLevel),
	})
	if err != nil {
		log.Fatalf("[DATABASE] Fatal: Failed to connect to Postgres: %v", err)
	}

	log.Println("[DATABASE] Successfully connected to PostgreSQL.")

	// Perform database schema automatic updates
	log.Println("[DATABASE] Running automatic migrations...")
	err = db.AutoMigrate(
		&models.User{},
		&models.Challenge{},
		&models.Submission{},
		&models.Solve{},
	)
	if err != nil {
		log.Fatalf("[DATABASE] Fatal: Migration failure: %v", err)
	}
	log.Println("[DATABASE] Schema migrations completed successfully.")

	DB = db
	return DB
}
