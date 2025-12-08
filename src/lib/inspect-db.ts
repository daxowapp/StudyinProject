
import { createClient } from "@/lib/supabase/server";

export async function inspectDatabaseValues() {
    const supabase = await createClient();
    const columns = ['level', 'category', 'city', 'language_name'];

    const results = {};

    for (const col of columns) {
        const { data, error } = await supabase
            .from('v_university_programs_full')
            .select(col)
            .eq('is_active', true);

        if (data) {
            // @ts-expect-error - implicit any on item
            const distinct = [...new Set(data.map(item => item[col]))];
            // @ts-expect-error - implicit any on results
            results[col] = distinct;
        } else {
            // @ts-expect-error - implicit any on results
            results[col] = error;
        }
    }

    return results;
}

