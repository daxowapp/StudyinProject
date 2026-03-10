const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log("Checking programs...");
    const { data: programs, error } = await supabase.from("university_programs")
        .select("id, display_title, level, is_active, university_id")
        .limit(10);
    
    if (error) console.error("Error:", error);
    console.log("Programs found:", programs ? programs.length : 0);
    if (programs && programs.length > 0) {
        console.log("Sample program:", programs[0]);
    }
}
run();
