-- Analyze v_university_programs_full view for optimization opportunities
-- This view is used heavily across the application

-- First, let's see the current view definition
SELECT 
    schemaname,
    viewname,
    definition
FROM 
    pg_views
WHERE 
    schemaname = 'public'
    AND viewname = 'v_university_programs_full';

-- Check how many rows this view returns
SELECT COUNT(*) as total_programs
FROM v_university_programs_full;

-- Analyze query performance for common patterns
EXPLAIN ANALYZE
SELECT *
FROM v_university_programs_full
WHERE is_active = true
LIMIT 100;

-- Check for missing indexes on joined tables
SELECT
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM
    pg_stats
WHERE
    schemaname = 'public'
    AND tablename IN ('university_programs', 'universities', 'program_catalog', 'languages')
    AND attname IN ('id', 'university_id', 'program_catalog_id', 'language_id', 'is_active', 'slug')
ORDER BY
    tablename, attname;
