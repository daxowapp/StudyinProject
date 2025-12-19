
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mxmrdnzmaztskbkqeusm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bXJkbnptYXp0c2tia3FldXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzk5MjIsImV4cCI6MjA3OTgxNTkyMn0.BjPnOV0EyLJiwbEt043iO87ONkcqlGTcV7XB2tfDqks';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('--- Checking Universities ---');
    const { data: unis, error: uniError } = await supabase
        .from('universities')
        .select('id, name')
        .eq('has_fast_track', true);

    if (uniError) {
        console.error('Uni Error:', uniError);
        return;
    }

    console.log(`Found ${unis.length} Fast Track Universities.`);

    if (unis.length > 0) {
        const ids = unis.map(u => u.id);
        console.log('--- Checking Programs ---');
        const { count, error: progError } = await supabase
            .from('v_university_programs_full')
            .select('*', { count: 'exact', head: true })
            .in('university_id', ids);

        if (progError) {
            console.error('Program Error:', progError);
        } else {
            console.log(`Found ${count} programs in these universities.`);
        }
    }

    console.log('--- Checking Programs Table Schema ---');
    const { data: sample, error: schemaError } = await supabase
        .from('programs')
        .select('*')
        .limit(1);

    if (schemaError) {
        console.error('Schema Error:', schemaError);
    } else if (sample && sample.length > 0) {
        console.log('Program Columns:', Object.keys(sample[0]));
    }
}

run();
