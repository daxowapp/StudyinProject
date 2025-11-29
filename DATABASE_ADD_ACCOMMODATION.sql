-- =====================================================
-- ADD ACCOMMODATION FIELDS TO UNIVERSITIES TABLE
-- =====================================================
-- This migration adds accommodation-related columns to universities
-- =====================================================

-- Add accommodation columns
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS accommodation_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS accommodation_types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS accommodation_description TEXT,
ADD COLUMN IF NOT EXISTS accommodation_fee_range VARCHAR(100),
ADD COLUMN IF NOT EXISTS accommodation_features TEXT[];

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_universities_accommodation ON universities(accommodation_available);

-- Add comments for documentation
COMMENT ON COLUMN universities.accommodation_available IS 'Whether the university provides accommodation for international students';
COMMENT ON COLUMN universities.accommodation_types IS 'JSONB array of accommodation options with details (type, price, features)';
COMMENT ON COLUMN universities.accommodation_description IS 'General description of accommodation facilities';
COMMENT ON COLUMN universities.accommodation_fee_range IS 'Price range for accommodation (e.g., "800-2000 CNY/month")';
COMMENT ON COLUMN universities.accommodation_features IS 'Array of accommodation features (e.g., WiFi, AC, Kitchen)';

-- =====================================================
-- NOTES:
-- =====================================================
-- accommodation_types JSONB structure example:
-- [
--   {
--     "type": "Single Room",
--     "price_cny": 1500,
--     "price_usd": 210,
--     "features": ["Private bathroom", "AC", "WiFi", "Desk"],
--     "description": "Single room with private facilities"
--   },
--   {
--     "type": "Double Room",
--     "price_cny": 1000,
--     "price_usd": 140,
--     "features": ["Shared bathroom", "AC", "WiFi"],
--     "description": "Shared room with two beds"
--   }
-- ]
-- =====================================================
