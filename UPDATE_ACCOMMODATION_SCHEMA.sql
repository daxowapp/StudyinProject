-- Add new columns to university_accommodation table to match provided data
ALTER TABLE university_accommodation
ADD COLUMN IF NOT EXISTS campus TEXT,
ADD COLUMN IF NOT EXISTS room_type TEXT,
ADD COLUMN IF NOT EXISTS occupancy INTEGER,
ADD COLUMN IF NOT EXISTS price_min NUMERIC,
ADD COLUMN IF NOT EXISTS price_max NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'RMB',
ADD COLUMN IF NOT EXISTS billing_period TEXT,
ADD COLUMN IF NOT EXISTS price_basis TEXT;

-- Make existing columns optional if they aren't already, or we can migrate data later
ALTER TABLE university_accommodation ALTER COLUMN type DROP NOT NULL;
ALTER TABLE university_accommodation ALTER COLUMN price_cny DROP NOT NULL;
ALTER TABLE university_accommodation ALTER COLUMN price_usd DROP NOT NULL;
