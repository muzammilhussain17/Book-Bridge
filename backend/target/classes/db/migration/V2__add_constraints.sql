-- V2: Add constraints and indexes that were missing from initial schema
-- Prevent a user from reviewing the same deal twice
CREATE UNIQUE INDEX IF NOT EXISTS idx_ratings_unique_review
    ON ratings (reviewer_id, reference_id, reference_type);

-- Index to speed up unread notification lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON notifications (user_id, is_read);

-- Index to speed up conversation participant lookups
CREATE INDEX IF NOT EXISTS idx_conv_participant_a ON conversations (participant_a);
CREATE INDEX IF NOT EXISTS idx_conv_participant_b ON conversations (participant_b);
