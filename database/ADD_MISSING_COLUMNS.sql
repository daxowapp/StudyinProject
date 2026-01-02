-- Add missing columns to universities
ALTER TABLE universities ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE universities ADD COLUMN IF NOT EXISTS accommodation_allowance VARCHAR(255); -- For "Rent outside"

-- Add missing columns to university_programs
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS seats VARCHAR(100); -- Changed to VARCHAR as it can be "open" or numbers
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS application_deadline VARCHAR(100);
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS fast_track BOOLEAN DEFAULT false;
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false; -- For "Hot" status
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS required_documents TEXT[];
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS admission_tech_interview BOOLEAN DEFAULT false;

-- Add missing columns for detailed program requirements
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS min_age INTEGER;
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS max_age INTEGER;
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS gpa_requirement VARCHAR(255);
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS english_requirement VARCHAR(255);

-- Update detailed comments
COMMENT ON COLUMN university_programs.seats IS 'Number of seats available or "open"';
COMMENT ON COLUMN university_programs.application_deadline IS 'Application deadline string from source';
COMMENT ON COLUMN university_programs.fast_track IS 'Whether the program has a fast track option';
