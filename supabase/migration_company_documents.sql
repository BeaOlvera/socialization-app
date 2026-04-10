-- Company documents: organized by FIT/ACE/TIE, toggleable visibility
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS company_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('fit','ace','tie')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_docs_company ON company_documents(company_id);

ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON company_documents FOR ALL USING (false);
