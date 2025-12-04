-- Find all Master-level requirements in the catalog
SELECT 
    id,
    title,
    category,
    requirement_type,
    description
FROM admission_requirements_catalog
WHERE requirement_type IN ('master', 'all')
ORDER BY category, title;
