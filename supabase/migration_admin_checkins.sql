-- ============================================================
-- Migration: Admin role, company config, check-in templates
-- Run in Supabase SQL Editor AFTER migration_activity_templates.sql
-- ============================================================

-- 1. Add 'admin' role to users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('newcomer','manager','hr_admin','admin'));

-- 2. Allow admin users without company (company_id nullable for admin)
ALTER TABLE users ALTER COLUMN company_id DROP NOT NULL;

-- 3. Company configuration table
CREATE TABLE IF NOT EXISTS company_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  has_buddies BOOLEAN DEFAULT TRUE,
  checkin_frequency TEXT DEFAULT 'monthly' CHECK (checkin_frequency IN ('biweekly','monthly','quarterly')),
  phases_enabled JSONB DEFAULT '["arrival","integration","adjustment","stabilization","embedding"]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- 4. Extend activity_templates with type and assigned_to
ALTER TABLE activity_templates ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'activity'
  CHECK (type IN ('activity','checkin'));
ALTER TABLE activity_templates ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT 'newcomer'
  CHECK (assigned_to IN ('newcomer','manager','buddy','hr'));
ALTER TABLE activity_templates ADD COLUMN IF NOT EXISTS format TEXT;
ALTER TABLE activity_templates ADD COLUMN IF NOT EXISTS duration TEXT;

-- 5. Extend phase_tasks with type, assigned_to, due_date, assigned_to_user_id
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'activity';
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT 'newcomer';
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS format TEXT;
ALTER TABLE phase_tasks ADD COLUMN IF NOT EXISTS duration TEXT;

-- 6. Index for looking up tasks assigned to a specific user
CREATE INDEX IF NOT EXISTS idx_phase_tasks_assigned_user ON phase_tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_phase_tasks_type ON phase_tasks(newcomer_id, type);
