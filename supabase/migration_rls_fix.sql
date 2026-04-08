-- ============================================================
-- RLS fix: enable on new tables added after initial schema
-- Run in Supabase SQL Editor
-- ============================================================

-- Enable RLS on tables added by migrations
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_config ENABLE ROW LEVEL SECURITY;

-- Deny anon access (all access goes through service_role key)
CREATE POLICY "Service role only" ON activity_templates
  FOR ALL USING (false);

CREATE POLICY "Service role only" ON company_config
  FOR ALL USING (false);
