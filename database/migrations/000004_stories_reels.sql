-- Migration: 000004_stories_reels.sql
-- Domain: STORIES, REELS, AUDIO & EPHEMERAL NOTES

-- 32. reel_audio
CREATE TABLE IF NOT EXISTS reel_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    artist_name VARCHAR(100) NOT NULL,
    original_creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    audio_url TEXT NOT NULL,
    duration_seconds NUMERIC(6, 2) NOT NULL,
    usage_count BIGINT NOT NULL DEFAULT 0,
    is_original BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reel_audio_creator ON reel_audio(original_creator_id);
CREATE INDEX idx_reel_audio_usage ON reel_audio(usage_count DESC);

-- 33. stories
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE', -- IMAGE, VIDEO
    duration_seconds NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
    is_close_friends BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stories_user_expires ON stories(user_id, expires_at);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);

-- 34. story_views
CREATE TABLE IF NOT EXISTS story_views (
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_emoji VARCHAR(10),
    reacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(story_id, viewer_id)
);

CREATE INDEX idx_story_views_viewer ON story_views(viewer_id);

-- 35. story_stickers
CREATE TABLE IF NOT EXISTS story_stickers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    sticker_type VARCHAR(30) NOT NULL, -- POLL, QUESTION, QUIZ, SLIDER, LINK, COUNTDOWN, MENTION, HASHTAG, LOCATION
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    position_x NUMERIC(5, 4) NOT NULL,
    position_y NUMERIC(5, 4) NOT NULL,
    rotation NUMERIC(6, 2) NOT NULL DEFAULT 0,
    scale NUMERIC(5, 4) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_story_stickers_story ON story_stickers(story_id);

-- 36. story_sticker_responses
CREATE TABLE IF NOT EXISTS story_sticker_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sticker_id UUID NOT NULL REFERENCES story_stickers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    response_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(sticker_id, user_id)
);

-- 37. story_highlights
CREATE TABLE IF NOT EXISTS story_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    cover_url TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_story_highlights_user ON story_highlights(user_id, order_index);

-- 38. highlight_stories
CREATE TABLE IF NOT EXISTS highlight_stories (
    highlight_id UUID NOT NULL REFERENCES story_highlights(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(highlight_id, story_id)
);

-- 39. reels
CREATE TABLE IF NOT EXISTS reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT,
    audio_id UUID REFERENCES reel_audio(id) ON DELETE SET NULL,
    duration_seconds NUMERIC(6, 2) NOT NULL,
    aspect_ratio VARCHAR(20) NOT NULL DEFAULT '9:16',
    allow_remix BOOLEAN NOT NULL DEFAULT TRUE,
    views_count BIGINT NOT NULL DEFAULT 0,
    likes_count INT NOT NULL DEFAULT 0,
    comments_count INT NOT NULL DEFAULT 0,
    shares_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reels_user_id ON reels(user_id, created_at DESC);
CREATE INDEX idx_reels_views ON reels(views_count DESC);
CREATE INDEX idx_reels_audio ON reels(audio_id);

-- 40. reel_remixes
CREATE TABLE IF NOT EXISTS reel_remixes (
    remix_reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
    original_reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(remix_reel_id, original_reel_id)
);

-- 41. reel_likes
CREATE TABLE IF NOT EXISTS reel_likes (
    reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(reel_id, user_id)
);

-- 42. notes
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(60) NOT NULL,
    audio_id UUID REFERENCES reel_audio(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_user_expires ON notes(user_id, expires_at);
