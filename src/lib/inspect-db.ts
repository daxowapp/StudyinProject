
import { createClient } from "@/lib/supabase/server";

export async function inspectDatabaseValues() {
    const supabase = await createClient();

    // Check universities table for large content
    const { data: universities, error } = await supabase
        .from('universities')
        .select('id, name, logo_url, cover_photo_url');

    if (error) return { error };

    const analysis = universities.map(u => ({
        id: u.id,
        name: u.name,
        logo_len: u.logo_url ? u.logo_url.length : 0,
        logo_start: u.logo_url ? u.logo_url.substring(0, 30) : 'null',
        cover_len: u.cover_photo_url ? u.cover_photo_url.length : 0,
        cover_start: u.cover_photo_url ? u.cover_photo_url.substring(0, 30) : 'null',
    }));

    // Find offenders > 1000 chars (likely base64)
    const largeLogos = analysis.filter(a => a.logo_len > 1000).length;
    const largeCovers = analysis.filter(a => a.cover_len > 1000).length;

    return {
        total_count: universities.length,
        large_logos_count: largeLogos,
        large_covers_count: largeCovers,
        details: analysis.sort((a, b) => b.logo_len - a.logo_len).slice(0, 5) // Top 5 largest
    };
}
