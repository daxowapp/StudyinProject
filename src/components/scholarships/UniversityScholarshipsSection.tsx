"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Award, Heart, DollarSign, Zap, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations, useLocale } from "next-intl";

interface UniversityScholarship {
    id: string;
    type_name: string;
    display_name: string | null;
    description: string | null;
    tuition_coverage_percentage: number;
    duration_years: number | null;
    service_fee_usd: number;
    service_fee_cny: number;
    includes_accommodation: boolean;
    accommodation_type: string | null;
    includes_stipend: boolean;
    stipend_amount_monthly: number | null;
    stipend_currency: string;
    stipend_duration_months: number | null;
    includes_medical_insurance: boolean;
    one_time_allowance: number | null;
    one_time_allowance_currency: string;
    additional_benefits: string[] | null;
}

interface UniversityScholarshipsSectionProps {
    universityId: string;
    universitySlug?: string;
    programSlug?: string; // When provided, Apply Now links directly to apply page
    title?: string;
    description?: string;
    showHeader?: boolean;
}

export function UniversityScholarshipsSection({
    universityId,
    universitySlug,
    programSlug,
    title = "Available Scholarship Types",
    description = "Choose the scholarship type that fits your budget",
    showHeader = true
}: UniversityScholarshipsSectionProps) {
    const t = useTranslations('UniversityScholarships');
    const locale = useLocale();
    const [scholarships, setScholarships] = useState<UniversityScholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const handleApply = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        // Determine the target URL
        // If programSlug is provided, go directly to apply page
        // Otherwise, go to programs list filtered by university where user can select and apply
        const applyUrl = programSlug
            ? `/${locale}/apply/${programSlug}`
            : universitySlug
                ? `/${locale}/programs?university=${universitySlug}`
                : `/${locale}/programs`;

        if (user) {
            // User is logged in - go directly to target
            router.push(applyUrl);
        } else {
            // User is NOT logged in - redirect to register with return URL
            router.push(`/${locale}/register?next=${encodeURIComponent(applyUrl)}`);
        }
    };

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                // Fetch scholarships
                const { data: scholarshipsData, error: scholarshipsError } = await supabase
                    .from("university_scholarships")
                    .select("*")
                    .eq("university_id", universityId)
                    .eq("is_active", true)
                    .order("display_order", { ascending: true });

                if (scholarshipsError) throw scholarshipsError;

                if (!scholarshipsData || scholarshipsData.length === 0) {
                    setScholarships([]);
                    return;
                }

                // If locale is default (en), just use the data
                // If locale is different, try to fetch translations
                if (locale === 'en') {
                    setScholarships(scholarshipsData);
                    return;
                }

                // Fetch translations for these scholarships
                const scholarshipIds = scholarshipsData.map(s => s.id);
                const { data: translationsData, error: translationsError } = await supabase
                    .from("scholarship_translations")
                    .select("*")
                    .in("scholarship_id", scholarshipIds)
                    .eq("locale", locale);

                if (translationsError) {
                    console.error("Error fetching translations:", translationsError);
                    // Fallback to original data
                    setScholarships(scholarshipsData);
                    return;
                }

                // Merge translations
                const mergedScholarships = scholarshipsData.map(scholarship => {
                    const translation = translationsData?.find(tr => tr.scholarship_id === scholarship.id);
                    if (translation) {
                        return {
                            ...scholarship,
                            display_name: translation.display_name || scholarship.display_name,
                            description: translation.description || scholarship.description,
                            accommodation_type: translation.accommodation_type || scholarship.accommodation_type,
                            additional_benefits: translation.additional_benefits || scholarship.additional_benefits,
                        };
                    }
                    return scholarship;
                });

                setScholarships(mergedScholarships);

            } catch (error) {
                console.error("Error fetching scholarships:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [universityId, supabase, locale]);

    if (loading) {
        return <div className="text-center py-8">{t('loading')}</div>;
    }

    if (!scholarships || scholarships.length === 0) {
        return (
            <div className="text-center py-12">
                <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">{t('noScholarships')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showHeader && (
                <>
                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 font-semibold text-sm mb-4">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t('options')}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div>

                    {/* Call to Action */}
                    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-orange-500/5 to-red-500/10 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="max-w-2xl mx-auto space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold text-sm mb-2">
                                    <Award className="h-4 w-4" />
                                    <span>{t('discover')}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold font-heading">
                                    {t('explore')}
                                </h3>
                                <p className="text-muted-foreground max-w-xl mx-auto">
                                    {t('description')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                    <a href="#scholarship-cards">
                                        <Button
                                            size="lg"
                                            className="bg-gradient-to-r from-primary via-orange-500 to-red-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-600/90 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById('scholarship-cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                        >
                                            <Award className="mr-2 h-5 w-5" />
                                            {t('viewAll')}
                                        </Button>
                                    </a>
                                    <Link href="/contact">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-2 border-primary/30 hover:bg-primary/10 font-semibold px-8"
                                        >
                                            <Heart className="mr-2 h-5 w-5" />
                                            {t('advice')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Scholarship Disclaimer */}
            <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 text-sm text-muted-foreground flex items-start gap-3 mb-6">
                <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <p>
                    <strong>Note:</strong> While a scholarship may cover the full duration of the program, its continuation depends on the student&apos;s academic performance.
                </p>
            </div>

            {/* Scholarship Table/Rows */}
            <div id="scholarship-cards" className="space-y-4">
                {/* Header Row - Desktop Only */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/50 rounded-xl text-sm font-medium text-muted-foreground">
                    <div className="col-span-2">{t('scholarshipType') || 'Scholarship Type'}</div>
                    <div className="col-span-2 text-center">{t('tuitionCoverage')}</div>
                    <div className="col-span-2 text-center">{t('serviceFee')}</div>
                    <div className="col-span-4">{t('whatsIncluded')}</div>
                    <div className="col-span-2 text-center">{t('action') || 'Action'}</div>
                </div>

                {scholarships.map((scholarship, index) => {
                    const themes = [
                        { accent: "emerald", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
                        { accent: "blue", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-800", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
                        { accent: "purple", bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
                        { accent: "amber", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-800", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
                        { accent: "rose", bg: "bg-rose-50 dark:bg-rose-950/20", border: "border-rose-200 dark:border-rose-800", badge: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200" },
                        { accent: "cyan", bg: "bg-cyan-50 dark:bg-cyan-950/20", border: "border-cyan-200 dark:border-cyan-800", badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
                    ];
                    const theme = themes[index % themes.length];
                    const isPopular = index === 0 && scholarship.tuition_coverage_percentage >= 100;

                    // Build comprehensive benefits list
                    const allBenefits: { icon: string; text: string }[] = [];

                    // Tuition
                    allBenefits.push({ icon: "📚", text: `${scholarship.tuition_coverage_percentage}% Tuition Covered` });

                    // Accommodation
                    if (scholarship.includes_accommodation) {
                        allBenefits.push({
                            icon: "🏠",
                            text: scholarship.accommodation_type ? `Free ${scholarship.accommodation_type}` : 'Free Accommodation'
                        });
                    }

                    // Stipend
                    if (scholarship.includes_stipend) {
                        const stipendText = scholarship.stipend_amount_monthly
                            ? `${scholarship.stipend_amount_monthly} ${scholarship.stipend_currency}/month Stipend`
                            : "Monthly Stipend Included";
                        allBenefits.push({
                            icon: "💰",
                            text: stipendText
                        });
                    }

                    // Medical Insurance
                    if (scholarship.includes_medical_insurance) {
                        allBenefits.push({ icon: "🏥", text: 'Medical Insurance' });
                    }

                    // One-time Allowance
                    if (scholarship.one_time_allowance && scholarship.one_time_allowance > 0) {
                        allBenefits.push({
                            icon: "🎁",
                            text: `${scholarship.one_time_allowance} ${scholarship.one_time_allowance_currency} Settlement Allowance`
                        });
                    }

                    // Additional Benefits
                    if (scholarship.additional_benefits) {
                        scholarship.additional_benefits.forEach(b => allBenefits.push({ icon: "✓", text: b }));
                    }

                    return (
                        <div
                            key={scholarship.id}
                            className={`relative rounded-xl border-2 ${theme.border} ${theme.bg} p-4 lg:p-6 transition-all hover:shadow-lg ${isPopular ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                        >
                            {/* Popular Badge */}
                            {isPopular && (
                                <div className="absolute -top-3 left-4 flex gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                        <Award className="h-3 w-3" />
                                        {t('mostPopular')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md animate-pulse">
                                        <Zap className="h-3 w-3" />
                                        Urgent - Apply Now
                                    </span>
                                </div>
                            )}
                            {!isPopular && (
                                <div className="absolute -top-3 left-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md animate-pulse">
                                        <Zap className="h-3 w-3" />
                                        Urgent - Apply Now
                                    </span>
                                </div>
                            )}

                            {/* Desktop Layout */}
                            <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                                {/* Type Name */}
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold ${theme.badge}`}>
                                        {scholarship.type_name}
                                    </span>
                                    {scholarship.display_name && (
                                        <p className="mt-1 text-xs text-muted-foreground">{scholarship.display_name}</p>
                                    )}
                                </div>

                                {/* Tuition Coverage */}
                                <div className="col-span-2 text-center">
                                    <div className="inline-flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl px-4 py-2 shadow-sm">
                                        <span className="text-3xl font-bold text-primary">{scholarship.tuition_coverage_percentage}%</span>
                                        <span className="text-xs text-muted-foreground">{t('tuitionCoverage')}</span>
                                    </div>
                                </div>

                                {/* Service Fee */}
                                <div className="col-span-2 text-center space-y-1">
                                    <div className="font-bold text-lg text-foreground">
                                        ${Number(scholarship.service_fee_usd).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        ¥{Number(scholarship.service_fee_cny).toLocaleString()}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="col-span-4">
                                    <div className="flex flex-wrap gap-2">
                                        {allBenefits.map((benefit, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-medium shadow-sm border"
                                                title={benefit.text}
                                            >
                                                <span>{benefit.icon}</span>
                                                <span className="">{benefit.text}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="col-span-2 text-center">
                                    <Button
                                        onClick={handleApply}
                                        className="w-full bg-primary hover:bg-primary/90"
                                        size="lg"
                                    >
                                        {t('applyNow')}
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Layout */}
                            <div className="lg:hidden space-y-4">
                                {/* Header: Type + Coverage */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold ${theme.badge}`}>
                                            {scholarship.type_name}
                                        </span>
                                        {scholarship.display_name && (
                                            <p className="mt-1 text-xs text-muted-foreground">{scholarship.display_name}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">{scholarship.tuition_coverage_percentage}%</div>
                                        <div className="text-xs text-muted-foreground">{t('tuitionCoverage')}</div>
                                    </div>
                                </div>

                                {/* Service Fee */}
                                <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <span className="font-medium">{t('serviceFee')}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">${Number(scholarship.service_fee_usd).toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">¥{Number(scholarship.service_fee_cny).toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        {t('whatsIncluded')}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {allBenefits.map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm bg-white dark:bg-slate-900 rounded-lg px-3 py-2 shadow-sm">
                                                <span>{benefit.icon}</span>
                                                <span>{benefit.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action */}
                                <Button
                                    onClick={handleApply}
                                    className="w-full bg-primary hover:bg-primary/90"
                                    size="lg"
                                >
                                    {t('applyNow')}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Note */}
            <Card className="border-none bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                            <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-sm">{t('howItWorks.title')}</h4>
                            <p className="text-xs text-muted-foreground">
                                {t('howItWorks.description')}
                            </p>
                            <Link href="/scholarships" className="inline-block mt-2">
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    {t('howItWorks.learnMore')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
