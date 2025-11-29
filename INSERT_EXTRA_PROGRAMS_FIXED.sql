-- =====================================================
-- EXTRA UNIVERSITY DATA - MASTER & LANGUAGE PROGRAMS
-- FROM NEW PDF FILES (NUAA, BIT, HIT, NPU, XJTLU, LYU, SDNU, UPC, BIT ZHUHAI)
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
-- 2. UPSERT NEW UNIVERSITIES ONLY
--    (BIT Beijing + Shandong Normal University)
-- =====================================================

-- Beijing Institute of Technology (Main Campus - Beijing)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT
    'bit',
    'Beijing Institute of Technology',
    'Beijing',
    'Beijing',
    '13 - Shanghai Ranking',
    '985/211/Double first-class university in Beijing offering a wide range of English-taught master programs.',
    ARRAY['985 project', '211', 'Double first-class']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'bit');

-- Shandong Normal University (Chinese Language Programs)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT
    'sdnu',
    'Shandong Normal University',
    'Jinan',
    'Shandong',
    '77 - US News',
    'Comprehensive university in Jinan offering exclusive Chinese language programs for international students.',
    ARRAY['Exclusive Chinese language program', 'March 2026 intake']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'sdnu');

-- =====================================================
-- 3. EXTEND PROGRAM CATALOG WITH NEW TITLES
-- =====================================================

DO $$
BEGIN
    ------------------------------------------------------------------
    -- NUAA - MASTER PROGRAMS
    ------------------------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Instrument Science and Technology', 'Engineering & Technology', 'Instrumentation', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Instrument Science and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Power Engineering and Engineering Thermophysics', 'Engineering & Technology', 'Energy Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Power Engineering and Engineering Thermophysics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aerospace Science and Technology', 'Engineering & Technology', 'Aerospace Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aerospace Science and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Electronics Science and Technology', 'Engineering & Technology', 'Electronics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Electronics Science and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Information and Communication Engineering', 'Engineering & Technology', 'Telecommunications', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Information and Communication Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Nuclear Science and Technology', 'Engineering & Technology', 'Nuclear Science', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Nuclear Science and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Transportation Engineering', 'Engineering & Technology', 'Transportation Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Transportation Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Corporate Management', 'Business & Management', 'Management', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Corporate Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Cyberspace Safety', 'Engineering & Technology', 'Cybersecurity', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Cyberspace Safety');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Integrated Circuits Science and Engineering', 'Engineering & Technology', 'Microelectronics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Integrated Circuits Science and Engineering');

    ------------------------------------------------------------------
    -- BIT ZHUHAI - BACHELOR PROGRAMS (NEW TITLES)
    ------------------------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aerospace Engineering', 'Engineering & Technology', 'Aerospace Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aerospace Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Vehicle Engineering', 'Engineering & Technology', 'Vehicle Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Vehicle Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Energy and Power Engineering', 'Engineering & Technology', 'Energy Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Energy and Power Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Automation', 'Engineering & Technology', 'Automation', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Automation');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Optoelectronic Information Science and Engineering', 'Engineering & Technology', 'Optoelectronics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Optoelectronic Information Science and Engineering');

    ------------------------------------------------------------------
    -- BIT ZHUHAI & BIT BEIJING - MASTER PROGRAMS (SOME TITLES MAY EXIST)
    ------------------------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aeronautics & Astronautics Science & Technology', 'Engineering & Technology', 'Aerospace Engineering', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aeronautics & Astronautics Science & Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Armament Science and Technology', 'Engineering & Technology', 'Defense Technology', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Armament Science and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Safety Science & Engineering', 'Engineering & Technology', 'Safety Engineering', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Safety Science & Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Cyberspace Science and Technology', 'Engineering & Technology', 'Cybersecurity', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Cyberspace Science and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Chemical Engineering and Technology', 'Engineering & Technology', 'Chemical Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Chemical Engineering and Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Biology', 'Natural Sciences', 'Biology', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Biology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Biomedical Engineering', 'Engineering & Technology', 'Biomedical Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Biomedical Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Statistics', 'Natural Sciences', 'Statistics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Statistics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Public Management', 'Business & Management', 'Public Management', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Public Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'National Economy Mobilization', 'Business & Management', 'Economics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'National Economy Mobilization');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Public Administration', 'Business & Management', 'Public Administration', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Public Administration');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Science of Law', 'Law', 'Law', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Science of Law');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Law', 'Law', 'Law', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Law');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Master of Business Administration (MBA)', 'Business & Management', 'Business Administration', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Master of Business Administration (MBA)');

    ------------------------------------------------------------------
    -- NPU MASTER - EXTRA TITLES
    ------------------------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Flight Vehicle Design', 'Engineering & Technology', 'Aerospace Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Flight Vehicle Design');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aircraft Structures and Airworthiness Technology', 'Engineering & Technology', 'Aerospace Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aircraft Structures and Airworthiness Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Fluid Mechanics', 'Engineering & Technology', 'Mechanics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Fluid Mechanics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Materials Processing Engineering', 'Engineering & Technology', 'Materials Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Materials Processing Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Materials Science', 'Engineering & Technology', 'Materials Science', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Materials Science');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Design Science', 'Engineering & Technology', 'Design', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Design Science');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Power Engineering and Engineering Thermalphysics', 'Engineering & Technology', 'Energy Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Power Engineering and Engineering Thermalphysics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Materials Physics and Chemistry', 'Natural Sciences', 'Materials Science', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Materials Physics and Chemistry');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Optical Engineering', 'Engineering & Technology', 'Optics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Optical Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Optics', 'Natural Sciences', 'Optics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Optics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Condensed Matter Physic', 'Natural Sciences', 'Physics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Condensed Matter Physic');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Chemical Technology', 'Engineering & Technology', 'Chemical Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Chemical Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Polymer Chemistry and Physics', 'Natural Sciences', 'Chemistry', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Polymer Chemistry and Physics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Organic Chemistry', 'Natural Sciences', 'Chemistry', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Organic Chemistry');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Foreign Linguistics and Applied Linguistics', 'Arts & Humanities', 'Linguistics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Foreign Linguistics and Applied Linguistics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'English Language and Literature', 'Arts & Humanities', 'English', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'English Language and Literature');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Research on the Basic Issues of Modern Chinese History', 'Arts & Humanities', 'History', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Research on the Basic Issues of Modern Chinese History');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Cybersecurity', 'Engineering & Technology', 'Cybersecurity', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Cybersecurity');

    ------------------------------------------------------------------
    -- XJTLU MASTER PROGRAMS (ALL ENGLISH-TAUGHT)
    ------------------------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Applied Informatics', 'Engineering & Technology', 'Computer Science', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Applied Informatics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Computer Science', 'Engineering & Technology', 'Computer Science', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Computer Science');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Financial Computing', 'Engineering & Technology', 'Computer Science', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Financial Computing');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Human-Computer Interaction', 'Engineering & Technology', 'Computer Science', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Human-Computer Interaction');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Low Carbon Electrical Power and Energy Technology', 'Engineering & Technology', 'Energy Engineering', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Low Carbon Electrical Power and Energy Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Multimedia Telecommunications', 'Engineering & Technology', 'Telecommunications', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Multimedia Telecommunications');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Pattern Recognition and Intelligent Systems', 'Engineering & Technology', 'Artificial Intelligence', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Pattern Recognition and Intelligent Systems');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Social Computing', 'Engineering & Technology', 'Computer Science', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Social Computing');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Sustainable Energy Technology', 'Engineering & Technology', 'Energy Engineering', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Sustainable Energy Technology');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Architectural Design', 'Engineering & Technology', 'Architecture', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Architectural Design');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Construction Management', 'Engineering & Technology', 'Construction Management', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Construction Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Professional Practice in Architecture', 'Engineering & Technology', 'Architecture', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Professional Practice in Architecture');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Sustainable Building Design and Engineering', 'Engineering & Technology', 'Architecture', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Sustainable Building Design and Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Urban Planning', 'Engineering & Technology', 'Urban Planning', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Urban Planning');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Applied Linguistics', 'Arts & Humanities', 'Linguistics', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Applied Linguistics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Business and Global Affairs', 'Business & Management', 'International Business', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Business and Global Affairs');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'MA Global Public Policy and International Relations', 'Social Sciences', 'International Relations', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'MA Global Public Policy and International Relations');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Media and Communication', 'Arts & Humanities', 'Media Studies', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Media and Communication');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'TESOL', 'Education', 'Language Education', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'TESOL');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Child Development and Family Education', 'Education', 'Education', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Child Development and Family Education');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Global Education', 'Education', 'Education', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Global Education');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Digital Education', 'Education', 'Education Technology', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Digital Education');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Cultural and Creative Industries', 'Arts & Humanities', 'Creative Industries', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Cultural and Creative Industries');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Business Analytics', 'Business & Management', 'Business Analytics', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Business Analytics');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Finance', 'Business & Management', 'Finance', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Finance');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Investment Management', 'Business & Management', 'Finance', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Investment Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Management', 'Business & Management', 'Management', 'Master', '1.5-2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Operations and Supply Chain Management', 'Business & Management', 'Operations Management', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Operations and Supply Chain Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Project Management', 'Business & Management', 'Project Management', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Project Management');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Professional Accounting', 'Business & Management', 'Accounting', 'Master', '1.5 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Professional Accounting');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Advanced Chemical Sciences', 'Natural Sciences', 'Chemistry', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Advanced Chemical Sciences');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Environmental Sciences', 'Natural Sciences', 'Environmental Science', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Environmental Sciences');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Molecular Bioscience', 'Natural Sciences', 'Biology', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Molecular Bioscience');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Data Science', 'Natural Sciences', 'Data Science', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Data Science');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Pharmaceutical Sciences (Part Time)', 'Medicine & Health Sciences', 'Pharmacy', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Pharmaceutical Sciences (Part Time)');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Medicinal Chemistry', 'Natural Sciences', 'Chemistry', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Medicinal Chemistry');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Entrepreneurship and Innovation', 'Business & Management', 'Entrepreneurship', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Entrepreneurship and Innovation');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Advanced Microelectronic Technology and Materials', 'Engineering & Technology', 'Microelectronics', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Advanced Microelectronic Technology and Materials');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Advanced Robotics Systems', 'Engineering & Technology', 'Robotics', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Advanced Robotics Systems');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Digital Business', 'Business & Management', 'E-business', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Digital Business');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Intelligent Engineering Science and Industrial Operations', 'Engineering & Technology', 'Industrial Engineering', 'Master', '2 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Intelligent Engineering Science and Industrial Operations');

    ------------------------------------------------------------------
    -- UPC - BACHELOR ENGINEERING PROGRAMS
    ------------------------------------------------------------------
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Oil and Natural Gas Engineering', 'Engineering & Technology', 'Petroleum Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Oil and Natural Gas Engineering');

    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Geological Resource and Geological Engineering', 'Engineering & Technology', 'Geological Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Geological Resource and Geological Engineering');

END $$;

-- =====================================================
-- 4. INSERT UNIVERSITY PROGRAMS (MASTER + LANGUAGE + NEW BACHELOR)
-- =====================================================

DO $$
DECLARE
    english_lang_id UUID;
    chinese_lang_id UUID;

    nuaa_id UUID;
    bit_zhuhai_id UUID;
    bit_id UUID;
    hit_id UUID;
    npu_id UUID;
    xjtlu_id UUID;
    lyu_id UUID;
    sdnu_id UUID;
    upc_id UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO english_lang_id FROM languages WHERE code = 'en';
    SELECT id INTO chinese_lang_id FROM languages WHERE code = 'zh';

    -- Get university IDs
    SELECT id INTO nuaa_id      FROM universities WHERE slug = 'nuaa';
    SELECT id INTO bit_zhuhai_id FROM universities WHERE slug = 'bit-zhuhai';
    SELECT id INTO bit_id       FROM universities WHERE slug = 'bit';
    SELECT id INTO hit_id       FROM universities WHERE slug = 'hit';
    SELECT id INTO npu_id       FROM universities WHERE slug = 'npu';
    SELECT id INTO xjtlu_id     FROM universities WHERE slug = 'xjtlu';
    SELECT id INTO lyu_id       FROM universities WHERE slug = 'lyu';
    SELECT id INTO sdnu_id      FROM universities WHERE slug = 'sdnu';
    SELECT id INTO upc_id       FROM universities WHERE slug = 'upc';

    -------------------------------------------------------------
    -- NUAA - MASTER PROGRAMS (English-taught, Sept 2026)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        nuaa_id,
        pc.id,
        'nuaa-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        CASE 
            WHEN pc.title IN ('Applied Economics', 'Management Science and Engineering', 'Accounting', 'Corporate Management')
                THEN 30000        -- Business & Management
            ELSE 33600            -- Engineering & others
        END,
        english_lang_id,
        'Sept 2026',
        '2-3 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Mechanics',
        'Mechanical Engineering',
        'Instrument Science and Technology',
        'Power Engineering and Engineering Thermophysics',
        'Aerospace Science and Technology',
        'Electrical Engineering',
        'Control Science and Engineering',
        'Electronics Science and Technology',
        'Information and Communication Engineering',
        'Chemistry',
        'Materials Science and Engineering',
        'Nuclear Science and Technology',
        'Civil Engineering',
        'Transportation Engineering',
        'Physics',
        'Applied Economics',
        'Management Science and Engineering',
        'Accounting',
        'Corporate Management',
        'Optical Engineering',
        'Computer Science and Technology',
        'Cyberspace Safety',
        'Software Engineering',
        'Mathematics',
        'Integrated Circuits Science and Engineering'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- BIT ZHUHAI - MASTER PROGRAMS (Mechanical / Materials / CS)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        bit_zhuhai_id,
        pc.id,
        'bit-zhuhai-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        36000,
        english_lang_id,
        'Sept 2026',
        '2 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Mechanical Engineering',
        'Materials Science and Engineering',
        'Computer Science and Technology'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- BIT ZHUHAI - BACHELOR PROGRAMS (Engineering)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        bit_zhuhai_id,
        pc.id,
        'bit-zhuhai-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        30000,
        english_lang_id,  -- main teaching includes English / Chinese+Russian but front-end can show details
        'Sept 2026',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Artificial Intelligence',
        'Aerospace Engineering',
        'Vehicle Engineering',
        'Energy and Power Engineering',
        'Automation',
        'Optoelectronic Information Science and Engineering'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- BIT BEIJING - MASTER PROGRAMS (2 years)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        bit_id,
        pc.id,
        'bit-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        CASE 
            WHEN pc.title = 'Master of Business Administration (MBA)' THEN 49000
            ELSE 36000
        END,
        english_lang_id,
        'Sept 2026',
        '2 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Aeronautics & Astronautics Science & Technology',
        'Mechanics',
        'Armament Science and Technology',
        'Safety Science & Engineering',
        'Mechanical Engineering',
        'Power Engineering and Engineering Thermophysics',
        'Optical Engineering',
        'Instrument Science and Technology',
        'Information and Communication Engineering',
        'Electronics Science and Technology',
        'Integrated Circuits Science and Engineering',
        'Control Science and Engineering',
        'Computer Science and Technology',
        'Cyberspace Science and Technology',
        'Chemistry',
        'Chemical Engineering and Technology',
        'Biology',
        'Biomedical Engineering',
        'Mathematics',
        'Statistics',
        'Physics',
        'Master of Business Administration (MBA)',
        'Management Science and Engineering',
        'Business Administration',
        'National Economy Mobilization',
        'Public Administration',
        'Applied Economics',
        'Law'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- HIT - MASTER PROGRAMS (Tuition 34000 RMB/year)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        hit_id,
        pc.id,
        'hit-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        34000,
        english_lang_id,
        'Sept 2026',
        '2-3 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Management Science and Engineering',
        'Applied Economics',
        'Public Management',
        'Business Administration',
        'Software Engineering',
        'Computer Science and Technology',
        'Chemical Engineering and Technology',
        'Chemistry',
        'Materials Science and Engineering',
        'Control Science and Engineering',
        'Power Engineering and Engineering Thermophysics',
        'Mechanics',
        'Civil Engineering',
        'Aeronautical and Astronautical Science and Technology',
        'Mechanical Engineering',
        'Information and Communication Engineering'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- NPU - MASTER PROGRAMS (Tuition 33000 RMB/year)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        npu_id,
        pc.id,
        'npu-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        33000,
        english_lang_id,
        'Sept 2026',
        '2-3 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Flight Vehicle Design',
        'Aircraft Structures and Airworthiness Technology',
        'Fluid Mechanics',
        'Aeronautical and Astronautical Science and Technology',
        'Control Science and Engineering',
        'Naval Architecture and Ocean Engineering',
        'Materials Processing Engineering',
        'Materials Science',
        'Mechanical Engineering',
        'Design Science',
        'Mechanics',
        'Power Engineering and Engineering Thermalphysics',
        'Information and Communication Engineering',
        'Electronics Science and Technology',
        'Electrical Engineering',
        'Computer Science and Technology',
        'Mathematics',
        'Materials Physics and Chemistry',
        'Optical Engineering',
        'Optics',
        'Condensed Matter Physic',
        'Chemical Technology',
        'Applied Chemistry',
        'Polymer Chemistry and Physics',
        'Organic Chemistry',
        'Management Science and Engineering',
        'Business Administration',
        'Public Administration',
        'Applied Economics',
        'Science of Law',
        'Software Engineering',
        'Biomedical Engineering',
        'Foreign Linguistics and Applied Linguistics',
        'English Language and Literature',
        'Research on the Basic Issues of Modern Chinese History',
        'Cybersecurity'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- XJTLU - MASTER PROGRAMS (tuition from PDF, English-taught)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        xjtlu_id,
        pc.id,
        'xjtlu-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        CASE
            WHEN pc.title IN ('Computer Science',
                              'Low Carbon Electrical Power and Energy Technology',
                              'Pattern Recognition and Intelligent Systems',
                              'Digital Education',
                              'Cultural and Creative Industries',
                              'Advanced Chemical Sciences',
                              'Environmental Sciences',
                              'Molecular Bioscience',
                              'Materials Science and Engineering',
                              'Bioinformatics',
                              'Data Science',
                              'Pharmaceutical Sciences (Part Time)',
                              'Applied Statistics',
                              'Medicinal Chemistry',
                              'Entrepreneurship and Innovation',
                              'Advanced Microelectronic Technology and Materials',
                              'Advanced Robotics Systems',
                              'Artificial Intelligence',
                              'Digital Business',
                              'Intelligent Engineering Science and Industrial Operations')
                THEN 200000
            WHEN pc.title IN ('Civil Engineering',
                              'Construction Management',
                              'International Professional Practice in Architecture',
                              'Sustainable Building Design and Engineering',
                              'Urban Planning')
                THEN 150000
            ELSE 180000
        END,
        english_lang_id,
        'Sept 2026',
        CASE
            WHEN pc.title IN ('Computer Science', 'Digital Education',
                              'Cultural and Creative Industries',
                              'Advanced Chemical Sciences',
                              'Environmental Sciences',
                              'Molecular Bioscience',
                              'Materials Science and Engineering',
                              'Bioinformatics',
                              'Data Science',
                              'Pharmaceutical Sciences (Part Time)',
                              'Applied Statistics',
                              'Medicinal Chemistry',
                              'Entrepreneurship and Innovation',
                              'Advanced Microelectronic Technology and Materials',
                              'Advanced Robotics Systems',
                              'Artificial Intelligence',
                              'Digital Business',
                              'Intelligent Engineering Science and Industrial Operations')
                THEN '2 years'
            ELSE '1.5 years'
        END,
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Applied Informatics',
        'Computer Science',
        'Financial Computing',
        'Human-Computer Interaction',
        'Low Carbon Electrical Power and Energy Technology',
        'Multimedia Telecommunications',
        'Pattern Recognition and Intelligent Systems',
        'Social Computing',
        'Sustainable Energy Technology',
        'Architectural Design',
        'Civil Engineering',
        'Construction Management',
        'Industrial Design',
        'International Professional Practice in Architecture',
        'Sustainable Building Design and Engineering',
        'Urban Planning',
        'Applied Linguistics',
        'China Studies',
        'International Business and Global Affairs',
        'MA Global Public Policy and International Relations',
        'Media and Communication',
        'TESOL',
        'Child Development and Family Education',
        'Global Education',
        'Digital Education',
        'Cultural and Creative Industries',
        'Business Analytics',
        'Economics and Finance',
        'Finance',
        'Investment Management',
        'Management',
        'Operations and Supply Chain Management',
        'Project Management',
        'Professional Accounting',
        'Advanced Chemical Sciences',
        'Environmental Sciences',
        'Molecular Bioscience',
        'Materials Science and Engineering',
        'Bioinformatics',
        'Data Science',
        'Financial Mathematics',
        'Applied Mathematics',
        'Pharmaceutical Sciences (Part Time)',
        'Applied Statistics',
        'Medicinal Chemistry',
        'Entrepreneurship and Innovation',
        'Advanced Microelectronic Technology and Materials',
        'Advanced Robotics Systems',
        'Artificial Intelligence',
        'Digital Business',
        'Intelligent Engineering Science and Industrial Operations'
    )
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- LYU - CHINESE LANGUAGE PROGRAM (ONE SEMESTER, MARCH 2026)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        lyu_id,
        pc.id,
        'lyu-chinese-language-2026-spring',
        5000,               -- per semester
        chinese_lang_id,
        'March 2026',
        '1 semester',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title = 'Chinese Language Program'
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- SDNU - CHINESE LANGUAGE PROGRAM (MARCH 2026)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        sdnu_id,
        pc.id,
        'sdnu-chinese-language-2026',
        14800,
        chinese_lang_id,
        'March 2026',
        '1 year',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title = 'Chinese Language Program'
    ON CONFLICT (slug) DO NOTHING;

    -------------------------------------------------------------
    -- UPC - BACHELOR ENGINEERING (Oil & Gas, Geological, Chemical)
    -------------------------------------------------------------
    INSERT INTO university_programs (
        university_id, program_catalog_id, slug,
        tuition_fee, language_id, intake, duration, currency, is_active
    )
    SELECT
        upc_id,
        pc.id,
        'upc-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        24000,
        english_lang_id,
        'Sept 2026',
        '4 years',
        'RMB',
        TRUE
    FROM program_catalog pc
    WHERE pc.title IN (
        'Oil and Natural Gas Engineering',
        'Geological Resource and Geological Engineering',
        'Chemical Engineering and Technology'
    )
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check new universities
SELECT * FROM universities WHERE slug IN ('bit','sdnu');

-- Check sample master programs
SELECT u.name, pc.title, up.tuition_fee, up.duration
FROM university_programs up
JOIN universities u ON up.university_id = u.id
JOIN program_catalog pc ON up.program_catalog_id = pc.id
WHERE up.slug LIKE '%-master'
ORDER BY u.name, pc.title
LIMIT 20;

-- =====================================================
-- SUCCESS!
-- =====================================================
