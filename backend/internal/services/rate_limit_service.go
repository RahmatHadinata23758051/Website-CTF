package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"ctf-platform/backend/internal/database"
)

// RateLimitResult is returned by the rate limit check.
type RateLimitResult struct {
	Allowed   bool
	Remaining int64
}

// CheckRateLimit applies a Redis sliding-window counter for a given key.
// It returns (true, remaining) when the request is within limits.
// If Redis is unavailable, it logs a warning and allows the request (fail-open for dev).
// Parameters:
//   - key    : unique rate limit key, e.g. "rate:login:ip:1.2.3.4"
//   - limit  : max number of requests
//   - window : time window duration
func CheckRateLimit(key string, limit int64, window time.Duration) RateLimitResult {
	client := database.RedisClient
	if client == nil {
		log.Printf("[RATE_LIMIT] Warning: Redis client is nil, skipping rate limit check for key=%s", key)
		return RateLimitResult{Allowed: true, Remaining: limit}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// Atomic INCR + EXPIRE pattern
	count, err := client.Incr(ctx, key).Result()
	if err != nil {
		log.Printf("[RATE_LIMIT] Warning: Redis INCR failed for key=%s: %v — allowing request", key, err)
		return RateLimitResult{Allowed: true, Remaining: limit}
	}

	// Set TTL only on first increment to avoid resetting the window
	if count == 1 {
		if expErr := client.Expire(ctx, key, window).Err(); expErr != nil {
			log.Printf("[RATE_LIMIT] Warning: Redis EXPIRE failed for key=%s: %v", key, expErr)
		}
	}

	if count > limit {
		return RateLimitResult{Allowed: false, Remaining: 0}
	}

	remaining := limit - count
	return RateLimitResult{Allowed: true, Remaining: remaining}
}

// RateLimitKey builds a namespaced Redis key for rate limiting.
// Example: RateLimitKey("login", "ip", "1.2.3.4") → "rate:login:ip:1.2.3.4"
func RateLimitKey(parts ...string) string {
	key := "rate"
	for _, p := range parts {
		key = fmt.Sprintf("%s:%s", key, p)
	}
	return key
}
