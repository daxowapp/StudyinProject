-- =====================================================
-- ADMISSION REQUIREMENTS - DATABASE MIGRATION
-- =====================================================
-- This migration creates a centralized admission requirements system
-- =====================================================

-- 1. Create admission_requirements_catalog table (Master requirements list)
CREATE TABLE IF NOT EXISTS admission_requirements_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'academic', 'language', 'document', 'financial', 'other'
    requirement_type VARCHAR(50) NOT NULL, -- 'bachelor', 'master', 'phd', 'all'
    description TEXT NOT NULL,
    is_common BOOLEAN DEFAULT true, -- Common requirements used by most universities
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create university_admission_requirements junction table
CREATE TABLE IF NOT EXISTS university_admission_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES admission_requirements_catalog(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    custom_note TEXT, -- University-specific notes or modifications
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(university_id, requirement_id)
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admission_requirements_category ON admission_requirements_catalog(category);
CREATE INDEX IF NOT EXISTS idx_admission_requirements_type ON admission_requirements_catalog(requirement_type);
CREATE INDEX IF NOT EXISTS idx_university_admission_university ON university_admission_requirements(university_id);
CREATE INDEX IF NOT EXISTS idx_university_admission_requirement ON university_admission_requirements(requirement_id);

-- 4. Insert common admission requirements

-- Academic Requirements
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('High School Diploma', 'academic', 'bachelor', 'Valid high school diploma or equivalent certificate', true),
('Bachelor Degree', 'academic', 'master', 'Recognized bachelor''s degree from an accredited institution', true),
('Master Degree', 'academic', 'phd', 'Recognized master''s degree from an accredited institution', true),
('Minimum GPA 3.0', 'academic', 'bachelor', 'Minimum GPA of 3.0/4.0 or equivalent (75% or above)', true),
('Minimum GPA 3.2', 'academic', 'master', 'Minimum GPA of 3.2/4.0 or equivalent (80% or above)', true),
('Academic Transcripts', 'academic', 'all', 'Official academic transcripts from all previous institutions', true),
('Graduation Certificate', 'academic', 'all', 'Notarized graduation certificate', true);

-- Language Requirements (Updated to "all" level)
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('IELTS', 'language', 'all', 'IELTS score required for English-taught programs (minimum 6.0 for Bachelor, 6.5 for Master)', true),
('TOEFL', 'language', 'all', 'TOEFL iBT score required for English-taught programs (minimum 80 for Bachelor, 90 for Master)', true),
('HSK', 'language', 'all', 'HSK Level required for Chinese-taught programs (Level 4+ for Bachelor, Level 5+ for Master, Level 6 for PhD)', true),
('PTE Academic', 'language', 'all', 'PTE Academic score for English-taught programs', true),
('Duolingo English Test', 'language', 'all', 'Duolingo English Test score for English-taught programs', true),
('English Proficiency Waiver', 'language', 'all', 'Waiver available for students from English-speaking countries', true);

-- Document Requirements
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('Valid Passport', 'document', 'all', 'Valid passport with at least 6 months validity', true),
('Passport Photos', 'document', 'all', 'Recent passport-size photos (usually 2-4 copies)', true),
('Physical Examination Form', 'document', 'all', 'Foreigner Physical Examination Form completed by a licensed physician', true),
('Non-Criminal Record', 'document', 'all', 'Certificate of no criminal record from home country', true),
('Recommendation Letters', 'document', 'master', 'Two recommendation letters from professors or employers', true),
('Personal Statement', 'document', 'all', 'Statement of purpose or personal statement (500-1000 words)', true),
('Study Plan', 'document', 'master', 'Detailed study or research plan', true),
('CV/Resume', 'document', 'master', 'Comprehensive curriculum vitae', true),
('Portfolio', 'document', 'bachelor', 'Portfolio required for art, design, and architecture programs', false);

-- Financial Requirements
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('Bank Statement', 'financial', 'all', 'Bank statement showing sufficient funds for tuition and living expenses', true),
('Financial Guarantee', 'financial', 'all', 'Financial guarantee letter from sponsor (if applicable)', true),
('Scholarship Certificate', 'financial', 'all', 'Scholarship award letter (if applicable)', false);

-- Other Requirements
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('Age Requirement 18-25', 'other', 'bachelor', 'Applicants should be between 18-25 years old', true),
('Age Requirement 18-35', 'other', 'master', 'Applicants should be between 18-35 years old', true),
('Age Requirement 18-40', 'other', 'phd', 'Applicants should be between 18-40 years old', true),
('Good Health', 'other', 'all', 'Applicants must be in good physical and mental health', true),
('Interview', 'other', 'master', 'Interview may be required for certain programs', false),
('Entrance Examination', 'other', 'bachelor', 'Some programs may require entrance examination', false);

-- 5. Create a view for easy querying
CREATE OR REPLACE VIEW v_university_admission_requirements AS
SELECT 
    uar.university_id,
    u.name as university_name,
    uar.requirement_id,
    arc.title,
    arc.category,
    arc.requirement_type,
    arc.description,
    uar.is_required,
    uar.custom_note,
    uar.display_order
FROM university_admission_requirements uar
JOIN universities u ON uar.university_id = u.id
JOIN admission_requirements_catalog arc ON uar.requirement_id = arc.id
ORDER BY uar.university_id, arc.category, uar.display_order;

-- 6. Sample: Link requirements to a university (example for Tsinghua)
-- You can run this after creating universities
/*
INSERT INTO university_admission_requirements (university_id, requirement_id, is_required, display_order)
SELECT 
    (SELECT id FROM universities WHERE slug = 'tsinghua-university' LIMIT 1),
    id,
    true,
    ROW_NUMBER() OVER (ORDER BY category, title)
FROM admission_requirements_catalog
WHERE requirement_type IN ('bachelor', 'all')
AND is_common = true;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count requirements by category
SELECT category, COUNT(*) as count 
FROM admission_requirements_catalog 
GROUP BY category 
ORDER BY count DESC;

-- Count requirements by type
SELECT requirement_type, COUNT(*) as count 
FROM admission_requirements_catalog 
GROUP BY requirement_type 
ORDER BY count DESC;

-- View all requirements
SELECT 
    category,
    requirement_type,
    title,
    description
FROM admission_requirements_catalog
ORDER BY category, requirement_type, title;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Run this migration in your Supabase SQL Editor
-- 2. Requirements are categorized by: academic, language, document, financial, other
-- 3. Requirements are typed by: bachelor, master, phd, all
-- 4. Universities can select from catalog and add custom notes
-- 5. Display order can be customized per university
-- =====================================================
