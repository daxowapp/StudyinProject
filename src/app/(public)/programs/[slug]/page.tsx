import { ProgramHeader } from "@/components/programs/ProgramHeader";
import { ProgramRequirements } from "@/components/programs/ProgramRequirements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Award, BookOpen, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch program with university details using slug
    const { data: program, error } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("slug", slug)
        .single();

    // Log for debugging
    console.log("Fetching program with slug:", slug);
    console.log("Error:", error);
    console.log("Program data:", program);

    if (error) {
        console.error("Supabase error:", error.message, error.details, error.hint);
        notFound();
    }

    if (!program) {
        console.log("No program found for slug:", slug);
        notFound();
    }

    const programData = {
        id: program.id,
        slug: program.slug,
        name: program.display_title || program.program_title,
        university: program.university_name || "Unknown University",
        universityId: program.university_id,
        city: program.city || "N/A",
        level: program.level,
        duration: program.duration,
        language: program.language_name || "Not specified",
        intake: program.intake,
        deadline: program.intake,
        tuition: `${program.tuition_fee} ${program.currency}/Year`,
        applicationFee: program.application_fee ? `${program.application_fee} ${program.currency}` : "800 RMB",
        serviceFee: program.service_fee ? `${program.service_fee} USD` : "150 USD",
        totalInitial: "~260 USD",
        badges: [program.language_name, program.level].filter(Boolean),
        overview: program.program_description || "No description available for this program.",
        curriculum: [
            "Core courses information will be updated soon",
        ],
        requirements: {
            academic: [
                "High school diploma or equivalent",
                "Strong academic background",
                "Minimum GPA of 3.0/4.0",
            ],
            language: program.language_name === "English"
                ? [
                    "IELTS 6.0 or TOEFL 80 (for non-native English speakers)",
                    "No Chinese language proficiency required",
                ]
                : [
                    "HSK 4 or above required",
                    "English proficiency may be beneficial",
                ],
            documents: [
                { name: "Passport Copy", required: true },
                { name: "High School Transcript", required: true, note: "Must be translated if not in English/Chinese" },
                { name: "High School Diploma", required: true },
                { name: program.language_name === "English" ? "English Proficiency Certificate" : "HSK Certificate", required: true },
                { name: "Personal Statement", required: true },
                { name: "Two Recommendation Letters", required: false },
                { name: "Physical Examination Record", required: true },
                { name: "Non-Criminal Record", required: true },
            ],
        },
        scholarships: [
            { name: "Chinese Government Scholarship (CSC)", type: "Full Scholarship" },
            { name: "Provincial Government Scholarship", type: "Partial Scholarship" },
            { name: "University Scholarship", type: "Tuition Waiver" },
        ],
        faqs: [
            { q: "Is accommodation provided?", a: "Yes, on-campus accommodation is available for international students." },
            { q: "Can I work part-time?", a: "Yes, international students can apply for work-study programs or internships with proper permits." },
            { q: "What is the application deadline?", a: `The application deadline is ${program.intake || "to be announced"}.` },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
            <ProgramHeader program={programData} />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-12">
                        {/* Overview */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Program Overview</h2>
                            </div>
                            <Card className="border-none shadow-lg">
                                <CardContent className="p-6">
                                    <div className="prose max-w-none text-muted-foreground">
                                        <p className="whitespace-pre-line leading-relaxed text-base">
                                            {programData.overview}
                                        </p>
                                    </div>

                                    {programData.curriculum && programData.curriculum.length > 0 && (
                                        <div className="mt-8 pt-6 border-t">
                                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                Key Courses
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {programData.curriculum.map((course: string, i: number) => (
                                                    <div key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/20">
                                                        {course}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>

                        {/* Requirements */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Requirements</h2>
                            </div>
                            <ProgramRequirements requirements={programData.requirements} />
                        </section>

                        {/* Scholarships */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Scholarships Available</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {programData.scholarships.map((sch, i) => (
                                    <Card key={i} className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <Award className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-base">{sch.name}</h3>
                                                    <p className="text-sm text-primary mt-1 font-medium">{sch.type}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <h2 className="text-3xl font-bold font-heading">Frequently Asked Questions</h2>
                            </div>
                            <Card className="border-none shadow-lg">
                                <CardContent className="p-6">
                                    <Accordion type="single" collapsible className="w-full">
                                        {programData.faqs.map((faq, i) => (
                                            <AccordionItem key={i} value={`item-${i}`}>
                                                <AccordionTrigger className="text-left hover:text-primary">
                                                    {faq.q}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground">
                                                    {faq.a}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    {/* Sidebar Spacer (for sticky box in header) */}
                    <div className="hidden lg:block w-[350px] shrink-0" />
                </div>
            </div>
        </div>
    );
}
