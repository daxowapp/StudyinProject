-- Add address column to universities table
-- This column stores the full street address for map display
ALTER TABLE universities ADD COLUMN IF NOT EXISTS address TEXT;

-- Optional: add a comment for documentation
COMMENT ON COLUMN universities.address IS 'Full street address in English for map display (e.g. 1 Zhongguancun North Street, Haidian District, Beijing, China 100871)';
