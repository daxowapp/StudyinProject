-- Add institution_category column to universities table
ALTER TABLE universities ADD COLUMN IF NOT EXISTS institution_category TEXT;

-- Add a comment explaining the field
COMMENT ON COLUMN universities.institution_category IS 'Category of institution: University, College, Language Institute, etc.';
