import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data: columns, error } = await supabase
        .from('university_admission_requirements')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching columns:", error);
    } else if (columns && columns.length > 0) {
        console.log("university_admission_requirements columns:", Object.keys(columns[0]));
    } else {
        console.log("Table is empty, cannot infer columns from data.");
    }
}

checkColumns();
