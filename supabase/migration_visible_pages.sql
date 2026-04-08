-- Add visible_pages to company_config
-- Run in Supabase SQL Editor
ALTER TABLE company_config ADD COLUMN IF NOT EXISTS visible_pages JSONB
  DEFAULT '["home","activities","timeline","buckets","progress","org","people","docs","evaluation"]';
