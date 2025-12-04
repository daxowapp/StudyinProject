import { ProgramRequirements } from "@/components/programs/ProgramRequirements";
import { UniversityScholarshipsSection } from "@/components/scholarships/UniversityScholarshipsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, GraduationCap, Building2, MapPin, Calendar, Clock, DollarSign, Globe, CheckCircle2, ArrowRight, Star, Users, TrendingUp, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Price } from "@/components/currency/Price";
import { getTranslations } from "next-intl/server";

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const t = await getTranslations('ProgramDetail');
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

    // Fetch university fast track status
    const { data: university } = await supabase
        .from("universities")
        .select("has_fast_track")
        .eq("id", program.university_id)
        .single();

    // Fetch admission requirements for this university and program level
    const { data: requirements } = await supabase
        .from("v_university_admission_requirements")
        .select("*")
        .eq("university_id", program.university_id)
        .in("requirement_type", [program.level.toLowerCase(), "all"])
        .order("category")
        .order("display_order");

    console.log("Requirements fetched:", requirements);

    // Group requirements by category
    const groupedRequirements = requirements?.reduce((acc: Record<string, { name: string; required: boolean; note: string }[]>, req: { category: string; title: string; is_required: boolean; custom_note: string; description: string }) => {
        if (!acc[req.category]) {
            acc[req.category] = [];
        }
        acc[req.category].push({
            name: req.title,
            required: req.is_required,
            note: req.custom_note || req.description
        });
        return acc;
    }, {}) || {};

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
        tuition_fee: program.tuition_fee, // Raw number for Price component
        currency: program.currency || 'CNY', // Currency code
        applicationFee: program.application_fee ? `${program.application_fee} ${program.currency}` : "800 RMB",
        application_fee_amount: program.application_fee || 800, // Raw number for Price component
        application_fee_currency: program.currency || 'CNY',
        serviceFee: program.service_fee ? `${program.service_fee} USD` : "150 USD",
        service_fee_amount: program.service_fee || 150, // Raw number for Price component
        service_fee_currency: 'USD',
        totalInitial: "~260 USD",
        badges: [program.language_name, program.level].filter(Boolean),
        overview: program.program_description || t('overview.noDescription'),
        curriculum: [
            t('overview.curriculumPlaceholder'),
        ],
        requirements: {
            academic: groupedRequirements.academic || [],
            language: groupedRequirements.language || [],
            documents: groupedRequirements.document || [],
            financial: groupedRequirements.financial || [],
            other: groupedRequirements.other || [],
        },
        scholarships: [
            { name: "Chinese Government Scholarship (CSC)", type: "Full Scholarship" },
            { name: "Provincial Government Scholarship", type: "Partial Scholarship" },
            { name: "University Scholarship", type: "Tuition Waiver" },
        ],
        faqs: [
            { q: "Is accommodation provided?", a: "Yes, on-campus accommodation is available for international students." },
            { q: "Can I work part-time?", a: "Yes, international students can apply for work-study programs or internships with proper permits." },
            { q: "What is the application deadline?", a: t('faq.deadline', { deadline: program.intake || "to be announced" }) },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 relative">
                    <div className="max-w-4xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                            <Link href="/" className="hover:text-primary">{t('breadcrumb.home')}</Link>
                            <span>/</span>
                            <Link href="/programs" className="hover:text-primary">{t('breadcrumb.programs')}</Link>
                            <span>/</span>
                            <span className="text-foreground">{programData.name}</span>
                        </div>

                        {/* Program Title */}
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            {programData.name}
                        </h1>

                        {/* University Info */}
                        <Link href={`/universities/${program.university_id}`} className="group inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg group-hover:text-primary transition-colors">{programData.university}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {programData.city}
                                </p>
                            </div>
                        </Link>

                        {/* Quick Info Badges */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <Badge className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                {programData.level}
                            </Badge>
                            <Badge className="px-4 py-2 text-sm bg-blue-500/10 text-blue-600 border-blue-500/20">
                                <Clock className="h-4 w-4 mr-2" />
                                {programData.duration}
                            </Badge>
                            <Badge className="px-4 py-2 text-sm bg-green-500/10 text-green-600 border-green-500/20">
                                <Globe className="h-4 w-4 mr-2" />
                                {programData.language}
                            </Badge>
                            <Badge className="px-4 py-2 text-sm bg-orange-500/10 text-orange-600 border-orange-500/20">
                                <Calendar className="h-4 w-4 mr-2" />
                                {t('badges.intake', { intake: programData.intake || t('badges.contactUniversity') })}
                            </Badge>
                            {university?.has_fast_track && (
                                <Badge className="px-4 py-2 text-sm bg-yellow-400/10 text-yellow-600 border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                                    {t('badges.fastTrack')}
                                </Badge>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link href={`/apply/${slug}`}>
                                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                                    {t('buttons.apply')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href={`/universities/${program.university_id}`}>
                                <Button size="lg" variant="outline" className="border-2">
                                    {t('buttons.viewUniversity')}
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-2">
                                {t('buttons.downloadBrochure')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Facts */}
                        <Card className="border-none shadow-xl bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-primary" />
                                    {t('highlights.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <DollarSign className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('highlights.tuition')}</p>
                                            <p className="text-xl font-bold">
                                                {programData.tuition_fee && typeof programData.tuition_fee === 'number' ? (
                                                    <Price amount={programData.tuition_fee} currency={programData.currency} />
                                                ) : (
                                                    programData.tuition
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Clock className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('highlights.duration')}</p>
                                            <p className="text-xl font-bold">{programData.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                            <Globe className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('highlights.language')}</p>
                                            <p className="text-xl font-bold">{programData.language}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                            <Users className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('highlights.level')}</p>
                                            <p className="text-xl font-bold">{programData.level}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overview */}
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                    {t('overview.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {programData.overview}
                                    </p>
                                </div>

                                {programData.curriculum && programData.curriculum.length > 0 && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="font-bold text-lg mb-4">{t('overview.curriculum')}</h3>
                                        <div className="grid gap-3">
                                            {programData.curriculum.map((course: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                    <span className="text-sm font-medium">{course}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                    {t('requirements.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProgramRequirements requirements={programData.requirements} />
                            </CardContent>
                        </Card>

                        {/* Scholarships */}
                        <Card className="border-none shadow-xl">
                            <CardContent className="p-8">
                                <UniversityScholarshipsSection
                                    universityId={programData.universityId}
                                    title={t('scholarships.title')}
                                    description={t('scholarships.description')}
                                />
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">{t('faq.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Quick Apply Card */}
                            <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                                <CardHeader>
                                    <CardTitle className="text-xl">{t('sidebar.ready')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>{t('sidebar.free')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>{t('sidebar.fast')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span>{t('sidebar.expert')}</span>
                                        </div>
                                    </div>
                                    <Link href={`/apply/${slug}`} className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" size="lg">
                                            {t('buttons.startApplication')}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full" size="lg">
                                        {t('buttons.contactAdvisor')}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Costs Breakdown */}
                            <Card className="border-none shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        {t('sidebar.cost')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm text-muted-foreground">{t('highlights.tuition')}</span>
                                        <span className="font-semibold">
                                            {programData.tuition_fee && typeof programData.tuition_fee === 'number' ? (
                                                <Price amount={programData.tuition_fee} currency={programData.currency} />
                                            ) : (
                                                programData.tuition
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm text-muted-foreground">{t('sidebar.applicationFee')}</span>
                                        <span className="font-semibold">
                                            {typeof programData.application_fee_amount === 'number' ? (
                                                <Price amount={programData.application_fee_amount} currency={programData.application_fee_currency} />
                                            ) : (
                                                programData.applicationFee
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm text-muted-foreground">{t('sidebar.serviceFee')}</span>
                                        <span className="font-semibold">
                                            {typeof programData.service_fee_amount === 'number' ? (
                                                <Price amount={programData.service_fee_amount} currency={programData.service_fee_currency} />
                                            ) : (
                                                programData.serviceFee
                                            )}
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs text-muted-foreground">{t('sidebar.disclaimer')}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Why Choose This Program */}
                            <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        {t('sidebar.why')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-sm">{t('sidebar.reasons.degree')}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-sm">{t('sidebar.reasons.faculty')}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-sm">{t('sidebar.reasons.facilities')}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-sm">{t('sidebar.reasons.career')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
