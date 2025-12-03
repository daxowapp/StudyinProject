-- =====================================================
-- UPDATE UNIVERSITIES WITH ACCOMMODATION DATA
-- =====================================================
-- This file adds accommodation information for the 8 universities
-- =====================================================

-- 1) Xi'an Jiaotong-Liverpool University - XJTLU
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Modern on-campus accommodation with various room types. Located in Suzhou with excellent facilities.',
    accommodation_fee_range = '1200-2500 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Laundry Room', 'Study Areas', 'Security 24/7', 'Gym Access'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 2500,
            "price_usd": 350,
            "features": ["Private bathroom", "AC", "WiFi", "Desk", "Wardrobe"],
            "description": "Private single room with ensuite bathroom"
        },
        {
            "type": "Double Room",
            "price_cny": 1500,
            "price_usd": 210,
            "features": ["Shared bathroom", "AC", "WiFi", "Study desk"],
            "description": "Shared room with two beds"
        },
        {
            "type": "Quad Room",
            "price_cny": 1200,
            "price_usd": 170,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Four-person room, budget-friendly option"
        }
    ]'::jsonb
WHERE slug = 'xjtlu';

-- 2) Linyi University
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Affordable on-campus dormitories with basic amenities. Clean and safe environment.',
    accommodation_fee_range = '800-1500 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Hot Water', 'Laundry', 'Canteen Nearby'],
    accommodation_types = '[
        {
            "type": "Double Room",
            "price_cny": 1500,
            "price_usd": 210,
            "features": ["Private bathroom", "AC", "WiFi", "Desk"],
            "description": "Two-person room with private facilities"
        },
        {
            "type": "Quad Room",
            "price_cny": 800,
            "price_usd": 115,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Four-person room, economical choice"
        }
    ]'::jsonb
WHERE slug = 'lyu';

-- 3) Northwestern Polytechnical University - NPU
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Well-maintained international student dormitories in Xi''an. Modern facilities with good security.',
    accommodation_fee_range = '1000-2000 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Heating', 'Security', 'Study Room', 'Common Kitchen'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 2000,
            "price_usd": 280,
            "features": ["Private bathroom", "AC", "Heating", "WiFi", "Desk", "Wardrobe"],
            "description": "Single room with private bathroom"
        },
        {
            "type": "Double Room",
            "price_cny": 1200,
            "price_usd": 170,
            "features": ["Shared bathroom", "AC", "Heating", "WiFi"],
            "description": "Two-person room with shared facilities"
        },
        {
            "type": "Triple Room",
            "price_cny": 1000,
            "price_usd": 140,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Three-person room"
        }
    ]'::jsonb
WHERE slug = 'npu';

-- 4) Dalian University of Technology - DLUT
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'International student apartments near the beach in Dalian. Comfortable living environment.',
    accommodation_fee_range = '1200-2200 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Heating', 'Laundry Room', 'Bike Parking', 'Security'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 2200,
            "price_usd": 310,
            "features": ["Private bathroom", "AC", "Heating", "WiFi", "Balcony"],
            "description": "Single room with sea view option"
        },
        {
            "type": "Double Room",
            "price_cny": 1500,
            "price_usd": 210,
            "features": ["Private bathroom", "AC", "Heating", "WiFi"],
            "description": "Two-person room with private bathroom"
        },
        {
            "type": "Quad Room",
            "price_cny": 1200,
            "price_usd": 170,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Four-person room, budget option"
        }
    ]'::jsonb
WHERE slug = 'dlut';

-- 5) Nanjing University of Aeronautics and Astronautics - NUAA
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Modern dormitories in Nanjing with good facilities for international students.',
    accommodation_fee_range = '1000-1800 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Hot Water', 'Study Areas', 'Canteen', 'Security'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 1800,
            "price_usd": 250,
            "features": ["Private bathroom", "AC", "WiFi", "Desk", "Wardrobe"],
            "description": "Single room with ensuite facilities"
        },
        {
            "type": "Double Room",
            "price_cny": 1200,
            "price_usd": 170,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Two-person room"
        },
        {
            "type": "Triple Room",
            "price_cny": 1000,
            "price_usd": 140,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Three-person room, economical"
        }
    ]'::jsonb
WHERE slug = 'nuaa';

-- 6) Harbin Institute of Technology - HIT
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Well-heated dormitories suitable for Harbin''s cold climate. Modern and comfortable.',
    accommodation_fee_range = '1000-2000 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Central Heating', 'Hot Water', 'Study Room', 'Laundry', 'Security 24/7'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 2000,
            "price_usd": 280,
            "features": ["Private bathroom", "Central heating", "WiFi", "Desk"],
            "description": "Single room with excellent heating system"
        },
        {
            "type": "Double Room",
            "price_cny": 1300,
            "price_usd": 180,
            "features": ["Shared bathroom", "Central heating", "WiFi"],
            "description": "Two-person room with heating"
        },
        {
            "type": "Triple Room",
            "price_cny": 1000,
            "price_usd": 140,
            "features": ["Shared bathroom", "Heating", "WiFi"],
            "description": "Three-person room"
        }
    ]'::jsonb
WHERE slug = 'hit';

-- 7) Beijing Institute of Technology (Zhuhai) - BIT Zhuhai
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Modern campus accommodation in beautiful Zhuhai. Close to the beach with tropical climate.',
    accommodation_fee_range = '1200-2500 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Hot Water', 'Beach Access', 'Sports Facilities', 'Security'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 2500,
            "price_usd": 350,
            "features": ["Private bathroom", "AC", "WiFi", "Balcony", "Ocean view"],
            "description": "Single room with ocean view"
        },
        {
            "type": "Double Room",
            "price_cny": 1600,
            "price_usd": 225,
            "features": ["Private bathroom", "AC", "WiFi"],
            "description": "Two-person room with private bathroom"
        },
        {
            "type": "Quad Room",
            "price_cny": 1200,
            "price_usd": 170,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Four-person room"
        }
    ]'::jsonb
WHERE slug = 'bit-zhuhai';

-- 8) China University of Petroleum (East China) - UPC
UPDATE universities
SET 
    accommodation_available = true,
    accommodation_description = 'Comfortable dormitories in Qingdao with sea breeze. Clean and well-maintained facilities.',
    accommodation_fee_range = '900-1800 CNY/month',
    accommodation_features = ARRAY['WiFi', 'Air Conditioning', 'Hot Water', 'Laundry Room', 'Study Areas', 'Security'],
    accommodation_types = '[
        {
            "type": "Single Room",
            "price_cny": 1800,
            "price_usd": 250,
            "features": ["Private bathroom", "AC", "WiFi", "Desk", "Wardrobe"],
            "description": "Single room with private facilities"
        },
        {
            "type": "Double Room",
            "price_cny": 1200,
            "price_usd": 170,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Two-person room"
        },
        {
            "type": "Quad Room",
            "price_cny": 900,
            "price_usd": 125,
            "features": ["Shared bathroom", "AC", "WiFi"],
            "description": "Four-person room, budget-friendly"
        }
    ]'::jsonb
WHERE slug = 'upc';

-- =====================================================
-- Verify the updates
-- =====================================================
SELECT 
    name,
    slug,
    accommodation_available,
    accommodation_fee_range,
    array_length(accommodation_features, 1) as features_count,
    jsonb_array_length(accommodation_types) as room_types_count
FROM universities
WHERE slug IN (
    'xjtlu', 'lyu', 'npu', 'dlut', 
    'nuaa', 'hit', 'bit-zhuhai', 'upc'
)
ORDER BY name;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. All prices are approximate and should be verified
-- 2. accommodation_types stored as JSONB for flexibility
-- 3. Features stored as TEXT[] array
-- 4. Price ranges help students budget planning
-- 5. Room types vary by university (single, double, triple, quad)
-- =====================================================
