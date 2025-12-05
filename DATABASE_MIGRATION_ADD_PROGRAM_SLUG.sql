-- =====================================================
-- ADD SLUG TO UNIVERSITY PROGRAMS
-- =====================================================
-- This migration adds slug support to university_programs
-- Format: program-name-university-name
-- =====================================================

-- 1. Add slug column to university_programs table
ALTER TABLE university_programs 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Create function to generate slug from program title and university name
CREATE OR REPLACE FUNCTION generate_program_slug(
    program_title TEXT,
    university_name TEXT
) RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Combine program title and university name
    base_slug := LOWER(TRIM(program_title || ' ' || university_name));
    
    -- Replace spaces and special characters with hyphens
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading/trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Ensure uniqueness
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM university_programs WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 3. Create function to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION set_program_slug()
RETURNS TRIGGER AS $$
DECLARE
    prog_title TEXT;
    univ_name TEXT;
BEGIN
    -- Get program title from catalog
    SELECT title INTO prog_title
    FROM program_catalog
    WHERE id = NEW.program_catalog_id;
    
    -- Get university name
    SELECT name INTO univ_name
    FROM universities
    WHERE id = NEW.university_id;
    
    -- Generate slug if not provided or if key fields changed
    IF NEW.slug IS NULL OR 
       (TG_OP = 'UPDATE' AND (
           OLD.program_catalog_id IS DISTINCT FROM NEW.program_catalog_id OR
           OLD.university_id IS DISTINCT FROM NEW.university_id
       )) THEN
        NEW.slug := generate_program_slug(
            COALESCE(NEW.custom_title, prog_title),
            univ_name
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger
DROP TRIGGER IF EXISTS trigger_set_program_slug ON university_programs;
CREATE TRIGGER trigger_set_program_slug
    BEFORE INSERT OR UPDATE ON university_programs
    FOR EACH ROW
    EXECUTE FUNCTION set_program_slug();

-- 5. Generate slugs for existing records
UPDATE university_programs up
SET slug = generate_program_slug(
    COALESCE(up.custom_title, pc.title),
    u.name
)
FROM program_catalog pc, universities u
WHERE up.program_catalog_id = pc.id
  AND up.university_id = u.id
  AND up.slug IS NULL;

-- 6. Update the view to include slug
-- Drop the existing view first to avoid column order issues
DROP VIEW IF EXISTS v_university_programs_full;

CREATE VIEW v_university_programs_full AS
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

-- 7. Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_university_programs_slug ON university_programs(slug);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Now programs can be accessed via:
-- /programs/computer-science-tsinghua-university
-- instead of:
-- /programs/820d4cdc-0bb6-491b-8eb8-7b86784f96a9
-- =====================================================
