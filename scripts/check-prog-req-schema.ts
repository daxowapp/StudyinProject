import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchemas() {
    // Check programs table
    const { data: progSample, error: progError } = await supabase
        .from('programs')
        .select('*')
        .limit(1);

    if (progSample && progSample.length > 0) {
        console.log("Programs columns:", Object.keys(progSample[0]));
    } else {
        console.log("Programs table empty or error:", progError?.message);
    }

    // Check university_admission_requirements table
    const { data: reqSample, error: reqError } = await supabase
        .from('university_admission_requirements')
        .select('*')
        .limit(1);

    if (reqSample && reqSample.length > 0) {
        console.log("Uni Requirements columns:", Object.keys(reqSample[0]));
    } else {
        console.log("Uni Requirements table empty or error:", reqError?.message);
    }

    // Check admission_requirements_catalog
    const { data: catSample } = await supabase
        .from('admission_requirements_catalog')
        .select('*')
        .limit(1);

    if (catSample && catSample.length > 0) {
        console.log("Requirement Catalog columns:", Object.keys(catSample[0]));
    }
}

checkSchemas();
