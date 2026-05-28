package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a user password using bcrypt.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash compares a raw password against its bcrypt hash.
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// HashFlag computes a salted SHA-256 hash of a CTF flag string.
func HashFlag(flag, salt string) string {
	hasher := sha256.New()
	// Salt the flag to prevent pre-computed rainbow table lookup attacks
	saltedInput := fmt.Sprintf("%s:%s", salt, flag)
	hasher.Write([]byte(saltedInput))
	return hex.EncodeToString(hasher.Sum(nil))
}
