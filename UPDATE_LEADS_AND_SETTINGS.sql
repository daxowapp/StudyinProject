-- Add new columns to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS study_interest TEXT;

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for reading settings (public can read specific settings like guide url)
CREATE POLICY "Public can read settings" ON settings
    FOR SELECT
    USING (true);

-- Create policy for admin to manage settings
CREATE POLICY "Admins can manage settings" ON settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default guide download URL setting
INSERT INTO settings (key, value, description)
VALUES ('guide_download_url', 'https://example.com/guide.pdf', 'URL for the downloadable guide')
ON CONFLICT (key) DO NOTHING;
