import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPolicies() {
    // We can't query pg_policies directly via JS client usually unless we have a function for it.
    // But I can try to insert a dummy record with anon key to reproduce, or just inspect the table structure if I can.
    // Actually, the best way is to ask the user to run a SQL query to show policies, or I can try to infer from the error.
    // But I can check if the table exists and its columns first.

    const { data: columns, error } = await supabase
        .from('application_documents')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error accessing application_documents:", error.message);
    } else if (columns && columns.length > 0) {
        console.log("Columns:", Object.keys(columns[0]));
    } else {
        console.log("Table exists but is empty. Cannot infer columns.");
    }
}

checkPolicies();
