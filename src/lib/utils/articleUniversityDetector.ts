/**
 * Detects university mentions in article content
 * Returns array of university IDs that are mentioned
 */

import { createClient } from "@/lib/supabase/server";

export async function detectUniversitiesInArticle(content: string, title: string): Promise<any[]> {
    const supabase = await createClient();
    
    // Fetch all universities
    const { data: universities } = await supabase
        .from("universities")
        .select("id, name, name_local, slug, city, province, logo_url")
        .eq("is_active", true);

    if (!universities) return [];

    // Combine title and content for searching
    const fullText = `${title} ${content}`.toLowerCase();
    
    // Find universities mentioned in the article
    const mentionedUniversities = universities.filter((university) => {
        const universityName = university.name.toLowerCase();
        const universityNameLocal = university.name_local?.toLowerCase() || "";
        
        // Check if university name appears in the text
        // Use word boundaries to avoid partial matches
        const nameRegex = new RegExp(`\\b${escapeRegex(universityName)}\\b`, 'i');
        const localNameRegex = universityNameLocal 
            ? new RegExp(`\\b${escapeRegex(universityNameLocal)}\\b`, 'i')
            : null;
        
        return nameRegex.test(fullText) || (localNameRegex && localNameRegex.test(fullText));
    });

    return mentionedUniversities;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Client-side version for detecting universities
 */
export function detectUniversitiesClient(
    content: string, 
    title: string, 
    universities: any[]
): any[] {
    const fullText = `${title} ${content}`.toLowerCase();
    
    return universities.filter((university) => {
        const universityName = university.name.toLowerCase();
        const universityNameLocal = university.name_local?.toLowerCase() || "";
        
        const nameRegex = new RegExp(`\\b${escapeRegex(universityName)}\\b`, 'i');
        const localNameRegex = universityNameLocal 
            ? new RegExp(`\\b${escapeRegex(universityNameLocal)}\\b`, 'i')
            : null;
        
        return nameRegex.test(fullText) || (localNameRegex && localNameRegex.test(fullText));
    });
}
