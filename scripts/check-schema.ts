import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    // Check universities table columns
    const { data: uniData, error: uniError } = await supabase
        .from('universities')
        .select('*')
        .limit(1);

    if (uniError) {
        console.error("Error checking universities:", uniError);
    } else if (uniData && uniData.length > 0) {
        console.log("Universities columns:", Object.keys(uniData[0]));
        // Check if 'code' or 'university_code' exists
        console.log("Has 'code' column:", 'code' in uniData[0]);
    } else {
        console.log("Universities table is empty or could not be read.");
    }

    // Check if university_accommodation table exists
    const { error: accError } = await supabase
        .from('university_accommodation')
        .select('*')
        .limit(1);

    if (accError) {
        console.log("university_accommodation table check:", accError.message);
    } else {
        console.log("university_accommodation table EXISTS!");
    }
}

checkSchema();
