-- IMPORT SCRIPT FOR MILGEC 2026
-- GENERATED AT 2026-01-01T16:37:41.209Z

BEGIN;


-- University: Nanjing Forestry University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanjing Forestry University', 
    'nanjing-forestry-university', 
    'Nanjing', 
    'Jiangsu', 
    'NJFU', 
    '52-US NEWS RANKING', 
    ARRAY['N/A'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Forestry', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Forestry Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Forestry at Nanjing Forestry University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-forestry-university'),
    (SELECT id FROM program_catalog WHERE title = 'Forestry'),
    'nanjing-forestry-university-forestry-0',
    'Forestry', 
    16500,
    'September',
    NULL,
    '31st May',
    false,
    false,
    '12/20  No failing grades',
    'Duolingo, TOEFL, IELTS',
    18,
    28,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-forestry-university'),
    'Scholarship-0',
    'Nanjing Forestry University Others Scholarship',
    'Cover tuition fee and Medical insurance (Conditional)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Wood Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Wood Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Wood Science and Engineering at Nanjing Forestry University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-forestry-university'),
    (SELECT id FROM program_catalog WHERE title = 'Wood Science and Engineering'),
    'nanjing-forestry-university-wood-science-and-engineering-1',
    'Wood Science and Engineering', 
    16500,
    'September',
    NULL,
    '31st May',
    false,
    false,
    '12/20  No failing grades',
    'Duolingo, TOEFL, IELTS',
    18,
    28,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-forestry-university'),
    'Scholarship-1',
    'Nanjing Forestry University Others Scholarship',
    'Cover tuition fee and Medical insurance (Conditional)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Nanjing University of Finance and Economics
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanjing University of Finance and Economics', 
    'nanjing-university-of-finance-and-economics', 
    'Nanjing', 
    'Jiangsu', 
    'NUFE', 
    '127-SHANGHAI RANKING', 
    ARRAY['N/A'],
    'Allowed from Second Year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Nanjing University of Finance and Economics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-finance-and-economics'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'nanjing-university-of-finance-and-economics-business-administration-2',
    'Business Administration', 
    17000,
    'September',
    NULL,
    '15th June',
    false,
    false,
    '4/5, 3.5/4, 80/100
(Having expertise in foreign languages, sports, or arts, one''s grades may also be appropriately reduced)',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: Tianjin University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Tianjin University', 
    'tianjin-university', 
    'Tianjin', 
    NULL, 
    'TJU', 
    '20-SHANGHAI RANKING', 
    ARRAY['985 Project','211','Double First-Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemical Engineering', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Chemical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemical Engineering at Tianjin University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'tianjin-university'),
    (SELECT id FROM program_catalog WHERE title = 'Chemical Engineering'),
    'tianjin-university-chemical-engineering-3',
    'Chemical Engineering', 
    20000,
    'September',
    NULL,
    '15th April',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'tianjin-university'),
    'Scholarship-3',
    'Tianjin University Chemical Scholarship',
    'Type A: 
Cover tuition and on campus accommodation fee,
Living allowance: 2,500RMB/month,  (10 months in total)
Type B:
Cover tuition fee
Living allowance:1400RMB /month (10 months in total)
Type C: Cover tuition fee
Type D: Cover 10000RMB tuition fee
Type E: Cover 6000RMB tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Environmental Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Environmental Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Environmental Engineering at Tianjin University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'tianjin-university'),
    (SELECT id FROM program_catalog WHERE title = 'Environmental Engineering'),
    'tianjin-university-environmental-engineering-4',
    'Environmental Engineering', 
    20000,
    'September',
    NULL,
    '15th April',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'tianjin-university'),
    'Scholarship-4',
    'Tianjin University Others Scholarship',
    'Type A: 
Cover tuition and on campus accommodation fee,
Living allowance: 2,500RMB/month,  (10 months in total)
Type B:
Cover tuition fee
Living allowance:1400RMB /month (10 months in total)
Type C: Cover tuition fee
Type D: Cover 10000RMB tuition fee
Type E: Cover 6000RMB tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmaceutical Science', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Pharmaceutical Science Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmaceutical Science at Tianjin University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'tianjin-university'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmaceutical Science'),
    'tianjin-university-pharmaceutical-science-5',
    'Pharmaceutical Science', 
    20000,
    'September',
    NULL,
    '15th April',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'tianjin-university'),
    'Scholarship-5',
    'Tianjin University Pharmacy Scholarship',
    'Type A: 
Cover tuition and on campus accommodation fee,
Living allowance: 2,500RMB/month,  (10 months in total)
Type B:
Cover tuition fee
Living allowance:1400RMB /month (10 months in total)
Type C: Cover tuition fee
Type D: Cover 10000RMB tuition fee
Type E: Cover 6000RMB tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Zhejiang University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Zhejiang University', 
    'zhejiang-university', 
    'Hangzhou', 
    'Zhejiang', 
    'ZJU', 
    '3-SHANGHAI RANKING', 
    ARRAY['985 Project','211','Double First-Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'MBBS_6 years_', 
    'MBBS', 
    'MBBS', 
    'Bachelor', 
    'MBBS_6 years_ Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: MBBS_6 years_ at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'MBBS_6 years_'),
    'zhejiang-university-mbbs-6-years--6',
    'MBBS_6 years_', 
    42800,
    'September',
    NULL,
    '31st May',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-6',
    'Zhejiang University MBBS Scholarship',
    '1. RMB 20,000 -- 5% of the total number of new MBBS students

2. Top 20% of the class (second to sixth year) will be awarded an Outstanding Academic Performance Scholarship by ZJU-ISM.

3. Excellent students (second to sixth year) will be awarded a Zhejiang Provincial Government Scholarship (near 15% of batch 2023 students were 
awarded this scholarship in 2024 based on their academic performance).',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Integrative Biomedical Sciences', 
    'Bio Med', 
    'Bio Med', 
    'Bachelor', 
    'Integrative Biomedical Sciences Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Integrative Biomedical Sciences at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Integrative Biomedical Sciences'),
    'zhejiang-university-integrative-biomedical-sciences-7',
    'Integrative Biomedical Sciences', 
    200000,
    'September',
    NULL,
    '31st May',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-7',
    'Zhejiang University Bio Med Scholarship',
    'There are three rates for tuition fee waivers:

A - 200,000 RMB waiver/year for 4 years (full fee waiver of all tuition fees)

B - 140,000 RMB waiver/year for 4 years (student contribution 60,000 RMB/year)

C - 80,000 RMB waiver/year for 4 years (student contribution 120,000 RMB/year)

D - 40,000 RMB waiver/year for 4 years (student contribution 160,000 RMB/year)

Academic Scholarship and Overseas Scholarship will be awarded during University study.

Duration: 4 years (The scholarship will be reviewed and given on the condition that the student meets the requirements for satisfactory progress toward a degree and follows the rules of the ZJU-UoE Institute.)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biomedical Informatics', 
    'Bio Med', 
    'Bio Med', 
    'Bachelor', 
    'Biomedical Informatics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biomedical Informatics at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Biomedical Informatics'),
    'zhejiang-university-biomedical-informatics-8',
    'Biomedical Informatics', 
    200000,
    'September',
    NULL,
    '31st May',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-8',
    'Zhejiang University Bio Med Scholarship',
    'There are three rates for tuition fee waivers:

A - 200,000 RMB waiver/year for 4 years (full fee waiver of all tuition fees)

B - 140,000 RMB waiver/year for 4 years (student contribution 60,000 RMB/year)

C - 80,000 RMB waiver/year for 4 years (student contribution 120,000 RMB/year)

D - 40,000 RMB waiver/year for 4 years (student contribution 160,000 RMB/year)

Academic Scholarship and Overseas Scholarship will be awarded during University study.

Duration: 4 years (The scholarship will be reviewed and given on the condition that the student meets the requirements for satisfactory progress toward a degree and follows the rules of the ZJU-UoE Institute.)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electrical Engineering and Automation', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electrical Engineering and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electrical Engineering and Automation at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Electrical Engineering and Automation'),
    'zhejiang-university-electrical-engineering-and-automation-9',
    'Electrical Engineering and Automation', 
    80000,
    'September',
    NULL,
    '28th Feb',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-9',
    'Zhejiang University Electrical Scholarship',
    'Partial Tuition Waiver: RMB 32,000   yuan/ Academic Year _Each scholarship will be reviewed   annually and renewed up to four academic years on the conditions

that the student meets requirements   for satisfactory progress toward the degrees and follows the rules of   Zhejiang University._',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Information Engineering', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Information Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Information Engineering at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Information Engineering'),
    'zhejiang-university-information-engineering-10',
    'Information Engineering', 
    80000,
    'September',
    NULL,
    '28th Feb',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-10',
    'Zhejiang University Computer Scholarship',
    'Partial Tuition Waiver: RMB 32,000   yuan/ Academic Year _Each scholarship will be reviewed   annually and renewed up to four academic years on the conditions

that the student meets requirements   for satisfactory progress toward the degrees and follows the rules of   Zhejiang University._',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronic Science and Technology', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electronic Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronic Science and Technology at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Electronic Science and Technology'),
    'zhejiang-university-electronic-science-and-technology-11',
    'Electronic Science and Technology', 
    80000,
    'September',
    NULL,
    '28th Feb',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-11',
    'Zhejiang University Electrical Scholarship',
    'RMB 5,000-30,000Partial Tuition Waiver: RMB 32,000   yuan/ Academic Year _Each scholarship will be reviewed   annually and renewed up to four academic years on the conditions

that the student meets requirements   for satisfactory progress toward the degrees and follows the rules of   Zhejiang University._',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Automation', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Automation at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Automation'),
    'zhejiang-university-automation-12',
    'Automation', 
    80000,
    'September',
    NULL,
    '28th Feb',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-12',
    'Zhejiang University Others Scholarship',
    'Type A: RMB 80,000 yuan / Academic Year
Type B: RMB 40,000 yuan / Academic Year
( Each scholarship will be reviewed   annually and renewed up to four academic years on the conditions
that the student meets requirements   for satisfactory progress toward the degrees and follows the rules of   Zhejiang University._',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Optical Information Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Optical Information Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Optical Information Science and Engineering at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Optical Information Science and Engineering'),
    'zhejiang-university-optical-information-science-and-engineering-13',
    'Optical Information Science and Engineering', 
    80000,
    'September',
    NULL,
    '31st May',
    false,
    false,
    'Type A: 18
Type B: 16',
    'Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-13',
    'Zhejiang University Others Scholarship',
    'Partial Tuition Waiver: RMB 32,000   yuan/ Academic Year _Each scholarship will be reviewed   annually and renewed up to four academic years on the conditions

that the student meets requirements   for satisfactory progress toward the degrees and follows the rules of   Zhejiang University._',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Liaoning Communication University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Liaoning Communication University', 
    'liaoning-communication-university', 
    'Shenyang', 
    'Liaoning', 
    'LNCU', 
    '500+-SHANGHAI RANKING', 
    ARRAY['N/A'],
    'Allowed from Second Year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Visual Communication Design', 
    'Art', 
    'Art', 
    'Bachelor', 
    'Visual Communication Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Visual Communication Design at Liaoning Communication University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-communication-university'),
    (SELECT id FROM program_catalog WHERE title = 'Visual Communication Design'),
    'liaoning-communication-university-visual-communication-design-14',
    'Visual Communication Design', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Animation Design', 
    'Art', 
    'Art', 
    'Bachelor', 
    'Animation Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Animation Design at Liaoning Communication University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-communication-university'),
    (SELECT id FROM program_catalog WHERE title = 'Animation Design'),
    'liaoning-communication-university-animation-design-15',
    'Animation Design', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Fashion Design', 
    'Art', 
    'Art', 
    'Bachelor', 
    'Fashion Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Fashion Design at Liaoning Communication University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-communication-university'),
    (SELECT id FROM program_catalog WHERE title = 'Fashion Design'),
    'liaoning-communication-university-fashion-design-16',
    'Fashion Design', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Trade at Liaoning Communication University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-communication-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Trade'),
    'liaoning-communication-university-international-trade-17',
    'International Trade', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Network & Multi-media Applications', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Network & Multi-media Applications Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Network & Multi-media Applications at Liaoning Communication University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-communication-university'),
    (SELECT id FROM program_catalog WHERE title = 'Network & Multi-media Applications'),
    'liaoning-communication-university-network-multi-media-applications-18',
    'Network & Multi-media Applications', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Multi-media Marketing & Management', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Multi-media Marketing & Management Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Multi-media Marketing & Management at Liaoning Communication University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-communication-university'),
    (SELECT id FROM program_catalog WHERE title = 'Multi-media Marketing & Management'),
    'liaoning-communication-university-multi-media-marketing-management-19',
    'Multi-media Marketing & Management', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: Nanchang University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanchang University', 
    'nanchang-university', 
    'Nanchang', 
    'Jiangxi', 
    'NCU', 
    '73-SHANGHAI RANKING', 
    ARRAY['211','Double First-Class'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Software Engineering', 
    'Software', 
    'Software', 
    'Bachelor', 
    'Software Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Software Engineering at Nanchang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Software Engineering'),
    'nanchang-university-software-engineering-20',
    'Software Engineering', 
    19000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%
Morocco average: �12
Morocco math: �12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    'Scholarship-20',
    'Nanchang University Software Scholarship',
    'Type A: 20000/academic year
Type B:Cover 100% tuition free for the first year
Type C:Cover 70% tuition free for the first year
Type D:Cover 50% tuition free for the first year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Nanchang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'nanchang-university-business-administration-21',
    'Business Administration', 
    18000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%
Morocco average: �12
Morocco math: �12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    'Scholarship-21',
    'Nanchang University Business Scholarship',
    'Type A: 20000/academic year
Type B:Cover 100% tuition free for the first year
Type C:Cover 70% tuition free for the first year
Type D:Cover 50% tuition free for the first year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Nanchang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'nanchang-university-computer-science-and-technology-22',
    'Computer Science and Technology', 
    19000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%
Morocco average: �12
Morocco math: �12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    'Scholarship-22',
    'Nanchang University Computer Scholarship',
    'Type A: 20000/academic year
Type B:Cover 100% tuition free for the first year
Type C:Cover 70% tuition free for the first year
Type D:Cover 50% tuition free for the first year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at Nanchang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'nanchang-university-artificial-intelligence-23',
    'Artificial Intelligence', 
    19000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%
Morocco average: �12
Morocco math: �12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    'Scholarship-23',
    'Nanchang University Artificial Intelligence AI Scholarship',
    'Type A: 20000/academic year
Type B:Cover 100% tuition free for the first year
Type C:Cover 70% tuition free for the first year
Type D:Cover 50% tuition free for the first year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Materials Science and Engineering', 
    'Material', 
    'Material', 
    'Bachelor', 
    'Materials Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Materials Science and Engineering at Nanchang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Materials Science and Engineering'),
    'nanchang-university-materials-science-and-engineering-24',
    'Materials Science and Engineering', 
    19000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%
Morocco average: �12
Morocco math: �12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    'Scholarship-24',
    'Nanchang University Material Scholarship',
    'Type A: 20000/academic year
Type B:Cover 100% tuition free for the first year
Type C:Cover 70% tuition free for the first year
Type D:Cover 50% tuition free for the first year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Material Forming and Control Engineering ( English & Chinese taught)', 
    'Material', 
    'Material', 
    'Bachelor', 
    'Material Forming and Control Engineering ( English & Chinese taught) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Material Forming and Control Engineering ( English & Chinese taught) at Nanchang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Material Forming and Control Engineering ( English & Chinese taught)'),
    'nanchang-university-material-forming-and-control-engineering-english-chinese-taught--25',
    'Material Forming and Control Engineering ( English & Chinese taught)', 
    19000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%
Morocco average: �12
Morocco math: �12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanchang-university'),
    'Scholarship-25',
    'Nanchang University Material Scholarship',
    'Type A: 20000/academic year
Type B:Cover 100% tuition free for the first year
Type C:Cover 70% tuition free for the first year
Type D:Cover 50% tuition free for the first year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Zhengzhou University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Zhengzhou University', 
    'zhengzhou-university', 
    'Zhengzhou', 
    'Henan', 
    'ZZU', 
    '29-US NEWS RANKING', 
    ARRAY['211','Double First-Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'MBBS (6 years)', 
    'MBBS', 
    'MBBS', 
    'Bachelor', 
    'MBBS (6 years) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: MBBS (6 years) at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'MBBS (6 years)'),
    'zhengzhou-university-mbbs-6-years--26',
    'MBBS (6 years)', 
    35000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Dental Surgery (6 years)', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Dental Surgery (6 years) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Dental Surgery (6 years) at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Dental Surgery (6 years)'),
    'zhengzhou-university-dental-surgery-6-years--27',
    'Dental Surgery (6 years)', 
    35000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmacy', 
    'BDS', 
    'BDS', 
    'Bachelor', 
    'Pharmacy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmacy at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmacy'),
    'zhengzhou-university-pharmacy-28',
    'Pharmacy', 
    25000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-28',
    'Zhengzhou University BDS Scholarship',
    '20,000 RMB/year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Software Engineering', 
    'Software', 
    'Software', 
    'Bachelor', 
    'Software Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Software Engineering at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Software Engineering'),
    'zhengzhou-university-software-engineering-29',
    'Software Engineering', 
    25000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-29',
    'Zhengzhou University Software Scholarship',
    '20,000 RMB/year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'zhengzhou-university-civil-engineering-30',
    'Civil Engineering', 
    25000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-30',
    'Zhengzhou University Civil Eng Scholarship',
    '20,000 RMB a year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economy and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economy and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economy and Trade at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economy and Trade'),
    'zhengzhou-university-international-economy-and-trade-31',
    'International Economy and Trade', 
    23000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-31',
    'Zhengzhou University Business Scholarship',
    'Type A: Cover tuition fee.(20 seats, but only for students who have already enrolled in the advanced Chinese Language and English Foundation courses)(4 years)
Type B: 18,000RMB/year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Tourism Management', 
    'Tourism', 
    'Tourism', 
    'Bachelor', 
    'Tourism Management Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Tourism Management at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Tourism Management'),
    'zhengzhou-university-tourism-management-32',
    'Tourism Management', 
    23000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-32',
    'Zhengzhou University Tourism Scholarship',
    'Type A: Cover tuition fee. (20 seats, but only for students who have already enrolled in the advanced Chinese Language and English Foundation courses)(4 years)
Type B: 18,000RMB/year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Urban and Rural Planning', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Urban and Rural Planning Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Urban and Rural Planning at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Urban and Rural Planning'),
    'zhengzhou-university-urban-and-rural-planning-33',
    'Urban and Rural Planning', 
    25000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-33',
    'Zhengzhou University Others Scholarship',
    'Type A: Cover tuition fee.(20 seats, but only for students who have already enrolled in the advanced Chinese Language and English Foundation courses)(4 years)
Type B: 20,000RMB/year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Architecture (5 years)', 
    'Architecture', 
    'Architecture', 
    'Bachelor', 
    'Architecture (5 years) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Architecture (5 years) at Zhengzhou University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    (SELECT id FROM program_catalog WHERE title = 'Architecture (5 years)'),
    'zhengzhou-university-architecture-5-years--34',
    'Architecture (5 years)', 
    25000,
    'September',
    NULL,
    '30th June',
    true,
    true,
    'Morocco average: �14',
    'EFFST, Duolingo, TOEFL, IELTS',
    30,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhengzhou-university'),
    'Scholarship-34',
    'Zhengzhou University Architecture Scholarship',
    'Type A: Cover tuition fee.(20 seats, but only for students who have already enrolled in the advanced Chinese Language and English Foundation courses)(4 years)
Type B: 20,000RMB/year (4 years)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Beijing Language and Culture University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing Language and Culture University', 
    'beijing-language-and-culture-university', 
    'Beijing', 
    NULL, 
    'BLCU', 
    '5-SHANGHAI RANKING of Chinese Language Universities', 
    ARRAY['N/A'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Finance', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Finance Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Finance at Beijing Language and Culture University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    (SELECT id FROM program_catalog WHERE title = 'Finance'),
    'beijing-language-and-culture-university-finance-35',
    'Finance', 
    39000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%',
    'TOEFL, TOEIC, IELTS',
    55,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    'Scholarship-35',
    'Beijing Language and Culture University Business Scholarship',
    'Free first year tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Beijing Language and Culture University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'beijing-language-and-culture-university-international-economics-and-trade-36',
    'International Economics and Trade', 
    39000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%',
    'TOEFL, IELTS',
    55,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    'Scholarship-36',
    'Beijing Language and Culture University Business Scholarship',
    'Free first year tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Accounting', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Accounting Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Accounting at Beijing Language and Culture University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    (SELECT id FROM program_catalog WHERE title = 'Accounting'),
    'beijing-language-and-culture-university-accounting-37',
    'Accounting', 
    39000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%',
    'TOEFL, IELTS',
    55,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    'Scholarship-37',
    'Beijing Language and Culture University Business Scholarship',
    'Free first year tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Special Education', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Special Education Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Special Education at Beijing Language and Culture University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    (SELECT id FROM program_catalog WHERE title = 'Special Education'),
    'beijing-language-and-culture-university-special-education-38',
    'Special Education', 
    39000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%',
    'TOEFL, IELTS',
    55,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    'Scholarship-38',
    'Beijing Language and Culture University Others Scholarship',
    'Free first year tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Sinology and China Studies', 
    'Language Related', 
    'Language Related', 
    'Bachelor', 
    'Sinology and China Studies Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Sinology and China Studies at Beijing Language and Culture University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    (SELECT id FROM program_catalog WHERE title = 'Sinology and China Studies'),
    'beijing-language-and-culture-university-sinology-and-china-studies-39',
    'Sinology and China Studies', 
    39000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '70%',
    'TOEFL, IELTS',
    55,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-language-and-culture-university'),
    'Scholarship-39',
    'Beijing Language and Culture University Language Related Scholarship',
    'Free first year tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Shandong University of Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Shandong University of Technology', 
    'shandong-university-of-technology', 
    'Zibo', 
    'Shandong', 
    'SDUT', 
    '194-SHANGHAI RANKING', 
    ARRAY['N/A'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Design, Manufacturing and Automation', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Design, Manufacturing and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Design, Manufacturing and Automation at Shandong University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Design, Manufacturing and Automation'),
    'shandong-university-of-technology-mechanical-design-manufacturing-and-automation-40',
    'Mechanical Design, Manufacturing and Automation', 
    16000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    'Scholarship-40',
    'Shandong University of Technology Mechanical Scholarship',
    'Tuition + dorm=RMB8800/year (quad room)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Shandong University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'shandong-university-of-technology-computer-science-and-technology-41',
    'Computer Science and Technology', 
    16000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    'Scholarship-41',
    'Shandong University of Technology Computer Scholarship',
    'Tuition + dorm=RMB8800/year (quad room)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Shandong University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'shandong-university-of-technology-international-economics-and-trade-42',
    'International Economics and Trade', 
    16000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    'Scholarship-42',
    'Shandong University of Technology Business Scholarship',
    'Tuition + dorm=RMB8800/year (quad room)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Shandong University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'shandong-university-of-technology-civil-engineering-43',
    'Civil Engineering', 
    16000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    'Scholarship-43',
    'Shandong University of Technology Civil Eng Scholarship',
    'Tuition + dorm=RMB8800/year (quad room)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electrical Engineering and Automation', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electrical Engineering and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electrical Engineering and Automation at Shandong University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Electrical Engineering and Automation'),
    'shandong-university-of-technology-electrical-engineering-and-automation-44',
    'Electrical Engineering and Automation', 
    16000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    'Scholarship-44',
    'Shandong University of Technology Electrical Scholarship',
    'Tuition + dorm=RMB8800/year (quad room)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Resource Exploration Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Resource Exploration Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Resource Exploration Engineering at Shandong University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Resource Exploration Engineering'),
    'shandong-university-of-technology-resource-exploration-engineering-45',
    'Resource Exploration Engineering', 
    16000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Over D or 60%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-technology'),
    'Scholarship-45',
    'Shandong University of Technology Others Scholarship',
    'Tuition + dorm=RMB8800/year (quad room)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Southern University of Science and Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Southern University of Science and Technology', 
    'southern-university-of-science-and-technology', 
    'Shenzhen', 
    'Guangdong', 
    'SUSTech', 
    '32-SHANGHAI RANKING', 
    ARRAY['Double First-Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Industrial Design _School of Automation and Intelligent Manufacturing_', 
    'Design', 
    'Design', 
    'Bachelor', 
    'Industrial Design _School of Automation and Intelligent Manufacturing_ Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Industrial Design _School of Automation and Intelligent Manufacturing_ at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Industrial Design _School of Automation and Intelligent Manufacturing_'),
    'southern-university-of-science-and-technology-industrial-design-school-of-automation-and-intelligent-manufacturing--46',
    'Industrial Design _School of Automation and Intelligent Manufacturing_', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-46',
    'Southern University of Science and Technology Design Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biomedical Science', 
    'Bio Med', 
    'Bio Med', 
    'Bachelor', 
    'Biomedical Science Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biomedical Science at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Biomedical Science'),
    'southern-university-of-science-and-technology-biomedical-science-47',
    'Biomedical Science', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-47',
    'Southern University of Science and Technology Bio Med Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Science and Engineering for Renewables', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Science and Engineering for Renewables Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Science and Engineering for Renewables at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Science and Engineering for Renewables'),
    'southern-university-of-science-and-technology-science-and-engineering-for-renewables-48',
    'Science and Engineering for Renewables', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-48',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Automation', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Automation at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Automation'),
    'southern-university-of-science-and-technology-automation-49',
    'Automation', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-49',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemistry', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Chemistry Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemistry at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Chemistry'),
    'southern-university-of-science-and-technology-chemistry-50',
    'Chemistry', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-50',
    'Southern University of Science and Technology Chemical Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Offshore Engineering and Technology', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Offshore Engineering and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Offshore Engineering and Technology at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Offshore Engineering and Technology'),
    'southern-university-of-science-and-technology-offshore-engineering-and-technology-51',
    'Offshore Engineering and Technology', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-51',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Industrial Design (School of Design)', 
    'Design', 
    'Design', 
    'Bachelor', 
    'Industrial Design (School of Design) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Industrial Design (School of Design) at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Industrial Design (School of Design)'),
    'southern-university-of-science-and-technology-industrial-design-school-of-design--52',
    'Industrial Design (School of Design)', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-52',
    'Southern University of Science and Technology Design Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronic and Photonic Materials and Devices', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electronic and Photonic Materials and Devices Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronic and Photonic Materials and Devices at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Electronic and Photonic Materials and Devices'),
    'southern-university-of-science-and-technology-electronic-and-photonic-materials-and-devices-53',
    'Electronic and Photonic Materials and Devices', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-53',
    'Southern University of Science and Technology Electrical Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Financial Engineering', 
    'Finance', 
    'Finance', 
    'Bachelor', 
    'Financial Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Financial Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Financial Engineering'),
    'southern-university-of-science-and-technology-financial-engineering-54',
    'Financial Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-54',
    'Southern University of Science and Technology Finance Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Finance', 
    'Finance', 
    'Finance', 
    'Bachelor', 
    'Finance Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Finance at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Finance'),
    'southern-university-of-science-and-technology-finance-55',
    'Finance', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-55',
    'Southern University of Science and Technology Finance Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Physics', 
    'Physics', 
    'Physics', 
    'Bachelor', 
    'Physics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Physics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Physics'),
    'southern-university-of-science-and-technology-physics-56',
    'Physics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-56',
    'Southern University of Science and Technology Physics Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Applied Physics', 
    'Physics', 
    'Physics', 
    'Bachelor', 
    'Applied Physics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Applied Physics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Applied Physics'),
    'southern-university-of-science-and-technology-applied-physics-57',
    'Applied Physics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-57',
    'Southern University of Science and Technology Physics Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Statistics', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Statistics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Statistics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Statistics'),
    'southern-university-of-science-and-technology-statistics-58',
    'Statistics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-58',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mathematics and Applied Mathematics', 
    'Math', 
    'Math', 
    'Bachelor', 
    'Mathematics and Applied Mathematics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mathematics and Applied Mathematics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mathematics and Applied Mathematics'),
    'southern-university-of-science-and-technology-mathematics-and-applied-mathematics-59',
    'Mathematics and Applied Mathematics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-59',
    'Southern University of Science and Technology Math Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Medical Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Intelligent Medical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Medical Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Medical Engineering'),
    'southern-university-of-science-and-technology-intelligent-medical-engineering-60',
    'Intelligent Medical Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-60',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biomedical Engineering', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Biomedical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biomedical Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Biomedical Engineering'),
    'southern-university-of-science-and-technology-biomedical-engineering-61',
    'Biomedical Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-61',
    'Southern University of Science and Technology Bio Eng. Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Bioinformatics', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Bioinformatics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Bioinformatics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Bioinformatics'),
    'southern-university-of-science-and-technology-bioinformatics-62',
    'Bioinformatics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-62',
    'Southern University of Science and Technology Bio Eng. Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biological Sciences (Biological Science)', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Biological Sciences (Biological Science) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biological Sciences (Biological Science) at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Biological Sciences (Biological Science)'),
    'southern-university-of-science-and-technology-biological-sciences-biological-science--63',
    'Biological Sciences (Biological Science)', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-63',
    'Southern University of Science and Technology Bio Eng. Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Microelectronics Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Microelectronics Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Microelectronics Science and Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Microelectronics Science and Engineering'),
    'southern-university-of-science-and-technology-microelectronics-science-and-engineering-64',
    'Microelectronics Science and Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-64',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Big Data Management and Application', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Big Data Management and Application Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Big Data Management and Application at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Big Data Management and Application'),
    'southern-university-of-science-and-technology-big-data-management-and-application-65',
    'Big Data Management and Application', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-65',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Theoretical and Applied Mechanics', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Theoretical and Applied Mechanics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Theoretical and Applied Mechanics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Theoretical and Applied Mechanics'),
    'southern-university-of-science-and-technology-theoretical-and-applied-mechanics-66',
    'Theoretical and Applied Mechanics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-66',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aerospace Engineering', 
    'Aero(nautic/space)', 
    'Aero(nautic/space)', 
    'Bachelor', 
    'Aerospace Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aerospace Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Aerospace Engineering'),
    'southern-university-of-science-and-technology-aerospace-engineering-67',
    'Aerospace Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-67',
    'Southern University of Science and Technology Aero(nautic/space) Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligence Science and Technology', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Intelligence Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligence Science and Technology at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligence Science and Technology'),
    'southern-university-of-science-and-technology-intelligence-science-and-technology-68',
    'Intelligence Science and Technology', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-68',
    'Southern University of Science and Technology Artificial Intelligence AI Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'southern-university-of-science-and-technology-computer-science-and-technology-69',
    'Computer Science and Technology', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-69',
    'Southern University of Science and Technology Computer Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Robotics Engineering', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Robotics Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Robotics Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Robotics Engineering'),
    'southern-university-of-science-and-technology-robotics-engineering-70',
    'Robotics Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-70',
    'Southern University of Science and Technology Artificial Intelligence AI Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'southern-university-of-science-and-technology-mechanical-engineering-71',
    'Mechanical Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-71',
    'Southern University of Science and Technology Mechanical Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Environmental Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Environmental Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Environmental Science and Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Environmental Science and Engineering'),
    'southern-university-of-science-and-technology-environmental-science-and-engineering-72',
    'Environmental Science and Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-72',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Hydrology and Water Resources Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Hydrology and Water Resources Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Hydrology and Water Resources Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Hydrology and Water Resources Engineering'),
    'southern-university-of-science-and-technology-hydrology-and-water-resources-engineering-73',
    'Hydrology and Water Resources Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-73',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Oceanography', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Oceanography Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Oceanography at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Oceanography'),
    'southern-university-of-science-and-technology-oceanography-74',
    'Oceanography', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-74',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Communication Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Communication Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Communication Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Communication Engineering'),
    'southern-university-of-science-and-technology-communication-engineering-75',
    'Communication Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-75',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Optoelectronic lnformation Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Optoelectronic lnformation Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Optoelectronic lnformation Science and Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Optoelectronic lnformation Science and Engineering'),
    'southern-university-of-science-and-technology-optoelectronic-lnformation-science-and-engineering-76',
    'Optoelectronic lnformation Science and Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-76',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Information Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Information Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Information Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Information Engineering'),
    'southern-university-of-science-and-technology-information-engineering-77',
    'Information Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-77',
    'Southern University of Science and Technology Others Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Geophysics', 
    'Geology', 
    'Geology', 
    'Bachelor', 
    'Geophysics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Geophysics at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Geophysics'),
    'southern-university-of-science-and-technology-geophysics-78',
    'Geophysics', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-78',
    'Southern University of Science and Technology Geology Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Materials Science and Engineering', 
    'Material', 
    'Material', 
    'Bachelor', 
    'Materials Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Materials Science and Engineering at Southern University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Materials Science and Engineering'),
    'southern-university-of-science-and-technology-materials-science-and-engineering-79',
    'Materials Science and Engineering', 
    30000,
    'September',
    NULL,
    '30th, April',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL',
    20,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'southern-university-of-science-and-technology'),
    'Scholarship-79',
    'Southern University of Science and Technology Material Scholarship',
    'Type A: Cover tuition fee, accommodation fee, insurance fee and living allowance: 2500RMB/month
Type B: 30,000RMB/year. 
Type C: 10,000 RMB for one year.',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Huazhong University 
of Science and Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Huazhong University 
of Science and Technology', 
    'huazhong-university-of-science-and-technology', 
    'Wuhan', 
    'Hubei', 
    'HUST', 
    '9-SHANGHAI 
RANKING', 
    ARRAY['985 Project','211','Double First-Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Design, Manufacturing and Automation', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Design, Manufacturing and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Design, Manufacturing and Automation at Huazhong University 
of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'huazhong-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Design, Manufacturing and Automation'),
    'huazhong-university-of-science-and-technology-mechanical-design-manufacturing-and-automation-80',
    'Mechanical Design, Manufacturing and Automation', 
    30000,
    'September',
    NULL,
    '15th,June',
    false,
    false,
    '12',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biomedical Engineering', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Biomedical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biomedical Engineering at Huazhong University 
of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'huazhong-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Biomedical Engineering'),
    'huazhong-university-of-science-and-technology-biomedical-engineering-81',
    'Biomedical Engineering', 
    30000,
    'September',
    NULL,
    '15th,June',
    false,
    false,
    '12',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Telecommunications Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Telecommunications Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Telecommunications Engineering at Huazhong University 
of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'huazhong-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Telecommunications Engineering'),
    'huazhong-university-of-science-and-technology-telecommunications-engineering-82',
    'Telecommunications Engineering', 
    30000,
    'September',
    NULL,
    '15th,June',
    false,
    false,
    '12',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmacy', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Pharmacy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmacy at Huazhong University 
of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'huazhong-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmacy'),
    'huazhong-university-of-science-and-technology-pharmacy-83',
    'Pharmacy', 
    35000,
    'September',
    NULL,
    '15th,June',
    false,
    false,
    '12',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Clinical Medicine', 
    'MBBS', 
    'MBBS', 
    'Bachelor', 
    'Clinical Medicine Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Clinical Medicine at Huazhong University 
of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'huazhong-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Clinical Medicine'),
    'huazhong-university-of-science-and-technology-clinical-medicine-84',
    'Clinical Medicine', 
    40000,
    'September',
    NULL,
    '15th,June',
    false,
    false,
    '12',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: East China Normal University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'East China Normal University', 
    'east-china-normal-university', 
    'Shanghai', 
    NULL, 
    'ECNU', 
    '20-UNIPAGE 
RANKING', 
    ARRAY['985 Project','211','Double First-Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Visual Communication Design', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Visual Communication Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Visual Communication Design at East China Normal University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-normal-university'),
    (SELECT id FROM program_catalog WHERE title = 'Visual Communication Design'),
    'east-china-normal-university-visual-communication-design-85',
    'Visual Communication Design', 
    50000,
    'September',
    NULL,
    '1st June',
    true,
    true,
    NULL,
    'TOEFL, IELTS, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Environmental Design', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Environmental Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Environmental Design at East China Normal University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-normal-university'),
    (SELECT id FROM program_catalog WHERE title = 'Environmental Design'),
    'east-china-normal-university-environmental-design-86',
    'Environmental Design', 
    50000,
    'September',
    NULL,
    '1st June',
    true,
    true,
    NULL,
    'TOEFL, IELTS, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration(Single Degree)', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration(Single Degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration(Single Degree) at East China Normal University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-normal-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration(Single Degree)'),
    'east-china-normal-university-business-administration-single-degree--87',
    'Business Administration(Single Degree)', 
    54000,
    'September',
    NULL,
    '1st June',
    true,
    true,
    NULL,
    'TOEFL, IELTS, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration(Double Degree)', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration(Double Degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration(Double Degree) at East China Normal University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-normal-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration(Double Degree)'),
    'east-china-normal-university-business-administration-double-degree--88',
    'Business Administration(Double Degree)', 
    108000,
    'September',
    NULL,
    '1st June',
    true,
    true,
    NULL,
    'TOEFL, IELTS, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: Shenyang Aerospace University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Shenyang Aerospace University', 
    'shenyang-aerospace-university', 
    'Shenyang Liaoning', 
    NULL, 
    'SAU', 
    '183-UNIPAGE 
RANKING', 
    ARRAY['N/A'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aircraft Maintenance', 
    'Aero(nautic/space)', 
    'Aero(nautic/space)', 
    'Bachelor', 
    'Aircraft Maintenance Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aircraft Maintenance at Shenyang Aerospace University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shenyang-aerospace-university'),
    (SELECT id FROM program_catalog WHERE title = 'Aircraft Maintenance'),
    'shenyang-aerospace-university-aircraft-maintenance-89',
    'Aircraft Maintenance', 
    18000,
    'March',
    NULL,
    '1st March',
    false,
    false,
    NULL,
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aeronautical Engineering', 
    'Aero(nautic/space)', 
    'Aero(nautic/space)', 
    'Bachelor', 
    'Aeronautical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aeronautical Engineering at Shenyang Aerospace University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shenyang-aerospace-university'),
    (SELECT id FROM program_catalog WHERE title = 'Aeronautical Engineering'),
    'shenyang-aerospace-university-aeronautical-engineering-90',
    'Aeronautical Engineering', 
    18000,
    'March',
    NULL,
    '1st March',
    false,
    false,
    NULL,
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Shenyang Aerospace University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shenyang-aerospace-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'shenyang-aerospace-university-mechanical-engineering-91',
    'Mechanical Engineering', 
    18000,
    'March',
    NULL,
    '1st March',
    false,
    false,
    NULL,
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Shenyang Aerospace University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shenyang-aerospace-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'shenyang-aerospace-university-computer-science-and-technology-92',
    'Computer Science and Technology', 
    18000,
    'March',
    NULL,
    '1st March',
    false,
    false,
    NULL,
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Shenyang Aerospace University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shenyang-aerospace-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'shenyang-aerospace-university-international-economics-and-trade-93',
    'International Economics and Trade', 
    18000,
    'March',
    NULL,
    '1st March',
    false,
    false,
    NULL,
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: Beijing Institute of Graphic Communication
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing Institute of Graphic Communication', 
    'beijing-institute-of-graphic-communication', 
    'Beijing', 
    NULL, 
    'BIGC', 
    '302-SHANGHAI RANKING', 
    ARRAY['N/A'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Printing Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Printing Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Printing Engineering at Beijing Institute of Graphic Communication
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    (SELECT id FROM program_catalog WHERE title = 'Printing Engineering'),
    'beijing-institute-of-graphic-communication-printing-engineering-94',
    'Printing Engineering', 
    16000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '80,00%',
    'IELTS, TOEFL, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    'Scholarship-94',
    'Beijing Institute of Graphic Communication Others Scholarship',
    '1st year: Free tuition and insurance
2-4year: 1_Free tuition and insurance
              2_Half tuition',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Communication', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Communication Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Communication at Beijing Institute of Graphic Communication
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    (SELECT id FROM program_catalog WHERE title = 'Communication'),
    'beijing-institute-of-graphic-communication-communication-95',
    'Communication', 
    16000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '80,00%',
    'IELTS, TOEFL, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    'Scholarship-95',
    'Beijing Institute of Graphic Communication Others Scholarship',
    '1st year: Free tuition and insurance
2-4year: 1_Free tuition and insurance
              2_Half tuition',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Beijing Institute of Graphic Communication
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'beijing-institute-of-graphic-communication-mechanical-engineering-96',
    'Mechanical Engineering', 
    16000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '80,00%',
    'IELTS, TOEFL, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    'Scholarship-96',
    'Beijing Institute of Graphic Communication Mechanical Scholarship',
    '1st year: Free tuition and insurance
2-4year: 1_Free tuition and insurance
              2_Half tuition',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Beijing Institute of Graphic Communication
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'beijing-institute-of-graphic-communication-computer-science-and-technology-97',
    'Computer Science and Technology', 
    16000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '80,00%',
    'IELTS, TOEFL, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    'Scholarship-97',
    'Beijing Institute of Graphic Communication Computer Scholarship',
    '1st year: Free tuition and insurance
2-4year: 1_Free tuition and insurance
              2_Half tuition',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Packaging Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Packaging Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Packaging Engineering at Beijing Institute of Graphic Communication
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    (SELECT id FROM program_catalog WHERE title = 'Packaging Engineering'),
    'beijing-institute-of-graphic-communication-packaging-engineering-98',
    'Packaging Engineering', 
    16000,
    'September',
    NULL,
    '30th June',
    false,
    false,
    '80,00%',
    'IELTS, TOEFL, Duolingo, EFFST',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-graphic-communication'),
    'Scholarship-98',
    'Beijing Institute of Graphic Communication Others Scholarship',
    '1st year: Free tuition and insurance
2-4year: 1_Free tuition and insurance
              2_Half tuition',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Xidian University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Xidian University', 
    'xidian-university', 
    'Xi''an Shaanxi', 
    NULL, 
    'XDU', 
    '32-4ICU RANKING', 
    ARRAY['211','Double First-class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Xidian University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xidian-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'xidian-university-computer-science-and-technology-99',
    'Computer Science and Technology', 
    25000,
    'September',
    NULL,
    '1st March',
    false,
    false,
    '15,75%',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xidian-university'),
    'Scholarship-99',
    'Xidian University Computer Scholarship',
    'Type A:Cover one year tuition fee and accommodation fee,with stipend 30000RMB/year
Type B:Cover one year tuition fee and accommodation fee,with stipend 15000RMB/year
Type C:Cover one year tuition fee and accommodation fee
Type D:Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Information and Computational Science', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Information and Computational Science Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Information and Computational Science at Xidian University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xidian-university'),
    (SELECT id FROM program_catalog WHERE title = 'Information and Computational Science'),
    'xidian-university-information-and-computational-science-100',
    'Information and Computational Science', 
    25000,
    'September',
    NULL,
    '1st March',
    false,
    false,
    '15,75%',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xidian-university'),
    'Scholarship-100',
    'Xidian University Others Scholarship',
    'Type A:Cover one year tuition fee and accommodation fee,with stipend 30000RMB/year
Type B:Cover one year tuition fee and accommodation fee,with stipend 15000RMB/year
Type C:Cover one year tuition fee and accommodation fee
Type D:Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Applied Physics', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Applied Physics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Applied Physics at Xidian University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xidian-university'),
    (SELECT id FROM program_catalog WHERE title = 'Applied Physics'),
    'xidian-university-applied-physics-101',
    'Applied Physics', 
    25000,
    'September',
    NULL,
    '1st March',
    false,
    false,
    '15,75%',
    'Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xidian-university'),
    'Scholarship-101',
    'Xidian University Others Scholarship',
    'Type A:Cover one year tuition fee and accommodation fee,with stipend 30000RMB/year
Type B:Cover one year tuition fee and accommodation fee,with stipend 15000RMB/year
Type C:Cover one year tuition fee and accommodation fee
Type D:Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Beijing Technology and Business University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing Technology and Business University', 
    'beijing-technology-and-business-university', 
    'Beijing', 
    NULL, 
    'BTBU', 
    '146- 4ICU RANKING', 
    ARRAY['N/A'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Accounting', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Accounting Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Accounting at Beijing Technology and Business University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-technology-and-business-university'),
    (SELECT id FROM program_catalog WHERE title = 'Accounting'),
    'beijing-technology-and-business-university-accounting-102',
    'Accounting', 
    24000,
    'September',
    NULL,
    '1st May',
    false,
    false,
    NULL,
    'TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-technology-and-business-university'),
    'Scholarship-102',
    'Beijing Technology and Business University Business Scholarship',
    'Type A:Cover tuition fee and accommodation fee,Insurance fee
Type B:Cover tuition fee,Insurance fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Central South University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Central South University', 
    'central-south-university', 
    'Changsha', 
    'Hunan', 
    'CSU', 
    '27-SHANGHAI RANKING', 
    ARRAY['985 Project','211','Double First-Class'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering (Dual degree)', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering (Dual degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering (Dual degree) at Central South University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'central-south-university'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering (Dual degree)'),
    'central-south-university-civil-engineering-dual-degree--103',
    'Civil Engineering (Dual degree)', 
    69000,
    'September',
    'open',
    '31st, May',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mathematics (Dual degree)', 
    'Math', 
    'Math', 
    'Bachelor', 
    'Mathematics (Dual degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mathematics (Dual degree) at Central South University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'central-south-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mathematics (Dual degree)'),
    'central-south-university-mathematics-dual-degree--104',
    'Mathematics (Dual degree)', 
    69000,
    'September',
    'open',
    '31st, May',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computing Science (Dual degree)', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computing Science (Dual degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computing Science (Dual degree) at Central South University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'central-south-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computing Science (Dual degree)'),
    'central-south-university-computing-science-dual-degree--105',
    'Computing Science (Dual degree)', 
    69000,
    'September',
    'open',
    '31st, May',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering (Dual degree)', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering (Dual degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering (Dual degree) at Central South University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'central-south-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering (Dual degree)'),
    'central-south-university-mechanical-engineering-dual-degree--106',
    'Mechanical Engineering (Dual degree)', 
    69000,
    'September',
    'open',
    '31st, May',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering with Transportation (Dual degree)', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering with Transportation (Dual degree) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering with Transportation (Dual degree) at Central South University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'central-south-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering with Transportation (Dual degree)'),
    'central-south-university-mechanical-engineering-with-transportation-dual-degree--107',
    'Mechanical Engineering with Transportation (Dual degree)', 
    69000,
    'September',
    'open',
    '31st, May',
    false,
    false,
    'Pass CSCA',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: Zhejiang International Studies University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Zhejiang International Studies University', 
    'zhejiang-international-studies-university', 
    'Hangzhou', 
    'Zhejiang', 
    'ZISU', 
    '282-SHANGHAI RANKING', 
    ARRAY['N/A'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Cross Border E-commerce', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Cross Border E-commerce Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Cross Border E-commerce at Zhejiang International Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'Cross Border E-commerce'),
    'zhejiang-international-studies-university-cross-border-e-commerce-108',
    'Cross Border E-commerce', 
    18000,
    'September',
    'open',
    '10th, July',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    'Scholarship-108',
    'Zhejiang International Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 50% tuition fee
Type C: Free first year 25% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economy and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economy and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economy and Trade at Zhejiang International Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economy and Trade'),
    'zhejiang-international-studies-university-international-economy-and-trade-109',
    'International Economy and Trade', 
    18000,
    'September',
    'open',
    '10th, July',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    'Scholarship-109',
    'Zhejiang International Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 50% tuition fee
Type C: Free first year 25% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Tourism Management', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Tourism Management Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Tourism Management at Zhejiang International Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'Tourism Management'),
    'zhejiang-international-studies-university-tourism-management-110',
    'Tourism Management', 
    18000,
    'September',
    'open',
    '10th, July',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    'Scholarship-110',
    'Zhejiang International Studies University Others Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 50% tuition fee
Type C: Free first year 25% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business English
(Business Environment in China)', 
    'Language Related', 
    'Language Related', 
    'Bachelor', 
    'Business English
(Business Environment in China) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business English
(Business Environment in China) at Zhejiang International Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business English
(Business Environment in China)'),
    'zhejiang-international-studies-university-business-english-business-environment-in-china--111',
    'Business English
(Business Environment in China)', 
    18000,
    'September',
    'open',
    '10th, July',
    false,
    false,
    '70%',
    'EFFST, Duolingo, TOEFL, IELTS',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-international-studies-university'),
    'Scholarship-111',
    'Zhejiang International Studies University Language Related Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 50% tuition fee
Type C: Free first year 25% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Beijing Foreign Studies University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing Foreign Studies University', 
    'beijing-foreign-studies-university', 
    'Beijing', 
    NULL, 
    'BFSU', 
    '82-SHANGHAI RANKING', 
    ARRAY['N/A'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration (Research direction: International Marketing)', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration (Research direction: International Marketing) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration (Research direction: International Marketing) at Beijing Foreign Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration (Research direction: International Marketing)'),
    'beijing-foreign-studies-university-business-administration-research-direction-international-marketing--112',
    'Business Administration (Research direction: International Marketing)', 
    39900,
    'September',
    'open',
    '15th, July',
    false,
    false,
    '80%',
    'IELTS, TOEFL, TOEIC',
    18,
    25,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    'Scholarship-112',
    'Beijing Foreign Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 90% tuition fee
Type C: Free first year 80% tuition fee
Type D: Free first year 70% tuition fee
Type E: Free first year 60% tuition fee
Type F: Free first year 50% tuition fee
Type G: Free first year 40% tuition fee
Type H: Free first year 30% tuition fee
Type I: Free first year 20% tuition fee
Type J: Free first year 10% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration (Research direction: Chinese Business Studies)', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration (Research direction: Chinese Business Studies) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration (Research direction: Chinese Business Studies) at Beijing Foreign Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration (Research direction: Chinese Business Studies)'),
    'beijing-foreign-studies-university-business-administration-research-direction-chinese-business-studies--113',
    'Business Administration (Research direction: Chinese Business Studies)', 
    39900,
    'September',
    'open',
    '15th, July',
    false,
    false,
    '80%',
    'IELTS, TOEFL, TOEIC',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    'Scholarship-113',
    'Beijing Foreign Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 90% tuition fee
Type C: Free first year 80% tuition fee
Type D: Free first year 70% tuition fee
Type E: Free first year 60% tuition fee
Type F: Free first year 50% tuition fee
Type G: Free first year 40% tuition fee
Type H: Free first year 30% tuition fee
Type I: Free first year 20% tuition fee
Type J: Free first year 10% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Beijing Foreign Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'beijing-foreign-studies-university-international-economics-and-trade-114',
    'International Economics and Trade', 
    39900,
    'September',
    'open',
    '15th, July',
    false,
    false,
    '80%',
    'IELTS, TOEFL, TOEIC',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    'Scholarship-114',
    'Beijing Foreign Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 90% tuition fee
Type C: Free first year 80% tuition fee
Type D: Free first year 70% tuition fee
Type E: Free first year 60% tuition fee
Type F: Free first year 50% tuition fee
Type G: Free first year 40% tuition fee
Type H: Free first year 30% tuition fee
Type I: Free first year 20% tuition fee
Type J: Free first year 10% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Business', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Business Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Business at Beijing Foreign Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Business'),
    'beijing-foreign-studies-university-international-business-115',
    'International Business', 
    39900,
    'September',
    'open',
    '15th, July',
    false,
    false,
    '80%',
    'IELTS, TOEFL, TOEIC',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    'Scholarship-115',
    'Beijing Foreign Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 90% tuition fee
Type C: Free first year 80% tuition fee
Type D: Free first year 70% tuition fee
Type E: Free first year 60% tuition fee
Type F: Free first year 50% tuition fee
Type G: Free first year 40% tuition fee
Type H: Free first year 30% tuition fee
Type I: Free first year 20% tuition fee
Type J: Free first year 10% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'E-Commerce', 
    'Business', 
    'Business', 
    'Bachelor', 
    'E-Commerce Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: E-Commerce at Beijing Foreign Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'E-Commerce'),
    'beijing-foreign-studies-university-e-commerce-116',
    'E-Commerce', 
    39900,
    'September',
    'open',
    '15th, July',
    false,
    false,
    '80%',
    'IELTS, TOEFL, TOEIC',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    'Scholarship-116',
    'Beijing Foreign Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 90% tuition fee
Type C: Free first year 80% tuition fee
Type D: Free first year 70% tuition fee
Type E: Free first year 60% tuition fee
Type F: Free first year 50% tuition fee
Type G: Free first year 40% tuition fee
Type H: Free first year 30% tuition fee
Type I: Free first year 20% tuition fee
Type J: Free first year 10% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Finance', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Finance Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Finance at Beijing Foreign Studies University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    (SELECT id FROM program_catalog WHERE title = 'Finance'),
    'beijing-foreign-studies-university-finance-117',
    'Finance', 
    39900,
    'September',
    'open',
    '15th, July',
    false,
    false,
    '80%',
    'IELTS, TOEFL, TOEIC',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-foreign-studies-university'),
    'Scholarship-117',
    'Beijing Foreign Studies University Business Scholarship',
    'Type A: Free first year tuition fee
Type B: Free first year 90% tuition fee
Type C: Free first year 80% tuition fee
Type D: Free first year 70% tuition fee
Type E: Free first year 60% tuition fee
Type F: Free first year 50% tuition fee
Type G: Free first year 40% tuition fee
Type H: Free first year 30% tuition fee
Type I: Free first year 20% tuition fee
Type J: Free first year 10% tuition fee
(Scholarship will annual review)',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Nanjing University of Science and Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanjing University of Science and Technology', 
    'nanjing-university-of-science-and-technology', 
    'Nanjing', 
    'Jiangsu', 
    'NJUST', 
    '38-SHANGHAI RANKING', 
    ARRAY['211','Double First Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Nanjing University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'nanjing-university-of-science-and-technology-mechanical-engineering-118',
    'Mechanical Engineering', 
    19800,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '60%
There is no minimum score, but the best candidates will be admitted.',
    'EFFST, Duolingo, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    'Scholarship-118',
    'Nanjing University of Science and Technology Mechanical Scholarship',
    'Type A (10 students): Cover tuition and accommodation fee, RMB1000 monthly stipend
Type B (20 students): Cover tuition fee
Type C (20 students): Cover 50% tuition fee
Type D (50 students): Cover accommodation fee only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Software Engineering', 
    'Software', 
    'Software', 
    'Bachelor', 
    'Software Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Software Engineering at Nanjing University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Software Engineering'),
    'nanjing-university-of-science-and-technology-software-engineering-119',
    'Software Engineering', 
    19800,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '60%
There is no minimum score, but the best candidates will be admitted.',
    'EFFST, Duolingo, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    'Scholarship-119',
    'Nanjing University of Science and Technology Software Scholarship',
    'Type A (10 students): Cover tuition and accommodation fee, RMB1000 monthly stipend
Type B (20 students): Cover tuition fee
Type C (20 students): Cover 50% tuition fee
Type D (50 students): Cover accommodation fee only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Nanjing University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'nanjing-university-of-science-and-technology-international-economics-and-trade-120',
    'International Economics and Trade', 
    19800,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '60%
There is no minimum score, but the best candidates will be admitted.',
    'EFFST, Duolingo, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    'Scholarship-120',
    'Nanjing University of Science and Technology Business Scholarship',
    'Type A (10 students): Cover tuition and accommodation fee, RMB1000 monthly stipend
Type B (20 students): Cover tuition fee
Type C (20 students): Cover 50% tuition fee
Type D (50 students): Cover accommodation fee only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Nanomaterials and Nanotechnology', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Nanomaterials and Nanotechnology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Nanomaterials and Nanotechnology at Nanjing University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Nanomaterials and Nanotechnology'),
    'nanjing-university-of-science-and-technology-nanomaterials-and-nanotechnology-121',
    'Nanomaterials and Nanotechnology', 
    19800,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '60%
There is no minimum score, but the best candidates will be admitted.',
    'EFFST, Duolingo, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-science-and-technology'),
    'Scholarship-121',
    'Nanjing University of Science and Technology Others Scholarship',
    'Type A (10 students): Cover tuition and accommodation fee, RMB1000 monthly stipend
Type B (20 students): Cover tuition fee
Type C (20 students): Cover 50% tuition fee
Type D (50 students): Cover accommodation fee only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: China University of Petroleum _Beijing_
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'China University of Petroleum _Beijing_', 
    'china-university-of-petroleum-beijing', 
    'Beijing', 
    NULL, 
    'CUP', 
    '48-SHANGHAI RANKING', 
    ARRAY['211','Double First Class'],
    'Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Petroleum Engineering', 
    'Petroleum Eng', 
    'Petroleum Eng', 
    'Bachelor', 
    'Petroleum Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Petroleum Engineering at China University of Petroleum _Beijing_
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Petroleum Engineering'),
    'china-university-of-petroleum-beijing-petroleum-engineering-122',
    'Petroleum Engineering', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Average score is more than 70% 
and GPA_3.0/5.0.',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    'Scholarship-122',
    'China University of Petroleum _Beijing_ Petroleum Eng Scholarship',
    'Type A: Cover tuition, accommodation fee and insurance, RMB2500 monthly stipend (10 months)
Type B: Cover tuition, accommodation fee and insurance',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemical Engineering and Technics', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Chemical Engineering and Technics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemical Engineering and Technics at China University of Petroleum _Beijing_
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Chemical Engineering and Technics'),
    'china-university-of-petroleum-beijing-chemical-engineering-and-technics-123',
    'Chemical Engineering and Technics', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Average score is more than 70% 
and GPA_3.0/5.0.',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    'Scholarship-123',
    'China University of Petroleum _Beijing_ Chemical Scholarship',
    'Type A: Cover tuition, accommodation fee and insurance, RMB2500 monthly stipend (10 months)
Type B: Cover tuition, accommodation fee and insurance',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at China University of Petroleum _Beijing_
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'china-university-of-petroleum-beijing-computer-science-and-technology-124',
    'Computer Science and Technology', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Average score is more than 70% 
and GPA_3.0/5.0.',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    'Scholarship-124',
    'China University of Petroleum _Beijing_ Computer Scholarship',
    'Type A: Cover tuition, accommodation fee and insurance, RMB2500 monthly stipend (10 months)
Type B: Cover tuition, accommodation fee and insurance',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economy and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economy and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economy and Trade at China University of Petroleum _Beijing_
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'International Economy and Trade'),
    'china-university-of-petroleum-beijing-international-economy-and-trade-125',
    'International Economy and Trade', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Average score is more than 70% 
and GPA_3.0/5.0.',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    'Scholarship-125',
    'China University of Petroleum _Beijing_ Business Scholarship',
    'Type A: Cover tuition, accommodation fee and insurance, RMB2500 monthly stipend (10 months)
Type B: Cover tuition, accommodation fee and insurance',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'English', 
    'Others', 
    'Others', 
    'Bachelor', 
    'English Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: English at China University of Petroleum _Beijing_
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'English'),
    'china-university-of-petroleum-beijing-english-126',
    'English', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    'Average score is more than 70% 
and GPA_3.0/5.0.',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-beijing'),
    'Scholarship-126',
    'China University of Petroleum _Beijing_ Others Scholarship',
    'Type A: Cover tuition, accommodation fee and insurance, RMB2500 monthly stipend (10 months)
Type B: Cover tuition, accommodation fee and insurance',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Zhejiang Gongshang University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Zhejiang Gongshang University', 
    'zhejiang-gongshang-university', 
    'Hangzhou', 
    'Zhejiang', 
    'ZJSU', 
    '101-SHANGHAI 
RANKING', 
    ARRAY['Double First Class'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Business', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Business Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Business at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Business'),
    'zhejiang-gongshang-university-international-business-127',
    'International Business', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-127',
    'Zhejiang Gongshang University Business Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Law (International Law)', 
    'Law', 
    'Law', 
    'Bachelor', 
    'Law (International Law) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Law (International Law) at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Law (International Law)'),
    'zhejiang-gongshang-university-law-international-law--128',
    'Law (International Law)', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-128',
    'Zhejiang Gongshang University Law Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Accounting', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Accounting Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Accounting at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Accounting'),
    'zhejiang-gongshang-university-accounting-129',
    'Accounting', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-129',
    'Zhejiang Gongshang University Business Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Hospitality Management ( International Hospitality Management)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Hospitality Management ( International Hospitality Management) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Hospitality Management ( International Hospitality Management) at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Hospitality Management ( International Hospitality Management)'),
    'zhejiang-gongshang-university-hospitality-management-international-hospitality-management--130',
    'Hospitality Management ( International Hospitality Management)', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-130',
    'Zhejiang Gongshang University Others Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'E-commerce', 
    'Business', 
    'Business', 
    'Bachelor', 
    'E-commerce Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: E-commerce at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'E-commerce'),
    'zhejiang-gongshang-university-e-commerce-131',
    'E-commerce', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-131',
    'Zhejiang Gongshang University Business Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Logistics Management', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Logistics Management Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Logistics Management at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Logistics Management'),
    'zhejiang-gongshang-university-logistics-management-132',
    'Logistics Management', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-132',
    'Zhejiang Gongshang University Others Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Philosophy', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Philosophy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Philosophy at Zhejiang Gongshang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Philosophy'),
    'zhejiang-gongshang-university-philosophy-133',
    'Philosophy', 
    18000,
    'September',
    NULL,
    '1st, June
*Applications for scholarships are recommended before May 1st ,2026.',
    false,
    false,
    '80%',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-gongshang-university'),
    'Scholarship-133',
    'Zhejiang Gongshang University Others Scholarship',
    'Type A: RMB20,000/year;
Type B: Cover 100% tuition fees ;
Type C: Cover 70% tuition fees;
Type D: Cover 40% tuition fees.
Type E: RMB9,000-24,000/year;',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Nanjing University of Posts and Telecommunications
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanjing University of Posts and Telecommunications', 
    'nanjing-university-of-posts-and-telecommunications', 
    'Nanjing', 
    'Jiangsu', 
    'NJUPT', 
    '81-SHANGHAI RANKING', 
    ARRAY['Double First Class'],
    NULL
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'General Program', 
    'General', 
    'General', 
    'Bachelor', 
    'General Program Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: General Program at Nanjing University of Posts and Telecommunications
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-posts-and-telecommunications'),
    (SELECT id FROM program_catalog WHERE title = 'General Program'),
    'nanjing-university-of-posts-and-telecommunications-general-program-134',
    'General Program', 
    0,
    'September',
    NULL,
    '1st April ~',
    false,
    false,
    NULL,
    NULL,
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

-- University: Nanjing University of Information Science & Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanjing University of Information Science & Technology', 
    'nanjing-university-of-information-science-technology', 
    'Nanjing', 
    'Jiangsu', 
    'NUIST', 
    '95-SHANGHAI RANKING', 
    ARRAY['Double First-Class'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Atmospheric Science', 
    'Aero(nautic/space)', 
    'Aero(nautic/space)', 
    'Bachelor', 
    'Atmospheric Science Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Atmospheric Science at Nanjing University of Information Science & Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Atmospheric Science'),
    'nanjing-university-of-information-science-technology-atmospheric-science-135',
    'Atmospheric Science', 
    15000,
    'September',
    NULL,
    '30th, May',
    false,
    false,
    'Morocco>15
Indonesia>83

Math and physics scores higher than 12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    'Scholarship-135',
    'Nanjing University of Information Science & Technology Aero(nautic/space) Scholarship',
    'Type A: Cover tuition fee
Type B: Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at Nanjing University of Information Science & Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'nanjing-university-of-information-science-technology-artificial-intelligence-136',
    'Artificial Intelligence', 
    15000,
    'September',
    NULL,
    '30th, May',
    false,
    false,
    'Morocco>15
Indonesia>83

Math and physics scores higher than 12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    'Scholarship-136',
    'Nanjing University of Information Science & Technology Artificial Intelligence AI Scholarship',
    'Type A: Cover tuition fee
Type B: Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Nanjing University of Information Science & Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'nanjing-university-of-information-science-technology-computer-science-and-technology-137',
    'Computer Science and Technology', 
    15000,
    'September',
    NULL,
    '30th, May',
    false,
    false,
    'Morocco>15
Indonesia>83

Math and physics scores higher than 12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    'Scholarship-137',
    'Nanjing University of Information Science & Technology Computer Scholarship',
    'Type A: Cover tuition fee
Type B: Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronic Information Engineering', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electronic Information Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronic Information Engineering at Nanjing University of Information Science & Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Electronic Information Engineering'),
    'nanjing-university-of-information-science-technology-electronic-information-engineering-138',
    'Electronic Information Engineering', 
    15000,
    'September',
    NULL,
    '30th, May',
    false,
    false,
    'Morocco>15
Indonesia>83

Math and physics scores higher than 12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    'Scholarship-138',
    'Nanjing University of Information Science & Technology Electrical Scholarship',
    'Type A: Cover tuition fee
Type B: Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics & Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics & Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics & Trade at Nanjing University of Information Science & Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics & Trade'),
    'nanjing-university-of-information-science-technology-international-economics-trade-139',
    'International Economics & Trade', 
    15000,
    'September',
    NULL,
    '30th, May',
    false,
    false,
    'Morocco>15
Indonesia>83

Math and physics scores higher than 12',
    'EFFST, Duolingo, TOEFL, IELTS',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-information-science-technology'),
    'Scholarship-139',
    'Nanjing University of Information Science & Technology Business Scholarship',
    'Type A: Cover tuition fee
Type B: Cover 50% tuition fee',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: China Pharmaceutical University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'China Pharmaceutical University', 
    'china-pharmaceutical-university', 
    'Nanjing', 
    'Jiangsu', 
    'CPU', 
    '86-SHANGHAI RANKING', 
    ARRAY['Double First-Class'],
    'Not Allowed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics & Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics & Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics & Trade at China Pharmaceutical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-pharmaceutical-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics & Trade'),
    'china-pharmaceutical-university-international-economics-trade-140',
    'International Economics & Trade', 
    19000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '72%',
    'IELTS, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-pharmaceutical-university'),
    'Scholarship-140',
    'China Pharmaceutical University Business Scholarship',
    'Type A: Cover tuition fee
Type B: After scholarship pay 5000 RMB/year
Type C: After scholarship pay 9000 RMB/year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmacy', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Pharmacy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmacy at China Pharmaceutical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-pharmaceutical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmacy'),
    'china-pharmaceutical-university-pharmacy-141',
    'Pharmacy', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '72%',
    'IELTS, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-pharmaceutical-university'),
    'Scholarship-141',
    'China Pharmaceutical University Pharmacy Scholarship',
    'Type A: Cover tuition fee
Type B: After scholarship pay 5000 RMB/year
Type C: After scholarship pay 10000 RMB/year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Clinical Pharmacy', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Clinical Pharmacy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Clinical Pharmacy at China Pharmaceutical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-pharmaceutical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Clinical Pharmacy'),
    'china-pharmaceutical-university-clinical-pharmacy-142',
    'Clinical Pharmacy', 
    25000,
    'September',
    NULL,
    '15th, June',
    false,
    false,
    '72%',
    'IELTS, TOEFL',
    25,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-pharmaceutical-university'),
    'Scholarship-142',
    'China Pharmaceutical University Pharmacy Scholarship',
    'Type A: Cover tuition fee
Type B: After scholarship pay 5000 RMB/year
Type C: After scholarship pay 10000 RMB/year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Beijing Institute of Technology (Beijing)
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing Institute of Technology (Beijing)', 
    'beijing-institute-of-technology-beijing', 
    NULL, 
    NULL, 
    'BIT-Beijing', 
    'Beijing', 
    ARRAY['13-SHANGHAI RANKING'],
    'Zhongguancun campus
2 people shared room: 1,350/month
3 people shared room: 1,200/month
4 people shared room: 900/month
Liangxiang campus
2 people shared room: 900/month
3 people shared room: 700/month
4 people shared room: 500/month'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aeronautical and Astronautical Engineering', 
    'Aeronautical', 
    'Aeronautical', 
    'Bachelor', 
    'Aeronautical and Astronautical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aeronautical and Astronautical Engineering at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Aeronautical and Astronautical Engineering'),
    'beijing-institute-of-technology-beijing-aeronautical-and-astronautical-engineering-143',
    'Aeronautical and Astronautical Engineering', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-143',
    'Beijing Institute of Technology (Beijing) Aeronautical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Automation', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Automation at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Automation'),
    'beijing-institute-of-technology-beijing-automation-144',
    'Automation', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-144',
    'Beijing Institute of Technology (Beijing) Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'beijing-institute-of-technology-beijing-computer-science-and-technology-145',
    'Computer Science and Technology', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-145',
    'Beijing Institute of Technology (Beijing) Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechatronics Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechatronics Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechatronics Engineering at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Mechatronics Engineering'),
    'beijing-institute-of-technology-beijing-mechatronics-engineering-146',
    'Mechatronics Engineering', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-146',
    'Beijing Institute of Technology (Beijing) Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronics Science and Technology', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electronics Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronics Science and Technology at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Electronics Science and Technology'),
    'beijing-institute-of-technology-beijing-electronics-science-and-technology-147',
    'Electronics Science and Technology', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-147',
    'Beijing Institute of Technology (Beijing) Electrical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'beijing-institute-of-technology-beijing-mechanical-engineering-148',
    'Mechanical Engineering', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-148',
    'Beijing Institute of Technology (Beijing) Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Beijing Institute of Technology (Beijing)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'beijing-institute-of-technology-beijing-international-economics-and-trade-149',
    'International Economics and Trade', 
    13,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-beijing'),
    'Scholarship-149',
    'Beijing Institute of Technology (Beijing) Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Linyi University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Linyi University', 
    'linyi-university', 
    NULL, 
    NULL, 
    'LYU', 
    'Linyi, Shandong', 
    ARRAY['197-US NEWS RANKING'],
    'Quad room(lower bed): 240RMMB/month

 Quad room(upper bed): 200RMB/month'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Business Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Business Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Business Trade at Linyi University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Business Trade'),
    'linyi-university-international-business-trade-150',
    'International Business Trade', 
    10,
    'September',
    NULL,
    'N/a',
    true,
    false,
    '1st March
-30th May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    'Scholarship-150',
    'Linyi University Business Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Linyi University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'linyi-university-computer-science-and-technology-151',
    'Computer Science and Technology', 
    10,
    'September',
    NULL,
    'N/a',
    true,
    false,
    '1st March
-30th May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    'Scholarship-151',
    'Linyi University Computer Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'E-commerce', 
    'Business', 
    'Business', 
    'Bachelor', 
    'E-commerce Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: E-commerce at Linyi University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    (SELECT id FROM program_catalog WHERE title = 'E-commerce'),
    'linyi-university-e-commerce-152',
    'E-commerce', 
    10,
    'September',
    NULL,
    'N/a',
    true,
    false,
    '1st March
-30th May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    'Scholarship-152',
    'Linyi University Business Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Visual Communication Design', 
    'Art', 
    'Art', 
    'Bachelor', 
    'Visual Communication Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Visual Communication Design at Linyi University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    (SELECT id FROM program_catalog WHERE title = 'Visual Communication Design'),
    'linyi-university-visual-communication-design-153',
    'Visual Communication Design', 
    10,
    'September',
    NULL,
    'N/a',
    true,
    false,
    '1st March
-30th May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    'Scholarship-153',
    'Linyi University Art Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Linyi University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'linyi-university-civil-engineering-154',
    'Civil Engineering', 
    10,
    'September',
    NULL,
    'N/a',
    true,
    false,
    '1st March
-30th May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    'Scholarship-154',
    'Linyi University Civil Eng Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Media communication', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Media communication Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Media communication at Linyi University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    (SELECT id FROM program_catalog WHERE title = 'Media communication'),
    'linyi-university-media-communication-155',
    'Media communication', 
    10,
    'September',
    NULL,
    'N/a',
    true,
    false,
    '1st March
-30th May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'linyi-university'),
    'Scholarship-155',
    'Linyi University Others Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Northwestern Polytechnical University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Northwestern Polytechnical University', 
    'northwestern-polytechnical-university', 
    NULL, 
    NULL, 
    'NPU', 
    'Xi''an,Shannxi', 
    ARRAY['21-SHANGHAI RANKING'],
    '5400(Triple Room)
7200 or 9000(Double Room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aerospace Engineering_Aircraft design_', 
    'Aeronautical', 
    'Aeronautical', 
    'Bachelor', 
    'Aerospace Engineering_Aircraft design_ Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aerospace Engineering_Aircraft design_ at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Aerospace Engineering_Aircraft design_'),
    'northwestern-polytechnical-university-aerospace-engineering-aircraft-design--156',
    'Aerospace Engineering_Aircraft design_', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-156',
    'Northwestern Polytechnical University Aeronautical Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aerospace Engineering(Satellites, space science)', 
    'Aero(nautic/space)', 
    'Aero(nautic/space)', 
    'Bachelor', 
    'Aerospace Engineering(Satellites, space science) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aerospace Engineering(Satellites, space science) at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Aerospace Engineering(Satellites, space science)'),
    'northwestern-polytechnical-university-aerospace-engineering-satellites-space-science--157',
    'Aerospace Engineering(Satellites, space science)', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-157',
    'Northwestern Polytechnical University Aero(nautic/space) Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanics Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Mechanics Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanics Engineering at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanics Engineering'),
    'northwestern-polytechnical-university-mechanics-engineering-158',
    'Mechanics Engineering', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-158',
    'Northwestern Polytechnical University Civil Eng Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electrical Engineering& Automation', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electrical Engineering& Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electrical Engineering& Automation at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Electrical Engineering& Automation'),
    'northwestern-polytechnical-university-electrical-engineering-automation-159',
    'Electrical Engineering& Automation', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-159',
    'Northwestern Polytechnical University Electrical Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'northwestern-polytechnical-university-computer-science-and-technology-160',
    'Computer Science and Technology', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-160',
    'Northwestern Polytechnical University Computer Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'northwestern-polytechnical-university-business-administration-161',
    'Business Administration', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-161',
    'Northwestern Polytechnical University Business Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'English', 
    'Language Related', 
    'Language Related', 
    'Bachelor', 
    'English Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: English at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'English'),
    'northwestern-polytechnical-university-english-162',
    'English', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-162',
    'Northwestern Polytechnical University Language Related Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronics and Information Engineering', 
    'Energy', 
    'Energy', 
    'Bachelor', 
    'Electronics and Information Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronics and Information Engineering at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Electronics and Information Engineering'),
    'northwestern-polytechnical-university-electronics-and-information-engineering-163',
    'Electronics and Information Engineering', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-163',
    'Northwestern Polytechnical University Energy Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biotechnology', 
    'Bio Med', 
    'Bio Med', 
    'Bachelor', 
    'Biotechnology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biotechnology at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Biotechnology'),
    'northwestern-polytechnical-university-biotechnology-164',
    'Biotechnology', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-164',
    'Northwestern Polytechnical University Bio Med Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Materials Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Materials Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Materials Science and Engineering at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Materials Science and Engineering'),
    'northwestern-polytechnical-university-materials-science-and-engineering-165',
    'Materials Science and Engineering', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-165',
    'Northwestern Polytechnical University Others Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Northwestern Polytechnical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'northwestern-polytechnical-university-mechanical-engineering-166',
    'Mechanical Engineering', 
    14,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    'until seats full',
    '17-23',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'northwestern-polytechnical-university'),
    'Scholarship-166',
    'Northwestern Polytechnical University Mechanical Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Dalian University of Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Dalian University of Technology', 
    'dalian-university-of-technology', 
    NULL, 
    NULL, 
    'DLUT', 
    'Dalian, Liaoning', 
    ARRAY['28-SHANGHAI RANKING'],
    'Dorm1_600/month_Single room_
Dorm 2: 1800/month_Single room_
              1200/month_Double room_'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Construction', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Intelligent Construction Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Construction at Dalian University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'dalian-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Construction'),
    'dalian-university-of-technology-intelligent-construction-167',
    'Intelligent Construction', 
    70,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'dalian-university-of-technology'),
    'Scholarship-167',
    'Dalian University of Technology Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Bioengineering(DUT-BGI)', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Bioengineering(DUT-BGI) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Bioengineering(DUT-BGI) at Dalian University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'dalian-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Bioengineering(DUT-BGI)'),
    'dalian-university-of-technology-bioengineering-dut-bgi--168',
    'Bioengineering(DUT-BGI)', 
    70,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'dalian-university-of-technology'),
    'Scholarship-168',
    'Dalian University of Technology Bio Eng. Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Design, manufacture and automation', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Design, manufacture and automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Design, manufacture and automation at Dalian University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'dalian-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Design, manufacture and automation'),
    'dalian-university-of-technology-mechanical-design-manufacture-and-automation-169',
    'Mechanical Design, manufacture and automation', 
    70,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'dalian-university-of-technology'),
    'Scholarship-169',
    'Dalian University of Technology Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Jiangsu University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Jiangsu University', 
    'jiangsu-university', 
    NULL, 
    NULL, 
    'JSU', 
    'Zhenjiang, Jiangsu', 
    ARRAY['83-SHANGHAI RANKING'],
    'CNY4500 /bed /year (North) (Double room)
CNY4900 / bed /year (South) (Double room)
 or CNY 30/bed/ day.'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemical Engineering and Process', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Chemical Engineering and Process Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemical Engineering and Process at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Chemical Engineering and Process'),
    'jiangsu-university-chemical-engineering-and-process-170',
    'Chemical Engineering and Process', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-170',
    'Jiangsu University Chemical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Food Science and Engineering', 
    'Food', 
    'Food', 
    'Bachelor', 
    'Food Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Food Science and Engineering at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Food Science and Engineering'),
    'jiangsu-university-food-science-and-engineering-171',
    'Food Science and Engineering', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-171',
    'Jiangsu University Food Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'jiangsu-university-international-economics-and-trade-172',
    'International Economics and Trade', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-172',
    'Jiangsu University Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'jiangsu-university-computer-science-and-technology-173',
    'Computer Science and Technology', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-173',
    'Jiangsu University Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'jiangsu-university-civil-engineering-174',
    'Civil Engineering', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-174',
    'Jiangsu University Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'jiangsu-university-business-administration-175',
    'Business Administration', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-175',
    'Jiangsu University Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmacy', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Pharmacy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmacy at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmacy'),
    'jiangsu-university-pharmacy-176',
    'Pharmacy', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-176',
    'Jiangsu University Pharmacy Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Bachelor of Medicine and Bachelor of Surgery (MBBS)', 
    'MBBS', 
    'MBBS', 
    'Bachelor', 
    'Bachelor of Medicine and Bachelor of Surgery (MBBS) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Bachelor of Medicine and Bachelor of Surgery (MBBS) at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Bachelor of Medicine and Bachelor of Surgery (MBBS)'),
    'jiangsu-university-bachelor-of-medicine-and-bachelor-of-surgery-mbbs--177',
    'Bachelor of Medicine and Bachelor of Surgery (MBBS)', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-177',
    'Jiangsu University MBBS Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'E-Commerce', 
    'Business', 
    'Business', 
    'Bachelor', 
    'E-Commerce Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: E-Commerce at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'E-Commerce'),
    'jiangsu-university-e-commerce-178',
    'E-Commerce', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-178',
    'Jiangsu University Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Design, Manufacturing and Automation', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Design, Manufacturing and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Design, Manufacturing and Automation at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Design, Manufacturing and Automation'),
    'jiangsu-university-mechanical-design-manufacturing-and-automation-179',
    'Mechanical Design, Manufacturing and Automation', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-179',
    'Jiangsu University Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Vehicle Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Vehicle Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Vehicle Engineering at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Vehicle Engineering'),
    'jiangsu-university-vehicle-engineering-180',
    'Vehicle Engineering', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-180',
    'Jiangsu University Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Energy and Power Engineering', 
    'Energy', 
    'Energy', 
    'Bachelor', 
    'Energy and Power Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Energy and Power Engineering at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Energy and Power Engineering'),
    'jiangsu-university-energy-and-power-engineering-181',
    'Energy and Power Engineering', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-181',
    'Jiangsu University Energy Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Information Management and Information System', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Information Management and Information System Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Information Management and Information System at Jiangsu University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    (SELECT id FROM program_catalog WHERE title = 'Information Management and Information System'),
    'jiangsu-university-information-management-and-information-system-182',
    'Information Management and Information System', 
    13,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '1st Jan',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'jiangsu-university'),
    'Scholarship-182',
    'Jiangsu University Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Beijing Institute of Technology (Zhuhai)
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing Institute of Technology (Zhuhai)', 
    'beijing-institute-of-technology-zhuhai', 
    NULL, 
    NULL, 
    'BIT Zhuhai', 
    'Zhuhai, Guangdong', 
    ARRAY['13-SHANGHAI RANKING'],
    'Double Room: RMB900 per month
Quad Room: RMB500 per month'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at Beijing Institute of Technology (Zhuhai)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-zhuhai'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'beijing-institute-of-technology-zhuhai-artificial-intelligence-183',
    'Artificial Intelligence', 
    80,
    'September',
    NULL,
    '985 project, 211, Double-first class',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-institute-of-technology-zhuhai'),
    'Scholarship-183',
    'Beijing Institute of Technology (Zhuhai) Artificial Intelligence AI Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Liaoning Petrochemical University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Liaoning Petrochemical University', 
    'liaoning-petrochemical-university', 
    NULL, 
    NULL, 
    'LNPU', 
    'Fushun, Liaoning', 
    ARRAY['256-SHANGHAI RANKING'],
    'Double room: 4500-5500/year
Single room: 6000-7000/year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Liaoning Petrochemical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-petrochemical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'liaoning-petrochemical-university-business-administration-184',
    'Business Administration', 
    0,
    'March',
    NULL,
    'N/a',
    true,
    true,
    'Until seats full',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-petrochemical-university'),
    'Scholarship-184',
    'Liaoning Petrochemical University Business Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at Liaoning Petrochemical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-petrochemical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'liaoning-petrochemical-university-artificial-intelligence-185',
    'Artificial Intelligence', 
    0,
    'March',
    NULL,
    'N/a',
    true,
    true,
    'Until seats full',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'liaoning-petrochemical-university'),
    'Scholarship-185',
    'Liaoning Petrochemical University Artificial Intelligence AI Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: China University of Petroleum (East China)
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'China University of Petroleum (East China)', 
    'china-university-of-petroleum-east-china', 
    NULL, 
    NULL, 
    'UPC', 
    'Qingdao, Shandong', 
    ARRAY['67-SHANGHAI RANKING'],
    'South Section (Ocean View): RMB700-750/Month (Double room)
North Section (City View): RMB600-650/Month (Double room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Petroleum Engineering', 
    'Petroleum Eng', 
    'Petroleum Eng', 
    'Bachelor', 
    'Petroleum Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Petroleum Engineering at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Petroleum Engineering'),
    'china-university-of-petroleum-east-china-petroleum-engineering-186',
    'Petroleum Engineering', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-186',
    'China University of Petroleum (East China) Petroleum Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Geology', 
    'Geology', 
    'Geology', 
    'Bachelor', 
    'Geology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Geology at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Geology'),
    'china-university-of-petroleum-east-china-geology-187',
    'Geology', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-187',
    'China University of Petroleum (East China) Geology Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Resource Exploration Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Resource Exploration Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Resource Exploration Engineering at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Resource Exploration Engineering'),
    'china-university-of-petroleum-east-china-resource-exploration-engineering-188',
    'Resource Exploration Engineering', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-188',
    'China University of Petroleum (East China) Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Design, Manufacturing and Automation', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Design, Manufacturing and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Design, Manufacturing and Automation at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Design, Manufacturing and Automation'),
    'china-university-of-petroleum-east-china-mechanical-design-manufacturing-and-automation-189',
    'Mechanical Design, Manufacturing and Automation', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-189',
    'China University of Petroleum (East China) Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Software Engineering', 
    'Software', 
    'Software', 
    'Bachelor', 
    'Software Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Software Engineering at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Software Engineering'),
    'china-university-of-petroleum-east-china-software-engineering-190',
    'Software Engineering', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-190',
    'China University of Petroleum (East China) Software Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'china-university-of-petroleum-east-china-civil-engineering-191',
    'Civil Engineering', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-191',
    'China University of Petroleum (East China) Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Architecture', 
    'Architecture', 
    'Architecture', 
    'Bachelor', 
    'Architecture Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Architecture at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Architecture'),
    'china-university-of-petroleum-east-china-architecture-192',
    'Architecture', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-192',
    'China University of Petroleum (East China) Architecture Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Big Data Management and Application (30 seats)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Big Data Management and Application (30 seats) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Big Data Management and Application (30 seats) at China University of Petroleum (East China)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    (SELECT id FROM program_catalog WHERE title = 'Big Data Management and Application (30 seats)'),
    'china-university-of-petroleum-east-china-big-data-management-and-application-30-seats--193',
    'Big Data Management and Application (30 seats)', 
    16,
    'September',
    NULL,
    '211, Double First-Class',
    true,
    false,
    '15th March~15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'china-university-of-petroleum-east-china'),
    'Scholarship-193',
    'China University of Petroleum (East China) Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Shandong University of Traditional Chinese Medicine
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Shandong University of Traditional Chinese Medicine', 
    'shandong-university-of-traditional-chinese-medicine', 
    NULL, 
    NULL, 
    'SDUTCM', 
    'Jinan, Shandong', 
    ARRAY['245-4ICU RANKING'],
    'Double bedroom: 4,000RMB/year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Shandong University of Traditional Chinese Medicine
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-traditional-chinese-medicine'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'shandong-university-of-traditional-chinese-medicine-computer-science-and-technology-194',
    'Computer Science and Technology', 
    0,
    'September',
    NULL,
    'N/a',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-traditional-chinese-medicine'),
    'Scholarship-194',
    'Shandong University of Traditional Chinese Medicine Computer Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Data Science and Big Data Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Data Science and Big Data Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Data Science and Big Data Technology at Shandong University of Traditional Chinese Medicine
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-traditional-chinese-medicine'),
    (SELECT id FROM program_catalog WHERE title = 'Data Science and Big Data Technology'),
    'shandong-university-of-traditional-chinese-medicine-data-science-and-big-data-technology-195',
    'Data Science and Big Data Technology', 
    0,
    'September',
    NULL,
    'N/a',
    true,
    true,
    '15th June',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-university-of-traditional-chinese-medicine'),
    'Scholarship-195',
    'Shandong University of Traditional Chinese Medicine Computer Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Communication _Global Communicationand Management_GCM', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Communication _Global Communicationand Management_GCM Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Communication _Global Communicationand Management_GCM at Zhejiang University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    (SELECT id FROM program_catalog WHERE title = 'Communication _Global Communicationand Management_GCM'),
    'zhejiang-university-communication-global-communicationand-management-gcm-196',
    'Communication _Global Communicationand Management_GCM', 
    18,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university'),
    'Scholarship-196',
    'Zhejiang University Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Xi'an Jiaotong-Liverpool University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Xi''an Jiaotong-Liverpool University', 
    'xi-an-jiaotong-liverpool-university', 
    NULL, 
    NULL, 
    'XJTLU', 
    'Suzhou, Jiangsu', 
    ARRAY['the largest international collaborative university in China',''],
    'SIP Campus Accommodation_
 1710-2700RMB/month
Taicang Campus Accommodation_
Double room: 6000RMB/year
Single room:14000RMB/year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Atteached pls find 49 majors
B2602-XJTLU-Xi_an Jiaotong-Liverpool University.pdf', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Atteached pls find 49 majors
B2602-XJTLU-Xi_an Jiaotong-Liverpool University.pdf Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Atteached pls find 49 majors
B2602-XJTLU-Xi_an Jiaotong-Liverpool University.pdf at Xi'an Jiaotong-Liverpool University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xi-an-jiaotong-liverpool-university'),
    (SELECT id FROM program_catalog WHERE title = 'Atteached pls find 49 majors
B2602-XJTLU-Xi_an Jiaotong-Liverpool University.pdf'),
    'xi-an-jiaotong-liverpool-university-atteached-pls-find-49-majors-b2602-xjtlu-xi-an-jiaotong-liverpool-university-pdf-197',
    'Atteached pls find 49 majors
B2602-XJTLU-Xi_an Jiaotong-Liverpool University.pdf', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '16st May',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'xi-an-jiaotong-liverpool-university'),
    'Scholarship-197',
    'Xi''an Jiaotong-Liverpool University Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Nanjing University Of Aeronautics And Astronautics
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Nanjing University Of Aeronautics And Astronautics', 
    'nanjing-university-of-aeronautics-and-astronautics', 
    NULL, 
    NULL, 
    'NUAA', 
    'Nanjing,Jiangsu', 
    ARRAY['36-SHANGHAI RANKING'],
    'Single room:8000/year
Double room:4000/year(small) or 7000/year(large)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Aeronautical Engineering', 
    'Aero(nautic/space)', 
    'Aero(nautic/space)', 
    'Bachelor', 
    'Aeronautical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Aeronautical Engineering at Nanjing University Of Aeronautics And Astronautics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    (SELECT id FROM program_catalog WHERE title = 'Aeronautical Engineering'),
    'nanjing-university-of-aeronautics-and-astronautics-aeronautical-engineering-198',
    'Aeronautical Engineering', 
    10,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '30th May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    'Scholarship-198',
    'Nanjing University Of Aeronautics And Astronautics Aero(nautic/space) Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at Nanjing University Of Aeronautics And Astronautics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'nanjing-university-of-aeronautics-and-astronautics-artificial-intelligence-199',
    'Artificial Intelligence', 
    10,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '30th May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    'Scholarship-199',
    'Nanjing University Of Aeronautics And Astronautics Artificial Intelligence AI Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Nanjing University Of Aeronautics And Astronautics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'nanjing-university-of-aeronautics-and-astronautics-mechanical-engineering-200',
    'Mechanical Engineering', 
    10,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '30th May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    'Scholarship-200',
    'Nanjing University Of Aeronautics And Astronautics Mechanical Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electrical & Electronic Engineering', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electrical & Electronic Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electrical & Electronic Engineering at Nanjing University Of Aeronautics And Astronautics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    (SELECT id FROM program_catalog WHERE title = 'Electrical & Electronic Engineering'),
    'nanjing-university-of-aeronautics-and-astronautics-electrical-electronic-engineering-201',
    'Electrical & Electronic Engineering', 
    10,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '30th May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    'Scholarship-201',
    'Nanjing University Of Aeronautics And Astronautics Electrical Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Business', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Business Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Business at Nanjing University Of Aeronautics And Astronautics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    (SELECT id FROM program_catalog WHERE title = 'International Business'),
    'nanjing-university-of-aeronautics-and-astronautics-international-business-202',
    'International Business', 
    10,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '30th May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    'Scholarship-202',
    'Nanjing University Of Aeronautics And Astronautics Business Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Nanjing University Of Aeronautics And Astronautics
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'nanjing-university-of-aeronautics-and-astronautics-civil-engineering-203',
    'Civil Engineering', 
    10,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '30th May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'nanjing-university-of-aeronautics-and-astronautics'),
    'Scholarship-203',
    'Nanjing University Of Aeronautics And Astronautics Civil Eng Scholarship',
    'Allowed from Second Year',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Harbin Institute of Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Harbin Institute of Technology', 
    'harbin-institute-of-technology', 
    NULL, 
    NULL, 
    'HIT', 
    'Harbin, Heilongjiang', 
    ARRAY['14-SHANGHAI RANKING'],
    'Double bed room:RMB 800-1000/month/bed'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'harbin-institute-of-technology-civil-engineering-204',
    'Civil Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-204',
    'Harbin Institute of Technology Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Architecture', 
    'Architecture', 
    'Architecture', 
    'Bachelor', 
    'Architecture Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Architecture at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Architecture'),
    'harbin-institute-of-technology-architecture-205',
    'Architecture', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-205',
    'Harbin Institute of Technology Architecture Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Medical Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Intelligent Medical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Medical Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Medical Engineering'),
    'harbin-institute-of-technology-intelligent-medical-engineering-206',
    'Intelligent Medical Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-206',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'harbin-institute-of-technology-artificial-intelligence-207',
    'Artificial Intelligence', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-207',
    'Harbin Institute of Technology Artificial Intelligence AI Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'harbin-institute-of-technology-computer-science-and-technology-208',
    'Computer Science and Technology', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-208',
    'Harbin Institute of Technology Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Management', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Management Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Management at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Business Management'),
    'harbin-institute-of-technology-business-management-209',
    'Business Management', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-209',
    'Harbin Institute of Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Measurement and Testing Technology and Instrument', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Measurement and Testing Technology and Instrument Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Measurement and Testing Technology and Instrument at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Measurement and Testing Technology and Instrument'),
    'harbin-institute-of-technology-measurement-and-testing-technology-and-instrument-210',
    'Measurement and Testing Technology and Instrument', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-210',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Construction', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Intelligent Construction Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Construction at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Construction'),
    'harbin-institute-of-technology-intelligent-construction-211',
    'Intelligent Construction', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-211',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biological Engineering', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Biological Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biological Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Biological Engineering'),
    'harbin-institute-of-technology-biological-engineering-212',
    'Biological Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-212',
    'Harbin Institute of Technology Bio Eng. Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Organizations and Global Governance', 
    'Others', 
    'Others', 
    'Bachelor', 
    'International Organizations and Global Governance Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Organizations and Global Governance at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Organizations and Global Governance'),
    'harbin-institute-of-technology-international-organizations-and-global-governance-213',
    'International Organizations and Global Governance', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-213',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Sociology', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Sociology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Sociology at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Sociology'),
    'harbin-institute-of-technology-sociology-214',
    'Sociology', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-214',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Energy and Power Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Energy and Power Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Energy and Power Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Energy and Power Engineering'),
    'harbin-institute-of-technology-energy-and-power-engineering-215',
    'Energy and Power Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-215',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Big Data Management and Application', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Big Data Management and Application Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Big Data Management and Application at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Big Data Management and Application'),
    'harbin-institute-of-technology-big-data-management-and-application-216',
    'Big Data Management and Application', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-216',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Digital Economy', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Digital Economy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Digital Economy at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Digital Economy'),
    'harbin-institute-of-technology-digital-economy-217',
    'Digital Economy', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-217',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Traffic Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Traffic Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Traffic Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Traffic Engineering'),
    'harbin-institute-of-technology-traffic-engineering-218',
    'Traffic Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-218',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Digital Media Art', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Digital Media Art Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Digital Media Art at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Digital Media Art'),
    'harbin-institute-of-technology-digital-media-art-219',
    'Digital Media Art', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-219',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Product Design', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Product Design Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Product Design at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Product Design'),
    'harbin-institute-of-technology-product-design-220',
    'Product Design', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-220',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Building Environment and Energy Application Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Building Environment and Energy Application Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Building Environment and Energy Application Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Building Environment and Energy Application Engineering'),
    'harbin-institute-of-technology-building-environment-and-energy-application-engineering-221',
    'Building Environment and Energy Application Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-221',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Urban and Rural Planning', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Urban and Rural Planning Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Urban and Rural Planning at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Urban and Rural Planning'),
    'harbin-institute-of-technology-urban-and-rural-planning-222',
    'Urban and Rural Planning', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-222',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Manufacturing Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Intelligent Manufacturing Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Manufacturing Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Manufacturing Engineering'),
    'harbin-institute-of-technology-intelligent-manufacturing-engineering-223',
    'Intelligent Manufacturing Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-223',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Robot Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Robot Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Robot Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Robot Engineering'),
    'harbin-institute-of-technology-robot-engineering-224',
    'Robot Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-224',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Environmental Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Environmental Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Environmental Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Environmental Engineering'),
    'harbin-institute-of-technology-environmental-engineering-225',
    'Environmental Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-225',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemical Engineering and Technology', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Chemical Engineering and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemical Engineering and Technology at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Chemical Engineering and Technology'),
    'harbin-institute-of-technology-chemical-engineering-and-technology-226',
    'Chemical Engineering and Technology', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-226',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Automation', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Automation at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Automation'),
    'harbin-institute-of-technology-automation-227',
    'Automation', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-227',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Integrated Circuit Design and Integrated System', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Integrated Circuit Design and Integrated System Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Integrated Circuit Design and Integrated System at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Integrated Circuit Design and Integrated System'),
    'harbin-institute-of-technology-integrated-circuit-design-and-integrated-system-228',
    'Integrated Circuit Design and Integrated System', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-228',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Communication Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Communication Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Communication Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Communication Engineering'),
    'harbin-institute-of-technology-communication-engineering-229',
    'Communication Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-229',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronic Information Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Electronic Information Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronic Information Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Electronic Information Engineering'),
    'harbin-institute-of-technology-electronic-information-engineering-230',
    'Electronic Information Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-230',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electrical Engineering and Automation', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electrical Engineering and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electrical Engineering and Automation at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Electrical Engineering and Automation'),
    'harbin-institute-of-technology-electrical-engineering-and-automation-231',
    'Electrical Engineering and Automation', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-231',
    'Harbin Institute of Technology Electrical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Welding Technology and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Welding Technology and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Welding Technology and Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Welding Technology and Engineering'),
    'harbin-institute-of-technology-welding-technology-and-engineering-232',
    'Welding Technology and Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-232',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Materials Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Materials Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Materials Science and Engineering at Harbin Institute of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Materials Science and Engineering'),
    'harbin-institute-of-technology-materials-science-and-engineering-233',
    'Materials Science and Engineering', 
    16,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '31st May',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology'),
    'Scholarship-233',
    'Harbin Institute of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: East China University of Science and Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'East China University of Science and Technology', 
    'east-china-university-of-science-and-technology', 
    NULL, 
    NULL, 
    'ECUST', 
    'Shanghai', 
    ARRAY['44-SHANGHAI RANKING'],
    'Single room: 80 or 110/day'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Visual Communication Design(Digital Design)', 
    'Art', 
    'Art', 
    'Bachelor', 
    'Visual Communication Design(Digital Design) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Visual Communication Design(Digital Design) at East China University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Visual Communication Design(Digital Design)'),
    'east-china-university-of-science-and-technology-visual-communication-design-digital-design--234',
    'Visual Communication Design(Digital Design)', 
    12,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '15th April',
    '17-35',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    'Scholarship-234',
    'East China University of Science and Technology Art Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at East China University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'east-china-university-of-science-and-technology-artificial-intelligence-235',
    'Artificial Intelligence', 
    12,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '15th April',
    '17-35',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    'Scholarship-235',
    'East China University of Science and Technology Artificial Intelligence AI Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemical Engineering and Technology', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Chemical Engineering and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemical Engineering and Technology at East China University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Chemical Engineering and Technology'),
    'east-china-university-of-science-and-technology-chemical-engineering-and-technology-236',
    'Chemical Engineering and Technology', 
    12,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '15th April',
    '17-35',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    'Scholarship-236',
    'East China University of Science and Technology Chemical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Bioengineering (Biopharmaceutical)', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Bioengineering (Biopharmaceutical) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Bioengineering (Biopharmaceutical) at East China University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Bioengineering (Biopharmaceutical)'),
    'east-china-university-of-science-and-technology-bioengineering-biopharmaceutical--237',
    'Bioengineering (Biopharmaceutical)', 
    12,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '15th April',
    '17-35',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    'Scholarship-237',
    'East China University of Science and Technology Bio Eng. Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at East China University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'east-china-university-of-science-and-technology-international-economics-and-trade-238',
    'International Economics and Trade', 
    12,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '15th April',
    '17-35',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    'Scholarship-238',
    'East China University of Science and Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Manufacturing Engineering', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Intelligent Manufacturing Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Manufacturing Engineering at East China University of Science and Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Manufacturing Engineering'),
    'east-china-university-of-science-and-technology-intelligent-manufacturing-engineering-239',
    'Intelligent Manufacturing Engineering', 
    12,
    'September',
    NULL,
    '211, Double First-class',
    true,
    true,
    '15th April',
    '17-35',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'east-china-university-of-science-and-technology'),
    'Scholarship-239',
    'East China University of Science and Technology Artificial Intelligence AI Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Ocean University of China
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Ocean University of China', 
    'ocean-university-of-china', 
    NULL, 
    NULL, 
    'OUC', 
    'Qingdao, Shandong', 
    ARRAY['57-SHANGHAI RANKING'],
    'Double room:5500 RMB/semester ; 11000 RMB/year
Single room:11000 RMB/semester ; 22000 RMB/year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Ocean University of China
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'ocean-university-of-china'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'ocean-university-of-china-computer-science-and-technology-240',
    'Computer Science and Technology', 
    16,
    'September',
    NULL,
    '985/211/Double First-Class',
    true,
    true,
    'April 10th',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'ocean-university-of-china'),
    'Scholarship-240',
    'Ocean University of China Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at Ocean University of China
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'ocean-university-of-china'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'ocean-university-of-china-international-economics-and-trade-241',
    'International Economics and Trade', 
    16,
    'September',
    NULL,
    '985/211/Double First-Class',
    true,
    true,
    'April 10th',
    '17-30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'ocean-university-of-china'),
    'Scholarship-241',
    'Ocean University of China Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Shandong First Medical University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Shandong First Medical University', 
    'shandong-first-medical-university', 
    NULL, 
    NULL, 
    'SDFMU', 
    'Taian, Shandong', 
    ARRAY['195-US NEWS RANKING'],
    'RMB3400/year(Double room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmacy', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Pharmacy Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmacy at Shandong First Medical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmacy'),
    'shandong-first-medical-university-pharmacy-242',
    'Pharmacy', 
    60,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '30th Dec
30th July',
    '24',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    'Scholarship-242',
    'Shandong First Medical University Pharmacy Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Nursing', 
    'Nursing', 
    'Nursing', 
    'Bachelor', 
    'Nursing Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Nursing at Shandong First Medical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Nursing'),
    'shandong-first-medical-university-nursing-243',
    'Nursing', 
    60,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '30th Dec
30th July',
    '24',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    'Scholarship-243',
    'Shandong First Medical University Nursing Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Stomatology', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Stomatology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Stomatology at Shandong First Medical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Stomatology'),
    'shandong-first-medical-university-stomatology-244',
    'Stomatology', 
    60,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '30th Dec
30th July',
    '24',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    'Scholarship-244',
    'Shandong First Medical University Others Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biotechnology', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Biotechnology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biotechnology at Shandong First Medical University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    (SELECT id FROM program_catalog WHERE title = 'Biotechnology'),
    'shandong-first-medical-university-biotechnology-245',
    'Biotechnology', 
    60,
    'March, September',
    NULL,
    'N/A',
    true,
    true,
    '30th Dec
30th July',
    '24',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'shandong-first-medical-university'),
    'Scholarship-245',
    'Shandong First Medical University Others Scholarship',
    'Not Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: South China University of Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'South China University of Technology', 
    'south-china-university-of-technology', 
    NULL, 
    NULL, 
    'SCUT', 
    'Guangzhou, Guangdong', 
    ARRAY['16-US NEWS RANKING'],
    '20000(Single room)                  
10000(Double room)
5000(Quad room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade'),
    'south-china-university-of-technology-international-economics-and-trade-246',
    'International Economics and Trade', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-246',
    'South China University of Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'south-china-university-of-technology-computer-science-and-technology-247',
    'Computer Science and Technology', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-247',
    'South China University of Technology Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Biomedical Engineering', 
    'Bio Eng.', 
    'Bio Eng.', 
    'Bachelor', 
    'Biomedical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Biomedical Engineering at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Biomedical Engineering'),
    'south-china-university-of-technology-biomedical-engineering-248',
    'Biomedical Engineering', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-248',
    'South China University of Technology Bio Eng. Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Robot engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Robot engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Robot engineering at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Robot engineering'),
    'south-china-university-of-technology-robot-engineering-249',
    'Robot engineering', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-249',
    'South China University of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent manufacturing engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Intelligent manufacturing engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent manufacturing engineering at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent manufacturing engineering'),
    'south-china-university-of-technology-intelligent-manufacturing-engineering-250',
    'Intelligent manufacturing engineering', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-250',
    'South China University of Technology Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Artificial Intelligence', 
    'Artificial Intelligence AI', 
    'Artificial Intelligence AI', 
    'Bachelor', 
    'Artificial Intelligence Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Artificial Intelligence at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Artificial Intelligence'),
    'south-china-university-of-technology-artificial-intelligence-251',
    'Artificial Intelligence', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-251',
    'South China University of Technology Artificial Intelligence AI Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Data Science', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Data Science Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Data Science at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Data Science'),
    'south-china-university-of-technology-data-science-252',
    'Data Science', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-252',
    'South China University of Technology Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Soft Matter Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Soft Matter Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Soft Matter Science and Engineering at South China University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Soft Matter Science and Engineering'),
    'south-china-university-of-technology-soft-matter-science-and-engineering-253',
    'Soft Matter Science and Engineering', 
    10,
    'September',
    NULL,
    '985 Project 
211 
Double First-Class',
    true,
    true,
    '30th Jun.',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'south-china-university-of-technology'),
    'Scholarship-253',
    'South China University of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Chang�an University
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Chang�an University', 
    'chang-an-university', 
    NULL, 
    NULL, 
    'CHU', 
    'Xi''an, Shaanxi', 
    ARRAY['59-4ICU RANKING'],
    '7200(Double room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechatronic Engineering(10 open class)', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechatronic Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechatronic Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Mechatronic Engineering(10 open class)'),
    'chang-an-university-mechatronic-engineering-10-open-class--254',
    'Mechatronic Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-254',
    'Chang�an University Mechanical Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics and Trade(10 open class)', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics and Trade(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics and Trade(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics and Trade(10 open class)'),
    'chang-an-university-international-economics-and-trade-10-open-class--255',
    'International Economics and Trade(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-255',
    'Chang�an University Business Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology(10 open class)', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology(10 open class)'),
    'chang-an-university-computer-science-and-technology-10-open-class--256',
    'Computer Science and Technology(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-256',
    'Chang�an University Computer Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronic and Information Engineering(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Electronic and Information Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronic and Information Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Electronic and Information Engineering(10 open class)'),
    'chang-an-university-electronic-and-information-engineering-10-open-class--257',
    'Electronic and Information Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-257',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering(10 open class)', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering(10 open class)'),
    'chang-an-university-civil-engineering-10-open-class--258',
    'Civil Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-258',
    'Chang�an University Civil Eng Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Architecture (5 years)(10 open class)', 
    'Architecture', 
    'Architecture', 
    'Bachelor', 
    'Architecture (5 years)(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Architecture (5 years)(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Architecture (5 years)(10 open class)'),
    'chang-an-university-architecture-5-years-10-open-class--259',
    'Architecture (5 years)(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-259',
    'Chang�an University Architecture Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Geology(10 open class)', 
    'Geology', 
    'Geology', 
    'Bachelor', 
    'Geology(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Geology(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Geology(10 open class)'),
    'chang-an-university-geology-10-open-class--260',
    'Geology(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-260',
    'Chang�an University Geology Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Materials Science and Technology(10 open class)', 
    'Material', 
    'Material', 
    'Bachelor', 
    'Materials Science and Technology(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Materials Science and Technology(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Materials Science and Technology(10 open class)'),
    'chang-an-university-materials-science-and-technology-10-open-class--261',
    'Materials Science and Technology(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-261',
    'Chang�an University Material Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Road, Bridge and River-crossing Engineering(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Road, Bridge and River-crossing Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Road, Bridge and River-crossing Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Road, Bridge and River-crossing Engineering(10 open class)'),
    'chang-an-university-road-bridge-and-river-crossing-engineering-10-open-class--262',
    'Road, Bridge and River-crossing Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-262',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Vehicle Engineering(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Vehicle Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Vehicle Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Vehicle Engineering(10 open class)'),
    'chang-an-university-vehicle-engineering-10-open-class--263',
    'Vehicle Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-263',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Logistics Engineering(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Logistics Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Logistics Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Logistics Engineering(10 open class)'),
    'chang-an-university-logistics-engineering-10-open-class--264',
    'Logistics Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-264',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Automobile Service Engineering(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Automobile Service Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Automobile Service Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Automobile Service Engineering(10 open class)'),
    'chang-an-university-automobile-service-engineering-10-open-class--265',
    'Automobile Service Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-265',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Intelligent Vehicle Engineering(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Intelligent Vehicle Engineering(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Intelligent Vehicle Engineering(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Intelligent Vehicle Engineering(10 open class)'),
    'chang-an-university-intelligent-vehicle-engineering-10-open-class--266',
    'Intelligent Vehicle Engineering(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-266',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Land Resource Management(10 open class)', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Land Resource Management(10 open class) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Land Resource Management(10 open class) at Chang�an University
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    (SELECT id FROM program_catalog WHERE title = 'Land Resource Management(10 open class)'),
    'chang-an-university-land-resource-management-10-open-class--267',
    'Land Resource Management(10 open class)', 
    10,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    'May 31th',
    '25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'chang-an-university'),
    'Scholarship-267',
    'Chang�an University Others Scholarship',
    'Allowed for master and phd only',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Zhejiang University of Technology
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Zhejiang University of Technology', 
    'zhejiang-university-of-technology', 
    NULL, 
    NULL, 
    'ZJUT', 
    'Hangzhou
Zhejiang', 
    ARRAY['62-SHANGHAI RANKING'],
    'Pingfeng Campus: 
3,500/year(quad room); 
5,300/year(double room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Chemical Engineering&Technology', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Chemical Engineering&Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Chemical Engineering&Technology at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Chemical Engineering&Technology'),
    'zhejiang-university-of-technology-chemical-engineering-technology-268',
    'Chemical Engineering&Technology', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-268',
    'Zhejiang University of Technology Chemical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Applied Chemistry', 
    'Chemical', 
    'Chemical', 
    'Bachelor', 
    'Applied Chemistry Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Applied Chemistry at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Applied Chemistry'),
    'zhejiang-university-of-technology-applied-chemistry-269',
    'Applied Chemistry', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-269',
    'Zhejiang University of Technology Chemical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Pharmaceutical Science', 
    'Pharmacy', 
    'Pharmacy', 
    'Bachelor', 
    'Pharmaceutical Science Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Pharmaceutical Science at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Pharmaceutical Science'),
    'zhejiang-university-of-technology-pharmaceutical-science-270',
    'Pharmaceutical Science', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-270',
    'Zhejiang University of Technology Pharmacy Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Environmental Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Environmental Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Environmental Engineering at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Environmental Engineering'),
    'zhejiang-university-of-technology-environmental-engineering-271',
    'Environmental Engineering', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-271',
    'Zhejiang University of Technology Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Engineering', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Engineering at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Engineering'),
    'zhejiang-university-of-technology-mechanical-engineering-272',
    'Mechanical Engineering', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-272',
    'Zhejiang University of Technology Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electrical Engineering& Automation', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electrical Engineering& Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electrical Engineering& Automation at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Electrical Engineering& Automation'),
    'zhejiang-university-of-technology-electrical-engineering-automation-273',
    'Electrical Engineering& Automation', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-273',
    'Zhejiang University of Technology Electrical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science & Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science & Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science & Technology at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science & Technology'),
    'zhejiang-university-of-technology-computer-science-technology-274',
    'Computer Science & Technology', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-274',
    'Zhejiang University of Technology Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Software Engineering', 
    'Software', 
    'Software', 
    'Bachelor', 
    'Software Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Software Engineering at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Software Engineering'),
    'zhejiang-university-of-technology-software-engineering-275',
    'Software Engineering', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-275',
    'Zhejiang University of Technology Software Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'zhejiang-university-of-technology-civil-engineering-276',
    'Civil Engineering', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-276',
    'Zhejiang University of Technology Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'zhejiang-university-of-technology-business-administration-277',
    'Business Administration', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-277',
    'Zhejiang University of Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics & Trade', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics & Trade Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics & Trade at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics & Trade'),
    'zhejiang-university-of-technology-international-economics-trade-278',
    'International Economics & Trade', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-278',
    'Zhejiang University of Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Finance', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Finance Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Finance at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'Finance'),
    'zhejiang-university-of-technology-finance-279',
    'Finance', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-279',
    'Zhejiang University of Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'International Economics & Trade(Specialized in Chinese Business)', 
    'Business', 
    'Business', 
    'Bachelor', 
    'International Economics & Trade(Specialized in Chinese Business) Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: International Economics & Trade(Specialized in Chinese Business) at Zhejiang University of Technology
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    (SELECT id FROM program_catalog WHERE title = 'International Economics & Trade(Specialized in Chinese Business)'),
    'zhejiang-university-of-technology-international-economics-trade-specialized-in-chinese-business--280',
    'International Economics & Trade(Specialized in Chinese Business)', 
    70,
    'September',
    NULL,
    'N/A',
    true,
    true,
    '30th,May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'zhejiang-university-of-technology'),
    'Scholarship-280',
    'Zhejiang University of Technology Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Beijing University of Posts and Telecommunication
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Beijing University of Posts and Telecommunication', 
    'beijing-university-of-posts-and-telecommunication', 
    NULL, 
    NULL, 
    'BUPT', 
    'Beijing', 
    ARRAY['60-SHANGHAI RANKING'],
    'Xitucheng Campus_
15000/year(Double room)'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science andTechnology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science andTechnology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science andTechnology at Beijing University of Posts and Telecommunication
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-university-of-posts-and-telecommunication'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science andTechnology'),
    'beijing-university-of-posts-and-telecommunication-computer-science-andtechnology-281',
    'Computer Science andTechnology', 
    0,
    'September',
    NULL,
    '211 
Double First-Class',
    true,
    true,
    '30th April',
    '30',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'beijing-university-of-posts-and-telecommunication'),
    'Scholarship-281',
    'Beijing University of Posts and Telecommunication Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: University of Electronic Science and Technology of China
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'University of Electronic Science and Technology of China', 
    'university-of-electronic-science-and-technology-of-china', 
    NULL, 
    NULL, 
    'UESTC', 
    'Chengdu, Sichuan', 
    ARRAY['16-US NEWS'],
    'Double Room: 6000/year
Quad Room:3000/year'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at University of Electronic Science and Technology of China
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'university-of-electronic-science-and-technology-of-china'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'university-of-electronic-science-and-technology-of-china-computer-science-and-technology-282',
    'Computer Science and Technology', 
    13,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '30th. June',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'university-of-electronic-science-and-technology-of-china'),
    'Scholarship-282',
    'University of Electronic Science and Technology of China Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Software Engineering', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Software Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Software Engineering at University of Electronic Science and Technology of China
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'university-of-electronic-science-and-technology-of-china'),
    (SELECT id FROM program_catalog WHERE title = 'Software Engineering'),
    'university-of-electronic-science-and-technology-of-china-software-engineering-283',
    'Software Engineering', 
    13,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '30th. June',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'university-of-electronic-science-and-technology-of-china'),
    'Scholarship-283',
    'University of Electronic Science and Technology of China Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Electronic Information Engineering', 
    'Electrical', 
    'Electrical', 
    'Bachelor', 
    'Electronic Information Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Electronic Information Engineering at University of Electronic Science and Technology of China
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'university-of-electronic-science-and-technology-of-china'),
    (SELECT id FROM program_catalog WHERE title = 'Electronic Information Engineering'),
    'university-of-electronic-science-and-technology-of-china-electronic-information-engineering-284',
    'Electronic Information Engineering', 
    13,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '30th. June',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'university-of-electronic-science-and-technology-of-china'),
    'Scholarship-284',
    'University of Electronic Science and Technology of China Electrical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

-- University: Harbin Institute of Technology(shenzhen)
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    'Harbin Institute of Technology(shenzhen)', 
    'harbin-institute-of-technology-shenzhen', 
    NULL, 
    NULL, 
    'HITSZ', 
    'Shenzhen,Guangdong Province', 
    ARRAY['14-SHANGHAI RANKING'],
    'Triple bedroom  or Quad room,Due to limited availability,first-book-first-served" ,Accommodation fees and utility charges will be determined by the rates announced at the time of dormitory application.'
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Computer Science and Technology', 
    'Computer', 
    'Computer', 
    'Bachelor', 
    'Computer Science and Technology Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Computer Science and Technology at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Computer Science and Technology'),
    'harbin-institute-of-technology-shenzhen-computer-science-and-technology-285',
    'Computer Science and Technology', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-285',
    'Harbin Institute of Technology(shenzhen) Computer Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Optoelectronic Information Science and Engineering', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Optoelectronic Information Science and Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Optoelectronic Information Science and Engineering at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Optoelectronic Information Science and Engineering'),
    'harbin-institute-of-technology-shenzhen-optoelectronic-information-science-and-engineering-286',
    'Optoelectronic Information Science and Engineering', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-286',
    'Harbin Institute of Technology(shenzhen) Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Mechanical Design, Manufacturing and Automation', 
    'Mechanical', 
    'Mechanical', 
    'Bachelor', 
    'Mechanical Design, Manufacturing and Automation Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Mechanical Design, Manufacturing and Automation at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Mechanical Design, Manufacturing and Automation'),
    'harbin-institute-of-technology-shenzhen-mechanical-design-manufacturing-and-automation-287',
    'Mechanical Design, Manufacturing and Automation', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-287',
    'Harbin Institute of Technology(shenzhen) Mechanical Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Energy and Power Engineering', 
    'Energy', 
    'Energy', 
    'Bachelor', 
    'Energy and Power Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Energy and Power Engineering at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Energy and Power Engineering'),
    'harbin-institute-of-technology-shenzhen-energy-and-power-engineering-288',
    'Energy and Power Engineering', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-288',
    'Harbin Institute of Technology(shenzhen) Energy Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Civil Engineering', 
    'Civil Eng', 
    'Civil Eng', 
    'Bachelor', 
    'Civil Engineering Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Civil Engineering at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Civil Engineering'),
    'harbin-institute-of-technology-shenzhen-civil-engineering-289',
    'Civil Engineering', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-289',
    'Harbin Institute of Technology(shenzhen) Civil Eng Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Architecture', 
    'Architecture', 
    'Architecture', 
    'Bachelor', 
    'Architecture Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Architecture at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Architecture'),
    'harbin-institute-of-technology-shenzhen-architecture-290',
    'Architecture', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-290',
    'Harbin Institute of Technology(shenzhen) Architecture Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Business Administration', 
    'Business', 
    'Business', 
    'Bachelor', 
    'Business Administration Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Business Administration at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Business Administration'),
    'harbin-institute-of-technology-shenzhen-business-administration-291',
    'Business Administration', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-291',
    'Harbin Institute of Technology(shenzhen) Business Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    'Economics', 
    'Others', 
    'Others', 
    'Bachelor', 
    'Economics Program', 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;

-- Program: Economics at Harbin Institute of Technology(shenzhen)
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    (SELECT id FROM program_catalog WHERE title = 'Economics'),
    'harbin-institute-of-technology-shenzhen-economics-292',
    'Economics', 
    0,
    'September',
    NULL,
    '985 Project, 
211, Double First-Class',
    true,
    true,
    '20th.May',
    '18-25',
    18,
    30,
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;

INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = 'harbin-institute-of-technology-shenzhen'),
    'Scholarship-292',
    'Harbin Institute of Technology(shenzhen) Others Scholarship',
    'Allowed',
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;

COMMIT;
