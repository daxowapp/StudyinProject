
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable(tableName: string, columns: string[]) {
    console.log(`Checking table '${tableName}'...`);

    const { data, error } = await supabase
        .from(tableName)
        .select(`id, ${columns.join(', ')}`)
        .limit(10); // Check a sample first to see if columns exist

    if (error) {
        console.log(`Skipping '${tableName}' (Error: ${error.message})`);
        return;
    }

    // Now check length of content for all rows
    const { data: rows } = await supabase
        .from(tableName)
        .select(`id, ${columns.join(', ')}`);

    let base64Count = 0;

    rows?.forEach((row: any) => {
        columns.forEach(col => {
            const val = row[col];
            if (val && typeof val === 'string' && val.length > 1000) {
                if (val.startsWith('data:image') || val.length > 10000) {
                    base64Count++;
                }
            }
        });
    });

    if (base64Count > 0) {
        console.error(`⚠️  FOUND ${base64Count} large/base64 images in '${tableName}'!`);
    } else {
        console.log(`✅  '${tableName}' looks clean.`);
    }
}

async function main() {
    await checkTable('articles', ['featured_image']);
    // university_scholarships seemingly has no image columns based on previous check, or they are empty.
    // Let's check 'universities' again just to be sure we got them all.
    await checkTable('universities', ['logo_url', 'cover_photo_url']);
}

main();
