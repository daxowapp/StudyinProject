
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We need service role key for admin actions like creating buckets/policies
// Assuming the user has it in env, otherwise we might fail.
// If NO service role, we might have to ask user to create bucket manually or use anon key if policies allow?
// Usually bucket creation requires admin.
// Let's check env vars.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey!);

async function main() {
    console.log('Checking storage buckets...');
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    const bucketName = 'universities';
    const exists = buckets.find(b => b.name === bucketName);

    if (exists) {
        console.log(`Bucket '${bucketName}' already exists.`);
    } else {
        console.log(`Creating bucket '${bucketName}'...`);
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
            fileSizeLimit: 5242880, // 5MB
        });

        if (createError) {
            console.error('Error creating bucket:', createError);
        } else {
            console.log(`Bucket '${bucketName}' created successfully.`);
        }
    }
}

main();
