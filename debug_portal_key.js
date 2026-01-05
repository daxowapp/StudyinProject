const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mxmrdnzmaztskbkqeusm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bXJkbnptYXp0c2tia3FldXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzk5MjIsImV4cCI6MjA3OTgxNTkyMn0.BjPnOV0EyLJiwbEt043iO87ONkcqlGTcV7XB2tfDqks';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('=== PORTAL KEY DEBUG ===\n');

    // Check unique portal_keys
    const { data: keys, error } = await supabase
        .from('universities')
        .select('portal_key');

    if (error) {
        console.error('Error fetching portal keys:', error);
        return;
    }

    const keyCounts = {};
    const nullCount = 0;

    keys.forEach(k => {
        if (!k.portal_key) {
            // nullCount++; // Counting nulls
        } else {
            keyCounts[k.portal_key] = (keyCounts[k.portal_key] || 0) + 1;
        }
    });

    console.log('Portal Key Counts in Universities table:');
    console.log(keyCounts);
    console.log('Total universities:', keys.length);

    // fast track check
    const { count: fastTrackCount, error: ftError } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true })
        .eq('portal_key', 'studyatchina')
        .eq('has_fast_track', true);

    console.log('\nFast Track universities with key "studyatchina":', fastTrackCount);
    if (ftError) console.error(ftError);

    // v_university_programs_full check

    // Check programs for fast track universities
    if (fastTrackCount > 0) {
        const { data: ftUnis } = await supabase
            .from('universities')
            .select('id, name')
            .eq('portal_key', 'studyatchina')
            .eq('has_fast_track', true);

        const ids = ftUnis.map(u => u.id);
        console.log('\nFast Track Uni IDs:', ids);

        const { count: ftProgCount, data: ftProgs, error: ftProgError } = await supabase
            .from('v_university_programs_full')
            .select('*', { count: 'exact' })
            .eq('portal_key', 'studyatchina')
            .in('university_id', ids);

        console.log('Programs for Fast Track Unis:', ftProgCount);
        if (ftProgError) console.error(ftProgError);

        if (ftProgs && ftProgs.length > 0) {
            console.log('Sample program:', ftProgs[0].program_title);
        }

        // Check Elite Universities as well
        const { data: eliteUnis, error: eliteError } = await supabase
            .from("universities")
            .select('id, name')
            .eq("portal_key", 'studyatchina')
            .order("created_at", { ascending: false })
            .limit(8);

        console.log('\nElite Universities Count:', eliteUnis ? eliteUnis.length : 0);
        if (eliteError) console.error(eliteError);
    }
    const { count: progCount, error: progError } = await supabase
        .from('v_university_programs_full')
        .select('*', { count: 'exact', head: true })
        .eq('portal_key', 'studyatchina');

    console.log('Programs in view with key "studyatchina":', progCount);
    if (progError) console.error(progError);
}

run();

