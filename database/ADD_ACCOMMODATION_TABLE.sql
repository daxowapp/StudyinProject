-- Create university_accommodation table
CREATE TABLE IF NOT EXISTS university_accommodation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT,
    price_cny NUMERIC,
    price_usd NUMERIC,
    features TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for university_accommodation
ALTER TABLE university_accommodation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for university_accommodation"
    ON university_accommodation FOR SELECT
    USING (true);

CREATE POLICY "Admin full access for university_accommodation"
    ON university_accommodation FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Add columns to universities table if they don't exist
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS accommodation_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS accommodation_description TEXT,
ADD COLUMN IF NOT EXISTS accommodation_fee_range TEXT,
ADD COLUMN IF NOT EXISTS accommodation_features TEXT[] DEFAULT '{}';
