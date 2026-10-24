package unit_test

import (
	"testing"
	"time"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
)

func TestJWTTokenGenerationAndVerification(t *testing.T) {
	secret := "test-secret-key-that-is-at-least-32-bytes!"
	manager := jwt.NewJWTManager(secret, 1*time.Hour)

	token, exp, err := manager.Generate("usr_123", "alice", "PERSONAL", []string{"ROLE_USER"})
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}
	if token == "" {
		t.Fatal("Expected non-empty token")
	}
	if exp <= time.Now().Unix() {
		t.Fatal("Expected expiration in future")
	}

	claims, err := manager.Verify(token)
	if err != nil {
		t.Fatalf("Failed to verify valid token: %v", err)
	}

	if claims.UserID != "usr_123" {
		t.Errorf("Expected UserID 'usr_123', got '%s'", claims.UserID)
	}
	if claims.Username != "alice" {
		t.Errorf("Expected Username 'alice', got '%s'", claims.Username)
	}
	if claims.AccountType != "PERSONAL" {
		t.Errorf("Expected AccountType 'PERSONAL', got '%s'", claims.AccountType)
	}
}

func TestJWTTokenExpiry(t *testing.T) {
	secret := "test-secret-key-that-is-at-least-32-bytes!"
	manager := jwt.NewJWTManager(secret, -1*time.Minute) // Already expired

	token, _, err := manager.Generate("usr_expired", "bob", "PERSONAL", []string{"ROLE_USER"})
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}

	_, err = manager.Verify(token)
	if err == nil {
		t.Fatal("Expected error for expired token, got nil")
	}
	if err != jwt.ErrTokenExpired {
		t.Errorf("Expected ErrTokenExpired, got %v", err)
	}
}
