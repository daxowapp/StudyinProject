const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mxmrdnzmaztskbkqeusm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bXJkbnptYXp0c2tia3FldXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzk5MjIsImV4cCI6MjA3OTgxNTkyMn0.BjPnOV0EyLJiwbEt043iO87ONkcqlGTcV7XB2tfDqks';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('=== COMPREHENSIVE DATA DEBUG ===\n');

    // 1. Check what useUniversities fetches (Elite Universities section)
    console.log('\n--- 1. UNIVERSITIES COUNT ---');
    const { count, error: countError } = await supabase.from('universities').select('*', { count: 'exact', head: true });
    if (countError) console.error('Count Error:', countError);
    console.log('Total visible universities:', count);

    console.log('--- 1. UNIVERSITIES (Elite Universities Section) ---');
    const { data: universities, error } = await supabase
        .from('universities')
        .select('id, name, city, ranking, cover_photo_url')
        .order('ranking', { ascending: true, nullsFirst: false })
        .limit(50);

    if (error) {
        console.error('ERROR:', error);
    } else {
        console.log('Count:', universities.length);
        universities.forEach((u, i) => {
            console.log(`\n[${i + 1}] ${u.name} (Ranking: ${u.ranking})`);
            console.log(`   City: ${u.city}`);
            console.log(`   cover_photo_url: ${u.cover_photo_url ?
                (u.cover_photo_url.startsWith('data:') ? 'BASE64 (length: ' + u.cover_photo_url.length + ')' : u.cover_photo_url.substring(0, 100))
                : 'NULL/EMPTY'}`);
        });
    }

    // 2. Check what v_university_programs_full returns (Popular Programs section)
    console.log('\n\n--- 2. PROGRAMS FROM VIEW (Popular Programs Section) ---');
    const { data: progs, error: progsError } = await supabase
        .from('v_university_programs_full')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

    if (progsError) {
        console.error('ERROR:', progsError);
    } else {
        console.log('Count:', progs.length);
        progs.forEach((p, i) => {
            console.log(`\n[${i + 1}] Program ID: ${p.id}`);
            console.log(`   display_title: "${p.display_title}"`);
            console.log(`   program_title: "${p.program_title}"`);
            console.log(`   university_name: "${p.university_name}"`);
            console.log(`   university_id: ${p.university_id}`);
        });
    }

    // 3. Fetch university logos for those programs
    if (progs && progs.length > 0) {
        console.log('\n\n--- 3. UNIVERSITY LOGOS FOR ABOVE PROGRAMS ---');
        const universityIds = [...new Set(progs.map(p => p.university_id))];

        const { data: uniDetails } = await supabase
            .from('universities')
            .select('id, name, logo_url, cover_photo_url')
            .in('id', universityIds);

        if (uniDetails) {
            uniDetails.forEach((u, i) => {
                console.log(`\n[${i + 1}] ${u.name}`);
                console.log(`   logo_url: ${u.logo_url ?
                    (u.logo_url.startsWith('data:') ? 'BASE64 (length: ' + u.logo_url.length + ')' : u.logo_url.substring(0, 100))
                    : 'NULL/EMPTY'}`);
                console.log(`   cover_photo_url: ${u.cover_photo_url ?
                    (u.cover_photo_url.startsWith('data:') ? 'BASE64 (length: ' + u.cover_photo_url.length + ')' : u.cover_photo_url.substring(0, 100))
                    : 'NULL/EMPTY'}`);
            });
        }
    }
}

run();
