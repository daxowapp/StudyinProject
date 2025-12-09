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

    // Build count query with all filters applied
    const buildCountQuery = () => {
        let query = supabase
            .from("v_university_programs_full")
            .select("*", { count: "exact", head: true })
            .eq("portal_key", PORTAL_KEY)
            .eq("is_active", true);

        if (filters.degree && filters.degree !== "any" && filters.degree !== "all") {
            query = query.ilike("level", `%${filters.degree}%`);
        }
        if (filters.field && filters.field !== "any" && filters.field !== "all") {
            query = query.ilike("category", `%${filters.field}%`);
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

