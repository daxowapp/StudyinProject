-- =====================================================
-- PROGRAM CATALOG SYSTEM - DATABASE MIGRATION
-- =====================================================
-- This migration creates a centralized program catalog system
-- to solve the problem of duplicate/similar program names
-- =====================================================

-- 1. Create program_catalog table (Master program list)
CREATE TABLE IF NOT EXISTS program_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL UNIQUE, -- Standardized program name
    category VARCHAR(100) NOT NULL, -- e.g., "Business & Management", "Engineering", "Medicine"
    field VARCHAR(100), -- Sub-category e.g., "Computer Science", "Civil Engineering"
    level VARCHAR(50) NOT NULL, -- Bachelor, Master, PhD
    description TEXT,
    typical_duration VARCHAR(50), -- e.g., "4 years", "2 years"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create university_programs table (University-specific program offerings)
CREATE TABLE IF NOT EXISTS university_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    program_catalog_id UUID NOT NULL REFERENCES program_catalog(id) ON DELETE RESTRICT,
    
    -- University-specific details
    custom_title VARCHAR(255), -- Optional: University's own name for the program
    tuition_fee DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'RMB',
    duration VARCHAR(50), -- Can override typical_duration
    
    -- Application details
    language_id UUID REFERENCES languages(id),
    intake VARCHAR(100),
    scholarship_chance VARCHAR(50),
    application_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    force_payment BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one university doesn't add the same program twice
    UNIQUE(university_id, program_catalog_id)
);

-- 3. Create indexes for better performance
CREATE INDEX idx_program_catalog_category ON program_catalog(category);
CREATE INDEX idx_program_catalog_level ON program_catalog(level);
CREATE INDEX idx_university_programs_university ON university_programs(university_id);
CREATE INDEX idx_university_programs_catalog ON university_programs(program_catalog_id);
CREATE INDEX idx_university_programs_active ON university_programs(is_active);

-- 4. Insert sample program catalog entries
INSERT INTO program_catalog (title, category, field, level, description, typical_duration) VALUES
-- Business & Management
('Business Administration', 'Business & Management', 'General Business', 'Bachelor', 'Comprehensive business education covering management, finance, marketing, and operations.', '4 years'),
('Business Administration', 'Business & Management', 'General Business', 'Master', 'Advanced business management and strategic leadership program.', '2 years'),
('International Business', 'Business & Management', 'International Trade', 'Bachelor', 'Focus on global business operations and international trade.', '4 years'),
('Marketing', 'Business & Management', 'Marketing', 'Bachelor', 'Study of market research, consumer behavior, and marketing strategies.', '4 years'),
('Finance', 'Business & Management', 'Finance', 'Bachelor', 'Financial management, investment analysis, and corporate finance.', '4 years'),
('Accounting', 'Business & Management', 'Accounting', 'Bachelor', 'Financial accounting, auditing, and taxation.', '4 years'),
('Economics', 'Business & Management', 'Economics', 'Bachelor', 'Microeconomics, macroeconomics, and economic theory.', '4 years'),
('MBA (Master of Business Administration)', 'Business & Management', 'General Business', 'Master', 'Executive business administration program.', '2 years'),

-- Engineering & Technology
('Computer Science', 'Engineering & Technology', 'Computer Science', 'Bachelor', 'Programming, algorithms, software engineering, and computer systems.', '4 years'),
('Computer Science', 'Engineering & Technology', 'Computer Science', 'Master', 'Advanced computing, AI, and research methodologies.', '2-3 years'),
('Software Engineering', 'Engineering & Technology', 'Computer Science', 'Bachelor', 'Software development, testing, and project management.', '4 years'),
('Artificial Intelligence', 'Engineering & Technology', 'Computer Science', 'Master', 'Machine learning, deep learning, and AI applications.', '2-3 years'),
('Data Science', 'Engineering & Technology', 'Computer Science', 'Master', 'Big data analytics, statistical modeling, and data visualization.', '2 years'),
('Civil Engineering', 'Engineering & Technology', 'Civil Engineering', 'Bachelor', 'Structural design, construction management, and infrastructure.', '4 years'),
('Mechanical Engineering', 'Engineering & Technology', 'Mechanical Engineering', 'Bachelor', 'Mechanics, thermodynamics, and manufacturing systems.', '4 years'),
('Electrical Engineering', 'Engineering & Technology', 'Electrical Engineering', 'Bachelor', 'Electronics, power systems, and telecommunications.', '4 years'),
('Chemical Engineering', 'Engineering & Technology', 'Chemical Engineering', 'Bachelor', 'Chemical processes, materials science, and process design.', '4 years'),
('Architecture', 'Engineering & Technology', 'Architecture', 'Bachelor', 'Architectural design, urban planning, and building technology.', '5 years'),

-- Medicine & Health Sciences
('MBBS (Bachelor of Medicine, Bachelor of Surgery)', 'Medicine & Health Sciences', 'Medicine', 'Bachelor', 'Clinical medicine and surgery training.', '6 years'),
('Nursing', 'Medicine & Health Sciences', 'Nursing', 'Bachelor', 'Patient care, clinical nursing, and healthcare management.', '4 years'),
('Pharmacy', 'Medicine & Health Sciences', 'Pharmacy', 'Bachelor', 'Pharmaceutical sciences and drug development.', '4 years'),
('Public Health', 'Medicine & Health Sciences', 'Public Health', 'Master', 'Epidemiology, health policy, and community health.', '2 years'),
('Traditional Chinese Medicine', 'Medicine & Health Sciences', 'Traditional Medicine', 'Bachelor', 'TCM theory, acupuncture, and herbal medicine.', '5 years'),

-- Arts & Humanities
('Chinese Language & Literature', 'Arts & Humanities', 'Languages', 'Bachelor', 'Chinese language, literature, and cultural studies.', '4 years'),
('English Language & Literature', 'Arts & Humanities', 'Languages', 'Bachelor', 'English linguistics, literature, and translation.', '4 years'),
('International Relations', 'Arts & Humanities', 'Political Science', 'Bachelor', 'Global politics, diplomacy, and international affairs.', '4 years'),
('Journalism & Communication', 'Arts & Humanities', 'Media Studies', 'Bachelor', 'Media production, journalism, and mass communication.', '4 years'),
('Law', 'Arts & Humanities', 'Law', 'Bachelor', 'Legal systems, constitutional law, and jurisprudence.', '4 years'),

-- Natural Sciences
('Mathematics', 'Natural Sciences', 'Mathematics', 'Bachelor', 'Pure and applied mathematics, statistics, and analysis.', '4 years'),
('Physics', 'Natural Sciences', 'Physics', 'Bachelor', 'Classical and modern physics, quantum mechanics.', '4 years'),
('Chemistry', 'Natural Sciences', 'Chemistry', 'Bachelor', 'Organic, inorganic, and physical chemistry.', '4 years'),
('Biology', 'Natural Sciences', 'Biology', 'Bachelor', 'Molecular biology, genetics, and ecology.', '4 years'),
('Environmental Science', 'Natural Sciences', 'Environmental Science', 'Bachelor', 'Environmental protection, sustainability, and conservation.', '4 years'),

-- Education
('Education', 'Education', 'General Education', 'Bachelor', 'Teaching methodologies and educational psychology.', '4 years'),
('TESOL (Teaching English to Speakers of Other Languages)', 'Education', 'Language Education', 'Master', 'English language teaching and curriculum development.', '2 years')

ON CONFLICT (title) DO NOTHING;

-- 5. Create a view for easy querying of university programs with catalog info
CREATE OR REPLACE VIEW v_university_programs_full AS
SELECT 
    up.id,
    up.university_id,
    u.name as university_name,
    u.city,
    u.province,
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
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- 6. Add comments for documentation
COMMENT ON TABLE program_catalog IS 'Master catalog of standardized academic programs';
COMMENT ON TABLE university_programs IS 'University-specific program offerings linked to the program catalog';
COMMENT ON COLUMN program_catalog.category IS 'Main category: Business & Management, Engineering & Technology, Medicine & Health Sciences, etc.';
COMMENT ON COLUMN program_catalog.field IS 'Specific field within the category';
COMMENT ON COLUMN university_programs.custom_title IS 'University can use their own name for the program (optional)';
COMMENT ON VIEW v_university_programs_full IS 'Complete view of university programs with catalog and university information';

-- =====================================================
-- MIGRATION NOTES:
-- =====================================================
-- After running this migration:
-- 1. Migrate existing programs data from old 'programs' table to new structure
-- 2. Update admin UI to use program catalog selection
-- 3. Update public pages to use new view
-- 4. Add program catalog management page in admin
-- =====================================================
