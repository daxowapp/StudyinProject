-- Add missing columns to applications table to support admin features
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS requested_documents TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS acceptance_letter_url TEXT;

-- Add comment
COMMENT ON COLUMN applications.requested_documents IS 'List of documents requested from the student';
COMMENT ON COLUMN applications.acceptance_letter_url IS 'URL of the uploaded conditional acceptance letter';
