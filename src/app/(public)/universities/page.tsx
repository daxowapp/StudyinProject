import { UniversityCard } from "@/components/universities/UniversityCard";
import { UniversityFilters } from "@/components/universities/UniversityFilters";
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

    // Fetch program counts and minimum tuition for each university
    const universitiesWithCounts = await Promise.all(
        (universities || []).map(async (uni) => {
            try {
                // Get count
                const { count } = await supabase
                    .from("university_programs")
                    .select("*", { count: "exact", head: true })
                    .eq("university_id", uni.id)
                    .eq("is_active", true);
                
                // Get minimum tuition
                const { data: minTuitionData } = await supabase
                    .from("university_programs")
                    .select("tuition_fee, currency")
                    .eq("university_id", uni.id)
                    .eq("is_active", true)
                    .order("tuition_fee", { ascending: true })
                    .limit(1)
                    .single();
                
                return {
                    ...uni,
                    programCount: count || 0,
                    minTuitionFee: minTuitionData?.tuition_fee,
                    currency: minTuitionData?.currency || "CNY"
                };
            } catch (err) {
                console.error(`Error fetching programs for ${uni.name}:`, err);
                return {
                    ...uni,
                    programCount: 0,
                    minTuitionFee: null,
                    currency: "CNY"
                };
            }
        })
    );

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
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-card rounded-xl border shadow-sm p-6">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                                    Filters
                                </h2>
                                <UniversityFilters />
                            </div>

                            {/* Quick Stats Card */}
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Quick Stats
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Universities</span>
                                        <span className="font-bold">{formattedUniversities.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cities</span>
                                        <span className="font-bold">{new Set(formattedUniversities.map(u => u.city)).size}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Provinces</span>
                                        <span className="font-bold">{new Set(formattedUniversities.map(u => u.province)).size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Top Bar */}
                        <div className="bg-card rounded-xl border shadow-sm p-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-1 bg-primary rounded-full" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Showing</p>
                                        <p className="font-bold text-lg">{formattedUniversities.length} Universities</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <div className="flex items-center border rounded-lg overflow-hidden">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/10 text-primary rounded-none">
                                            <LayoutGrid className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none">
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Select defaultValue="rank">
                                        <SelectTrigger className="w-[200px] h-10">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rank">Ranking: High to Low</SelectItem>
                                            <SelectItem value="name">Name: A-Z</SelectItem>
                                            <SelectItem value="programs">Most Programs</SelectItem>
                                            <SelectItem value="tuition-low">Tuition: Low to High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {formattedUniversities.map((uni) => (
                                <UniversityCard key={uni.id} university={uni} />
                            ))}
                            {!formattedUniversities.length && (
                                <div className="col-span-full">
                                    <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
                                        <div className="max-w-md mx-auto">
                                            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                                <Building2 className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">No universities found</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Try adjusting your filters or search criteria
                                            </p>
                                            <Button variant="outline">Clear Filters</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {formattedUniversities.length > 0 && (
                            <div className="bg-card rounded-xl border shadow-sm p-4">
                                <div className="flex justify-center items-center gap-2">
                                    <Button variant="outline" size="icon" disabled className="h-10 w-10">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" className="h-10 min-w-10">
                                        1
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-10 min-w-10">
                                        2
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-10 min-w-10">
                                        3
                                    </Button>
                                    <span className="px-2 text-muted-foreground">...</span>
                                    <Button variant="outline" size="sm" className="h-10 min-w-10">
                                        8
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
