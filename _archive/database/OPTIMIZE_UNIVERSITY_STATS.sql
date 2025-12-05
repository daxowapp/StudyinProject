-- Create a view to aggregate university statistics
-- This avoids N+1 query problems by pre-calculating counts and min fees

CREATE OR REPLACE VIEW v_university_stats AS
SELECT 
    u.id as university_id,
    COUNT(up.id) FILTER (WHERE up.is_active = true) as program_count,
    MIN(up.tuition_fee) FILTER (WHERE up.is_active = true) as min_tuition_fee,
    -- Get the currency associated with the minimum tuition fee
    -- We use a subquery or window function approach to get the currency of the min fee row
    (SELECT currency FROM university_programs up2 
     WHERE up2.university_id = u.id 
     AND up2.is_active = true 
     ORDER BY up2.tuition_fee ASC 
     LIMIT 1) as currency
FROM 
    universities u
LEFT JOIN 
    university_programs up ON u.id = up.university_id
GROUP BY 
    u.id;

-- Grant access to the view
GRANT SELECT ON v_university_stats TO anon, authenticated, service_role;
