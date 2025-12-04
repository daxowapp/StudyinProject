-- Create scholarship types table
CREATE TABLE IF NOT EXISTS scholarship_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g., "Type A", "Type B", "Type C"
    display_name VARCHAR(200), -- e.g., "Full Scholarship (Type A)"
    description TEXT,
    tuition_coverage_percentage INTEGER NOT NULL, -- e.g., 50, 75, 100
    service_fee_usd DECIMAL(10, 2), -- Service fee in USD
    service_fee_cny DECIMAL(10, 2), -- Service fee in CNY
    includes_accommodation BOOLEAN DEFAULT false,
    includes_stipend BOOLEAN DEFAULT false,
    stipend_amount_monthly DECIMAL(10, 2),
    benefits JSONB, -- Array of additional benefits
    requirements JSONB, -- Array of requirements
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarship applications table
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_type_id UUID REFERENCES scholarship_types(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    program_id UUID REFERENCES university_programs(id) ON DELETE SET NULL,
    student_name VARCHAR(200) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50),
    nationality VARCHAR(100),
    passport_number VARCHAR(100),
    date_of_birth DATE,
    highest_education VARCHAR(100),
    gpa DECIMAL(4, 2),
    english_proficiency VARCHAR(50),
    application_documents JSONB, -- Store document URLs
    personal_statement TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, under_review, approved, rejected
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default scholarship types based on the images
INSERT INTO scholarship_types (name, display_name, description, tuition_coverage_percentage, service_fee_usd, service_fee_cny, includes_accommodation, includes_stipend, benefits, requirements, display_order) VALUES
(
    'Type A',
    'Full Scholarship (Type A)',
    'Covers 100% of tuition fees. Best option for students seeking complete tuition coverage.',
    100,
    3500.00,
    25000.00,
    false,
    false,
    '["100% tuition coverage", "Application support", "Visa assistance", "Pre-departure guidance"]'::jsonb,
    '["Valid passport", "High school certificate (translated)", "Transcript (translated)", "English certificate", "Personal statement", "Photo"]'::jsonb,
    1
),
(
    'Type B',
    'Partial Scholarship (Type B)',
    'Covers 75% of tuition fees. Great balance between scholarship coverage and service fees.',
    75,
    2800.00,
    20000.00,
    false,
    false,
    '["75% tuition coverage", "Application support", "Visa assistance", "Pre-departure guidance"]'::jsonb,
    '["Valid passport", "High school certificate (translated)", "Transcript (translated)", "English certificate", "Personal statement", "Photo"]'::jsonb,
    2
),
(
    'Type C',
    'Half Scholarship (Type C)',
    'Covers 50% of tuition fees. Affordable option with significant tuition reduction.',
    50,
    2200.00,
    16000.00,
    false,
    false,
    '["50% tuition coverage", "Application support", "Visa assistance", "Pre-departure guidance"]'::jsonb,
    '["Valid passport", "High school certificate (translated)", "Transcript (translated)", "English certificate", "Personal statement", "Photo"]'::jsonb,
    3
),
(
    'Self-Funded',
    'Self-Funded (No Scholarship)',
    'No scholarship coverage. Pay full tuition with minimal service fees.',
    0,
    1500.00,
    11000.00,
    false,
    false,
    '["Application support", "Visa assistance", "Pre-departure guidance", "Accommodation arrangement"]'::jsonb,
    '["Valid passport", "High school certificate (translated)", "Transcript (translated)", "English certificate", "Photo"]'::jsonb,
    4
);

-- Create indexes
CREATE INDEX idx_scholarship_types_active ON scholarship_types(is_active);
CREATE INDEX idx_scholarship_types_order ON scholarship_types(display_order);
CREATE INDEX idx_scholarship_applications_status ON scholarship_applications(status);
CREATE INDEX idx_scholarship_applications_student_email ON scholarship_applications(student_email);
CREATE INDEX idx_scholarship_applications_university ON scholarship_applications(university_id);
CREATE INDEX idx_scholarship_applications_program ON scholarship_applications(program_id);

-- Add RLS policies
ALTER TABLE scholarship_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Public can view active scholarship types
CREATE POLICY "Public can view active scholarship types"
    ON scholarship_types FOR SELECT
    USING (is_active = true);

-- Anyone can insert scholarship applications
CREATE POLICY "Anyone can submit scholarship applications"
    ON scholarship_applications FOR INSERT
    WITH CHECK (true);

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
    ON scholarship_applications FOR SELECT
    USING (student_email = current_user);

COMMENT ON TABLE scholarship_types IS 'Different types of scholarships available (Type A, B, C, Self-Funded)';
COMMENT ON TABLE scholarship_applications IS 'Student scholarship applications';
COMMENT ON COLUMN scholarship_types.tuition_coverage_percentage IS 'Percentage of tuition covered (0-100)';
COMMENT ON COLUMN scholarship_types.service_fee_usd IS 'Service fee charged in USD';
COMMENT ON COLUMN scholarship_types.service_fee_cny IS 'Service fee charged in CNY';
