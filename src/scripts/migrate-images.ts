
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { decode } from 'base64-arraybuffer';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadImage(base64Data: string, bucket: string, path: string): Promise<string | null> {
    try {
        // Remove data:image/...;base64, prefix if present
        const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');

        const fileData = decode(base64Clean);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, fileData, {
                contentType: 'image/png', // Defaulting to png, assumption mostly safe for base64 blobs or could parse from prefix
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error(`Error uploading to ${path}:`, error);
        return null;
    }
}

async function migrateImages() {
    console.log('Starting migration...');

    // 1. Fetch universities with likely Base64 images (checking length > 200 chars as a heuristic)
    // Note: checking "startsWith('http')" is safer to exclude already migrated ones
    const { data: universities, error } = await supabase
        .from('universities')
        .select('id, logo_url, cover_photo_url');

    if (error) {
        console.error('Error fetching universities:', error);
        return;
    }

    console.log(`Found ${universities.length} universities. Checking for Base64 images...`);

    let updatedCount = 0;

    for (const uni of universities) {
        let updates: any = {};

        // Check Logo
        if (uni.logo_url && !uni.logo_url.startsWith('http') && uni.logo_url.length > 200) {
            console.log(`Migrating Logo for ${uni.id}...`);
            const publicUrl = await uploadImage(uni.logo_url, 'universities', `logos/${uni.id}.png`);
            if (publicUrl) {
                updates.logo_url = publicUrl;
            }
        }

        // Check Cover Photo
        if (uni.cover_photo_url && !uni.cover_photo_url.startsWith('http') && uni.cover_photo_url.length > 200) {
            console.log(`Migrating Cover for ${uni.id}...`);
            const publicUrl = await uploadImage(uni.cover_photo_url, 'universities', `covers/${uni.id}.png`);
            if (publicUrl) {
                updates.cover_photo_url = publicUrl;
            }
        }

        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
                .from('universities')
                .update(updates)
                .eq('id', uni.id);

            if (updateError) {
                console.error(`Failed to update university ${uni.id}:`, updateError);
            } else {
                console.log(`Successfully updated university ${uni.id}`);
                updatedCount++;
            }
        }
    }

    console.log(`Migration complete. Updated ${updatedCount} universities.`);
}

migrateImages();
