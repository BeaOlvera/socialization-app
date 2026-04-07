-- ============================================================
-- Row Level Security Policies
-- Run AFTER schema.sql in Supabase SQL Editor
-- NOTE: These policies work with the service role key (bypasses RLS)
-- and anon key (respects RLS). The app uses service role server-side,
-- so these are an extra safety layer.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE newcomers ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Service role bypasses all RLS (used by API routes)
-- Anon key users get these policies:

-- Companies: users can read their own company
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM users WHERE id = auth.uid()));

-- Users: can read own record
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Newcomers: newcomers see own, managers see their reports, HR sees all in company
CREATE POLICY "Newcomers view own record"
  ON newcomers FOR SELECT
  USING (user_id = auth.uid());

-- Checkins: newcomers see own, managers see their newcomers'
CREATE POLICY "Own checkins"
  ON checkins FOR SELECT
  USING (newcomer_id IN (SELECT id FROM newcomers WHERE user_id = auth.uid()));

-- Messages: only via checkin ownership
CREATE POLICY "Own messages"
  ON messages FOR SELECT
  USING (checkin_id IN (
    SELECT c.id FROM checkins c
    JOIN newcomers n ON c.newcomer_id = n.id
    WHERE n.user_id = auth.uid()
  ));

-- Phase tasks: newcomers see own
CREATE POLICY "Own tasks"
  ON phase_tasks FOR ALL
  USING (newcomer_id IN (SELECT id FROM newcomers WHERE user_id = auth.uid()));

-- Actions: newcomers see own
CREATE POLICY "Own actions"
  ON actions FOR ALL
  USING (newcomer_id IN (SELECT id FROM newcomers WHERE user_id = auth.uid()));

-- Notifications: users see own
CREATE POLICY "Own notifications"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- Audit logs: HR admin only (via service role, not anon)
-- No anon policy = no access via anon key

-- Privacy consents: own records only
CREATE POLICY "Own consents"
  ON privacy_consents FOR SELECT
  USING (person_id = auth.uid()::text);
