-- =====================================================
-- EXTRA BACHELOR & LANGUAGE & MASTER PROGRAMS
-- UPC, BIT, SDUTCM, ECUST, OUC, TGU
-- (BASED ON NEW 2026 PDFS)
-- =====================================================

-- =====================================================
-- 1. ENSURE LANGUAGES EXIST
-- =====================================================

INSERT INTO languages (name, code)
SELECT 'English', 'en'
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en');

INSERT INTO languages (name, code)
SELECT 'Chinese', 'zh'
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'zh');

-- =====================================================
-- 2. UPSERT UNIVERSITIES (ONLY NEW ONES)
-- =====================================================

-- Shandong University of Traditional Chinese Medicine (SDUTCM)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'sdutcm',
    'Shandong University of Traditional Chinese Medicine',
    'Jinan',
    'Shandong',
    '245 - 4ICU Ranking',
    'University in Jinan offering English-taught bachelor and master programs in Pharmacy, Nursing, Electronics Information, Biomedical Engineering and related fields.',
    ARRAY['Bachelor intake Sept 2026', 'Master intake Sept 2026']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'sdutcm');

-- East China University of Science and Technology (ECUST)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT
    'ecust',
    'East China University of Science and Technology',
    'Shanghai',
    'Shanghai',
    '44 - Shanghai Ranking',
    '211 / Double First-Class university in Shanghai offering English-taught single and double degree bachelor programs.',
    ARRAY['211', 'Double first-class', 'Bachelor intake Sept 2026']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'ecust');

-- Ocean University of China (OUC)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT
    'ouc',
    'Ocean University of China',
    'Qingdao',
    'Shandong',
    '57 - Shanghai Ranking',
    '985 / 211 / Double First-Class university in Qingdao with English-taught bachelor programs in International Economics and Trade and Computer Science and Technology.',
    ARRAY['985 project', '211', 'Double first-class']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'ouc');

-- Tiangong University (TGU) - Chinese language only
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT
    'tgu',
    'Tiangong University',
    'Tianjin',
    'Tianjin',
    '137 - Shanghai Ranking',
    'Double First-Class university in Tianjin offering a 2026 Chinese language program for international students.',
    ARRAY['Double first-class', 'Chinese language program', 'March 2026 intake']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'tgu');

-- =====================================================
-- 3. EXTEND PROGRAM CATALOG WITH NEW TITLES
-- =====================================================

DO $$
BEGIN
    --------------------------------------------------
    -- UPC - New Bachelor Majors (English-taught)
    --------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Petroleum Engineering', 'Engineering & Technology', 'Petroleum Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Petroleum Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Geology', 'Natural Sciences', 'Geology', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Geology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Resource Exploration Engineering', 'Engineering & Technology', 'Geological Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Resource Exploration Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechanical Design, Manufacturing and Automation', 'Engineering & Technology', 'Mechanical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechanical Design, Manufacturing and Automation');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Big Data Management and Application', 'Engineering & Technology', 'Data Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Big Data Management and Application');

    --------------------------------------------------
    -- SDUTCM - Bachelor
    --------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Data Science and Big Data Technology', 'Engineering & Technology', 'Data Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Data Science and Big Data Technology');

    --------------------------------------------------
    -- BIT (Beijing) - Bachelor (English-taught)
    --------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aeronautical and Astronautical Engineering', 'Engineering & Technology', 'Aerospace Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aeronautical and Astronautical Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechatronics Engineering', 'Engineering & Technology', 'Mechatronics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechatronics Engineering');

    --------------------------------------------------
    -- ECUST - Single & Double Degree Bachelor Programs
    --------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Visual Communication Design(Digital Design)(single degree)', 'Arts & Humanities', 'Design', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Visual Communication Design(Digital Design)(single degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Artificial Intelligence(single degree)', 'Engineering & Technology', 'Artificial Intelligence', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Artificial Intelligence(single degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Chemical Engineering and Technology(single degree)', 'Engineering & Technology', 'Chemical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Chemical Engineering and Technology(single degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Bioengineering (Biopharmaceutical)(single degree)', 'Engineering & Technology', 'Bioengineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Bioengineering (Biopharmaceutical)(single degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Economics and Trade(single degree)', 'Business & Management', 'International Trade', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Economics and Trade(single degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Intelligent Manufacturing Engineering(single degree)', 'Engineering & Technology', 'Manufacturing Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Intelligent Manufacturing Engineering(single degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Visual Communication Design(Digital Design)(double degree)', 'Arts & Humanities', 'Design', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Visual Communication Design(Digital Design)(double degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Artificial Intelligence(double degree)', 'Engineering & Technology', 'Artificial Intelligence', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Artificial Intelligence(double degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Chemical Engineering and Technology(double degree)', 'Engineering & Technology', 'Chemical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Chemical Engineering and Technology(double degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Bioengineering (Biopharmaceutical)(double degree)', 'Engineering & Technology', 'Bioengineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Bioengineering (Biopharmaceutical)(double degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Economics and Trade(double degree)', 'Business & Management', 'International Trade', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Economics and Trade(double degree)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Intelligent Manufacturing Engineering(double degree)', 'Engineering & Technology', 'Manufacturing Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Intelligent Manufacturing Engineering(double degree)');

    -- Base title for other universities (OUC, BIT)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Economics and Trade', 'Business & Management', 'International Trade', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Economics and Trade');

    --------------------------------------------------
    -- SDUTCM - Master Programs
    --------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Nursing', 'Medicine & Health Sciences', 'Nursing', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Nursing');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Electronics Information', 'Engineering & Technology', 'Electronics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Electronics Information');

END $$;

-- =====================================================
-- 4. INSERT UNIVERSITY PROGRAMS
-- =====================================================

DO $$
DECLARE
    english_lang_id UUID;
    chinese_lang_id UUID;

    upc_id    UUID;
    bit_id    UUID;
    sdutcm_id UUID;
    ecust_id  UUID;
    ouc_id    UUID;
    tgu_id    UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO english_lang_id FROM languages WHERE code = 'en';
    SELECT id INTO chinese_lang_id FROM languages WHERE code = 'zh';

    -- Get university IDs
    SELECT id INTO upc_id    FROM universities WHERE slug = 'upc';
    SELECT id INTO bit_id    FROM universities WHERE slug = 'bit';
    SELECT id INTO sdutcm_id FROM universities WHERE slug = 'sdutcm';
    SELECT id INTO ecust_id  FROM universities WHERE slug = 'ecust';
    SELECT id INTO ouc_id    FROM universities WHERE slug = 'ouc';
    SELECT id INTO tgu_id    FROM universities WHERE slug = 'tgu';

    -------------------------------------------------------------
    -- UPC - BACHELOR PROGRAMS (English-taught, Sept 2026)
    -- Tuition:
    --  - Petroleum Engineering & Big Data Management and Application: 20000
    --  - Others: 18000
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        upc_id,
        pc.id,
        'upc-' || CASE 
            WHEN pc.title = 'Petroleum Engineering' THEN 'petroleum'
            WHEN pc.title = 'Geology' THEN 'geology'
            WHEN pc.title = 'Resource Exploration Engineering' THEN 'resource-exp'
            WHEN pc.title = 'Mechanical Design, Manufacturing and Automation' THEN 'mech-design'
            WHEN pc.title = 'Software Engineering' THEN 'software'
            WHEN pc.title = 'Civil Engineering' THEN 'civil'
            WHEN pc.title = 'Architecture' THEN 'architecture'
            WHEN pc.title = 'Big Data Management and Application' THEN 'big-data'
        END || '-2026-bach',
        CASE 
            WHEN pc.title IN ('Petroleum Engineering', 'Big Data Management and Application')
                THEN 20000
            ELSE 18000
        END,
        english_lang_id,
        'Sept 2026',
        'Type A/B/C scholarships available',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Petroleum Engineering',
        'Geology',
        'Resource Exploration Engineering',
        'Mechanical Design, Manufacturing and Automation',
        'Software Engineering',
        'Civil Engineering',
        'Architecture',
        'Big Data Management and Application'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -------------------------------------------------------------
    -- BIT (Beijing) - BACHELOR PROGRAMS (English-taught, Sept 2026)
    -- Tuition: 30000 RMB/year
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        bit_id,
        pc.id,
        'bit-' || CASE 
            WHEN pc.title = 'Aeronautical and Astronautical Engineering' THEN 'aero-astro'
            WHEN pc.title = 'Automation' THEN 'automation'
            WHEN pc.title = 'Computer Science and Technology' THEN 'cs-tech'
            WHEN pc.title = 'Mechatronics Engineering' THEN 'mechatronics'
            WHEN pc.title = 'Electronics Science and Technology' THEN 'electronics'
            WHEN pc.title = 'Mechanical Engineering' THEN 'mech-eng'
            WHEN pc.title = 'International Economics and Trade' THEN 'intl-econ'
        END || '-2026-bach',
        30000,
        english_lang_id,
        'Sept 2026',
        'Type A-G scholarships available',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Aeronautical and Astronautical Engineering',
        'Automation',
        'Computer Science and Technology',
        'Mechatronics Engineering',
        'Electronics Science and Technology',
        'Mechanical Engineering',
        'International Economics and Trade'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -------------------------------------------------------------
    -- SDUTCM - BACHELOR PROGRAMS (English-taught, Sept 2026)
    -- Tuition: 23000 RMB/year, Scholarship: 12000 RMB/year
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        sdutcm_id,
        pc.id,
        'sdutcm-' || CASE 
            WHEN pc.title = 'Computer Science and Technology' THEN 'cs'
            WHEN pc.title = 'Data Science and Big Data Technology' THEN 'data-sci'
        END || '-2026-bach',
        23000,
        english_lang_id,
        'Sept 2026',
        'Scholarship: 12000 RMB/year',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Computer Science and Technology',
        'Data Science and Big Data Technology'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -------------------------------------------------------------
    -- SDUTCM - MASTER PROGRAMS (English-taught, Sept 2026)
    -- Tuition: 30000 RMB/year
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        sdutcm_id,
        pc.id,
        'sdutcm-' || CASE 
            WHEN pc.title = 'Pharmacy' THEN 'pharmacy'
            WHEN pc.title = 'Nursing' THEN 'nursing'
            WHEN pc.title = 'Electronics Information' THEN 'elec-info'
            WHEN pc.title = 'Biomedical Engineering' THEN 'biomed'
        END || '-2026-mast',
        30000,
        english_lang_id,
        'Sept 2026',
        'Type A/B scholarships available',
        '2-3 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Pharmacy',
        'Nursing',
        'Electronics Information',
        'Biomedical Engineering'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -------------------------------------------------------------
    -- ECUST - BACHELOR PROGRAMS (single & double degree)
    -- Single: 55000 RMB/year, Double: 70000 RMB/year
    -------------------------------------------------------------
    -- Single degree
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        ecust_id,
        pc.id,
        'ecust-' || CASE 
            WHEN pc.title = 'Visual Communication Design(Digital Design)(single degree)' THEN 'visual-s'
            WHEN pc.title = 'Artificial Intelligence(single degree)' THEN 'ai-s'
            WHEN pc.title = 'Chemical Engineering and Technology(single degree)' THEN 'chem-s'
            WHEN pc.title = 'Bioengineering (Biopharmaceutical)(single degree)' THEN 'bioeng-s'
            WHEN pc.title = 'International Economics and Trade(single degree)' THEN 'econ-s'
            WHEN pc.title = 'Intelligent Manufacturing Engineering(single degree)' THEN 'mfg-s'
        END || '-2026-bach',
        55000,
        english_lang_id,
        'Sept 2026',
        'Type A-E scholarships available',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Visual Communication Design(Digital Design)(single degree)',
        'Artificial Intelligence(single degree)',
        'Chemical Engineering and Technology(single degree)',
        'Bioengineering (Biopharmaceutical)(single degree)',
        'International Economics and Trade(single degree)',
        'Intelligent Manufacturing Engineering(single degree)'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -- Double degree
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        ecust_id,
        pc.id,
        'ecust-' || CASE 
            WHEN pc.title = 'Visual Communication Design(Digital Design)(double degree)' THEN 'visual-d'
            WHEN pc.title = 'Artificial Intelligence(double degree)' THEN 'ai-d'
            WHEN pc.title = 'Chemical Engineering and Technology(double degree)' THEN 'chem-d'
            WHEN pc.title = 'Bioengineering (Biopharmaceutical)(double degree)' THEN 'bioeng-d'
            WHEN pc.title = 'International Economics and Trade(double degree)' THEN 'econ-d'
            WHEN pc.title = 'Intelligent Manufacturing Engineering(double degree)' THEN 'mfg-d'
        END || '-2026-bach',
        70000,
        english_lang_id,
        'Sept 2026',
        'Type A-E scholarships available',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Visual Communication Design(Digital Design)(double degree)',
        'Artificial Intelligence(double degree)',
        'Chemical Engineering and Technology(double degree)',
        'Bioengineering (Biopharmaceutical)(double degree)',
        'International Economics and Trade(double degree)',
        'Intelligent Manufacturing Engineering(double degree)'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -------------------------------------------------------------
    -- OUC - BACHELOR PROGRAMS (English-taught)
    -- Tuition: 23000 RMB/year
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, scholarship_chance,
        duration, currency, is_active
    )
    SELECT
        ouc_id,
        pc.id,
        'ouc-' || CASE 
            WHEN pc.title = 'International Economics and Trade' THEN 'econ'
            WHEN pc.title = 'Computer Science and Technology' THEN 'cs'
        END || '-2026-bach',
        23000,
        english_lang_id,
        'Sept 2026',
        'Type A/B scholarships available',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'International Economics and Trade',
        'Computer Science and Technology'
    )
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

    -------------------------------------------------------------
    -- TGU - CHINESE LANGUAGE PROGRAM (March 2026)
    -- Tuition: 6000 RMB/semester -> 12000/year (approx)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        tgu_id,
        pc.id,
        'tgu-chinese-language-2026',
        12000,
        chinese_lang_id,
        'March 2026',
        '1 year',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title = 'Chinese Language Program'
    ON CONFLICT (university_id, program_catalog_id) DO NOTHING;

END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check new universities
SELECT slug, name, city FROM universities 
WHERE slug IN ('sdutcm', 'ecust', 'ouc', 'tgu');

-- Check sample programs
SELECT u.name, pc.title, up.tuition_fee, up.duration
FROM university_programs up
JOIN universities u ON up.university_id = u.id
JOIN program_catalog pc ON up.program_catalog_id = pc.id
WHERE u.slug IN ('sdutcm', 'ecust', 'ouc', 'tgu', 'upc', 'bit')
AND up.slug LIKE '%-2026-%'
ORDER BY u.name, pc.title
LIMIT 30;

-- =====================================================
-- DONE - ALL FIXED!
-- =====================================================
