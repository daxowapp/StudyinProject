import { createClient } from "@/lib/supabase/server";
import { ScholarshipFilterClient } from "@/components/scholarships/ScholarshipFilterClient";
import { Award, Sparkles, Home, Heart, Wallet } from "lucide-react";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Filter Universities by Scholarship Benefits | Studyatchina",
    description: "Find universities that offer scholarships with free accommodation, medical insurance, monthly salary, and full tuition coverage.",
};

export const revalidate = 600; // 10 minute ISR

export default async function ScholarshipFilterPage() {
    const supabase = await createClient();

    // Fetch all scholarships with university info
    const { data: scholarships, error } = await supabase
        .from("university_scholarships")
        .select(`
            id,
            university_id,
            type_name,
            tuition_coverage_percentage,
            service_fee_usd,
            includes_accommodation,
            includes_stipend,
            stipend_amount_monthly,
            includes_medical_insurance,
            universities!inner (
                name,
                slug,
                city,
                logo_url,
                portal_key
            )
        `)
        .eq("is_active", true)
        .eq("universities.portal_key", PORTAL_KEY)
        .order("tuition_coverage_percentage", { ascending: false });

    if (error) {
        console.error("Error fetching scholarships:", error);
    }

    // Transform data to include university info at top level
    const formattedScholarships = scholarships?.map((s) => ({
        id: s.id,
        university_id: s.university_id,
        university_name: (s.universities as { name: string })?.name || "Unknown University",
        university_slug: (s.universities as { slug: string })?.slug || "",
        university_city: (s.universities as { city: string })?.city || "",
        university_logo: (s.universities as { logo_url: string })?.logo_url || null,
        type_name: s.type_name,
        tuition_coverage_percentage: s.tuition_coverage_percentage || 0,
        service_fee_usd: s.service_fee_usd || 0,
        includes_accommodation: s.includes_accommodation || false,
        includes_stipend: s.includes_stipend || false,
        stipend_amount_monthly: s.stipend_amount_monthly,
        includes_medical_insurance: s.includes_medical_insurance || false,
    })) || [];

    // Calculate stats
    const uniqueUniversities = new Set(formattedScholarships.map(s => s.university_id)).size;
    const withAccommodation = new Set(formattedScholarships.filter(s => s.includes_accommodation).map(s => s.university_id)).size;
    const withInsurance = new Set(formattedScholarships.filter(s => s.includes_medical_insurance).map(s => s.university_id)).size;
    const withStipend = new Set(formattedScholarships.filter(s => s.includes_stipend).map(s => s.university_id)).size;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            Find Your Perfect University
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Filter Universities by Benefits
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Find universities that offer scholarships with free accommodation, medical insurance, monthly salary, and more.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-center">
                    <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                            <strong>{uniqueUniversities}</strong> universities
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">
                            <strong>{withAccommodation}</strong> with free accommodation
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span className="text-sm">
                            <strong>{withInsurance}</strong> with medical insurance
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-green-500" />
                        <span className="text-sm">
                            <strong>{withStipend}</strong> with monthly salary
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter Client */}
            <ScholarshipFilterClient scholarships={formattedScholarships} />
        </div>
    );
}
