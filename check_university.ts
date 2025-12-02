
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUniversity() {
    const id = '4237b8ea-74bd-4bdb-a48e-27b31db3762e';
    console.log(`Checking university with ID: ${id}`);

    const { data, error } = await supabase
        .from('universities')
        .select('id, name, slug')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching university:', error.message);
        return;
    }

    console.log('University found:');
    console.log(JSON.stringify(data, null, 2));

    if (data.slug) {
        console.log(`\nPublic URL would be: http://localhost:3000/universities/${data.slug}`);
        // Check if public page is accessible
        try {
            const res = await fetch(`http://localhost:3000/universities/${data.slug}`);
            console.log(`Public page status: ${res.status}`);
        } catch (e) {
            console.error("Failed to fetch public page:", e);
        }
    } else {
        console.log('\nNO SLUG FOUND. The "View Public Page" button should be disabled.');
    }
}

checkUniversity();
