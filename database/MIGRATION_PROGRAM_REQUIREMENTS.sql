-- =====================================================
-- PROGRAM-SPECIFIC ADMISSION REQUIREMENTS - DATABASE MIGRATION
-- =====================================================
-- This migration adds support for program-specific requirements
-- that override university-level requirements
-- =====================================================

-- 1. Add has_custom_requirements flag to university_programs table
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS has_custom_requirements BOOLEAN DEFAULT false;

-- 2. Create program_admission_requirements table
CREATE TABLE IF NOT EXISTS program_admission_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES university_programs(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES admission_requirements_catalog(id) ON DELETE CASCADE,
    custom_title VARCHAR(255), -- For custom requirements not in catalog
    custom_description TEXT,
    category VARCHAR(100) NOT NULL, -- 'academic', 'language', 'document', 'financial', 'other'
    is_required BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Either requirement_id OR custom_title must be provided
    CONSTRAINT program_req_content_check CHECK (
        requirement_id IS NOT NULL OR custom_title IS NOT NULL
    )
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_program_requirements_program ON program_admission_requirements(program_id);
CREATE INDEX IF NOT EXISTS idx_program_requirements_category ON program_admission_requirements(category);
CREATE INDEX IF NOT EXISTS idx_program_requirements_requirement ON program_admission_requirements(requirement_id);
CREATE INDEX IF NOT EXISTS idx_programs_has_custom_requirements ON university_programs(has_custom_requirements) WHERE has_custom_requirements = true;

-- 4. Create view for easy querying
CREATE OR REPLACE VIEW v_program_admission_requirements AS
SELECT 
    par.id,
    par.program_id,
    COALESCE(up.custom_title, pc.title) as program_title,
    pc.title as program_title_original,
    up.university_id,
    u.name as university_name,
    par.requirement_id,
    COALESCE(arc.title, par.custom_title) as title,
    par.category,
    COALESCE(arc.description, par.custom_description) as description,
    par.custom_title IS NOT NULL as is_custom,
    par.is_required,
    par.display_order,
    par.created_at,
    par.updated_at
FROM program_admission_requirements par
JOIN university_programs up ON par.program_id = up.id
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN admission_requirements_catalog arc ON par.requirement_id = arc.id
ORDER BY par.program_id, par.category, par.display_order;

-- 4b. Update the v_university_programs_full view to include has_custom_requirements
-- This ensures the view exposes the new column for queries
-- Note: Must DROP first because PostgreSQL cannot add columns with CREATE OR REPLACE
DROP VIEW IF EXISTS v_university_programs_full;
CREATE VIEW v_university_programs_full AS
SELECT 
    up.id,
    up.slug,
    up.university_id,
    u.name as university_name,
    u.slug as university_slug,
    u.city,
    u.province,
    u.portal_key,
    pc.id as program_catalog_id,
    pc.title as program_title,
    pc.category,
    pc.field,
    pc.level,
    pc.description as program_description,
    up.custom_title,
    COALESCE(up.custom_title, pc.title) as display_title,
    up.tuition_fee,
    up.currency,
    COALESCE(up.duration, pc.typical_duration) as duration,
    up.language_id,
    l.name as language_name,
    up.intake,
    up.scholarship_chance,
    up.application_fee,
    up.service_fee,
    up.force_payment,
    up.is_active,
    up.has_custom_requirements,
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- 5. Enable Row Level Security
ALTER TABLE program_admission_requirements ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
-- Public read access
DROP POLICY IF EXISTS "Public can view program requirements" ON program_admission_requirements;
CREATE POLICY "Public can view program requirements" 
ON program_admission_requirements 
FOR SELECT 
USING (true);

-- Admin full access
DROP POLICY IF EXISTS "Admins can manage program requirements" ON program_admission_requirements;
CREATE POLICY "Admins can manage program requirements" 
ON program_admission_requirements 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'super_admin', 'academic_manager', 'data_entry')
    )
);

-- 7. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_program_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_program_requirements_updated_at ON program_admission_requirements;
CREATE TRIGGER trigger_program_requirements_updated_at
    BEFORE UPDATE ON program_admission_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_program_requirements_updated_at();

-- 8. Add comments
COMMENT ON TABLE program_admission_requirements IS 'Program-specific admission requirements that override university-level requirements';
COMMENT ON COLUMN university_programs.has_custom_requirements IS 'If true, program has custom requirements that override university defaults';
COMMENT ON COLUMN program_admission_requirements.requirement_id IS 'Reference to catalog requirement (NULL if custom)';
COMMENT ON COLUMN program_admission_requirements.custom_title IS 'Custom requirement title when not using catalog';
COMMENT ON COLUMN program_admission_requirements.custom_description IS 'Custom requirement description when not using catalog';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check the new column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'university_programs' AND column_name = 'has_custom_requirements';

-- Count programs with custom requirements flag
SELECT has_custom_requirements, COUNT(*) 
FROM university_programs 
GROUP BY has_custom_requirements;

-- Check the new table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'program_admission_requirements'
ORDER BY ordinal_position;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Run this migration in your Supabase SQL Editor
-- 2. When has_custom_requirements = true, the program page
--    will fetch from v_program_admission_requirements instead
--    of v_university_admission_requirements
-- 3. Custom requirements completely replace university defaults
-- 4. Admins can use catalog requirements OR create custom ones
-- =====================================================
