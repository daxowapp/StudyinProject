import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing env vars");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ALL_LOCALES = ["ar", "tr", "ru", "fr", "es", "fa", "tk", "zh"];

async function checkTranslations() {
    console.log("Checking translation coverage...");
    
    // First, let's get the total number of programs
    const { count: programsCount, error: progErr } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true });
        
    if (progErr) {
        console.error("Error fetching programs:", progErr);
        return;
    }
    
    console.log(`Total Programs: ${programsCount}`);
    console.log("-----------------------------------------");
    
    // Check total translation count for each locale
    for (const locale of ALL_LOCALES) {
        // Count records where locale matches
        const { count, error } = await supabase
            .from('program_translations')
            .select('*', { count: 'exact', head: true })
            .eq('locale', locale);
            
        // Count records where title is null
        const { count: nullTitlesCount, error: nullErr } = await supabase
            .from('program_translations')
            .select('*', { count: 'exact', head: true })
            .eq('locale', locale)
            .is('title', null);
            
        if (error || nullErr) {
            console.error(`Error fetching for ${locale}:`, error || nullErr);
            continue;
        }
        
        const isComplete = count === programsCount && nullTitlesCount === 0;
        const missingRecords = (count || 0) < programsCount ? programsCount - (count || 0) : 0;
        
        console.log(`Locale: ${locale.toUpperCase().padEnd(3)} | Records: ${count}/${programsCount} | Missing titles: ${nullTitlesCount} | ${isComplete ? '✅ Complete' : `❌ Missing ${missingRecords} records or ${nullTitlesCount} titles`}`);

        // If there are missing titles, fetch 3 examples
        if (nullTitlesCount && nullTitlesCount > 0) {
            const { data: missingData, error: sampleErr } = await supabase
                .from('program_translations')
                .select('id, program_id, overview, title')
                .eq('locale', locale)
                .is('title', null)
                .limit(3);
                
            if (missingData) {
                console.log(`  Examples of missing titles for ${locale}:`);
                missingData.forEach(d => {
                    console.log(`    Program ID: ${d.program_id}, Overview exists? ${!!d.overview}, Has <title>? ${d.overview ? d.overview.includes('<title>') : 'N/A'}`);
                });
            }
        }
    }
}

checkTranslations().catch(console.error);
