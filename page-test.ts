import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function run() {
    const { data } = await supabase.from('v_scholarship_programs').select('*').limit(300);
    const mapped = data!.map((p: any) => ({
         program_id: p.program_id, 
         is_popular: p.is_popular as boolean || false 
    }));
    const raw = data!.filter((p: any) => p.is_popular === true);
    const pop = mapped.filter((p: any) => p.is_popular === true);
    
    console.log("Raw total sampled:", data!.length);
    console.log("Raw true count via native data object:", raw.length);
    console.log("Mapped count via page.tsx code signature:", pop.length);
}
run();
