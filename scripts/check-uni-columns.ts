import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUniColumns() {
    const { data: columns, error } = await supabase
        .from('universities')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error accessing universities:", error.message);
    } else if (columns && columns.length > 0) {
        console.log("Universities Columns:", Object.keys(columns[0]));
    } else {
        console.log("Universities table exists but is empty.");
    }
}

checkUniColumns();
