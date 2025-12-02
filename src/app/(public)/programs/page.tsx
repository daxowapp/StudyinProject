import { ProgramsClient } from "@/components/programs/ProgramsClient";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export default async function ProgramsPage() {
    const supabase = await createClient();

    // OPTIMIZED: Limit initial load, client-side component handles filtering
    const { data: programs, error } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("is_active", true)
        .limit(200); // Load first 200 programs for better performance

    if (error) {
        console.error("Error fetching programs:", error);
    }

    // Fetch universities for slug mapping
    const { data: universities } = await supabase
        .from("universities")
        .select("name, slug");

    const universityMap = universities?.reduce((acc: any, uni: any) => {
        acc[uni.slug] = uni.name;
        return acc;
    }, {}) || {};

    // Transform data to match ProgramCard props
    const formattedPrograms = programs?.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.display_title || p.program_title,
        university: p.university_name,
        city: p.city,
        level: p.level,
        duration: p.duration,
        tuition: `${p.tuition_fee} ${p.currency}/Year`,
        deadline: p.intake,
        badges: [p.language_name, p.level].filter(Boolean),
        category: p.category,
        tuition_fee: p.tuition_fee,
        scholarship_chance: p.scholarship_chance,
    })) || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Discover Your Perfect Program
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Browse through {formattedPrograms.length}+ programs from top Chinese universities. Find the perfect match for your academic journey.
                        </p>
                    </div>
                </div>
            </div>

            <ProgramsClient programs={formattedPrograms} universityMap={universityMap} />
        </div>
    );
}
