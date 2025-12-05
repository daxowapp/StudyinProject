-- =====================================================
-- ARTICLES/BLOG SYSTEM - DATABASE MIGRATION
-- =====================================================
-- This migration creates a complete articles/blog system
-- =====================================================

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    reading_time INTEGER, -- in minutes
    is_featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create article_categories table for better organization
CREATE TABLE IF NOT EXISTS article_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50), -- Icon name
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default categories
INSERT INTO article_categories (name, slug, description, color, icon, display_order) VALUES
('Study Tips', 'study-tips', 'Tips and advice for studying in China', '#3B82F6', 'BookOpen', 1),
('University Life', 'university-life', 'Life as a student in Chinese universities', '#10B981', 'GraduationCap', 2),
('Scholarships', 'scholarships', 'Scholarship opportunities and application guides', '#F59E0B', 'Award', 3),
('Visa & Immigration', 'visa-immigration', 'Visa requirements and immigration procedures', '#EF4444', 'FileText', 4),
('Culture & Travel', 'culture-travel', 'Chinese culture and travel experiences', '#8B5CF6', 'Globe', 5),
('Career & Jobs', 'career-jobs', 'Career opportunities and job market in China', '#EC4899', 'Briefcase', 6),
('Language Learning', 'language-learning', 'Chinese language learning resources', '#06B6D4', 'Languages', 7),
('News & Updates', 'news-updates', 'Latest news and updates about studying in China', '#6366F1', 'Newspaper', 8)
ON CONFLICT (slug) DO NOTHING;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- 5. Create function to generate slug
CREATE OR REPLACE FUNCTION generate_article_slug(article_title TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Convert title to slug format
    base_slug := LOWER(TRIM(article_title));
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Ensure uniqueness
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM articles WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_article_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_article_slug(NEW.title);
    END IF;
    
    -- Update updated_at timestamp
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_article_slug ON articles;
CREATE TRIGGER trigger_set_article_slug
    BEFORE INSERT OR UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION set_article_slug();

-- 7. Create view for published articles with author info
CREATE OR REPLACE VIEW v_published_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.featured_image,
    a.category,
    a.tags,
    a.published_at,
    a.views,
    a.reading_time,
    a.is_featured,
    a.created_at,
    a.updated_at,
    p.first_name || ' ' || p.last_name as author_name,
    p.email as author_email,
    ac.name as category_name,
    ac.color as category_color,
    ac.icon as category_icon
FROM articles a
LEFT JOIN profiles p ON a.author_id = p.id
LEFT JOIN article_categories ac ON a.category = ac.slug
WHERE a.status = 'published'
ORDER BY a.published_at DESC;

-- 8. Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for articles
-- Public can read published articles
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles" ON articles
    FOR SELECT USING (status = 'published');

-- Admins can do everything
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
CREATE POLICY "Admins can manage articles" ON articles
    FOR ALL USING (public.is_admin());

-- Authors can manage their own articles
DROP POLICY IF EXISTS "Authors can manage own articles" ON articles;
CREATE POLICY "Authors can manage own articles" ON articles
    FOR ALL USING (auth.uid() = author_id);

-- 10. RLS Policies for categories
-- Public can read categories
DROP POLICY IF EXISTS "Public can view categories" ON article_categories;
CREATE POLICY "Public can view categories" ON article_categories
    FOR SELECT USING (true);

-- Admins can manage categories
DROP POLICY IF EXISTS "Admins can manage categories" ON article_categories;
CREATE POLICY "Admins can manage categories" ON article_categories
    FOR ALL USING (public.is_admin());

-- 11. Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE articles
    SET views = views + 1
    WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql;

-- 12. Sample articles (optional)
INSERT INTO articles (title, excerpt, content, category, tags, status, published_at, reading_time, is_featured, author_id) VALUES
(
    'Complete Guide to Studying in China 2025',
    'Everything you need to know about studying in China, from application to graduation.',
    'China has become one of the most popular destinations for international students...',
    'study-tips',
    ARRAY['guide', 'beginners', '2025'],
    'published',
    NOW(),
    10,
    true,
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
    'Top 10 Scholarships for International Students',
    'Discover the best scholarship opportunities available for studying in China.',
    'Scholarships can significantly reduce the financial burden of studying abroad...',
    'scholarships',
    ARRAY['scholarships', 'funding', 'CSC'],
    'published',
    NOW() - INTERVAL '1 day',
    8,
    true,
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
    'Chinese Student Visa Application Process',
    'Step-by-step guide to applying for a Chinese student visa (X1/X2).',
    'Obtaining a student visa is a crucial step in your journey to study in China...',
    'visa-immigration',
    ARRAY['visa', 'immigration', 'X1', 'X2'],
    'published',
    NOW() - INTERVAL '2 days',
    12,
    false,
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count articles by status
SELECT status, COUNT(*) as count 
FROM articles 
GROUP BY status;

-- Count articles by category
SELECT category, COUNT(*) as count 
FROM articles 
GROUP BY category 
ORDER BY count DESC;

-- View all categories
SELECT * FROM article_categories ORDER BY display_order;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Run this migration in your Supabase SQL Editor
-- 2. Articles support: title, content, images, categories, tags
-- 3. SEO-friendly with slugs, meta titles, and descriptions
-- 4. View counter for analytics
-- 5. Featured articles for homepage
-- 6. Draft/Published/Archived workflow
-- 7. Author attribution with profiles
-- =====================================================
