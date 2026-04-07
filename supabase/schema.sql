-- ============================================================
-- ONBOARD: Newcomer Socialization Platform — Database Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── COMPANIES ──────────────────────────────────────────────
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT CHECK (size IN ('under_50','50_200','200_500','500_2000','2000_plus')),
  values JSONB DEFAULT '[]',
  rituals TEXT,
  decision_making_style TEXT,
  unwritten_rules TEXT,
  mission TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── USERS ──────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('newcomer','manager','hr_admin')),
  password_hash TEXT,
  token TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company ON users(company_id);
CREATE UNIQUE INDEX idx_users_token ON users(token);

-- ─── NEWCOMERS ──────────────────────────────────────────────
CREATE TABLE newcomers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  buddy_id UUID REFERENCES users(id) ON DELETE SET NULL,
  department TEXT,
  position TEXT,
  start_date DATE NOT NULL,
  current_phase TEXT NOT NULL DEFAULT 'arrival'
    CHECK (current_phase IN ('arrival','integration','adjustment','stabilization','embedding')),
  status TEXT NOT NULL DEFAULT 'green'
    CHECK (status IN ('green','yellow','red')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_newcomers_company ON newcomers(company_id);
CREATE INDEX idx_newcomers_manager ON newcomers(manager_id);
CREATE INDEX idx_newcomers_user ON newcomers(user_id);

-- ─── TEAM MEMBERS (the newcomer's people network) ──────────
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newcomer_id UUID NOT NULL REFERENCES newcomers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  relation TEXT NOT NULL CHECK (relation IN ('manager','buddy','peer','key_contact')),
  email TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_newcomer ON team_members(newcomer_id);

-- ─── CHECK-INS (monthly evaluations — self or manager) ─────
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newcomer_id UUID NOT NULL REFERENCES newcomers(id) ON DELETE CASCADE,
  checkin_type TEXT NOT NULL CHECK (checkin_type IN ('self','manager')),
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  month_number INTEGER NOT NULL CHECK (month_number BETWEEN 1 AND 12),
  phase TEXT,

  -- Likert scores: arrays of 5 integers (1-5) per dimension
  scores_fit JSONB DEFAULT '[]',
  scores_ace JSONB DEFAULT '[]',
  scores_tie JSONB DEFAULT '[]',

  -- Computed averages (0-100 scale)
  score_fit_avg NUMERIC(5,2),
  score_ace_avg NUMERIC(5,2),
  score_tie_avg NUMERIC(5,2),

  -- Interview status
  interview_status TEXT DEFAULT 'pending'
    CHECK (interview_status IN ('pending','in_progress','completed')),

  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkins_newcomer ON checkins(newcomer_id);
CREATE INDEX idx_checkins_submitted_by ON checkins(submitted_by);

-- ─── MESSAGES (AI interview transcripts) ────────────────────
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checkin_id UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('assistant','user')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_checkin ON messages(checkin_id);

-- ─── PHASE TASKS (timeline checklist items) ─────────────────
CREATE TABLE phase_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newcomer_id UUID NOT NULL REFERENCES newcomers(id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('arrival','integration','adjustment','stabilization','embedding')),
  dimension TEXT NOT NULL CHECK (dimension IN ('fit','ace','tie')),
  task_index INTEGER NOT NULL,
  label TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phase_tasks_newcomer ON phase_tasks(newcomer_id);
CREATE INDEX idx_phase_tasks_phase ON phase_tasks(newcomer_id, phase);

-- ─── ACTIONS (daily actions for newcomers) ──────────────────
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newcomer_id UUID NOT NULL REFERENCES newcomers(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('fit','ace','tie')),
  text TEXT NOT NULL,
  urgent BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_actions_newcomer ON actions(newcomer_id);

-- ─── DIMENSION SCORE HISTORY (time series for charts) ───────
CREATE TABLE dimension_scores_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newcomer_id UUID NOT NULL REFERENCES newcomers(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('fit','ace','tie')),
  score NUMERIC(5,2) NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('self','manager')),
  checkin_id UUID REFERENCES checkins(id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scores_history_newcomer ON dimension_scores_history(newcomer_id);
CREATE INDEX idx_scores_history_time ON dimension_scores_history(newcomer_id, recorded_at);

-- ─── NOTIFICATIONS ──────────────────────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('alert','reminder','info')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  href TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read);

-- ═══════════════════════════════════════════════════════════
-- COMPLIANCE TABLES (mirrors 360 app)
-- ═══════════════════════════════════════════════════════════

-- ─── AUDIT LOGS ─────────────────────────────────────────────
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ─── PRIVACY CONSENTS ───────────────────────────────────────
CREATE TABLE privacy_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_type TEXT NOT NULL,
  person_id TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  consent_text TEXT,
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consents_person ON privacy_consents(person_type, person_id);

-- ─── AI LOGS (EU AI Act compliance) ─────────────────────────
CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checkin_id UUID REFERENCES checkins(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  model TEXT,
  prompt_length INTEGER,
  response_length INTEGER,
  tokens_used INTEGER,
  duration_ms INTEGER,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_checkin ON ai_logs(checkin_id);
CREATE INDEX idx_ai_logs_timestamp ON ai_logs(created_at);

-- ═══════════════════════════════════════════════════════════
-- DATA RETENTION FIELDS
-- ═══════════════════════════════════════════════════════════

ALTER TABLE checkins ADD COLUMN retention_expires_at TIMESTAMPTZ;
ALTER TABLE checkins ADD COLUMN data_deleted_at TIMESTAMPTZ;
ALTER TABLE newcomers ADD COLUMN data_deletion_requested_at TIMESTAMPTZ;
ALTER TABLE newcomers ADD COLUMN data_deletion_completed_at TIMESTAMPTZ;
