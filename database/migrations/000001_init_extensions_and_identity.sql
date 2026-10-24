-- Migration: 000001_init_extensions_and_identity.sql
-- Domain: IDENTITY & ACCESS MANAGEMENT
-- Target: PostgreSQL 15+ / UUIDv7 / Foreign Keys / Strict Constraints

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    birthdate DATE NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    account_type VARCHAR(20) NOT NULL DEFAULT 'PERSONAL', -- PERSONAL, CREATOR, BUSINESS
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PENDING_VERIFICATION, RESTRICTED, SUSPENDED, DELETED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);

-- 2. user_credentials
CREATE TABLE IF NOT EXISTS user_credentials (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id hash
    password_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMPTZ
);

-- 3. user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_id VARCHAR(100) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh ON user_sessions(refresh_token_hash);

-- 4. user_devices
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(128) NOT NULL,
    device_name VARCHAR(100),
    os_name VARCHAR(50),
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    push_token TEXT,
    is_trusted BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, device_fingerprint)
);

-- 5. user_mfa_methods
CREATE TABLE IF NOT EXISTS user_mfa_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method_type VARCHAR(30) NOT NULL, -- TOTP, PASSKEY, SMS, BACKUP_CODES
    secret_encrypted TEXT,
    credential_id VARCHAR(255), -- for WebAuthn/Passkey
    public_key TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. user_verifications
CREATE TABLE IF NOT EXISTS user_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- PASSPORT, NATIONAL_ID, DRIVERS_LICENSE
    document_url TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    reviewed_by UUID,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 7. user_consents
CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_type VARCHAR(50) NOT NULL, -- TERMS_OF_SERVICE, PRIVACY_POLICY, MARKETING, LOCATION
    version VARCHAR(20) NOT NULL,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    UNIQUE(user_id, policy_type, version)
);

-- 8. user_privacy_settings
CREATE TABLE IF NOT EXISTS user_privacy_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    allow_tagging VARCHAR(20) NOT NULL DEFAULT 'EVERYONE', -- EVERYONE, FOLLOWING, NO_ONE
    allow_mentions VARCHAR(20) NOT NULL DEFAULT 'EVERYONE',
    allow_message_requests VARCHAR(20) NOT NULL DEFAULT 'EVERYONE',
    show_activity_status BOOLEAN NOT NULL DEFAULT TRUE,
    sensitive_content_level VARCHAR(20) NOT NULL DEFAULT 'STANDARD', -- STRICT, STANDARD, MORE
    daily_time_limit_minutes INT DEFAULT NULL,
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '08:00:00',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. user_security_events
CREATE TABLE IF NOT EXISTS user_security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- LOGIN_SUCCESS, LOGIN_FAIL, PASSWORD_CHANGE, MFA_CHALLENGE, SESSION_REVOKED
    ip_address INET,
    user_agent TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO', -- INFO, WARNING, SUSPICIOUS, CRITICAL
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_security_events_user ON user_security_events(user_id);
CREATE INDEX idx_user_security_events_type ON user_security_events(event_type);

-- 10. user_deletion_requests
CREATE TABLE IF NOT EXISTS user_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_deletion_at TIMESTAMPTZ NOT NULL, -- 30 days grace period
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, CANCELLED, COMPLETED
    completed_at TIMESTAMPTZ
);
