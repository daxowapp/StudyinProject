import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProgram() {
    const slug = 'bit-zhuhai-artificial-intelligence-2026-bachelor';

    // Fetch program details
    const { data: program, error } = await supabase
        .from('university_programs')
        .select(`
            *,
            program_catalog:program_catalog_id (
                id,
                title,
                level
            ),
            university:university_id (
                id,
                name
            )
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("Error fetching program:", error);
        return;
    }

    const programLevel = program.program_catalog.level;
    console.log("Program Level:", programLevel);

    // Fetch all requirements for university (Corrected Query)
    const { data: allRequirements, error: reqError } = await supabase
        .from('university_admission_requirements')
        .select(`
            *,
            requirement:requirement_id (
                id,
                title,
                category,
                description,
                requirement_type
            )
        `)
        .eq('university_id', program.university_id);

    if (reqError) {
        console.error("Error fetching requirements:", reqError);
        return;
    }

    console.log("Total Requirements Found:", allRequirements?.length);

    // Filter requirements based on program level (Logic from page.tsx)
    const requirements = allRequirements?.filter((req: any) => {
        const type = req.requirement.requirement_type.toLowerCase();
        const level = program.program_catalog.level.toLowerCase();
        return type === 'all' || type === level;
    });

    console.log("Filtered Requirements Count:", requirements?.length);
    console.log("Filtered Requirements:", requirements?.map(r => ({
        title: r.requirement.title,
        type: r.requirement.requirement_type,
        is_required: r.is_required
    })));
}

checkProgram();
