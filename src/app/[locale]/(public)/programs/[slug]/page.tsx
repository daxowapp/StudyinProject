import { DeadlineCountdown } from "@/components/programs/DeadlineCountdown";
import { ProgramRequirements } from "@/components/programs/ProgramRequirements";


import { UniversityScholarshipsSection } from "@/components/scholarships/UniversityScholarshipsSection";
import { AccommodationSection } from "@/components/universities/AccommodationSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, GraduationCap, Building2, MapPin, Calendar, Clock, DollarSign, Globe, CheckCircle2, ArrowRight, Star, Users, TrendingUp, Zap, Home } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Price } from "@/components/currency/PriceDisplay";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { CourseJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { CscaCtaSection } from "@/components/home/CscaCtaSection";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

// Enable ISR with 10 minute revalidation for performance
export const revalidate = 600;

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
    const supabase = await createClient();
    const { slug, locale } = await params;

    const { data: program } = await supabase
        .from("v_university_programs_full")
        .select("display_title, program_title, program_description, university_name, level, tuition_fee, currency")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    if (!program) {
        return {
            title: 'Program Not Found',
        };
    }

    const programName = program.display_title || program.program_title;
    const title = `${programName} at ${program.university_name}`;
    const description = program.program_description?.slice(0, 160) ||
        `Study ${programName} (${program.level}) at ${program.university_name} in China. Tuition: ${program.tuition_fee} ${program.currency}/year.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/programs/${slug}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/programs/${slug}`,
            languages: {
                'en': `${baseUrl}/en/programs/${slug}`,
                'ar': `${baseUrl}/ar/programs/${slug}`,
                'fa': `${baseUrl}/fa/programs/${slug}`,
                'tr': `${baseUrl}/tr/programs/${slug}`,
            },
        },
    };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const supabase = await createClient();
    const t = await getTranslations('ProgramDetail');
    const { slug, locale } = await params;

    // Fetch program with university details using slug
    const { data: program, error } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    if (error || !program) {
        notFound();
    }

    // Fetch all related data in parallel for better performance
    const [translationResult, universityResult, accommodationResult, overrideResult] = await Promise.all([
        // Program translation
        supabase
            .from("program_translations")
            .select("*")
            .eq("program_id", program.id)
            .eq("locale", locale)
            .single(),
        // University info
        supabase
            .from("universities")
            .select("has_fast_track, brochure_url, accommodation_available, accommodation_description, accommodation_fee_range, accommodation_features")
            .eq("id", program.university_id)
            .single(),
        // Accommodation types
        supabase
            .from("university_accommodation")
            .select("*")
            .eq("university_id", program.university_id)
            .order("display_order", { ascending: true }),
        // Program specific overrides/missing fields
        supabase
            .from("university_programs")
            .select("csca_exam_require")
            .eq("id", program.id)
            .single(),
    ]);

    const translation = translationResult.data;
    const university = universityResult.data;
    const accommodationTypes = accommodationResult.data;
    const programOverrides = overrideResult.data;

    // Fetch requirements - check if program has custom requirements
    let requirements;
    if (program.has_custom_requirements) {
        // Fetch program-specific requirements (overrides university defaults)
        const { data } = await supabase
            .from("v_program_admission_requirements")
            .select("*")
            .eq("program_id", program.id)
            .order("category")
            .order("display_order");
        requirements = data;
    } else {
        // Fetch university-level requirements (default behavior)
        const { data } = await supabase
            .from("v_university_admission_requirements")
            .select("*")
            .eq("university_id", program.university_id)
            .in("requirement_type", [program.level.toLowerCase(), "all"])
            .order("category")
            .order("display_order");
        requirements = data;
    }

    // Group requirements by category
    const groupedRequirements = requirements?.reduce((acc: Record<string, { name: string; required: boolean; note: string }[]>, req: { category: string; title: string; is_required: boolean; custom_note?: string; description: string }) => {
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

    // Use translated content if available, fallback to original
    const programTitle = translation?.title || program.display_title || program.program_title;
    const programDescription = translation?.description || program.program_description || t('overview.noDescription');

    const programData = {
        id: program.id,
        slug: program.slug,
        name: programTitle,
        university: program.university_name || "Unknown University",
        universityId: program.university_id,
        universitySlug: program.university_slug,
        city: program.city || "N/A",
        level: program.level,
        duration: program.duration,
        language: program.language_name || "Not specified",
        intake: program.intake,
        deadline: program.intake,
        application_deadline: program.application_deadline,
        tuition: `${program.tuition_fee} ${program.currency}/Year`,
        tuition_fee: program.tuition_fee, // Raw number for Price component
        currency: program.currency || 'CNY', // Currency code
        applicationFee: program.application_fee ? `${program.application_fee} USD` : "300 USD",
        application_fee_amount: program.application_fee || 300, // Raw number for Price component
        application_fee_currency: 'USD',
        csca_exam_require: programOverrides?.csca_exam_require || false,
        totalInitial: "~260 USD",
        badges: [program.language_name, program.level].filter(Boolean),
        overview: programDescription,
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
            { q: t('faq.accommodationQ'), a: t('faq.accommodationA') },
            { q: t('faq.workQ'), a: t('faq.workA') },
            { q: t('faq.deadlineQ'), a: t('faq.deadline', { deadline: program.intake || "to be announced" }) },
        ],
        gpa_requirement: program.gpa_requirement,
        score_ielts: program.score_ielts,
        score_toefl: program.score_toefl,
        score_duolingo: program.score_duolingo,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
            <CourseJsonLd
                name={programData.name}
                description={programData.overview}
                provider={programData.university}
                providerUrl={`${baseUrl}/en/universities/${programData.universityId}`}
                url={`${baseUrl}/en/programs/${programData.slug}`}
                duration={programData.duration}
                educationalLevel={programData.level}
                inLanguage={programData.language}
                offers={programData.tuition_fee ? { price: programData.tuition_fee, currency: programData.currency } : undefined}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Programs', url: `${baseUrl}/en/programs` },
                    { name: programData.university, url: `${baseUrl}/en/universities/${programData.universitySlug}` },
                    { name: programData.name, url: `${baseUrl}/en/programs/${programData.slug}` },
                ]}
            />
            <FAQJsonLd
                questions={programData.faqs.map((faq: { q: string; a: string }) => ({
                    question: faq.q,
                    answer: faq.a,
                }))}
            />
            {/* Premium Hero Section */}
            <div className="relative border-b overflow-hidden bg-background">
                {/* Decorative Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="absolute top-0 right-0 w-full h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 relative z-10">
                    <div className="max-w-4xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap font-medium">
                            <Link href="/" className="hover:text-primary transition-colors">{t('breadcrumb.home')}</Link>
                            <span className="text-muted-foreground/50">/</span>
                            <Link href="/programs" className="hover:text-primary transition-colors">{t('breadcrumb.programs')}</Link>
                            <span className="text-muted-foreground/50">/</span>
                            <Link href={`/${locale}/universities/${program.university_slug}`} className="hover:text-primary transition-colors">
                                {programData.university}
                            </Link>
                            <span className="text-muted-foreground/50">/</span>
                            <span className="text-foreground">{programData.name}</span>
                        </div>

                        {/* Program Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight text-foreground">
                            {programData.name}
                        </h1>

                        {/* University Info */}
                        <Link href={`/${locale}/universities/${program.university_slug}`} className="group inline-flex items-center gap-4 mb-8 bg-muted/40 hover:bg-muted/60 border border-muted/50 rounded-2xl p-2 pr-6 transition-all duration-300">
                            <div className="h-12 w-12 rounded-xl bg-background shadow-sm border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{programData.university}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {programData.city}
                                </p>
                            </div>
                        </Link>

                        {/* Quick Info Badges */}
                        <div className="flex flex-wrap gap-2.5 mb-10">
                            <Badge variant="secondary" className="px-3.5 py-1.5 text-sm font-medium bg-muted/50 hover:bg-muted">
                                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                                {programData.level}
                            </Badge>
                            <Badge variant="secondary" className="px-3.5 py-1.5 text-sm font-medium bg-muted/50 hover:bg-muted">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {programData.duration}
                            </Badge>
                            <Badge variant="secondary" className="px-3.5 py-1.5 text-sm font-medium bg-muted/50 hover:bg-muted">
                                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                {programData.language}
                            </Badge>
                            <Badge variant="secondary" className="px-3.5 py-1.5 text-sm font-medium bg-muted/50 hover:bg-muted">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {t('badges.intake', { intake: programData.intake || t('badges.contactUniversity') })}
                            </Badge>
                            {university?.has_fast_track && (
                                <Badge className="px-3.5 py-1.5 text-sm font-medium bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">
                                    <Zap className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                                    {t('badges.fastTrack')}
                                </Badge>
                            )}
                            {program.has_custom_requirements && (
                                <Badge className="px-3.5 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
                                    <Star className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                                    {t('badges.specialRequirements') || 'Special Requirements'}
                                </Badge>
                            )}
                            {programData.csca_exam_require && (
                                <Badge className="px-3.5 py-1.5 text-sm font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25 shadow-sm">
                                    <span className="mr-1.5 text-base leading-none">📝</span> Requires CSCA Exam
                                </Badge>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link href={`/apply/${slug}`}>
                                <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all bg-primary hover:bg-primary/90">
                                    {t('buttons.apply')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href={`/${locale}/universities/${program.university_slug}`}>
                                <Button size="lg" variant="outline" className="rounded-full h-14 px-6 font-medium border-2 hover:bg-muted/50 transition-colors">
                                    {t('buttons.viewUniversity')}
                                </Button>
                            </Link>
                            {university?.brochure_url && (
                                <a href={university.brochure_url} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="ghost" className="rounded-full h-14 px-6 font-medium hover:bg-muted/50 transition-colors">
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        {t('buttons.downloadBrochure')}
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Facts Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Tuition */}
                            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-primary/20 hover:shadow-md transition-all">
                                <CardContent className="p-5 flex flex-col items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('highlights.tuition')}</p>
                                        <p className="text-lg font-bold">
                                            {programData.tuition_fee && typeof programData.tuition_fee === 'number' ? (
                                                <Price amount={programData.tuition_fee} currency={programData.currency} />
                                            ) : (
                                                programData.tuition
                                            )}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Duration */}
                            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-blue-500/20 hover:shadow-md transition-all">
                                <CardContent className="p-5 flex flex-col items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('highlights.duration')}</p>
                                        <p className="text-lg font-bold">{programData.duration}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Language */}
                            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-green-500/20 hover:shadow-md transition-all">
                                <CardContent className="p-5 flex flex-col items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <Globe className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('highlights.language')}</p>
                                        <p className="text-lg font-bold">{programData.language}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Level */}
                            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-orange-500/20 hover:shadow-md transition-all">
                                <CardContent className="p-5 flex flex-col items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('highlights.level')}</p>
                                        <p className="text-lg font-bold">{programData.level}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* GPA */}
                            {(program as any).gpa_requirement && (
                                <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-purple-500/20 hover:shadow-md transition-all">
                                    <CardContent className="p-5 flex flex-col items-start gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('highlights.gpaRequirement') || 'Minimum GPA'}</p>
                                            <p className="text-lg font-bold">{(program as any).gpa_requirement}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Languages Scores */}
                            {((program as any).score_ielts || (program as any).score_toefl || (program as any).score_duolingo) && (
                                <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-pink-500/20 hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
                                    <CardContent className="p-5 flex flex-col items-start gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                            <BookOpen className="h-5 w-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('highlights.languageRequirements') || 'Language Requirements'}</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(program as any).score_ielts && (
                                                    <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 text-xs">
                                                        IELTS: {(program as any).score_ielts}
                                                    </Badge>
                                                )}
                                                {(program as any).score_toefl && (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                                        TOEFL: {(program as any).score_toefl}
                                                    </Badge>
                                                )}
                                                {(program as any).score_duolingo && (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                                        Duolingo: {(program as any).score_duolingo}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Overview */}
                        <Card className="border-border/50 shadow-sm bg-white dark:bg-background/50 hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                    {t('overview.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
                                    <p className="leading-relaxed">
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
                                <ProgramRequirements
                                    requirements={programData.requirements}
                                    scores={{
                                        ielts: (program as any).score_ielts,
                                        toefl: (program as any).score_toefl,
                                        duolingo: (program as any).score_duolingo
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Scholarships */}
                        <Card className="border-none shadow-xl">
                            <CardContent className="p-8">
                                <UniversityScholarshipsSection
                                    universityId={programData.universityId}
                                    programSlug={programData.slug}
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

                        {/* Accommodation */}
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Home className="h-6 w-6 text-primary" />
                                    {t('accommodation.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AccommodationSection
                                    accommodationAvailable={university?.accommodation_available ?? true}
                                    accommodationDescription={university?.accommodation_description}
                                    accommodationFeeRange={university?.accommodation_fee_range}
                                    accommodationFeatures={university?.accommodation_features}
                                    accommodationTypes={accommodationTypes || []}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Deadline Countdown */}
                            <DeadlineCountdown deadline={programData.application_deadline} />

                            {/* Quick Apply Card */}
                            <Card className="border border-primary/20 shadow-xl shadow-primary/5 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{t('sidebar.ready')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium">{t('sidebar.free')}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium">{t('sidebar.fast')}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium">{t('sidebar.expert')}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 flex flex-col gap-3">
                                        <Link href={`/apply/${slug}`} className="w-full">
                                            <Button className="w-full h-12 text-base font-semibold shadow-md bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all">
                                                {t('buttons.startApplication')}
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="w-full h-12 font-medium border-2 hover:bg-muted transition-colors">
                                            {t('buttons.contactAdvisor')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Costs Breakdown */}
                            <Card className="border border-border/50 shadow-sm bg-white dark:bg-background/50 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <DollarSign className="h-4 w-4 text-primary" />
                                        </div>
                                        {t('sidebar.cost')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-1 pb-3 border-b border-border/60">
                                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{t('highlights.tuition')}</span>
                                        <span className="font-bold text-lg text-foreground">
                                            {programData.tuition_fee && typeof programData.tuition_fee === 'number' ? (
                                                <Price amount={programData.tuition_fee} currency={programData.currency} />
                                            ) : (
                                                programData.tuition
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 pb-3 border-b border-border/60">
                                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{t('sidebar.applicationFee')}</span>
                                        <span className="font-bold text-lg text-foreground">
                                            {typeof programData.application_fee_amount === 'number' ? (
                                                <Price amount={programData.application_fee_amount} currency={programData.application_fee_currency} />
                                            ) : (
                                                programData.applicationFee
                                            )}
                                        </span>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-xs text-muted-foreground/80 flex items-start gap-1.5">
                                            <span className="text-primary font-bold">*</span>
                                            {t('sidebar.disclaimer')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Why Choose This Program */}
                            <Card className="border border-blue-500/20 shadow-sm bg-gradient-to-b from-blue-500/5 to-transparent">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                        <TrendingUp className="h-5 w-5" />
                                        {t('sidebar.why')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3.5">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-muted-foreground leading-snug">{t('sidebar.reasons.degree')}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-muted-foreground leading-snug">{t('sidebar.reasons.faculty')}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-muted-foreground leading-snug">{t('sidebar.reasons.facilities')}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-muted-foreground leading-snug">{t('sidebar.reasons.career')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <CscaCtaSection />
        </div >
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
