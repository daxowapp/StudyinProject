import { UniversityCard } from "@/components/universities/UniversityCard";
import { UniversitiesClient } from "@/components/universities/UniversitiesClient";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, MapPin, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function UniversitiesPage() {
    const supabase = await createClient();

    // Fetch universities
    const { data: universities, error } = await supabase
        .from("universities")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error fetching universities:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        // Return empty array instead of throwing to prevent page crash
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto p-6">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">Unable to load universities</h1>
                    <p className="text-muted-foreground mb-2">{error.message}</p>
                    {error.details && (
                        <p className="text-sm text-muted-foreground">{error.details}</p>
                    )}
                    {error.hint && (
                        <p className="text-sm text-muted-foreground mt-2">Hint: {error.hint}</p>
                    )}
                </div>
            </div>
        );
    }

    // Handle empty universities
    if (!universities || universities.length === 0) {
        console.log("No universities found in database");
    }

    // Fetch stats from view
    const { data: stats } = await supabase
        .from("v_university_stats")
        .select("*");

    // Create a map for quick lookup
    const statsMap = new Map(stats?.map((s: any) => [s.university_id, s]) || []);

    const universitiesWithCounts = (universities || []).map((uni) => {
        const stat = statsMap.get(uni.id);
        return {
            ...uni,
            programCount: stat?.program_count || 0,
            minTuitionFee: stat?.min_tuition_fee,
            currency: stat?.currency || "CNY"
        };
    });

    // Transform data and filter active universities
    const formattedUniversities = universitiesWithCounts
        .filter((uni) => uni.is_active !== false) // Filter active universities
        .map((uni) => {
            // Format tuition display
            let minTuition = "Contact for pricing";
            if (uni.minTuitionFee) {
                const currencySymbol = uni.currency === "USD" ? "$" : "¥";
                minTuition = `${currencySymbol}${uni.minTuitionFee.toLocaleString()}`;
            }

            return {
                id: uni.id,
                slug: uni.slug || uni.id,
                name: uni.name || "Unknown University",
                city: uni.city || "N/A",
                province: uni.province || "N/A",
                programs: uni.programCount,
                minTuition: minTuition,
                badges: uni.features || [],
                logo: uni.logo_url,
                photo: uni.cover_photo_url || uni.photo_url,
                ranking: uni.ranking,
                type: uni.type,
                university_type: uni.university_type,
                institution_category: uni.institution_category,
                has_fast_track: uni.has_fast_track,
            };
        });

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Explore Top Chinese Universities
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Discover {formattedUniversities.length}+ prestigious institutions across China. From Project 985 to C9 League universities.
                        </p>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by university name, city, or ranking..."
                                className="pl-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-2 focus-visible:ring-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8">
                <UniversitiesClient universities={formattedUniversities} />
            </div>
        </div>
    );
}
