-- Add content field to company_documents for AI-generated text
ALTER TABLE company_documents ADD COLUMN IF NOT EXISTS content TEXT;
-- Add source field to track how the doc was created
ALTER TABLE company_documents ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual'
  CHECK (source IN ('manual', 'ai_interview', 'file_upload'));
