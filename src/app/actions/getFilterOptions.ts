"use server";

import { createClient } from "@/lib/supabase/server";
import { PORTAL_KEY } from "@/lib/constants/portal";

export type FilterState = {
    degree?: string;
    field?: string;
    city?: string;
    language?: string;
    budget?: string;
    scholarship?: string;
    duration?: string;
};

export type FilterOptions = {
    degrees: string[];
    fields: string[];
    cities: string[];
    languages: string[];
    durations: string[];
    programCount: number;
};

export async function getFilterOptions(filters: FilterState): Promise<FilterOptions> {
    const supabase = await createClient();

    const buildQuery = (excludeKey: keyof FilterState) => {
        let query = supabase
            .from("v_university_programs_full")
            .select("level, category, city, language_name, duration")
            .eq("portal_key", PORTAL_KEY)
            .eq("is_active", true);

        if (excludeKey !== 'degree' && filters.degree && filters.degree !== "any" && filters.degree !== "all") {
            query = query.ilike("level", `%${filters.degree}%`);
        }
        if (excludeKey !== 'field' && filters.field && filters.field !== "any" && filters.field !== "all") {
            query = query.ilike("category", `%${filters.field}%`);
        }
        if (excludeKey !== 'city' && filters.city && filters.city !== "any" && filters.city !== "all") {
            query = query.eq("city", filters.city);
        }
        if (excludeKey !== 'language' && filters.language && filters.language !== "any" && filters.language !== "all") {
            query = query.ilike("language_name", `%${filters.language}%`);
        }
        // Duration/Budget logic can be similar if needed, keeping simple for now

        return query;
    };

    // Field keywords mapping - must match ProgramsClient.tsx filterKeywords
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

    // Level mapping - must match ProgramsClient.tsx levelMap
    const levelMap: Record<string, string[]> = {
        'bachelor': ['Bachelor', "Bachelor's", 'Bachelors', 'Undergraduate'],
        'master': ['Master', "Master's", 'Masters', 'Postgraduate'],
        'phd': ['PhD', 'Ph.D', 'Doctorate', 'Doctoral'],
        'diploma': ['Diploma', 'Certificate'],
        'language': ['Language Course', 'Language', 'Non-Degree']
    };

    // Build count query with all filters applied (matching client-side logic)
    const buildCountQuery = () => {
        let query = supabase
            .from("v_university_programs_full")
            .select("*", { count: "exact", head: true })
            .eq("portal_key", PORTAL_KEY)
            .eq("is_active", true);

        // Level filter - match multiple possible values
        if (filters.degree && filters.degree !== "any" && filters.degree !== "all") {
            const degreeLower = filters.degree.toLowerCase();
            const levels = levelMap[degreeLower];
            if (levels && levels.length > 0) {
                // Match any of the possible level values
                const orConditions = levels.map(l => `level.ilike.%${l}%`).join(',');
                query = query.or(orConditions);
            } else {
                query = query.ilike("level", `%${filters.degree}%`);
            }
        }

        // Field filter - use keyword matching like client-side
        if (filters.field && filters.field !== "any" && filters.field !== "all") {
            const fieldLower = filters.field.toLowerCase();
            const keywords = fieldKeywords[fieldLower];
            if (keywords && keywords.length > 0) {
                // Match any keyword in category or display_title
                const orConditions = keywords.flatMap(k => [
                    `category.ilike.%${k}%`,
                    `display_title.ilike.%${k}%`
                ]).join(',');
                query = query.or(orConditions);
            } else {
                query = query.ilike("category", `%${filters.field}%`);
            }
        }

        if (filters.city && filters.city !== "any" && filters.city !== "all") {
            query = query.eq("city", filters.city);
        }
        if (filters.language && filters.language !== "any" && filters.language !== "all") {
            query = query.ilike("language_name", `%${filters.language}%`);
        }

        return query;
    };

    // Run queries in parallel for better performance
    const [degreesRes, fieldsRes, citiesRes, languagesRes, countRes] = await Promise.all([
        buildQuery('degree'), // Get degrees considering field, city, language
        buildQuery('field'),  // Get fields considering degree, city, language
        buildQuery('city'),   // Get cities considering degree, field, language
        buildQuery('language'), // Get languages considering degree, field, city
        buildCountQuery() // Get total count with all filters
    ]);

    const extractUseableData = (res: { error: unknown; data: Record<string, string>[] | null }, key: string) => {
        if (res.error || !res.data) return [];
        return Array.from(new Set(res.data.map((d: Record<string, string>) => d[key]).filter(Boolean))).sort() as string[];
    };

    return {
        degrees: extractUseableData(degreesRes, 'level'),
        fields: extractUseableData(fieldsRes, 'category'),
        cities: extractUseableData(citiesRes, 'city'),
        languages: extractUseableData(languagesRes, 'language_name'),
        durations: [], // Static or handled similarly if needed
        programCount: countRes.count || 0
    };
}

