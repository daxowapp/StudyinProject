"use server";

import { createClient } from "@/lib/supabase/server";

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
};

export async function getFilterOptions(filters: FilterState): Promise<FilterOptions> {
    const supabase = await createClient();

    const buildQuery = (excludeKey: keyof FilterState) => {
        let query = supabase
            .from("v_university_programs_full")
            .select("level, category, city, language_name, duration")
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

    // Run queries in parallel for better performance
    const [degreesRes, fieldsRes, citiesRes, languagesRes] = await Promise.all([
        buildQuery('degree'), // Get degrees considering field, city, language
        buildQuery('field'),  // Get fields considering degree, city, language
        buildQuery('city'),   // Get cities considering degree, field, language
        buildQuery('language') // Get languages considering degree, field, city
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
        durations: [] // Static or handled similarly if needed
    };
}
