
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function normalizeLevels() {
    console.log('🔄 Starting normalization of program levels...');

    // limit to 1000 for safety, but we loop until done
    const PAGE_SIZE = 1000;
    let page = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // Define normalizations
    const normalizations: Record<string, string> = {
        // Bachelor variations
        'bachelor': 'Bachelor',
        'bachelors': 'Bachelor',
        'undergraduate': 'Bachelor',

        // Master variations
        'master': 'Master',
        'masters': 'Master',
        'postgraduate': 'Master',

        // PhD variations
        'phd': 'PhD',
        'doctorate': 'PhD',
        'doctoral': 'PhD',

        // Non-degree variations
        'non-degree': 'Non-Degree',
        'language': 'Non-Degree', // Mapping language courses to Non-Degree as requested previously
        'language course': 'Non-Degree'
    };

    try {
        // 1. Get all programs
        const { count } = await supabase
            .from('university_programs')
            .select('*', { count: 'exact', head: true });

        console.log(`📊 Found ${count} total programs.`);

        while (true) {
            const { data: programs, error } = await supabase
                .from('university_programs')
                .select('id, level')
                .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

            if (error) {
                console.error('❌ Error fetching programs:', error);
                break;
            }

            if (!programs || programs.length === 0) break;

            console.log(`Processing batch ${page + 1} (${programs.length} programs)...`);

            for (const program of programs) {
                if (!program.level) continue;

                const currentLevel = program.level.trim();
                const lowerLevel = currentLevel.toLowerCase();

                let targetLevel = normalizations[lowerLevel];

                // If no direct mapping, capitalizes first letter
                if (!targetLevel) {
                    targetLevel = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1).toLowerCase();
                }

                // Only update if different
                if (currentLevel !== targetLevel) {
                    const { error: updateError } = await supabase
                        .from('university_programs')
                        .update({ level: targetLevel })
                        .eq('id', program.id);

                    if (updateError) {
                        console.error(`❌ Failed to update program ${program.id}:`, updateError);
                        errorCount++;
                    } else {
                        updatedCount++;
                        // process.stdout.write('.'); // progress indicator
                    }
                }
            }

            page++;
        }

        console.log('\n✅ Normalization complete!');
        console.log(`📝 Updated ${updatedCount} programs.`);
        console.log(`⚠️ Errors: ${errorCount}`);

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

normalizeLevels();
