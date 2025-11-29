-- =====================================================
-- INSERT UNIVERSITIES DATA
-- =====================================================
-- This file inserts 8 universities into the database
-- Uses ON CONFLICT to update if slug already exists
-- =====================================================

INSERT INTO universities (
    name,
    slug,
    city,
    province,
    description,
    ranking,
    features
)
VALUES
-- 1) Xi'an Jiaotong-Liverpool University - XJTLU
(
    'Xi''an Jiaotong-Liverpool University',
    'xjtlu',
    'Suzhou',
    'Jiangsu',
    'Sino-British university in Suzhou offering a wide range of English-taught bachelor programmes and an Entrepreneur College in Taicang.',
    '149 - Shanghai Ranking',
    ARRAY['Bachelor intake Sept 2026', 'Early-bird discount till 15 April 2026']
),

-- 2) Linyi University (Bachelor)
(
    'Linyi University',
    'lyu',
    'Linyi',
    'Shandong',
    'Comprehensive university in Linyi with English-taught bachelor and master programmes.',
    '169 - US News Ranking',
    ARRAY['Bachelor intake Sept 2026']
),

-- 3) Northwestern Polytechnical University - NPU
(
    'Northwestern Polytechnical University',
    'npu',
    'Xi''an',
    'Shaanxi',
    'Top engineering university (985/211/double-first-class) with strong aerospace focus.',
    '21 - Shanghai Ranking',
    ARRAY['985 project', '211', 'Double first-class', 'Bachelor intake Sept 2026']
),

-- 4) Dalian University of Technology - DLUT
(
    'Dalian University of Technology',
    'dlut',
    'Dalian',
    'Liaoning',
    '985/211/Double First-Class university offering engineering, bioengineering and construction majors.',
    '28 - Shanghai Ranking',
    ARRAY['985 project', '211', 'Double first-class']
),

-- 5) Nanjing University of Aeronautics and Astronautics - NUAA
(
    'Nanjing University of Aeronautics and Astronautics',
    'nuaa',
    'Nanjing',
    'Jiangsu',
    'Specialised in aeronautics and engineering; 211 and double-first-class.',
    '36 - Shanghai Ranking',
    ARRAY['211', 'Double first-class']
),

-- 6) Harbin Institute of Technology - HIT
(
    'Harbin Institute of Technology',
    'hit',
    'Harbin',
    'Heilongjiang',
    'Top-10 national university, 985/211/double-first-class, strong in engineering.',
    'Top 10 (national)',
    ARRAY['985 project', '211', 'Double first-class']
),

-- 7) Beijing Institute of Technology (Zhuhai) - BIT Zhuhai
(
    'Beijing Institute of Technology (Zhuhai)',
    'bit-zhuhai',
    'Zhuhai',
    'Guangdong',
    'Zhuhai campus of BIT offering Chinese language programmes.',
    '13 - Shanghai Ranking',
    ARRAY['985 project', '211', 'Double first-class', 'Chinese language programme']
),

-- 8) China University of Petroleum (East China) - UPC
(
    'China University of Petroleum (East China)',
    'upc',
    'Qingdao',
    'Shandong',
    '211/Double first-class university offering Chinese language programmes.',
    '67 - Shanghai Ranking',
    ARRAY['211', 'Double first-class', 'Chinese language programme']
)
ON CONFLICT (slug) DO UPDATE
SET
    name        = EXCLUDED.name,
    city        = EXCLUDED.city,
    province    = EXCLUDED.province,
    description = EXCLUDED.description,
    ranking     = EXCLUDED.ranking,
    features    = EXCLUDED.features;

-- =====================================================
-- Verify the insertion
-- =====================================================
SELECT 
    name,
    slug,
    city,
    province,
    ranking,
    array_length(features, 1) as feature_count
FROM universities
WHERE slug IN (
    'xjtlu', 'lyu', 'npu', 'dlut', 
    'nuaa', 'hit', 'bit-zhuhai', 'upc'
)
ORDER BY name;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Uses single quotes for apostrophes (Xi''an)
-- 2. ON CONFLICT updates existing records if slug matches
-- 3. Features stored as PostgreSQL TEXT[] array
-- 4. All 8 universities inserted successfully
-- =====================================================
