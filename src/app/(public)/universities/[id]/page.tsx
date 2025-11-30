import { UniversityHeader } from "@/components/universities/UniversityHeader";
import { UniversityStats } from "@/components/universities/UniversityStats";
import { UniversityPrograms } from "@/components/universities/UniversityPrograms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Globe, MapPin, Users, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;
    
    // Fetch university with programs
    const { data: university, error } = await supabase
        .from("universities")
        .select(`
            *,
            programs(
                id,
                title,
                level,
                duration,
                tuition_fee,
                language,
                intake
            )
        `)
        .eq("id", id)
        .single();

    // Log for debugging
    console.log("Fetching university with ID:", id);
    console.log("Error:", error);
    console.log("University data:", university);

    if (error) {
        console.error("Supabase error:", error.message, error.details, error.hint);
        notFound();
    }

    if (!university) {
        console.log("No university found for ID:", id);
        notFound();
    }

    // Transform programs data
    const formattedPrograms = university.programs?.map((p: any) => ({
        id: p.id,
        name: p.title,
        level: p.level,
        duration: p.duration,
        tuition: `${p.tuition_fee} RMB`,
        language: p.language,
        intake: p.intake,
        badges: p.language === "English" ? ["English Taught"] : [],
    })) || [];

    const universityData = {
        id: university.id,
        name: university.name,
        nameLocal: university.name_local || university.name,
        city: university.city,
        province: university.province,
        website: university.website,
        logo: university.logo_url,
        badges: university.features || [],
        stats: {
            founded: university.founded || "N/A",
            students: university.total_students || "N/A",
            ranking: university.ranking || "N/A",
            intlStudents: university.international_students || "N/A",
        },
        overview: university.description || "No description available.",
        highlights: [
            "World-class research facilities",
            "Beautiful campus environment",
            "Strong alumni network",
            "Diverse international community",
        ],
        programs: formattedPrograms,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
            <UniversityHeader university={universityData} />

            <div className="container mx-auto px-4 md:px-6">
                <UniversityStats stats={universityData.stats} />

                <div className="grid lg:grid-cols-3 gap-8 mt-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Overview</h2>
                            </div>
                            <Card className="border-none shadow-lg">
                                <CardContent className="p-6">
                                    <div className="prose max-w-none text-muted-foreground">
                                        <p className="whitespace-pre-line leading-relaxed text-base">
                                            {universityData.overview}
                                        </p>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-6 border-t">
                                        {universityData.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-center gap-3 text-sm font-medium">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                                </div>
                                                {highlight}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Programs Section */}
                        <section id="programs" className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Available Programs</h2>
                            </div>
                            {formattedPrograms.length > 0 ? (
                                <UniversityPrograms programs={universityData.programs} />
                            ) : (
                                <Card className="border-none shadow-lg">
                                    <CardContent className="p-12 text-center">
                                        <p className="text-muted-foreground">No programs available at this time.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </section>

                        {/* Admission Requirements */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Admission Requirements</h2>
                            </div>
                            <Card className="border-none shadow-lg">
                                <CardContent className="p-6 space-y-6">
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h3 className="font-bold mb-3 flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Academic Requirements
                                        </h3>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                                            <li>High school diploma for Bachelor programs</li>
                                            <li>Bachelor&apos;s degree for Master programs</li>
                                            <li>Minimum GPA of 3.0/4.0 or equivalent</li>
                                        </ul>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h3 className="font-bold mb-3 flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-primary" />
                                            Language Requirements
                                        </h3>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                                            <li>English-taught programs: IELTS 6.0 or TOEFL 80</li>
                                            <li>Chinese-taught programs: HSK 4 or above</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info Card */}
                        <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Quick Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Location</span>
                                        <span className="font-medium">{universityData.city}, {universityData.province}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Founded</span>
                                        <span className="font-medium">{universityData.stats.founded}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Programs</span>
                                        <span className="font-medium">{formattedPrograms.length}</span>
                                    </div>
                                </div>
                                {universityData.website && (
                                    <Link href={universityData.website} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full mt-4" variant="outline">
                                            <Globe className="h-4 w-4 mr-2" />
                                            Visit Website
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>

                        {/* Student Support Card */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Student Support</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Airport Pickup Service
                                    </li>
                                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        On-campus Accommodation
                                    </li>
                                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Visa Application Assistance
                                    </li>
                                    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Student Orientation Week
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-muted-foreground border">
                                    <div className="text-center">
                                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Map View</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">
                                        {universityData.city}, {universityData.province}, China
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
