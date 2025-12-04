import { createClient } from "@/lib/supabase/server";

export interface UniversityTranslation {
    id?: string;
    university_id: string;
    locale: string;
    name: string;
    description: string;
    features: string[];
}

export interface ScholarshipTranslation {
    id?: string;
    scholarship_id: string;
    locale: string;
    display_name: string;
    description: string;
    accommodation_type: string;
    additional_benefits: string[];
    requirements: string[];
}

export interface AccommodationTranslation {
    id?: string;
    university_id: string;
    locale: string;
    accommodation_description: string;
    accommodation_features: string[];
    accommodation_types: Array<{
        type: string;
        description: string;
        features: string[];
    }>;
}

export interface ProgramTranslation {
    id?: string;
    program_id: string;
    locale: string;
    title: string;
    description: string;
    requirements: string[];
    career_prospects: string[];
}

/**
 * Fetches university translation for a specific locale
 * Falls back to English if translation doesn't exist
 */
export async function getUniversityTranslation(
    universityId: string,
    locale: string
): Promise<UniversityTranslation | null> {
    const supabase = await createClient();

    // Try to get translation for the requested locale
    const { data } = await supabase
        .from("university_translations")
        .select("*")
        .eq("university_id", universityId)
        .eq("locale", locale)
        .single();

    if (data) return data;

    // Fallback to English
    if (locale !== "en") {
        const { data: englishData } = await supabase
            .from("university_translations")
            .select("*")
            .eq("university_id", universityId)
            .eq("locale", "en")
            .single();

        return englishData;
    }

    return null;
}

/**
 * Fetches scholarship translations for a university
 */
export async function getScholarshipTranslations(
    universityId: string,
    locale: string
): Promise<Map<string, ScholarshipTranslation>> {
    const supabase = await createClient();

    // First get all scholarships for this university
    const { data: scholarships } = await supabase
        .from("university_scholarships")
        .select("id")
        .eq("university_id", universityId);

    if (!scholarships) return new Map();

    const scholarshipIds = scholarships.map(s => s.id);

    // Get translations for these scholarships
    const { data: translations } = await supabase
        .from("scholarship_translations")
        .select("*")
        .in("scholarship_id", scholarshipIds)
        .eq("locale", locale);

    const translationMap = new Map<string, ScholarshipTranslation>();
    translations?.forEach(t => translationMap.set(t.scholarship_id, t));

    return translationMap;
}

/**
 * Fetches accommodation translation for a university
 */
export async function getAccommodationTranslation(
    universityId: string,
    locale: string
): Promise<AccommodationTranslation | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from("accommodation_translations")
        .select("*")
        .eq("university_id", universityId)
        .eq("locale", locale)
        .single();

    if (data) return data;

    // Fallback to English
    if (locale !== "en") {
        const { data: englishData } = await supabase
            .from("accommodation_translations")
            .select("*")
            .eq("university_id", universityId)
            .eq("locale", "en")
            .single();

        return englishData;
    }

    return null;
}

/**
 * Fetches program translation
 */
export async function getProgramTranslation(
    programId: string,
    locale: string
): Promise<ProgramTranslation | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from("program_translations")
        .select("*")
        .eq("program_id", programId)
        .eq("locale", locale)
        .single();

    if (data) return data;

    // Fallback to English
    if (locale !== "en") {
        const { data: englishData } = await supabase
            .from("program_translations")
            .select("*")
            .eq("program_id", programId)
            .eq("locale", "en")
            .single();

        return englishData;
    }

    return null;
}

/**
 * Helper to merge base data with translations
 * Falls back to base data if translation field is empty
 */
export function mergeWithTranslation<T extends Record<string, unknown>>(
    baseData: T,
    translation: Partial<T> | null,
    fields: (keyof T)[]
): T {
    if (!translation) return baseData;

    const merged = { ...baseData };

    for (const field of fields) {
        const translatedValue = translation[field];
        if (translatedValue &&
            (typeof translatedValue !== 'string' || translatedValue.trim() !== '') &&
            (!Array.isArray(translatedValue) || translatedValue.length > 0)) {
            merged[field] = translatedValue as T[keyof T];
        }
    }

    return merged;
}
