-- Add details column to checkins for storing coded interview analysis
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS details JSONB;
