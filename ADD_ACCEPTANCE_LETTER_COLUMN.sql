-- Add acceptance_letter_url column to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS acceptance_letter_url TEXT;

-- Verify it was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'acceptance_letter_url';
