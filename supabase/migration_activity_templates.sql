-- ============================================================
-- Migration: Activity templates + extended phase_tasks
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Company-level activity templates (master list uploaded by HR admin)
CREATE TABLE activity_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('pre_arrival','arrival','integration','adjustment','stabilization','embedding')),
  week TEXT,
  days TEXT,
  dimension TEXT NOT NULL CHECK (dimension IN ('fit','ace','tie')),
  subdimension TEXT,
  activity TEXT NOT NULL,
  who TEXT,
  estimated_time TEXT,
  builds_on TEXT,
  output TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_templates_company ON activity_templates(company_id);
CREATE INDEX idx_activity_templates_phase ON activity_templates(company_id, phase);

-- Extend phase_tasks with richer fields
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS week TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS days TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS subdimension TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS activity TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS who TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS estimated_time TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS builds_on TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS output TEXT;
