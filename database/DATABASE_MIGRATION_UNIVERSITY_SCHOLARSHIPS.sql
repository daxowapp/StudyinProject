-- Migration: University-Specific Scholarships
-- Each university can define its own scholarship types with custom benefits

-- Drop existing scholarship_types table if it exists
DROP TABLE IF EXISTS scholarship_applications CASCADE;
DROP TABLE IF EXISTS scholarship_types CASCADE;

-- Create university_scholarships table
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

-- Create index for faster queries
CREATE INDEX idx_university_scholarships_university ON university_scholarships(university_id);
CREATE INDEX idx_university_scholarships_active ON university_scholarships(is_active);

-- Create scholarship applications table
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

-- Create indexes
CREATE INDEX idx_scholarship_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX idx_scholarship_applications_status ON scholarship_applications(application_status);
CREATE INDEX idx_scholarship_applications_student_email ON scholarship_applications(student_email);

-- Enable Row Level Security
ALTER TABLE university_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for university_scholarships
CREATE POLICY "Public can view active scholarships"
    ON university_scholarships FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage scholarships"
    ON university_scholarships FOR ALL
    USING (true)
    WITH CHECK (true);

-- RLS Policies for scholarship_applications
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

-- Add comments
COMMENT ON TABLE university_scholarships IS 'University-specific scholarship types with custom benefits';
COMMENT ON TABLE scholarship_applications IS 'Student applications for university scholarships';

-- Example data for Ningbo University (you'll need to get the actual university_id)
-- Replace 'YOUR_UNIVERSITY_ID' with actual UUID from universities table

-- Example for University 1 (with many types)
/*
INSERT INTO university_scholarships (
    university_id, type_name, display_name, description,
    tuition_coverage_percentage, duration_years,
    includes_accommodation, accommodation_type,
    includes_stipend, stipend_amount_monthly, stipend_duration_months,
    service_fee_usd, service_fee_cny, display_order
) VALUES
-- Type A: Full package
('YOUR_UNIVERSITY_ID', 'Type A', 'Type A: Full Scholarship with Stipend', 
 'Free tuition, free accommodation on campus and 2500RMB/month stipend for 12 months',
 100, 4, true, 'Free university dormitory', 
 true, 2500, 12, 3500, 25000, 1),

-- Type B: Tuition + Accommodation
('YOUR_UNIVERSITY_ID', 'Type B', 'Type B: Full Scholarship with Accommodation', 
 'Free tuition, free accommodation on campus',
 100, 4, true, 'Free university dormitory', 
 false, null, null, 2800, 20000, 2),

-- Type C: Tuition only (4 years)
('YOUR_UNIVERSITY_ID', 'Type C', 'Type C: Full Tuition Scholarship', 
 'Free tuition',
 100, 4, false, null, 
 false, null, null, 2200, 16000, 3),

-- Type D: Tuition + Accommodation (1 year)
('YOUR_UNIVERSITY_ID', 'Type D', 'Type D: One Year Scholarship with Accommodation', 
 'Free tuition, free accommodation on campus',
 100, 1, true, 'Free university dormitory', 
 false, null, null, 2000, 14000, 4),

-- Type E: Tuition only (1 year)
('YOUR_UNIVERSITY_ID', 'Type E', 'Type E: One Year Tuition Scholarship', 
 'Free tuition',
 100, 1, false, null, 
 false, null, null, 1800, 13000, 5),

-- Type F: 50% off (1 year)
('YOUR_UNIVERSITY_ID', 'Type F', 'Type F: 50% Tuition Discount', 
 '50% off tuition fee',
 50, 1, false, null, 
 false, null, null, 1500, 11000, 6),

-- Type G: 25% off (1 year)
('YOUR_UNIVERSITY_ID', 'Type G', 'Type G: 25% Tuition Discount', 
 '25% off tuition fee',
 25, 1, false, null, 
 false, null, null, 1200, 8500, 7),

-- Type H: One-time allowance
('YOUR_UNIVERSITY_ID', 'Type H', 'Type H: Cash Allowance', 
 'RMB 10,000 one-time allowance',
 0, 1, false, null, 
 false, null, null, 1000, 7000, 8);
*/

-- Example for University 2 (simple package)
/*
INSERT INTO university_scholarships (
    university_id, type_name, display_name, description,
    tuition_coverage_percentage, duration_years,
    includes_accommodation, accommodation_type,
    includes_stipend, stipend_amount_monthly, stipend_duration_months,
    includes_medical_insurance,
    service_fee_usd, service_fee_cny, display_order
) VALUES
('ANOTHER_UNIVERSITY_ID', 'Full Scholarship', 'Full Scholarship Package', 
 'Free tuition, free university dormitory or accommodation allowance, stipend (1500CNY/Month), medical insurance',
 100, 4, true, 'Free university dormitory or accommodation allowance', 
 true, 1500, 12, true, 3000, 21000, 1);
*/

-- Example for University 3 (percentage-based)
/*
INSERT INTO university_scholarships (
    university_id, type_name, display_name, description,
    tuition_coverage_percentage, duration_years,
    service_fee_usd, service_fee_cny, display_order
) VALUES
('THIRD_UNIVERSITY_ID', 'Type A', 'Type A: Full Tuition Coverage', 
 'Free tuition (4 years)', 100, 4, 3500, 25000, 1),
 
('THIRD_UNIVERSITY_ID', 'Type B', 'Type B: 50% Tuition Coverage', 
 'Cover 50% off tuition fee (4 years)', 50, 4, 2500, 18000, 2),
 
('THIRD_UNIVERSITY_ID', 'Type C', 'Type C: 30% Tuition Coverage', 
 'Cover 30% off tuition fee (4 years)', 30, 4, 2000, 14000, 3),
 
('THIRD_UNIVERSITY_ID', 'Type D', 'Type D: 20% Tuition Coverage', 
 'Cover 20% off tuition fee (4 years)', 20, 4, 1800, 13000, 4);
*/
