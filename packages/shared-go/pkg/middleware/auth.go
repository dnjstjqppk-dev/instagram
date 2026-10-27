package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/response"
)

type contextKey string

const (
	UserClaimsKey contextKey = "user_claims"
)

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Device-ID")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func Auth(jwtManager *jwt.JWTManager) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authorization header", nil)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid authorization format", nil)
				return
			}

			claims, err := jwtManager.Verify(parts[1])
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "INVALID_TOKEN", err.Error(), nil)
				return
			}

			ctx := context.WithValue(r.Context(), UserClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func OptionalAuth(jwtManager *jwt.JWTManager) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && parts[0] == "Bearer" {
					if claims, err := jwtManager.Verify(parts[1]); err == nil {
						ctx := context.WithValue(r.Context(), UserClaimsKey, claims)
						r = r.WithContext(ctx)
					}
				}
			}
			next.ServeHTTP(w, r)
		})
	}
}

func GetClaims(ctx context.Context) (*jwt.Claims, bool) {
	claims, ok := ctx.Value(UserClaimsKey).(*jwt.Claims)
	return claims, ok
}

