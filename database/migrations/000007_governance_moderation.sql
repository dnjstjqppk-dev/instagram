-- Migration: 000007_governance_moderation.sql
-- Domain: TRUST & SAFETY, CONTENT MODERATION, AUDIT LOGGING, OUTBOX & NOTIFICATIONS

-- 60. moderation_reports
CREATE TABLE IF NOT EXISTS moderation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(30) NOT NULL, -- POST, COMMENT, STORY, REEL, MESSAGE, USER
    content_id UUID NOT NULL,
    reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason_category VARCHAR(50) NOT NULL, -- SPAM, HARASSMENT, HATE_SPEECH, NUDITY, VIOLENCE, FRAUD, INTELLECTUAL_PROPERTY
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, RESOLVED, DISMISSED
    assigned_moderator_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_mod_reports_status ON moderation_reports(status, created_at DESC);
CREATE INDEX idx_mod_reports_target ON moderation_reports(reported_user_id);

-- 61. moderation_actions
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES moderation_reports(id) ON DELETE SET NULL,
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_taken VARCHAR(50) NOT NULL, -- CONTENT_REMOVED, WARNING_ISSUED, SHADOWBANNED, ACCOUNT_SUSPENDED, DISMISSED
    reason TEXT NOT NULL,
    actioned_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mod_actions_user ON moderation_actions(target_user_id);

-- 62. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);

-- 63. outbox_events
CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, PUBLISHED, FAILED
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_outbox_events_status ON outbox_events(status, created_at ASC);

-- 64. notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- LIKE, COMMENT, FOLLOW, MENTION, TAG, STORY_REACTION, DM, SYSTEM
    entity_type VARCHAR(50) NOT NULL, -- POST, COMMENT, USER, STORY, REEL, MESSAGE
    entity_id UUID NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);
