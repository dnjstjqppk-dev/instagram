-- Migration: 000002_social_graph.sql
-- Domain: SOCIAL GRAPH & USER PROFILES

-- 11. profiles
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio VARCHAR(150),
    website_url VARCHAR(255),
    pronouns VARCHAR(50),
    category VARCHAR(50), -- e.g. Artist, Musician, Entrepreneur, Blogger
    contact_email VARCHAR(255),
    contact_phone VARCHAR(32),
    display_category BOOLEAN NOT NULL DEFAULT FALSE,
    display_contact BOOLEAN NOT NULL DEFAULT FALSE,
    posts_count INT NOT NULL DEFAULT 0,
    followers_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. follows
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(follower_id, following_id),
    CHECK(follower_id <> following_id)
);

CREATE INDEX idx_follows_following ON follows(following_id);

-- 13. follow_requests
CREATE TABLE IF NOT EXISTS follow_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(requester_id, target_id)
);

CREATE INDEX idx_follow_requests_target ON follow_requests(target_id, status);

-- 14. blocks
CREATE TABLE IF NOT EXISTS blocks (
    blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(blocker_id, blocked_id),
    CHECK(blocker_id <> blocked_id)
);

-- 15. mutes
CREATE TABLE IF NOT EXISTS mutes (
    muter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    muted_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mute_posts BOOLEAN NOT NULL DEFAULT TRUE,
    mute_stories BOOLEAN NOT NULL DEFAULT TRUE,
    mute_notes BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(muter_id, muted_id),
    CHECK(muter_id <> muted_id)
);

-- 16. restrictions
CREATE TABLE IF NOT EXISTS restrictions (
    restricter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restricted_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(restricter_id, restricted_id),
    CHECK(restricter_id <> restricted_id)
);

-- 17. favorites
CREATE TABLE IF NOT EXISTS favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    favorite_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, favorite_user_id),
    CHECK(user_id <> favorite_user_id)
);

-- 18. close_friends
CREATE TABLE IF NOT EXISTS close_friends (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, friend_id),
    CHECK(user_id <> friend_id)
);
