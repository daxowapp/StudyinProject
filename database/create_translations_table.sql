-- Create university_translations table
CREATE TABLE IF NOT EXISTS university_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL, -- 'ar', 'fa', 'tr', 'en'
    name TEXT,
    description TEXT,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(university_id, locale)
);

-- Enable RLS
ALTER TABLE university_translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON university_translations
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON university_translations
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated'); -- Adjust based on actual admin role check

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_university_translations_updated_at
    BEFORE UPDATE ON university_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
