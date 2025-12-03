-- =====================================================
-- APPLICATIONS SYSTEM - Database Schema
-- =====================================================
-- This adds the complete application system to the database
-- =====================================================

-- Drop existing tables if they exist (CASCADE will drop all policies and dependencies)
DROP TABLE IF EXISTS application_status_history CASCADE;
DROP TABLE IF EXISTS application_documents CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

-- =====================================================
-- 1. APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    university_program_id UUID NOT NULL REFERENCES university_programs(id) ON DELETE RESTRICT,
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_documents, pending_payment, submitted, under_review, accepted, rejected, withdrawn
    
    -- Student Information
    student_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50),
    student_country VARCHAR(100),
    student_passport VARCHAR(100),
    
    -- Application Details
    preferred_intake VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    
    -- Payment Information
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded, waived
    payment_amount DECIMAL(10, 2),
    payment_currency VARCHAR(10) DEFAULT 'RMB',
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50), -- credit_card, bank_transfer, wechat, alipay, etc.
    
    -- Document Upload Status
    documents_complete BOOLEAN DEFAULT false,
    documents_verified BOOLEAN DEFAULT false,
    documents_verified_at TIMESTAMP WITH TIME ZONE,
    documents_verified_by UUID,
    
    -- Admin Notes
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    decision_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. APPLICATION DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES admission_requirements_catalog(id) ON DELETE RESTRICT,
    
    -- Document Information
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100), -- passport, transcript, certificate, photo, etc.
    file_url TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    file_type VARCHAR(50), -- pdf, jpg, png, etc.
    
    -- Verification Status
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    verification_notes TEXT,
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. APPLICATION STATUS HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    -- Status Change
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID,
    change_reason TEXT,
    notes TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_program ON applications(university_program_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_payment_status ON applications(payment_status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_application_documents_application ON application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_application_documents_requirement ON application_documents(requirement_id);
CREATE INDEX IF NOT EXISTS idx_application_documents_verified ON application_documents(is_verified);

CREATE INDEX IF NOT EXISTS idx_application_status_history_application ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_application_status_history_created_at ON application_status_history(created_at DESC);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- Students can view and manage their own applications
CREATE POLICY "Students can view own applications" 
    ON applications FOR SELECT 
    USING (auth.uid() = student_id);

CREATE POLICY "Students can create own applications" 
    ON applications FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own draft applications" 
    ON applications FOR UPDATE 
    USING (auth.uid() = student_id AND status IN ('draft', 'pending_documents', 'pending_payment'));

-- Students can manage their own documents
CREATE POLICY "Students can view own documents" 
    ON application_documents FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM applications 
        WHERE applications.id = application_documents.application_id 
        AND applications.student_id = auth.uid()
    ));

CREATE POLICY "Students can upload own documents" 
    ON application_documents FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM applications 
        WHERE applications.id = application_documents.application_id 
        AND applications.student_id = auth.uid()
    ));

CREATE POLICY "Students can delete own unverified documents" 
    ON application_documents FOR DELETE 
    USING (
        is_verified = false 
        AND EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_documents.application_id 
            AND applications.student_id = auth.uid()
        )
    );

-- Students can view their own status history
CREATE POLICY "Students can view own status history" 
    ON application_status_history FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM applications 
        WHERE applications.id = application_status_history.application_id 
        AND applications.student_id = auth.uid()
    ));

-- Admins can view and manage all applications (adjust based on your admin role setup)
CREATE POLICY "Admins can manage all applications" 
    ON applications FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Admins can manage all documents" 
    ON application_documents FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Admins can manage all status history" 
    ON application_status_history FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- =====================================================
-- 6. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for applications table
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO application_status_history (
            application_id,
            old_status,
            new_status,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log status changes
CREATE TRIGGER log_application_status_change_trigger
    AFTER UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION log_application_status_change();

-- =====================================================
-- 7. VIEWS
-- =====================================================

-- View for complete application information
CREATE OR REPLACE VIEW v_applications_full AS
SELECT 
    a.id,
    a.student_id,
    a.student_email,
    a.student_name,
    a.status,
    a.payment_status,
    a.payment_amount,
    a.payment_currency,
    a.documents_complete,
    a.submitted_at,
    a.created_at,
    
    -- University Program Info
    up.id as program_id,
    up.slug as program_slug,
    up.tuition_fee,
    up.application_fee,
    up.service_fee,
    up.force_payment,
    up.intake,
    
    -- Program Catalog Info
    pc.title as program_title,
    pc.level as program_level,
    pc.category as program_category,
    
    -- University Info
    u.id as university_id,
    u.name as university_name,
    u.slug as university_slug,
    u.city,
    u.province,
    u.logo_url as university_logo,
    
    -- Language Info
    l.name as language_name,
    l.code as language_code
FROM applications a
JOIN university_programs up ON a.university_program_id = up.id
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- =====================================================
-- 8. TABLE COMMENTS
-- =====================================================
COMMENT ON TABLE applications IS 'Student applications to university programs';
COMMENT ON TABLE application_documents IS 'Documents uploaded for applications';
COMMENT ON TABLE application_status_history IS 'History of application status changes';

COMMENT ON COLUMN applications.status IS 'Application status: draft, pending_documents, pending_payment, submitted, under_review, accepted, rejected, withdrawn';
COMMENT ON COLUMN applications.payment_status IS 'Payment status: pending, paid, refunded, waived';

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
