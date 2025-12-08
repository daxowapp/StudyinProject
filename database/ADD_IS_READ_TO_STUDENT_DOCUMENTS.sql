-- Add is_read column to student_documents table
ALTER TABLE student_documents 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Update existing documents to be read (optional, but good for migration so users don't see old docs as new)
-- UPDATE student_documents SET is_read = TRUE;
