package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"ctf-platform/backend/internal/config"

	"github.com/redis/go-redis/v9"
)

// RedisClient holds the active redis client instance.
var RedisClient *redis.Client

// InitRedis establishes connection to Redis server.
func InitRedis(cfg *config.Config) *redis.Client {
	addr := fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort)

	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: cfg.RedisPassword,
		DB:       0, // Default DB
	})

	// Test connection with timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := client.Ping(ctx).Result()
	if err != nil {
		// Log but do not crash immediately so local devs can optionally run without Redis in partial offline mode
		log.Printf("[REDIS] Warning: Failed to connect to Redis at %s: %v. Rate limits & scoreboard caching might fall back.\n", addr, err)
	} else {
		log.Printf("[REDIS] Successfully connected to Redis at %s.\n", addr)
	}

	RedisClient = client
	return RedisClient
}
