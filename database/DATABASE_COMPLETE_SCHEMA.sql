-- =====================================================
-- COMPLETE DATABASE SCHEMA - StudyAtChina Platform
-- =====================================================
-- This file contains ALL table schemas without sample data
-- Run this in your Supabase SQL Editor to create the complete database structure
-- =====================================================

-- =====================================================
-- 1. UNIVERSITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_local VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    city VARCHAR(100),
    province VARCHAR(100),
    website TEXT,
    description TEXT,
    logo_url TEXT,
    cover_photo_url TEXT,
    founded VARCHAR(50),
    total_students VARCHAR(50),
    international_students VARCHAR(50),
    ranking VARCHAR(100),
    features TEXT[],
    video_url TEXT,
    gallery_images TEXT[],
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for universities
CREATE INDEX IF NOT EXISTS idx_universities_slug ON universities(slug);
CREATE INDEX IF NOT EXISTS idx_universities_location ON universities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_universities_city ON universities(city);

-- =====================================================
-- 2. LANGUAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PROGRAM CATALOG SYSTEM
-- =====================================================

-- Program Catalog (Master list of programs)
CREATE TABLE IF NOT EXISTS program_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    field VARCHAR(100),
    level VARCHAR(50) NOT NULL,
    description TEXT,
    typical_duration VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- University Programs (University-specific offerings)
CREATE TABLE IF NOT EXISTS university_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    program_catalog_id UUID NOT NULL REFERENCES program_catalog(id) ON DELETE RESTRICT,
    slug VARCHAR(255) UNIQUE,
    custom_title VARCHAR(255),
    tuition_fee DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'RMB',
    duration VARCHAR(50),
    language_id UUID REFERENCES languages(id),
    intake VARCHAR(100),
    scholarship_chance VARCHAR(50),
    application_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    force_payment BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(university_id, program_catalog_id)
);

-- Indexes for programs
CREATE INDEX IF NOT EXISTS idx_program_catalog_category ON program_catalog(category);
CREATE INDEX IF NOT EXISTS idx_program_catalog_level ON program_catalog(level);
CREATE INDEX IF NOT EXISTS idx_university_programs_university ON university_programs(university_id);
CREATE INDEX IF NOT EXISTS idx_university_programs_catalog ON university_programs(program_catalog_id);
CREATE INDEX IF NOT EXISTS idx_university_programs_active ON university_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_university_programs_slug ON university_programs(slug);

-- View for complete program information
CREATE OR REPLACE VIEW v_university_programs_full AS
SELECT 
    up.id,
    up.slug,
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

-- =====================================================
-- 4. ADMISSION REQUIREMENTS SYSTEM
-- =====================================================

-- Admission Requirements Catalog (Master list)
CREATE TABLE IF NOT EXISTS admission_requirements_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'academic', 'language', 'document', 'financial', 'other'
    requirement_type VARCHAR(50) NOT NULL, -- 'bachelor', 'master', 'phd', 'all'
    description TEXT NOT NULL,
    is_common BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- University-specific admission requirements
CREATE TABLE IF NOT EXISTS university_admission_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES admission_requirements_catalog(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    custom_note TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(university_id, requirement_id)
);

-- Indexes for admission requirements
CREATE INDEX IF NOT EXISTS idx_admission_requirements_category ON admission_requirements_catalog(category);
CREATE INDEX IF NOT EXISTS idx_admission_requirements_type ON admission_requirements_catalog(requirement_type);
CREATE INDEX IF NOT EXISTS idx_university_admission_university ON university_admission_requirements(university_id);
CREATE INDEX IF NOT EXISTS idx_university_admission_requirement ON university_admission_requirements(requirement_id);

-- View for admission requirements
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

-- =====================================================
-- 5. UNIVERSITY SCHOLARSHIPS SYSTEM
-- =====================================================

-- University-specific scholarships
CREATE TABLE IF NOT EXISTS university_scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    -- Scholarship Type Info
    type_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    description TEXT,
    
    -- Coverage Details
    tuition_coverage_percentage INTEGER DEFAULT 0 CHECK (tuition_coverage_percentage >= 0 AND tuition_coverage_percentage <= 100),
    duration_years INTEGER,
    
    -- Accommodation
    includes_accommodation BOOLEAN DEFAULT false,
    accommodation_type VARCHAR(100),
    
    -- Stipend
    includes_stipend BOOLEAN DEFAULT false,
    stipend_amount_monthly DECIMAL(10, 2),
    stipend_currency VARCHAR(10) DEFAULT 'CNY',
    stipend_duration_months INTEGER,
    
    -- Medical Insurance
    includes_medical_insurance BOOLEAN DEFAULT false,
    
    -- One-time Benefits
    one_time_allowance DECIMAL(10, 2),
    one_time_allowance_currency VARCHAR(10) DEFAULT 'CNY',
    
    -- Service Fee
    service_fee_usd DECIMAL(10, 2) DEFAULT 0,
    service_fee_cny DECIMAL(10, 2) DEFAULT 0,
    
    -- Additional Benefits
    additional_benefits JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    
    -- Status & Display
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(university_id, type_name)
);

-- Scholarship Applications
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id UUID NOT NULL REFERENCES university_scholarships(id) ON DELETE CASCADE,
    student_id UUID,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50),
    program_id UUID REFERENCES university_programs(id),
    application_status VARCHAR(50) DEFAULT 'pending',
    documents JSONB DEFAULT '[]'::jsonb,
    admin_notes TEXT,
    student_notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for scholarships
CREATE INDEX IF NOT EXISTS idx_university_scholarships_university ON university_scholarships(university_id);
CREATE INDEX IF NOT EXISTS idx_university_scholarships_active ON university_scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_status ON scholarship_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_student_email ON scholarship_applications(student_email);

-- =====================================================
-- 6. ARTICLES/BLOG SYSTEM (Optional)
-- =====================================================

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID,
    category VARCHAR(100),
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_requirements_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_admission_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read policies (adjust based on your needs)
CREATE POLICY "Public can view universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Public can view program catalog" ON program_catalog FOR SELECT USING (true);
CREATE POLICY "Public can view active programs" ON university_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view requirements" ON admission_requirements_catalog FOR SELECT USING (true);
CREATE POLICY "Public can view university requirements" ON university_admission_requirements FOR SELECT USING (true);
CREATE POLICY "Public can view active scholarships" ON university_scholarships FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published articles" ON articles FOR SELECT USING (is_published = true);

-- Admin policies (you'll need to adjust these based on your auth setup)
CREATE POLICY "Admins can manage universities" ON universities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage program catalog" ON program_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage programs" ON university_programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage requirements" ON admission_requirements_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage university requirements" ON university_admission_requirements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage scholarships" ON university_scholarships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage applications" ON scholarship_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 8. TABLE COMMENTS
-- =====================================================

COMMENT ON TABLE universities IS 'Universities offering programs in China';
COMMENT ON TABLE program_catalog IS 'Master catalog of standardized academic programs';
COMMENT ON TABLE university_programs IS 'University-specific program offerings';
COMMENT ON TABLE admission_requirements_catalog IS 'Master list of admission requirements';
COMMENT ON TABLE university_admission_requirements IS 'University-specific admission requirements';
COMMENT ON TABLE university_scholarships IS 'University-specific scholarship types with custom benefits';
COMMENT ON TABLE scholarship_applications IS 'Student applications for university scholarships';
COMMENT ON TABLE articles IS 'Blog articles and news content';

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Insert initial data (languages, program catalog, admission requirements)
-- 2. Add universities via admin panel
-- 3. Add programs for each university
-- 4. Configure admission requirements per university
-- 5. Add scholarship types per university
-- =====================================================
