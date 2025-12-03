-- =====================================================
-- COMPLETE UNIVERSITY DATA INSERTION (FIXED)
-- =====================================================
-- This script inserts all universities, programs, and related data
-- from the extracted PDF information
-- =====================================================

-- =====================================================
-- 1. INSERT LANGUAGES
-- =====================================================
-- =====================================================
-- 2. UPSERT UNIVERSITIES
-- =====================================================

-- Xi'an Jiaotong-Liverpool University
INSERT INTO universities (slug, name, city, province, ranking, description)
SELECT 
    'xjtlu',
    'Xi''an Jiaotong-Liverpool University',
    'Suzhou',
    'Jiangsu',
    '149 - Shanghai Ranking',
    'Sino-British university in Suzhou offering a wide range of English-taught bachelor programmes and an Entrepreneur College in Taicang.'
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'xjtlu');

-- Linyi University
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'lyu',
    'Linyi University',
    'Linyi',
    'Shandong',
    '169 - US News Ranking',
    'Comprehensive university in Linyi with English-taught bachelor and master programmes.',
    ARRAY['Bachelor intake Sept 2026']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'lyu');

-- Northwestern Polytechnical University
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'npu',
    'Northwestern Polytechnical University',
    'Xi''an',
    'Shaanxi',
    '21 - Shanghai Ranking',
    'Top engineering university (985/211/double-first-class) with strong aerospace focus.',
    ARRAY['985 project', '211', 'Double first-class', 'Bachelor intake Sept 2026']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'npu');

-- Dalian University of Technology
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'dlut',
    'Dalian University of Technology',
    'Dalian',
    'Liaoning',
    '28 - Shanghai Ranking',
    '985/211/Double First-Class university offering engineering, bioengineering and construction majors.',
    ARRAY['985 project', '211', 'Double first-class']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'dlut');

-- Nanjing University of Aeronautics and Astronautics
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'nuaa',
    'Nanjing University of Aeronautics and Astronautics',
    'Nanjing',
    'Jiangsu',
    '36 - Shanghai Ranking',
    'Specialised in aeronautics and engineering; 211 and double-first-class.',
    ARRAY['211', 'Double first-class']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'nuaa');

-- Harbin Institute of Technology
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'hit',
    'Harbin Institute of Technology',
    'Harbin',
    'Heilongjiang',
    'Top 10 (national)',
    'Top-10 national university, 985/211/double-first-class, strong in engineering.',
    ARRAY['985 project', '211', 'Double first-class']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'hit');

-- Beijing Institute of Technology (Zhuhai)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'bit-zhuhai',
    'Beijing Institute of Technology (Zhuhai)',
    'Zhuhai',
    'Guangdong',
    '13 - Shanghai Ranking',
    'Zhuhai campus of BIT offering Chinese language programmes.',
    ARRAY['985 project', '211', 'Double first-class', 'Chinese language programme']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'bit-zhuhai');

-- China University of Petroleum (East China)
INSERT INTO universities (slug, name, city, province, ranking, description, features)
SELECT 
    'upc',
    'China University of Petroleum (East China)',
    'Qingdao',
    'Shandong',
    '67 - Shanghai Ranking',
    '211/Double first-class university offering Chinese language programmes.',
    ARRAY['211', 'Double first-class', 'Chinese language programme']
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE slug = 'upc');

-- =====================================================
-- 3. INSERT PROGRAM CATALOG ENTRIES
-- =====================================================
-- Using DO block to check for existence before inserting

DO $$
DECLARE
    prog_title TEXT;
    prog_titles TEXT[] := ARRAY[
        'Architecture', 'Civil Engineering', 'Industrial Design', 'Urban Planning and Design',
        'Accounting', 'Business Administration', 'Economics', 'Economics and Finance',
        'Human Resource Management', 'Information Management and Information System',
        'International Business with a Language', 'Digital and Intelligent Marketing',
        'Computer Science and Technology', 'Digital Media Technology', 'Electrical Engineering',
        'Electronic Science and Technology', 'Information and Computing Science',
        'Mechatronics and Robotic Systems', 'Telecommunication Engineering',
        'Artificial Intelligence - Intelligent Systems', 'Digital Media Arts', 'Filmmaking',
        'TV Production', 'Pharmaceutical Sciences', 'Biopharmaceuticals',
        'Applied Statistics (Biostatistics)', 'China Studies', 'English and Communication Studies',
        'English and Business Studies', 'English and Applied Linguistics', 'International Relations',
        'Media and Communication Studies', 'Translation and Interpreting', 'Applied Chemistry',
        'Bioinformatics', 'Biological Sciences', 'Environmental Science',
        'Materials Science and Engineering', 'Actuarial Science', 'Applied Mathematics',
        'Financial Mathematics', 'International Business Trade', 'E-commerce',
        'Visual Communication Design', 'Media Communication', 'Chemistry',
        'Tourism Management', 'Control Engineering', 'Applied Statistics', 'Pharmacy',
        'Aerospace Engineering (Aircraft Design)', 'Aerospace Engineering (Satellites, Space Science)',
        'Engineering Mechanics', 'Electronics and Information Engineering', 'English',
        'Intelligent Construction (Civil Engineering)', 'Mechanical Design, Manufacture and Automation',
        'Bioengineering (DUT-BGI)', 'Mechanics', 'Aeronautical and Astronautical Science and Technology',
        'Naval Architecture and Ocean Engineering', 'Mechanical Engineering',
        'Materials Science and Engineering', 'Heat, Gas Supply, Ventilation and Air-conditioning',
        'Aeronautical Engineering', 'Artificial Intelligence', 'Electrical & Electronic Engineering',
        'International Business', 'Intelligent Medical Engineering', 'Business Management',
        'Measurement and Testing Technology and Instrument', 'Chinese Language Program'
    ];
BEGIN
    -- Insert Architecture
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Architecture', 'Engineering & Technology', 'Architecture', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Architecture');
    
    -- Insert Civil Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Civil Engineering', 'Engineering & Technology', 'Civil Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Civil Engineering');
    
    -- Insert Industrial Design
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Industrial Design', 'Engineering & Technology', 'Design', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Industrial Design');
    
    -- Insert Urban Planning and Design
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Urban Planning and Design', 'Engineering & Technology', 'Architecture', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Urban Planning and Design');
    
    -- Insert Accounting
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Accounting', 'Business & Management', 'Accounting', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Accounting');
    
    -- Insert Business Administration
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Business Administration', 'Business & Management', 'General Business', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Business Administration');
    
    -- Insert Economics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Economics', 'Business & Management', 'Economics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Economics');
    
    -- Insert Economics and Finance
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Economics and Finance', 'Business & Management', 'Finance', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Economics and Finance');
    
    -- Insert Human Resource Management
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Human Resource Management', 'Business & Management', 'Human Resources', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Human Resource Management');
    
    -- Insert Information Management and Information System
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Information Management and Information System', 'Business & Management', 'Information Systems', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Information Management and Information System');
    
    -- Insert International Business with a Language
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Business with a Language', 'Business & Management', 'International Business', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Business with a Language');
    
    -- Insert Digital and Intelligent Marketing
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Digital and Intelligent Marketing', 'Business & Management', 'Marketing', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Digital and Intelligent Marketing');
    
    -- Insert Computer Science and Technology
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Computer Science and Technology', 'Engineering & Technology', 'Computer Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Computer Science and Technology');
    
    -- Insert Digital Media Technology
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Digital Media Technology', 'Engineering & Technology', 'Media Technology', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Digital Media Technology');
    
    -- Insert Electrical Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Electrical Engineering', 'Engineering & Technology', 'Electrical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Electrical Engineering');
    
    -- Insert Electronic Science and Technology
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Electronic Science and Technology', 'Engineering & Technology', 'Electronics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Electronic Science and Technology');
    
    -- Insert Information and Computing Science
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Information and Computing Science', 'Engineering & Technology', 'Computer Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Information and Computing Science');
    
    -- Insert Mechatronics and Robotic Systems
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechatronics and Robotic Systems', 'Engineering & Technology', 'Robotics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechatronics and Robotic Systems');
    
    -- Insert Telecommunication Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Telecommunication Engineering', 'Engineering & Technology', 'Telecommunications', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Telecommunication Engineering');
    
    -- Insert Artificial Intelligence - Intelligent Systems
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Artificial Intelligence - Intelligent Systems', 'Engineering & Technology', 'Artificial Intelligence', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Artificial Intelligence - Intelligent Systems');
    
    -- Insert Artificial Intelligence (general)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Artificial Intelligence', 'Engineering & Technology', 'Artificial Intelligence', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Artificial Intelligence');
    
    -- Insert Digital Media Arts
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Digital Media Arts', 'Arts & Humanities', 'Media Arts', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Digital Media Arts');
    
    -- Insert Filmmaking
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Filmmaking', 'Arts & Humanities', 'Film & Media', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Filmmaking');
    
    -- Insert TV Production
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'TV Production', 'Arts & Humanities', 'Film & Media', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'TV Production');
    
    -- Insert Pharmaceutical Sciences
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Pharmaceutical Sciences', 'Medicine & Health Sciences', 'Pharmacy', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Pharmaceutical Sciences');
    
    -- Insert Biopharmaceuticals
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Biopharmaceuticals', 'Medicine & Health Sciences', 'Pharmacy', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Biopharmaceuticals');
    
    -- Insert Applied Statistics (Biostatistics)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Applied Statistics (Biostatistics)', 'Natural Sciences', 'Statistics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Applied Statistics (Biostatistics)');
    
    -- Insert Applied Statistics (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Applied Statistics', 'Natural Sciences', 'Statistics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Applied Statistics');
    
    -- Insert China Studies
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'China Studies', 'Arts & Humanities', 'Area Studies', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'China Studies');
    
    -- Insert English and Communication Studies
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'English and Communication Studies', 'Arts & Humanities', 'Languages', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'English and Communication Studies');
    
    -- Insert English and Business Studies
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'English and Business Studies', 'Arts & Humanities', 'Languages', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'English and Business Studies');
    
    -- Insert English and Applied Linguistics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'English and Applied Linguistics', 'Arts & Humanities', 'Languages', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'English and Applied Linguistics');
    
    -- Insert English
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'English', 'Arts & Humanities', 'Languages', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'English');
    
    -- Insert International Relations
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Relations', 'Arts & Humanities', 'Political Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Relations');
    
    -- Insert Media and Communication Studies
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Media and Communication Studies', 'Arts & Humanities', 'Media Studies', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Media and Communication Studies');
    
    -- Insert Media Communication
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Media Communication', 'Arts & Humanities', 'Media Studies', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Media Communication');
    
    -- Insert Translation and Interpreting
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Translation and Interpreting', 'Arts & Humanities', 'Languages', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Translation and Interpreting');
    
    -- Insert Applied Chemistry
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Applied Chemistry', 'Natural Sciences', 'Chemistry', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Applied Chemistry');
    
    -- Insert Chemistry (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Chemistry', 'Natural Sciences', 'Chemistry', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Chemistry');
    
    -- Insert Bioinformatics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Bioinformatics', 'Natural Sciences', 'Biology', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Bioinformatics');
    
    -- Insert Biological Sciences
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Biological Sciences', 'Natural Sciences', 'Biology', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Biological Sciences');
    
    -- Insert Environmental Science
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Environmental Science', 'Natural Sciences', 'Environmental Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Environmental Science');
    
    -- Insert Materials Science and Engineering (Bachelor)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Materials Science and Engineering', 'Engineering & Technology', 'Materials Science', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Materials Science and Engineering');
    
    -- Insert Materials Science and Engineering (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Materials Science and Engineering', 'Engineering & Technology', 'Materials Science', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Materials Science and Engineering');
    
    -- Insert Actuarial Science
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Actuarial Science', 'Business & Management', 'Finance', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Actuarial Science');
    
    -- Insert Applied Mathematics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Applied Mathematics', 'Natural Sciences', 'Mathematics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Applied Mathematics');
    
    -- Insert Financial Mathematics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Financial Mathematics', 'Natural Sciences', 'Mathematics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Financial Mathematics');
    
    -- Insert International Business Trade
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Business Trade', 'Business & Management', 'International Trade', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Business Trade');
    
    -- Insert E-commerce
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'E-commerce', 'Business & Management', 'E-commerce', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'E-commerce');
    
    -- Insert Visual Communication Design
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Visual Communication Design', 'Arts & Humanities', 'Design', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Visual Communication Design');
    
    -- Insert Tourism Management
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Tourism Management', 'Business & Management', 'Tourism', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Tourism Management');
    
    -- Insert Control Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Control Engineering', 'Engineering & Technology', 'Control Systems', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Control Engineering');
    
    -- Insert Pharmacy (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Pharmacy', 'Medicine & Health Sciences', 'Pharmacy', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Pharmacy');
    
    -- Insert Civil Engineering (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Civil Engineering', 'Engineering & Technology', 'Civil Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Civil Engineering');
    
    -- Insert Computer Science and Technology (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Computer Science and Technology', 'Engineering & Technology', 'Computer Science', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Computer Science and Technology');
    
    -- Insert Aerospace Engineering (Aircraft Design)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aerospace Engineering (Aircraft Design)', 'Engineering & Technology', 'Aerospace Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aerospace Engineering (Aircraft Design)');
    
    -- Insert Aerospace Engineering (Satellites, Space Science)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aerospace Engineering (Satellites, Space Science)', 'Engineering & Technology', 'Aerospace Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aerospace Engineering (Satellites, Space Science)');
    
    -- Insert Engineering Mechanics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Engineering Mechanics', 'Engineering & Technology', 'Mechanical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Engineering Mechanics');
    
    -- Insert Electronics and Information Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Electronics and Information Engineering', 'Engineering & Technology', 'Electronics', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Electronics and Information Engineering');
    
    -- Insert Intelligent Construction (Civil Engineering)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Intelligent Construction (Civil Engineering)', 'Engineering & Technology', 'Civil Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Intelligent Construction (Civil Engineering)');
    
    -- Insert Mechanical Design, Manufacture and Automation
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechanical Design, Manufacture and Automation', 'Engineering & Technology', 'Mechanical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechanical Design, Manufacture and Automation');
    
    -- Insert Bioengineering (DUT-BGI)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Bioengineering (DUT-BGI)', 'Engineering & Technology', 'Bioengineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Bioengineering (DUT-BGI)');
    
    -- Insert Mechanics
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechanics', 'Engineering & Technology', 'Mechanics', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechanics');
    
    -- Insert Aeronautical and Astronautical Science and Technology
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aeronautical and Astronautical Science and Technology', 'Engineering & Technology', 'Aerospace Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aeronautical and Astronautical Science and Technology');
    
    -- Insert Naval Architecture and Ocean Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Naval Architecture and Ocean Engineering', 'Engineering & Technology', 'Naval Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Naval Architecture and Ocean Engineering');
    
    -- Insert Mechanical Engineering (Master)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechanical Engineering', 'Engineering & Technology', 'Mechanical Engineering', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechanical Engineering');
    
    -- Insert Mechanical Engineering (Bachelor)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Mechanical Engineering', 'Engineering & Technology', 'Mechanical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Mechanical Engineering');
    
    -- Insert Heat, Gas Supply, Ventilation and Air-conditioning
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Heat, Gas Supply, Ventilation and Air-conditioning', 'Engineering & Technology', 'HVAC', 'Master', '2-3 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Heat, Gas Supply, Ventilation and Air-conditioning');
    
    -- Insert Aeronautical Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Aeronautical Engineering', 'Engineering & Technology', 'Aerospace Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Aeronautical Engineering');
    
    -- Insert Electrical & Electronic Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Electrical & Electronic Engineering', 'Engineering & Technology', 'Electrical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Electrical & Electronic Engineering');
    
    -- Insert International Business
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'International Business', 'Business & Management', 'International Business', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'International Business');
    
    -- Insert Intelligent Medical Engineering
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Intelligent Medical Engineering', 'Engineering & Technology', 'Medical Engineering', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Intelligent Medical Engineering');
    
    -- Insert Business Management
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Business Management', 'Business & Management', 'General Business', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Business Management');
    
    -- Insert Architecture (Bachelor)
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Architecture', 'Engineering & Technology', 'Architecture', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Architecture');
    
    -- Insert Measurement and Testing Technology and Instrument
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Measurement and Testing Technology and Instrument', 'Engineering & Technology', 'Instrumentation', 'Bachelor', '4 years'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Measurement and Testing Technology and Instrument');
    
    -- Insert Chinese Language Program
    INSERT INTO program_catalog (title, category, field, level, typical_duration)
    SELECT 'Chinese Language Program', 'Education', 'Language Education', 'Language', '1 year'
    WHERE NOT EXISTS (SELECT 1 FROM program_catalog WHERE title = 'Chinese Language Program');
    
END $$;

-- =====================================================
-- 4. INSERT UNIVERSITY PROGRAMS
-- =====================================================

DO $$
DECLARE
    english_lang_id UUID;
    chinese_lang_id UUID;
    xjtlu_id UUID;
    lyu_id UUID;
    npu_id UUID;
    dlut_id UUID;
    nuaa_id UUID;
    hit_id UUID;
    bit_zhuhai_id UUID;
    upc_id UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO english_lang_id FROM languages WHERE code = 'en';
    SELECT id INTO chinese_lang_id FROM languages WHERE code = 'zh';
    
    -- Get university IDs
    SELECT id INTO xjtlu_id FROM universities WHERE slug = 'xjtlu';
    SELECT id INTO lyu_id FROM universities WHERE slug = 'lyu';
    SELECT id INTO npu_id FROM universities WHERE slug = 'npu';
    SELECT id INTO dlut_id FROM universities WHERE slug = 'dlut';
    SELECT id INTO nuaa_id FROM universities WHERE slug = 'nuaa';
    SELECT id INTO hit_id FROM universities WHERE slug = 'hit';
    SELECT id INTO bit_zhuhai_id FROM universities WHERE slug = 'bit-zhuhai';
    SELECT id INTO upc_id FROM universities WHERE slug = 'upc';

    -- =====================================================
    -- XJTLU Bachelor Programs (English-taught)
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, language_id, intake, scholarship_chance, duration, currency, is_active)
    SELECT 
        xjtlu_id,
        pc.id,
        'xjtlu-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        english_lang_id,
        'Sept 2026',
        'Type A: 10%–50% of tuition fee',
        '4 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Architecture', 'Civil Engineering', 'Industrial Design', 'Urban Planning and Design',
        'Accounting', 'Business Administration', 'Economics', 'Economics and Finance',
        'Human Resource Management', 'Information Management and Information System',
        'International Business with a Language', 'Digital and Intelligent Marketing',
        'Computer Science and Technology', 'Digital Media Technology', 'Electrical Engineering',
        'Electronic Science and Technology', 'Information and Computing Science',
        'Mechatronics and Robotic Systems', 'Telecommunication Engineering',
        'Artificial Intelligence - Intelligent Systems', 'Digital Media Arts', 'Filmmaking',
        'TV Production', 'Pharmaceutical Sciences', 'Biopharmaceuticals',
        'Applied Statistics (Biostatistics)', 'China Studies', 'English and Communication Studies',
        'English and Business Studies', 'English and Applied Linguistics', 'International Relations',
        'Media and Communication Studies', 'Translation and Interpreting', 'Applied Chemistry',
        'Bioinformatics', 'Biological Sciences', 'Environmental Science',
        'Materials Science and Engineering', 'Actuarial Science', 'Applied Mathematics',
        'Financial Mathematics'
    )
    AND pc.level = 'Bachelor'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- Linyi University Bachelor Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, tuition_fee, language_id, intake, scholarship_chance, duration, currency, is_active)
    SELECT 
        lyu_id,
        pc.id,
        'lyu-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        12000,
        english_lang_id,
        'Sept 2026',
        'Type A & B scholarships available',
        '4 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'International Business Trade', 'Computer Science and Technology', 'E-commerce',
        'Visual Communication Design', 'Civil Engineering', 'Media Communication'
    )
    AND pc.level = 'Bachelor'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- Linyi University Master Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, tuition_fee, language_id, intake, duration, currency, is_active)
    SELECT 
        lyu_id,
        pc.id,
        'lyu-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        12000,
        english_lang_id,
        'Sept 2026',
        '2-3 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Chemistry', 'Tourism Management', 'Control Engineering', 'Applied Statistics',
        'Pharmacy', 'Civil Engineering', 'Computer Science and Technology'
    )
    AND pc.level = 'Master'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- NPU Bachelor Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, language_id, intake, duration, currency, is_active)
    SELECT 
        npu_id,
        pc.id,
        'npu-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        english_lang_id,
        'Sept 2026',
        '4 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Aerospace Engineering (Aircraft Design)', 'Aerospace Engineering (Satellites, Space Science)',
        'Engineering Mechanics', 'Electronics and Information Engineering',
        'Computer Science and Technology', 'Business Administration', 'English'
    )
    AND pc.level = 'Bachelor'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- DLUT Bachelor Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, tuition_fee, language_id, intake, scholarship_chance, duration, currency, is_active)
    SELECT 
        dlut_id,
        pc.id,
        'dlut-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        25500,
        english_lang_id,
        'Sept 2026',
        'Full Tuition: Free tuition for 4 years',
        '4 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Intelligent Construction (Civil Engineering)',
        'Mechanical Design, Manufacture and Automation',
        'Bioengineering (DUT-BGI)'
    )
    AND pc.level = 'Bachelor'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- DLUT Master Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, language_id, intake, duration, currency, is_active)
    SELECT 
        dlut_id,
        pc.id,
        'dlut-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-master',
        english_lang_id,
        'Sept 2026',
        '2-3 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Mechanics', 'Aeronautical and Astronautical Science and Technology',
        'Naval Architecture and Ocean Engineering', 'Mechanical Engineering',
        'Materials Science and Engineering', 'Heat, Gas Supply, Ventilation and Air-conditioning'
    )
    AND pc.level = 'Master'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- NUAA Bachelor Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, tuition_fee, language_id, intake, duration, currency, is_active)
    SELECT 
        nuaa_id,
        pc.id,
        'nuaa-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        CASE WHEN pc.title = 'International Business' THEN 22900 ELSE NULL END,
        english_lang_id,
        'Sept 2026',
        '4 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Aeronautical Engineering', 'Civil Engineering', 'Artificial Intelligence',
        'Mechanical Engineering', 'Electrical & Electronic Engineering', 'International Business'
    )
    AND pc.level = 'Bachelor'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- HIT Bachelor Programs
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, language_id, intake, duration, currency, is_active)
    SELECT 
        hit_id,
        pc.id,
        'hit-' || LOWER(REGEXP_REPLACE(pc.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-2026-bachelor',
        english_lang_id,
        'Sept 2026',
        '4 years',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title IN (
        'Civil Engineering', 'Artificial Intelligence', 'Computer Science and Technology',
        'Intelligent Medical Engineering', 'Business Management', 'Architecture',
        'Measurement and Testing Technology and Instrument'
    )
    AND pc.level = 'Bachelor'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- BIT Zhuhai Chinese Language Program
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, tuition_fee, language_id, intake, duration, currency, is_active)
    SELECT 
        bit_zhuhai_id,
        pc.id,
        'bit-zhuhai-chinese-language-2026',
        4000, -- per year after offer
        chinese_lang_id,
        'March 2026',
        '1 year',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title = 'Chinese Language Program'
    ON CONFLICT (slug) DO NOTHING;

    -- =====================================================
    -- UPC Chinese Language Program
    -- =====================================================
    INSERT INTO university_programs (university_id, program_catalog_id, slug, tuition_fee, language_id, intake, duration, currency, is_active)
    SELECT 
        upc_id,
        pc.id,
        'upc-chinese-language-2026',
        10000, -- per year (5000 per semester after scholarship)
        chinese_lang_id,
        'March 2026',
        '1 year',
        'RMB',
        true
    FROM program_catalog pc
    WHERE pc.title = 'Chinese Language Program'
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count universities
SELECT COUNT(*) as total_universities FROM universities;

-- Count programs in catalog
SELECT COUNT(*) as total_program_types FROM program_catalog;

-- Count university programs by university
SELECT 
    u.name,
    COUNT(up.id) as program_count
FROM universities u
LEFT JOIN university_programs up ON u.id = up.university_id
WHERE u.slug IN ('xjtlu', 'lyu', 'npu', 'dlut', 'nuaa', 'hit', 'bit-zhuhai', 'upc')
GROUP BY u.name
ORDER BY program_count DESC;

-- View sample programs
SELECT 
    u.name as university,
    pc.title as program,
    pc.level,
    up.tuition_fee,
    up.currency,
    up.intake,
    l.name as language
FROM university_programs up
JOIN universities u ON up.university_id = u.id
JOIN program_catalog pc ON up.program_catalog_id = pc.id
LEFT JOIN languages l ON up.language_id = l.id
WHERE u.slug IN ('xjtlu', 'lyu', 'npu', 'dlut', 'nuaa', 'hit', 'bit-zhuhai', 'upc')
ORDER BY u.name, pc.level, pc.title
LIMIT 20;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- All data inserted successfully
-- Ready to use in your application
-- =====================================================
