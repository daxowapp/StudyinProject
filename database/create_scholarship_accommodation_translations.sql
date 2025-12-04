-- ============================================
-- Scholarship, Accommodation & Program Translations
-- ============================================
-- This migration adds translation tables for scholarships, accommodations,
-- and programs to support multi-language content (Arabic, Farsi, Turkish, English)

-- ============================================
-- 1. Scholarship Translations Table
-- ============================================
CREATE TABLE IF NOT EXISTS scholarship_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id UUID NOT NULL REFERENCES university_scholarships(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL, -- 'ar', 'fa', 'tr', 'en'
    
    -- Translatable Fields
    display_name TEXT,
    description TEXT,
    accommodation_type TEXT,
    additional_benefits JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique translation per scholarship per locale
    UNIQUE(scholarship_id, locale)
);

-- Enable RLS
ALTER TABLE scholarship_translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON scholarship_translations
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON scholarship_translations
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_scholarship_translations_updated_at
    BEFORE UPDATE ON scholarship_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Accommodation Translations Table
-- ============================================
CREATE TABLE IF NOT EXISTS accommodation_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL, -- 'ar', 'fa', 'tr', 'en'
    
    -- Translatable Fields
    accommodation_description TEXT,
    accommodation_features JSONB DEFAULT '[]'::jsonb, -- Array of translated feature strings
    accommodation_types JSONB DEFAULT '[]'::jsonb, -- Array of { type, description, features[] }
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique translation per university per locale
    UNIQUE(university_id, locale)
);

-- Enable RLS
ALTER TABLE accommodation_translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON accommodation_translations
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON accommodation_translations
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_accommodation_translations_updated_at
    BEFORE UPDATE ON accommodation_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Program Translations Table
-- ============================================
CREATE TABLE IF NOT EXISTS program_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES university_programs(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL, -- 'ar', 'fa', 'tr', 'en'
    
    -- Translatable Fields
    title TEXT,
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    career_prospects JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique translation per program per locale
    UNIQUE(program_id, locale)
);

-- Enable RLS
ALTER TABLE program_translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON program_translations
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON program_translations
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_program_translations_updated_at
    BEFORE UPDATE ON program_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Add comments for documentation
-- ============================================
COMMENT ON TABLE scholarship_translations IS 'Translations for university scholarships in multiple languages';
COMMENT ON TABLE accommodation_translations IS 'Translations for university accommodation info in multiple languages';
COMMENT ON TABLE program_translations IS 'Translations for university programs in multiple languages';

COMMENT ON COLUMN scholarship_translations.locale IS 'Language code: en, ar, fa, tr';
COMMENT ON COLUMN scholarship_translations.display_name IS 'Translated scholarship display name';
COMMENT ON COLUMN scholarship_translations.description IS 'Translated scholarship description';
COMMENT ON COLUMN scholarship_translations.additional_benefits IS 'Translated array of additional benefits';
COMMENT ON COLUMN scholarship_translations.requirements IS 'Translated array of requirements';

COMMENT ON COLUMN accommodation_translations.locale IS 'Language code: en, ar, fa, tr';
COMMENT ON COLUMN accommodation_translations.accommodation_description IS 'Translated accommodation overview';
COMMENT ON COLUMN accommodation_translations.accommodation_features IS 'Translated array of accommodation features';
COMMENT ON COLUMN accommodation_translations.accommodation_types IS 'Translated array of room types with descriptions';

COMMENT ON COLUMN program_translations.locale IS 'Language code: en, ar, fa, tr';
COMMENT ON COLUMN program_translations.title IS 'Translated program title';
COMMENT ON COLUMN program_translations.description IS 'Translated program description';
COMMENT ON COLUMN program_translations.requirements IS 'Translated array of requirements';
COMMENT ON COLUMN program_translations.career_prospects IS 'Translated array of career prospects';

-- ============================================
-- Create indexes for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_scholarship_translations_scholarship_id 
    ON scholarship_translations(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_translations_locale 
    ON scholarship_translations(locale);

CREATE INDEX IF NOT EXISTS idx_accommodation_translations_university_id 
    ON accommodation_translations(university_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_translations_locale 
    ON accommodation_translations(locale);

CREATE INDEX IF NOT EXISTS idx_program_translations_program_id 
    ON program_translations(program_id);
CREATE INDEX IF NOT EXISTS idx_program_translations_locale 
    ON program_translations(locale);

-- ============================================
-- INSTRUCTIONS:
-- 1. Run this SQL in your Supabase SQL editor
-- 2. The translations will be editable in the admin panel
-- 3. Scholarship translations: /admin/universities/[id]/scholarships
-- 4. Accommodation translations: /admin/universities/[id] (Translations tab)
-- 5. Program translations: /admin/programs/[id] (Translations tab)
-- ============================================

