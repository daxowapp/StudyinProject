import { createClient } from "@/lib/supabase/server";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
    Award, MapPin, Clock, Globe, Calendar,
    GraduationCap, Home, Heart, Wallet, ArrowLeft,
    Building2
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export const revalidate = 600;

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: program } = await supabase
        .from("v_university_programs_full")
        .select("display_title, program_title, university_name, city")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    const programName = program?.display_title || program?.program_title || "Scholarship Program";
    const universityName = program?.university_name || "";

    const title = `${programName} Scholarship - ${universityName}`;
    const description = `Apply for a scholarship to study ${programName} at ${universityName}, ${program?.city}. View scholarship coverage, benefits, and what you need to pay.`;

    return {
        title,
        description,
        openGraph: { title, description, url: `${baseUrl}/${locale}/scholarships/${slug}` },
        alternates: { canonical: `${baseUrl}/${locale}/scholarships/${slug}` },
    };
}

export default async function ScholarshipDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();
    const t = await getTranslations("Scholarships");

    // 1. Fetch program details
    const { data: program, error: programError } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    if (programError || !program) {
        notFound();
    }

    // 2. Fetch all scholarship options for this university
    const { data: scholarships } = await supabase
        .from("university_scholarships")
        .select("*")
        .eq("university_id", program.university_id)
        .eq("is_active", true)
        .order("tuition_coverage_percentage", { ascending: false });

    // 3. Fetch university details (logo, etc.)
    const { data: university } = await supabase
        .from("universities")
        .select("id, name, slug, city, logo_url, cover_photo_url, ranking")
        .eq("id", program.university_id)
        .single();

    const programTitle = program.display_title || program.program_title;
    const tuitionFee = program.tuition_fee || 0;

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Scholarships', url: `${baseUrl}/scholarships` },
                    { name: programTitle, url: `${baseUrl}/scholarships/${slug}` }
                ]}
            />

            {/* Hero */}
            <div className="bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-10">
                    {/* Breadcrumb */}
                    <Link
                        href="/scholarships"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("detail.backToSearch")}
                    </Link>

                    <div className="flex items-start gap-5">
                        {/* University Logo */}
                        {university?.logo_url && (
                            <div className="h-16 w-16 rounded-xl bg-white shadow-sm border flex items-center justify-center overflow-hidden shrink-0">
                                <Image
                                    src={university.logo_url}
                                    alt={university.name || ""}
                                    width={56}
                                    height={56}
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <div>
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 mb-3">
                                <Award className="h-3 w-3 mr-1" />
                                {t("detail.scholarshipAvailable")}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">
                                {programTitle}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                                <Link
                                    href={`/universities/${university?.slug}`}
                                    className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
                                >
                                    <Building2 className="h-4 w-4" />
                                    {university?.name}
                                </Link>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {program.city}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Program Info + Scholarships */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Program Quick Info */}
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    {t("detail.programDetails")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <GraduationCap className="h-5 w-5 text-primary mx-auto mb-1" />
                                        <div className="text-xs text-muted-foreground">{t("detail.degree")}</div>
                                        <div className="font-semibold text-sm">{program.level}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                                        <div className="text-xs text-muted-foreground">{t("detail.duration")}</div>
                                        <div className="font-semibold text-sm">{program.duration}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <Globe className="h-5 w-5 text-primary mx-auto mb-1" />
                                        <div className="text-xs text-muted-foreground">{t("detail.language")}</div>
                                        <div className="font-semibold text-sm">{program.language_name}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
                                        <div className="text-xs text-muted-foreground">{t("detail.intake")}</div>
                                        <div className="font-semibold text-sm">{program.intake || "Sep 2026"}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Scholarship Options */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Award className="h-6 w-6 text-primary" />
                                {t("detail.availableScholarships")}
                            </h2>

                            {(!scholarships || scholarships.length === 0) ? (
                                <Card className="border-dashed">
                                    <CardContent className="py-12 text-center">
                                        <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">{t("detail.noScholarships")}</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {scholarships.map((s) => {
                                        const studentPaysTuition = Math.round(tuitionFee * (1 - (s.tuition_coverage_percentage || 0) / 100));
                                        const coverageColor = s.tuition_coverage_percentage >= 100
                                            ? "border-emerald-500/30 bg-linear-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10"
                                            : s.tuition_coverage_percentage >= 75
                                                ? "border-blue-500/30 bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10"
                                                : s.tuition_coverage_percentage >= 50
                                                    ? "border-purple-500/30 bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10"
                                                    : "border-slate-300 bg-linear-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/10";

                                        return (
                                            <Card key={s.id} className={`border-2 ${coverageColor} shadow-md hover:shadow-lg transition-shadow`}>
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        {/* Left: Scholarship Info */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <Badge className="text-sm font-semibold">
                                                                    {s.type_name}
                                                                </Badge>
                                                                <span className="text-2xl font-bold text-primary">
                                                                    {s.tuition_coverage_percentage}%
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">{t("detail.tuitionCoverage")}</span>
                                                            </div>

                                                            {s.display_name && (
                                                                <p className="text-sm font-medium mb-2">{s.display_name}</p>
                                                            )}

                                                            {/* Benefits */}
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {s.includes_accommodation && (
                                                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 text-xs">
                                                                        <Home className="h-3 w-3 mr-1" />
                                                                        {s.accommodation_type || t("detail.freeAccommodation")}
                                                                    </Badge>
                                                                )}
                                                                {s.includes_stipend && s.stipend_amount_monthly && (
                                                                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 text-xs">
                                                                        <Wallet className="h-3 w-3 mr-1" />
                                                                        ¥{s.stipend_amount_monthly}/mo {t("detail.stipend")}
                                                                    </Badge>
                                                                )}
                                                                {s.includes_medical_insurance && (
                                                                    <Badge variant="secondary" className="bg-red-500/10 text-red-700 text-xs">
                                                                        <Heart className="h-3 w-3 mr-1" />
                                                                        {t("detail.medicalInsurance")}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {s.description && (
                                                                <p className="text-sm text-muted-foreground">{s.description}</p>
                                                            )}
                                                        </div>

                                                        {/* Right: Cost Breakdown */}
                                                        <div className="md:text-right space-y-2 md:min-w-[220px]">
                                                            <div>
                                                                <div className="text-xs text-muted-foreground">{t("detail.originalTuition")}</div>
                                                                <div className="text-sm line-through text-muted-foreground">
                                                                    ¥{tuitionFee.toLocaleString()}/year
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-muted-foreground">{t("detail.youPay")}</div>
                                                                <div className={`text-xl font-bold ${studentPaysTuition === 0 ? "text-emerald-600" : "text-foreground"}`}>
                                                                    {studentPaysTuition === 0
                                                                        ? t("search.free")
                                                                        : `¥${studentPaysTuition.toLocaleString()}/year`}
                                                                </div>
                                                            </div>
                                                            {(s.service_fee_usd > 0 || s.service_fee_cny > 0) && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {t("detail.serviceFee")}: ${s.service_fee_usd?.toLocaleString()} / ¥{s.service_fee_cny?.toLocaleString()}
                                                                </div>
                                                            )}
                                                            <Link href="/apply">
                                                                <Button className="mt-2" size="sm">
                                                                    {t("detail.applyNow")}
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* University Card */}
                        <Card className="border-none shadow-lg sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">{t("detail.university")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    {university?.logo_url && (
                                        <div className="h-12 w-12 rounded-lg bg-white shadow-sm border flex items-center justify-center overflow-hidden shrink-0">
                                            <Image
                                                src={university.logo_url}
                                                alt={university.name || ""}
                                                width={40}
                                                height={40}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{university?.name}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {program.city}, {program.province}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link href={`/universities/${university?.slug}`}>
                                        <Button variant="outline" className="w-full" size="sm">
                                            <Building2 className="h-4 w-4 mr-2" />
                                            {t("detail.viewUniversity")}
                                        </Button>
                                    </Link>
                                    <Link href={`/programs/${program.slug}`}>
                                        <Button variant="outline" className="w-full" size="sm">
                                            <GraduationCap className="h-4 w-4 mr-2" />
                                            {t("detail.viewProgram")}
                                        </Button>
                                    </Link>
                                    <Link href="/apply">
                                        <Button className="w-full" size="sm">
                                            {t("detail.applyNow")}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
