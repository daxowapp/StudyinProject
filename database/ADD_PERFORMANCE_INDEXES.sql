-- Performance Optimization: Add indexes for frequently queried columns
-- This will significantly improve query performance across the application

-- Index for university_programs foreign key lookups
CREATE INDEX IF NOT EXISTS idx_university_programs_university_id 
ON university_programs(university_id);

-- Index for filtering active programs
CREATE INDEX IF NOT EXISTS idx_university_programs_is_active 
ON university_programs(is_active);

-- Index for program catalog lookups
CREATE INDEX IF NOT EXISTS idx_university_programs_program_catalog_id 
ON university_programs(program_catalog_id);

-- Index for language lookups
CREATE INDEX IF NOT EXISTS idx_university_programs_language_id 
ON university_programs(language_id);

-- Index for university slug lookups (used in URLs)
CREATE INDEX IF NOT EXISTS idx_universities_slug 
ON universities(slug);

-- Index for program slug lookups (used in URLs)
CREATE INDEX IF NOT EXISTS idx_university_programs_slug 
ON university_programs(slug);

-- Index for applications student lookups
CREATE INDEX IF NOT EXISTS idx_applications_student_id 
ON applications(student_id);

-- Index for applications program lookups
CREATE INDEX IF NOT EXISTS idx_applications_university_program_id 
ON applications(university_program_id);

-- Index for applications status filtering
CREATE INDEX IF NOT EXISTS idx_applications_status 
ON applications(status);

-- Index for admission requirements university lookups
CREATE INDEX IF NOT EXISTS idx_admission_requirements_university_id 
ON university_admission_requirements(university_id);

-- Index for admission requirements requirement lookups
CREATE INDEX IF NOT EXISTS idx_admission_requirements_requirement_id 
ON university_admission_requirements(requirement_id);

-- Composite index for active programs by university (common query pattern)
CREATE INDEX IF NOT EXISTS idx_university_programs_university_active 
ON university_programs(university_id, is_active);

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY 
    tablename, indexname;
