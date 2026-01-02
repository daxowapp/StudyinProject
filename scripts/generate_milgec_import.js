const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, '../docs/MILGEC Offers List 2026.csv');
const OUTPUT_FILE = path.join(__dirname, '../database/IMPORT_MILGEC_2026.sql');

// Helper to escape single quotes for SQL
function escapeSql(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''").trim()}'`;
}

// Helper to parse numeric tuition
function parseTuition(tuitionStr) {
    if (!tuitionStr) return 0;
    // Extract the first number found, removing commas
    const match = tuitionStr.replace(/,/g, '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

// Simple CSV Parser that handles quoted fields with newlines
function parseCSV(text) {
    const result = [];
    let row = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuote) {
            if (char === '"' && nextChar === '"') {
                current += '"';
                i++; // skip next quote
            } else if (char === '"') {
                inQuote = false;
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuote = true;
            } else if (char === ';') {
                row.push(current.trim());
                current = '';
            } else if (char === '\n' || char === '\r') {
                if (current || row.length > 0) {
                    row.push(current.trim());
                    if (row.length > 1) result.push(row); // Only add non-empty rows
                    row = [];
                    current = '';
                }
                // Handle \r\n
                if (char === '\r' && nextChar === '\n') i++;
            } else {
                current += char;
            }
        }
    }
    if (row.length > 0) result.push(row);
    return result;
}

const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
const data = parseCSV(csvContent);

// NEW COLUMNS MAPPING (approx based on header inspection):
// 0: Category (Others, Business, etc.) - Map to program_catalog.category
// 1: Fast Track (Yes/No) - Map to university_programs.fast_track
// 2: Hot/General - Map to is_popular (Active "Hot" means popular)
// 3: Intake - Map to intake
// 4: Code - Map to universities.code
// 5: University Name
// 6: CSCA (Yes/No) - Maybe requirement?
// 7: Major - Map to program_catalog.title
// 8: PIC (Person in Charge) - Skip?
// 9: Seats
// 10: Remaining Seats - Skip
// 13: Location (City, Province)
// 14: Ranking
// 15: Special Title (985/211 etc) - Map to universities.features
// 16: Deadline
// 17: Mini Marks - Map to gpa_requirement
// 18: Original Tuition
// 19: Original Dorm - Skip or put in desc
// 20: Rent outside - Map to accommodation_allowance
// 21: Scholarship Details
// 25: Age Limit
// 26: English - Map to english_requirement
// 27: Docs List - Map to required_documents
// 28: Dorm link - Skip

let sql = `-- IMPORT SCRIPT FOR MILGEC 2026
-- GENERATED AT ${new Date().toISOString()}

BEGIN;

`;

// Track processed universities to avoid duplicate inserts in this script run
const processedUniversities = new Set();
const processedPrograms = new Set();

data.slice(1).forEach((row, index) => {
    const uniName = row[5];
    if (!uniName) return;

    const category = row[0] || 'General';
    const fastTrack = (row[1] || '').toLowerCase().includes('yes');
    const programType = row[2] || 'General';
    const isPopular = programType.toLowerCase().includes('hot');
    const intake = row[3];
    const uniCode = row[4];
    const major = row[7] || 'General Program';
    const seats = row[9];
    const locationRaw = row[13] || '';
    const ranking = row[14];
    const specialTitle = row[15];
    const deadline = row[16];
    const miniMarks = row[17];
    const tuitionRaw = row[18];
    const rentOutside = row[20];
    const scholarshipDetails = row[21];
    const ageLimit = row[25];
    const englishReq = row[26];
    const docsList = row[27];

    // Parse Location
    let city = 'Unknown';
    let province = '';
    // Split by common separators including newlines
    const locParts = locationRaw.split(/,|，|_|\n/);
    if (locParts.length > 0) city = locParts[0].trim();
    if (locParts.length > 1) province = locParts[locParts.length - 1].trim(); // Take last part as province often

    // Generate University Slug
    const uniSlug = uniName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // 1. Insert University
    if (!processedUniversities.has(uniName)) {
        let featuresArr = 'NULL';
        if (specialTitle && specialTitle.length > 2) {
            // Split features by newline or comma
            const feats = specialTitle.split(/\n|,/).map(f => `"${f.trim()}"`).join(',');
            featuresArr = `'{{${feats}}}`; // PG Array format e.g. '{"985", "211"}' need to be careful with escaping
            // Actually simpler to just store as text array literal in SQL: ARRAY['985', '211']
            const featsSql = specialTitle.split(/\n|,/).map(f => `'${f.replace(/'/g, "''").trim()}'`).join(',');
            featuresArr = `ARRAY[${featsSql}]`;
        }

        sql += `
-- University: ${uniName}
INSERT INTO universities (name, slug, city, province, code, ranking, features, accommodation_allowance)
VALUES (
    ${escapeSql(uniName)}, 
    ${escapeSql(uniSlug)}, 
    ${escapeSql(city)}, 
    ${escapeSql(province)}, 
    ${escapeSql(uniCode)}, 
    ${escapeSql(ranking)}, 
    ${featuresArr === 'NULL' ? 'NULL' : featuresArr},
    ${escapeSql(rentOutside)}
)
ON CONFLICT (slug) DO UPDATE SET 
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    code = EXCLUDED.code,
    ranking = EXCLUDED.ranking,
    features = EXCLUDED.features,
    accommodation_allowance = EXCLUDED.accommodation_allowance;
`;
        processedUniversities.add(uniName);
    }

    // 2. Insert Program Catalog Entry
    // We need to ensure the major exists in program_catalog
    // We assume level is 'Bachelor' unless 'Master' or 'PhD' is in the title string, 
    // or we default to Bachelor for now as CSV mostly assumes Bachelor?
    // User noted some Master programs. Let's try to detect.
    let level = 'Bachelor';
    if (major.toLowerCase().includes('master')) level = 'Master';
    if (major.toLowerCase().includes('phd') || major.toLowerCase().includes('doctoral')) level = 'PhD';
    if (major.toLowerCase().includes('non-degree') || major.toLowerCase().includes('language')) level = 'Non-Degree';

    // We should create a catalog entry for this Major
    const catalogTitle = major;

    sql += `
INSERT INTO program_catalog (title, category, field, level, description, typical_duration)
VALUES (
    ${escapeSql(catalogTitle)}, 
    ${escapeSql(category)}, 
    ${escapeSql(category)}, 
    ${escapeSql(level)}, 
    ${escapeSql(major + ' Program')}, 
    '4 years' -- default
)
ON CONFLICT (title) DO NOTHING;
`;

    // 3. Insert University Program
    const tuitionVal = parseTuition(tuitionRaw);
    const programSlug = `${uniSlug}-${major.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;

    // Parse Age Limit
    let minAge = 18;
    let maxAge = 30;
    if (ageLimit) {
        const ages = ageLimit.match(/(\d+)/g);
        if (ages && ages.length >= 1) minAge = parseInt(ages[0]);
        if (ages && ages.length >= 2) maxAge = parseInt(ages[1]);
    }

    sql += `
-- Program: ${major} at ${uniName}
INSERT INTO university_programs (
    university_id, 
    program_catalog_id, 
    slug,
    custom_title,
    tuition_fee, 
    intake, 
    seats,
    application_deadline,
    fast_track,
    is_popular,
    gpa_requirement,
    english_requirement,
    min_age,
    max_age,
    scholarship_chance
)
VALUES (
    (SELECT id FROM universities WHERE slug = ${escapeSql(uniSlug)}),
    (SELECT id FROM program_catalog WHERE title = ${escapeSql(catalogTitle)}),
    ${escapeSql(programSlug)},
    ${escapeSql(major)}, 
    ${tuitionVal},
    ${escapeSql(intake)},
    ${escapeSql(seats)},
    ${escapeSql(deadline)},
    ${fastTrack},
    ${isPopular},
    ${escapeSql(miniMarks)},
    ${escapeSql(englishReq)},
    ${minAge},
    ${maxAge},
    'Available'
)
ON CONFLICT (slug) DO UPDATE SET
    tuition_fee = EXCLUDED.tuition_fee,
    seats = EXCLUDED.seats,
    application_deadline = EXCLUDED.application_deadline,
    gpa_requirement = EXCLUDED.gpa_requirement;
`;

    // 4. Scholarship
    if (scholarshipDetails && scholarshipDetails.length > 5 && !scholarshipDetails.toLowerCase().includes('no scholarship')) {
        const scholarshipDisplay = `${uniName} ${category} Scholarship`;

        sql += `
INSERT INTO university_scholarships (
    university_id,
    type_name,
    display_name,
    description,
    is_active
)
VALUES (
    (SELECT id FROM universities WHERE slug = ${escapeSql(uniSlug)}),
    'Scholarship-${index}',
    ${escapeSql(scholarshipDisplay)},
    ${escapeSql(scholarshipDetails)},
    true
)
ON CONFLICT (university_id, type_name) DO UPDATE SET
    description = EXCLUDED.description;
`;
    }
});

sql += `
COMMIT;
`;

fs.writeFileSync(OUTPUT_FILE, sql);
console.log(`Successfully generated SQL to ${OUTPUT_FILE}`);
