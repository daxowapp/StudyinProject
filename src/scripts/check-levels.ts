
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase
        .from('program_catalog') // Levels are usually in catalog? or university_programs view
        .select('level')
        .limit(100);

    if (error) {
        console.error('Error fetching catalog:', error);
    } else if (data) {
        const levels = new Set(data.map(p => p.level));
        console.log('Distinct Levels (program_catalog):', Array.from(levels));
    }

    const { data: progData, error: progError } = await supabase
        .from('v_university_programs_full')
        .select('level')
        .limit(100);

    if (progError) {
        console.error('Error fetching view:', progError);
    } else if (progData) {
        const levels = new Set(progData.map(p => p.level));
        console.log('Distinct Levels (view):', Array.from(levels));
    }
}

main();
