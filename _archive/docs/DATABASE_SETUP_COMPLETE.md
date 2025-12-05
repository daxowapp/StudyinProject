# Complete Database Setup Guide 🗄️

## 🎯 Overview

This guide contains **all database migrations** needed to run the Study At China platform with all new features.

---

## 📋 Migration Files

### 1. **Universities Table Migration**
**File:** `DATABASE_MIGRATION_UNIVERSITIES.sql`

Adds all new columns to universities table:
- ✅ `name_local` - Chinese name
- ✅ `slug` - SEO-friendly URL (UNIQUE)
- ✅ `province` - Province name
- ✅ `founded` - Founded year
- ✅ `total_students` - Total student count
- ✅ `international_students` - International student count
- ✅ `ranking` - University ranking
- ✅ `features` - Array of features
- ✅ `video_url` - YouTube/Vimeo URL
- ✅ `gallery_images` - Array of image URLs
- ✅ `latitude` - Map latitude
- ✅ `longitude` - Map longitude

### 2. **Program Catalog Migration**
**File:** `DATABASE_MIGRATION_PROGRAMS.sql`

Creates new program catalog system:
- ✅ `program_catalog` table - Master program list
- ✅ `university_programs` table - University-specific programs
- ✅ `v_university_programs_full` view - Combined view
- ✅ Sample data for 40+ programs

---

## 🚀 How to Run Migrations

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project
2. Click on "SQL Editor" in the sidebar

### Step 2: Run Universities Migration
1. Copy content from `DATABASE_MIGRATION_UNIVERSITIES.sql`
2. Paste into SQL Editor
3. Click "Run" button
4. Verify success ✅

### Step 3: Run Programs Migration
1. Copy content from `DATABASE_MIGRATION_PROGRAMS.sql`
2. Paste into SQL Editor
3. Click "Run" button
4. Verify success ✅

---

## 📊 Complete Schema

### Universities Table (After Migration):

```sql
CREATE TABLE universities (
    -- Existing columns
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- New columns
    name_local VARCHAR(255),              -- Chinese name
    slug VARCHAR(255) UNIQUE,             -- SEO-friendly URL
    province VARCHAR(100),                -- Province
    founded VARCHAR(50),                  -- Founded year
    total_students VARCHAR(50),           -- Total students
    international_students VARCHAR(50),   -- International students
    ranking VARCHAR(100),                 -- Ranking
    features TEXT[],                      -- Features array
    video_url TEXT,                       -- Video URL
    gallery_images TEXT[],                -- Gallery images
    latitude DECIMAL(10, 8),              -- Map latitude
    longitude DECIMAL(11, 8)              -- Map longitude
);
```

### Program Catalog Table (New):

```sql
CREATE TABLE program_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    field VARCHAR(100),
    level VARCHAR(50) NOT NULL,
    description TEXT,
    typical_duration VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### University Programs Table (New):

```sql
CREATE TABLE university_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id),
    program_catalog_id UUID NOT NULL REFERENCES program_catalog(id),
    custom_title VARCHAR(255),
    tuition_fee DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'RMB',
    duration VARCHAR(50),
    language_id UUID REFERENCES languages(id),
    intake VARCHAR(100),
    scholarship_chance VARCHAR(50),
    application_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    force_payment BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(university_id, program_catalog_id)
);
```

---

## ✅ Verification Queries

### Check Universities Table:

```sql
-- Verify all columns exist
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'universities'
ORDER BY ordinal_position;
```

### Check Program Catalog:

```sql
-- Count programs in catalog
SELECT COUNT(*) as total_programs FROM program_catalog;

-- View programs by category
SELECT category, COUNT(*) as count 
FROM program_catalog 
GROUP BY category 
ORDER BY count DESC;
```

### Check Indexes:

```sql
-- Verify indexes exist
SELECT 
    indexname, 
    tablename 
FROM pg_indexes 
WHERE tablename IN ('universities', 'program_catalog', 'university_programs');
```

---

## 🔧 Troubleshooting

### Error: "column already exists"
```sql
-- This is OK! It means the column was already added
-- The migration uses IF NOT EXISTS to prevent errors
```

### Error: "relation does not exist"
```sql
-- Make sure you're running the migration in the correct database
-- Check that the universities table exists first
SELECT * FROM universities LIMIT 1;
```

### Error: "duplicate key value violates unique constraint"
```sql
-- This means you have duplicate slugs
-- Run this to find duplicates:
SELECT slug, COUNT(*) 
FROM universities 
GROUP BY slug 
HAVING COUNT(*) > 1;

-- Fix by updating duplicates manually
```

---

## 📝 Sample Data

### Universities Sample:

```sql
INSERT INTO universities (
    name, 
    name_local, 
    slug, 
    city, 
    province,
    founded,
    total_students,
    international_students,
    ranking,
    features,
    latitude,
    longitude
) VALUES (
    'Tsinghua University',
    '清华大学',
    'tsinghua-university',
    'Beijing',
    'Beijing',
    '1911',
    '50,000',
    '3,000',
    'Top 20 Globally',
    ARRAY['Research University', 'Engineering Excellence', 'International Programs'],
    39.9997,
    116.3267
);
```

### Program Catalog Sample:

```sql
INSERT INTO program_catalog (
    title, 
    category, 
    field, 
    level, 
    typical_duration
) VALUES 
('Business Administration', 'Business & Management', 'General Business', 'Bachelor', '4 years'),
('Computer Science', 'Engineering & Technology', 'Computer Science', 'Bachelor', '4 years'),
('MBBS', 'Medicine & Health Sciences', 'Medicine', 'Bachelor', '6 years');
```

---

## 🎯 Post-Migration Checklist

- [ ] Run `DATABASE_MIGRATION_UNIVERSITIES.sql`
- [ ] Run `DATABASE_MIGRATION_PROGRAMS.sql`
- [ ] Verify all columns exist
- [ ] Check indexes are created
- [ ] Test university page loads
- [ ] Test admin edit page works
- [ ] Test program catalog page
- [ ] Verify slugs are unique
- [ ] Test map locations display
- [ ] Test gallery/video features

---

## 🚀 Next Steps

After running migrations:

1. **Update Existing Data**
   - Add slugs to existing universities
   - Add locations (latitude/longitude)
   - Upload logos and gallery images
   - Add video URLs

2. **Populate Program Catalog**
   - Add all standard programs
   - Categorize properly
   - Set typical durations

3. **Link Programs to Universities**
   - Use new university_programs table
   - Set tuition fees
   - Add language information

4. **Test Everything**
   - Public university pages
   - Admin edit pages
   - Program filtering
   - Map locations

---

## 📊 Database Diagram

```
┌─────────────────┐
│  universities   │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug (UNIQUE)   │◄─────┐
│ city            │      │
│ latitude        │      │
│ longitude       │      │
│ video_url       │      │
│ gallery_images  │      │
│ features        │      │
└─────────────────┘      │
                         │
                         │
┌──────────────────────┐ │
│ university_programs  │ │
├──────────────────────┤ │
│ id (PK)              │ │
│ university_id (FK)───┼─┘
│ program_catalog_id───┼──┐
│ tuition_fee          │  │
│ custom_title         │  │
│ language_id          │  │
└──────────────────────┘  │
                          │
                          │
┌─────────────────────┐   │
│  program_catalog    │   │
├─────────────────────┤   │
│ id (PK)             │◄──┘
│ title (UNIQUE)      │
│ category            │
│ level               │
│ typical_duration    │
└─────────────────────┘
```

---

## 🎉 Result

After running all migrations, you'll have:

- ✅ Complete universities table with all features
- ✅ Program catalog system
- ✅ SEO-friendly slug URLs
- ✅ Map location support
- ✅ Gallery and video support
- ✅ User roles system
- ✅ Proper indexes for performance

**Your database is now ready for production!** 🚀
