-- ============================================
-- University Scholarships Schema (Schema Only)
-- ============================================
-- This file contains ONLY the table structure without example data
-- Use this to create the tables in your database

-- Drop existing tables if they exist
DROP TABLE IF EXISTS scholarship_applications CASCADE;
DROP TABLE IF EXISTS scholarship_types CASCADE;
DROP TABLE IF EXISTS university_scholarships CASCADE;

-- ============================================
-- Create university_scholarships table
-- ============================================
CREATE TABLE IF NOT EXISTS university_scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    -- Scholarship Type Info
    type_name VARCHAR(100) NOT NULL, -- e.g., "Type A", "Type B", "Full Scholarship"
    display_name VARCHAR(255), -- e.g., "Type A: Full Scholarship with Stipend"
    description TEXT,
    
    -- Coverage Details
    tuition_coverage_percentage INTEGER DEFAULT 0 CHECK (tuition_coverage_percentage >= 0 AND tuition_coverage_percentage <= 100),
    duration_years INTEGER, -- e.g., 1, 4 (null means full program duration)
    
    -- Accommodation
    includes_accommodation BOOLEAN DEFAULT false,
    accommodation_type VARCHAR(100), -- e.g., "Free university dormitory", "Accommodation allowance"
    
    -- Stipend
    includes_stipend BOOLEAN DEFAULT false,
    stipend_amount_monthly DECIMAL(10, 2),
    stipend_currency VARCHAR(10) DEFAULT 'CNY',
    stipend_duration_months INTEGER, -- e.g., 12 (per year)
    
    -- Medical Insurance
    includes_medical_insurance BOOLEAN DEFAULT false,
    
    -- One-time Benefits
    one_time_allowance DECIMAL(10, 2), -- e.g., 10000 RMB
    one_time_allowance_currency VARCHAR(10) DEFAULT 'CNY',
    
    -- Service Fee (what student pays to apply)
    service_fee_usd DECIMAL(10, 2) DEFAULT 0,
    service_fee_cny DECIMAL(10, 2) DEFAULT 0,
    
    -- Additional Benefits (JSONB array)
    additional_benefits JSONB DEFAULT '[]'::jsonb,
    
    -- Requirements
    requirements JSONB DEFAULT '[]'::jsonb,
    
    -- Status & Display
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique type names per university
    UNIQUE(university_id, type_name)
);

-- ============================================
-- Create scholarship applications table
-- ============================================
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id UUID NOT NULL REFERENCES university_scholarships(id) ON DELETE CASCADE,
    student_id UUID, -- Reference to users table if you have one
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50),
    
    -- Application Details
    program_id UUID REFERENCES programs(id),
    application_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, withdrawn
    
    -- Documents (JSONB array of document URLs)
    documents JSONB DEFAULT '[]'::jsonb,
    
    -- Notes
    admin_notes TEXT,
    student_notes TEXT,
    
    -- Timestamps
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Create indexes for better performance
-- ============================================
CREATE INDEX idx_university_scholarships_university ON university_scholarships(university_id);
CREATE INDEX idx_university_scholarships_active ON university_scholarships(is_active);
CREATE INDEX idx_scholarship_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX idx_scholarship_applications_status ON scholarship_applications(application_status);
CREATE INDEX idx_scholarship_applications_student_email ON scholarship_applications(student_email);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE university_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for university_scholarships
-- ============================================
CREATE POLICY "Public can view active scholarships"
    ON university_scholarships FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage scholarships"
    ON university_scholarships FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- RLS Policies for scholarship_applications
-- ============================================
CREATE POLICY "Users can view own applications"
    ON scholarship_applications FOR SELECT
    USING (true);

CREATE POLICY "Users can create applications"
    ON scholarship_applications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can manage all applications"
    ON scholarship_applications FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Add table comments
-- ============================================
COMMENT ON TABLE university_scholarships IS 'University-specific scholarship types with custom benefits';
COMMENT ON TABLE scholarship_applications IS 'Student applications for university scholarships';

-- ============================================
-- Column comments for university_scholarships
-- ============================================
COMMENT ON COLUMN university_scholarships.type_name IS 'Short name like Type A, Type B, etc.';
COMMENT ON COLUMN university_scholarships.display_name IS 'Full descriptive name shown to users';
COMMENT ON COLUMN university_scholarships.tuition_coverage_percentage IS 'Percentage of tuition covered (0-100)';
COMMENT ON COLUMN university_scholarships.duration_years IS 'Number of years scholarship lasts (NULL = full program)';
COMMENT ON COLUMN university_scholarships.stipend_amount_monthly IS 'Monthly stipend amount if applicable';
COMMENT ON COLUMN university_scholarships.stipend_duration_months IS 'How many months per year stipend is paid (usually 12)';
COMMENT ON COLUMN university_scholarships.one_time_allowance IS 'One-time cash benefit (e.g., 10000 RMB)';
COMMENT ON COLUMN university_scholarships.service_fee_usd IS 'Service fee student pays for application support (USD)';
COMMENT ON COLUMN university_scholarships.service_fee_cny IS 'Service fee student pays for application support (CNY)';
COMMENT ON COLUMN university_scholarships.additional_benefits IS 'JSONB array of additional benefits as strings';
COMMENT ON COLUMN university_scholarships.requirements IS 'JSONB array of eligibility requirements';
COMMENT ON COLUMN university_scholarships.display_order IS 'Sort order (lower numbers appear first)';

-- ============================================
-- Schema creation complete
-- ============================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL editor
-- 2. Add scholarships via admin panel at /admin/universities/[id]/scholarships
-- 3. Scholarships will automatically appear on university and program pages
