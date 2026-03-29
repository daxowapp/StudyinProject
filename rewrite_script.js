const fs = require('fs');

const path = '/Users/darwish/Dev/StudyinProject/src/components/programs/ProgramsClientContent.tsx';
let content = fs.readFileSync(path, 'utf8');

// The replacement start
const startIndexText = '    // Filter programs based on current filters, then rank by relevance\n    const filteredPrograms = useMemo(() => {';
const endIndexText = '    const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);';

const startIndex = content.indexOf(startIndexText);
const endIndex = content.indexOf(endIndexText) + endIndexText.length;

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find start or end index", {startIndex, endIndex});
    process.exit(1);
}

const beforeContent = content.substring(0, startIndex);
const afterContent = content.substring(endIndex);

const replacement = `    const supabase = createClient();
    
    const { data: queryData, isFetching: isFetchingPrograms } = useQuery({
        queryKey: ['programs', filters, currentPage, sortBy, expandedTerms],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            let query = supabase
                .from('v_university_programs_full')
                .select('id, slug, display_title, program_title, university_name, university_slug, city, level, duration, tuition_fee, currency, intake, application_deadline, language_name, category, scholarship_chance, gpa_requirement, csca_exam_require', { count: 'exact' })
                .eq('portal_key', PORTAL_KEY)
                .eq('is_active', true);
            
            // Search processing
            if (filters.search) {
                const searchLower = filters.search.toLowerCase().trim();
                const uniqueSearchTerms = Array.from(new Set([searchLower, ...expandedTerms]));
                
                const orConditions = uniqueSearchTerms.map(term => 
                    \`program_title.ilike.%\${term}%,university_name.ilike.%\${term}%,category.ilike.%\${term}%\`
                ).join(',');
                query = query.or(orConditions);
            }

            // Level filter
            if (filters.levels.length > 0) {
                const levelMap: Record<string, string[]> = {
                    'bachelor': ['bachelor', "bachelor's", 'bachelors', 'undergraduate'],
                    'master': ['master', "master's", 'masters', 'postgraduate'],
                    'phd': ['phd', 'ph.d', 'doctorate', 'doctoral'],
                    'diploma': ['diploma', 'certificate'],
                    'language': ['language course', 'language', 'non-degree', 'chinese'],
                    'non-degree': ['language course', 'language', 'non-degree', 'chinese']
                };
                
                let validVariations: string[] = [];
                filters.levels.forEach(l => {
                    validVariations = validVariations.concat(levelMap[l.toLowerCase()] || [l.toLowerCase()]);
                });
                
                if (validVariations.length > 0) {
                    const orConditions = validVariations.map(variation => \`level.ilike.%\${variation}%\`).join(',');
                    query = query.or(orConditions);
                }
            }

            // Field Filter
            if (filters.field !== 'all') {
                const fieldLower = filters.field.toLowerCase();
                const fieldKeywords: Record<string, string[]> = {
                    'business': ['business', 'mba', 'management', 'economics', 'finance', 'accounting', 'marketing', 'commerce'],
                    'engineering': ['engineering', 'engineer', 'mechanical', 'electrical', 'civil', 'chemical', 'industrial', 'technology'],
                    'medicine': ['medicine', 'medical', 'mbbs', 'health', 'nursing', 'pharmacy', 'clinical', 'surgery'],
                    'cs': ['computer', 'computing', 'software', 'it', 'information technology', 'data science', 'ai', 'artificial intelligence'],
                    'arts': ['arts', 'humanities', 'literature', 'history', 'philosophy', 'language', 'culture'],
                    'science': ['science', 'physics', 'chemistry', 'biology', 'mathematics', 'math'],
                    'law': ['law', 'legal', 'justice', 'jurisprudence'],
                    'education': ['education', 'teaching', 'pedagogy', 'training']
                };
                const keywords = fieldKeywords[fieldLower] || [fieldLower];
                const orConditions = keywords.map(kw => \`program_title.ilike.%\${kw}%,category.ilike.%\${kw}%\`).join(',');
                query = query.or(orConditions);
            }

            // Tuition
            if (filters.maxTuition < 200000) {
                query = query.lte('tuition_fee', filters.maxTuition);
            }

            // Languages
            if (filters.languages.length > 0) {
                const orConditions = filters.languages.map(lang => \`language_name.ilike.%\${lang}%\`).join(',');
                query = query.or(orConditions);
            }

            // City
            if (filters.cities.length > 0) {
                const orConditions = filters.cities.map(city => \`city.ilike.%\${city}%\`).join(',');
                query = query.or(orConditions);
            }

            // University
            if (filters.university !== 'all') {
                query = query.or(\`university_slug.eq.\${filters.university},university_name.eq.\${filters.university}\`);
            }

            // Duration
            if (filters.duration !== 'all') {
                query = query.eq('duration', filters.duration);
            }

            // Scholarship
            if (filters.scholarship) {
                query = query.not('scholarship_chance', 'is', null).neq('scholarship_chance', '').neq('scholarship_chance', 'None');
            }

            // CSCA
            if (filters.cscaExam) {
                query = query.neq('csca_exam_require', true);
            }
            
            // GPA
            if (filters.gpa !== undefined && filters.gpa !== null) {
                query = query.or(\`gpa_requirement.is.null,gpa_requirement.lte.\${filters.gpa}\`);
            }
            
            // Sorting
            if (sortBy === 'tuition-low') {
                query = query.order('tuition_fee', { ascending: true, nullsFirst: false });
            } else if (sortBy === 'tuition-high') {
                query = query.order('tuition_fee', { ascending: false, nullsFirst: false });
            } else if (sortBy === 'popular') {
                query = query.order('scholarship_chance', { ascending: false });
            }
            // Fallback default sort
            query = query.order('id', { ascending: true });

            // Pagination
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;
            if (error) {
                console.error("Fetch error:", error);
                throw error;
            }
            
            // Transform
            const programs = (data || []).map((p: any) => ({
                id: p.id,
                slug: p.slug,
                name: p.display_title || p.program_title,
                university: p.university_name,
                university_slug: p.university_slug,
                city: p.city,
                level: p.level,
                duration: p.duration,
                tuition: \`\${p.tuition_fee} \${p.currency}/Year\`,
                tuition_fee: p.tuition_fee,
                currency: p.currency || 'CNY',
                deadline: p.intake,
                application_deadline: p.application_deadline,
                badges: [p.language_name, p.level].filter(Boolean),
                category: p.category,
                language: p.language_name,
                scholarship_chance: p.scholarship_chance,
                has_fast_track: fastTrackMap[p.university_slug] || false,
                min_age: undefined,
                max_age: undefined,
                gpa_requirement: p.gpa_requirement,
                csca_exam_require: p.csca_exam_require,
            }));
            
            return { programs, count: count || 0 };
        }
    });

    const paginatedPrograms = queryData?.programs || [];
    const totalCount = queryData?.count || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;`;

// Updates
let finalContent = beforeContent + replacement + afterContent;

// 1. Add imports
finalContent = finalContent.replace(
    'import { useQuery } from "@tanstack/react-query";',
    'import { useQuery, keepPreviousData } from "@tanstack/react-query";\nimport { createClient } from "@/lib/supabase/client";\nimport { PORTAL_KEY } from "@/lib/constants/portal";'
);

// 2. Update Interface
finalContent = finalContent.replace(
    /interface ProgramsClientProps \{[\s\S]*?\}/,
    `interface ProgramsClientProps {
    universityMap?: Record<string, string>;
    fastTrackMap?: Record<string, boolean>;
    availableCities?: string[];
    availableUniversities?: string[];
    initialFilters?: Partial<FilterState>;
}`
);

// 3. Update Function Signature
finalContent = finalContent.replace(
    /export function ProgramsClient\(\{ programs, universityMap = \{\}, initialFilters = \{\} \}: ProgramsClientProps\) \{/,
    `export function ProgramsClient({ universityMap = {}, fastTrackMap = {}, availableCities = [], availableUniversities = [], initialFilters = {} }: ProgramsClientProps) {`
);

// 4. Remove availableCities and availableUniversities calculation
finalContent = finalContent.replace(
    /    \/\/ Extract unique cities and universities[\s\S]*?    \/\/ Initialize filters from URL parameters/,
    `    // Initialize filters from URL parameters`
);

// Replace filteredPrograms.length inside render
finalContent = finalContent.replace(/filteredPrograms\.length/g, "totalCount");

fs.writeFileSync(path, finalContent);
console.log("Rewrite complete!");
