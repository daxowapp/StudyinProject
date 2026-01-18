
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listColumns(table: string) {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

    if (error) {
        console.log(`Error reading ${table}:`, error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log(`\nColumns for '${table}':`);
        console.log(Object.keys(data[0]).join(', '));
    } else {
        console.log(`\n'${table}' is empty or no access.`);
    }
}

async function main() {
    await listColumns('university_scholarships');
    await listColumns('university_programs'); // check for gpa_requirement
    await listColumns('v_university_programs_full'); // check if view has score columns
    await listColumns('articles');
    await listColumns('profiles'); // check if it exists
    await listColumns('users'); // not exposed strictly via postgrest usually
}

main();
