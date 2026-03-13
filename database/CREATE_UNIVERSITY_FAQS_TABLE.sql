-- University FAQs table for storing AI-generated FAQ Q&A pairs per university per locale
CREATE TABLE IF NOT EXISTS university_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    locale TEXT NOT NULL DEFAULT 'en',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(university_id, locale, display_order)
);

-- Index for efficient lookup by university + locale
CREATE INDEX IF NOT EXISTS idx_university_faqs_lookup ON university_faqs(university_id, locale);

-- Enable RLS
ALTER TABLE university_faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "University FAQs are publicly readable"
    ON university_faqs FOR SELECT
    USING (true);

-- Allow service role full access
CREATE POLICY "Service role can manage university FAQs"
    ON university_faqs FOR ALL
    USING (true)
    WITH CHECK (true);
