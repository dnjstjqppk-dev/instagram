package jwt

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrTokenExpired = errors.New("token has expired")
)

type Claims struct {
	UserID      string   `json:"sub"`
	Username    string   `json:"username"`
	AccountType string   `json:"account_type"`
	Roles       []string `json:"roles"`
	IssuedAt    int64    `json:"iat"`
	ExpiresAt   int64    `json:"exp"`
}

type JWTManager struct {
	secretKey     []byte
	tokenDuration time.Duration
}

func NewJWTManager(secretKey string, duration time.Duration) *JWTManager {
	return &JWTManager{
		secretKey:     []byte(secretKey),
		tokenDuration: duration,
	}
}

func (m *JWTManager) Generate(userID, username, accountType string, roles []string) (string, int64, error) {
	now := time.Now()
	exp := now.Add(m.tokenDuration).Unix()

	header := map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	}
	headerBytes, _ := json.Marshal(header)
	encodedHeader := base64.RawURLEncoding.EncodeToString(headerBytes)

	claims := Claims{
		UserID:      userID,
		Username:    username,
		AccountType: accountType,
		Roles:       roles,
		IssuedAt:    now.Unix(),
		ExpiresAt:   exp,
	}
	claimsBytes, err := json.Marshal(claims)
	if err != nil {
		return "", 0, err
	}
	encodedClaims := base64.RawURLEncoding.EncodeToString(claimsBytes)

	unsignedToken := fmt.Sprintf("%s.%s", encodedHeader, encodedClaims)
	sig := m.sign(unsignedToken)
	token := fmt.Sprintf("%s.%s", unsignedToken, sig)

	return token, exp, nil
}

func (m *JWTManager) Verify(tokenString string) (*Claims, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, ErrInvalidToken
	}

	unsigned := fmt.Sprintf("%s.%s", parts[0], parts[1])
	expectedSig := m.sign(unsigned)
	if !hmac.Equal([]byte(parts[2]), []byte(expectedSig)) {
		return nil, ErrInvalidToken
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidToken
	}

	var claims Claims
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, ErrInvalidToken
	}

	if time.Now().Unix() > claims.ExpiresAt {
		return nil, ErrTokenExpired
	}

	return &claims, nil
}

func (m *JWTManager) sign(data string) string {
	h := hmac.New(sha256.New, m.secretKey)
	h.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}
