-- Add tuition_unit to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS tuition_unit TEXT DEFAULT 'year';

-- Add program_level to university_admission_requirements table
ALTER TABLE university_admission_requirements 
ADD COLUMN IF NOT EXISTS program_level TEXT;

-- Optional: Update existing records if needed, but for now defaults are fine or null.
