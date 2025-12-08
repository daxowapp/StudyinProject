-- =====================================================
-- REFUND REQUESTS SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL, -- For easier RLS
    
    -- Request Details
    reason TEXT NOT NULL,
    amount DECIMAL(10, 2), -- Optional, in case partial refund
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    
    -- Admin Response
    admin_response TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Prevent multiple active requests for the same application
    UNIQUE(application_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_refund_requests_application ON refund_requests(application_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_student ON refund_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);

-- Enable RLS
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Students can view their own requests
CREATE POLICY "Students can view own refund requests" 
    ON refund_requests FOR SELECT 
    USING (auth.uid() = student_id);

-- Students can create requests for their own applications
CREATE POLICY "Students can create refund requests" 
    ON refund_requests FOR INSERT 
    WITH CHECK (
        auth.uid() = student_id 
        AND EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = refund_requests.application_id 
            AND applications.student_id = auth.uid()
        )
    );

-- Admins can view and manage all requests
CREATE POLICY "Admins can manage all refund requests" 
    ON refund_requests FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_refund_requests_updated_at 
    BEFORE UPDATE ON refund_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify creation
DO $$
BEGIN
    RAISE NOTICE 'Refund requests table created successfully';
END $$;
