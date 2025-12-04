-- Add university_type column to universities table
ALTER TABLE universities ADD COLUMN IF NOT EXISTS university_type TEXT;

-- Add a comment explaining the field
COMMENT ON COLUMN universities.university_type IS 'Type of university: Public, Private, Research, etc.';
