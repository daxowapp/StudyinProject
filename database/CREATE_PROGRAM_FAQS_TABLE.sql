-- ============================================================
-- CREATE PROGRAM FAQS TABLE
-- ============================================================
-- Stores AI-generated FAQ question/answer pairs for each program.
-- Used for SEO (Google), GEO (location search), and AEO (AI answer engines).
-- ============================================================

-- Create the table
CREATE TABLE IF NOT EXISTS program_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES university_programs(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by program
CREATE INDEX IF NOT EXISTS idx_program_faqs_program_id ON program_faqs(program_id);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_program_faqs_display_order ON program_faqs(program_id, display_order);

-- Enable RLS
ALTER TABLE program_faqs ENABLE ROW LEVEL SECURITY;

-- Public read access (FAQs should be visible to everyone on program pages)
CREATE POLICY "program_faqs_public_read"
    ON program_faqs
    FOR SELECT
    USING (true);

-- Admin write access (only admins can insert/update/delete FAQs)
CREATE POLICY "program_faqs_admin_insert"
    ON program_faqs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "program_faqs_admin_update"
    ON program_faqs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "program_faqs_admin_delete"
    ON program_faqs
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Service role bypass (for API routes using createAdminClient)
CREATE POLICY "program_faqs_service_role_all"
    ON program_faqs
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_program_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_program_faqs_updated_at
    BEFORE UPDATE ON program_faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_program_faqs_updated_at();
