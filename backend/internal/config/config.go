package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all the server configuration parameters.
type Config struct {
	AppEnv        string
	Port          string
	JWTSecret     string
	FlagSalt      string
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	DBSSLMode     string
	RedisHost     string
	RedisPort     string
	RedisPassword string
}

// LoadConfig reads the .env file if present and loads settings from the environment.
func LoadConfig() *Config {
	// Attempt to load the root-level .env or local backend .env
	// In local dev, the file is in the root or backend root.
	// We'll search in a few common spots or read OS variables.
	if err := godotenv.Load(); err != nil {
		// Also try loading from backend directory specifically if running from root
		if err := godotenv.Load("backend/.env"); err != nil {
			if err := godotenv.Load("../.env"); err != nil {
				log.Println("[CONFIG] Info: No .env file detected, relying on OS environment variables.")
			}
		}
	}

	return &Config{
		AppEnv:        getEnv("APP_ENV", "development"),
		Port:          getEnv("PORT", "8080"),
		JWTSecret:     getEnv("JWT_SECRET", "supersecretjwtkeyreplaceinproduction123!"),
		FlagSalt:      getEnv("FLAG_SALT", "ctfsaltvaluechangeinproduction456!"),
		DBHost:        getEnv("DB_HOST", "localhost"),
		DBPort:        getEnv("DB_PORT", "5432"),
		DBUser:        getEnv("DB_USER", "postgres"),
		DBPassword:    getEnv("DB_PASSWORD", "postgres"),
		DBName:        getEnv("DB_NAME", "ctfdb"),
		DBSSLMode:     getEnv("DB_SSLMODE", "disable"),
		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
