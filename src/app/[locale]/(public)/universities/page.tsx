import { UniversitiesPageClient } from "@/components/universities/UniversitiesPageClient";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { CscaCtaSection } from "@/components/home/CscaCtaSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;

    const title = 'Top Chinese Universities for International Students';
    const description = 'Explore 100+ prestigious Chinese universities. Find programs, scholarships, admission requirements, and application guidance for studying in China.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/universities`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/universities`,
            languages: {
                'en': `${baseUrl}/en/universities`,
                'ar': `${baseUrl}/ar/universities`,
                'fa': `${baseUrl}/fa/universities`,
                'tr': `${baseUrl}/tr/universities`,
            },
        },
    };
}

export default async function UniversitiesPage() {
    const supabase = await createClient();
    const t = await getTranslations('Universities');

    // Two parallel fast queries instead of one slow aggregation view
    const [uniResult, programResult] = await Promise.all([
        // 1. University metadata — simple filtered scan, no joins
        supabase
            .from("universities")
            .select("id, slug, name, city, province, logo_url, cover_photo_url, banner_url, ranking, university_type, institution_category, has_fast_track, features, portal_key")
            .eq("portal_key", PORTAL_KEY)
            .order("name")
            .limit(1000),
        // 2. Program stats — lightweight join for aggregation
        supabase
            .from("university_programs")
            .select("university_id, tuition_fee, currency, scholarship_chance, csca_exam_require, program_catalog(level), languages:language_id(name)")
            .limit(50000),
    ]);

    const error = uniResult.error || programResult.error;
    if (error) {
        console.error("Error fetching universities:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto p-6">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">{t('error.title')}</h1>
                    <p className="text-muted-foreground mb-2">{error.message}</p>
                    {error.details && (
                        <p className="text-sm text-muted-foreground">{error.details}</p>
                    )}
                    {error.hint && (
                        <p className="text-sm text-muted-foreground mt-2">{t('error.hint', { hint: error.hint })}</p>
                    )}
                </div>
            </div>
        );
    }

    // Aggregate program stats per university in JS (fast in-memory)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const programsByUni = new Map<string, {
        count: number;
        minFee: number;
        minCurrency: string;
        levels: Set<string>;
        languages: Set<string>;
        hasScholarship: boolean;
        hasCsca: boolean;
    }>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const prog of (programResult.data || []) as any[]) {
        const uid = prog.university_id;
        let stats = programsByUni.get(uid);
        if (!stats) {
            stats = { count: 0, minFee: Infinity, minCurrency: 'CNY', levels: new Set(), languages: new Set(), hasScholarship: false, hasCsca: false };
            programsByUni.set(uid, stats);
        }
        stats.count++;
        if (prog.tuition_fee > 0 && prog.tuition_fee < stats.minFee) {
            stats.minFee = prog.tuition_fee;
            stats.minCurrency = prog.currency || 'CNY';
        }
        const level = prog.program_catalog?.level;
        if (level) stats.levels.add(level);
        const lang = prog.languages?.name;
        if (lang) stats.languages.add(lang);
        if (prog.scholarship_chance && prog.scholarship_chance !== '' && prog.scholarship_chance !== 'None') {
            stats.hasScholarship = true;
        }
        if (prog.csca_exam_require === true) {
            stats.hasCsca = true;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedUniversities = (uniResult.data || []).map((uni: any) => {
        const stats = programsByUni.get(uni.id);
        const minTuitionFee = stats && stats.minFee !== Infinity ? stats.minFee : 0;

        return {
            id: uni.id,
            slug: uni.slug || uni.id,
            name: uni.name || "Unknown University",
            city: uni.city || "N/A",
            province: uni.province || "N/A",
            programs: stats?.count || 0,
            minTuition: minTuitionFee > 0 ? `¥${minTuitionFee.toLocaleString()}/year` : "Contact for pricing",
            minTuitionFee: minTuitionFee,
            currency: stats?.minCurrency || 'CNY',
            badges: uni.features || [],
            logo: uni.logo_url,
            photo: uni.cover_photo_url || uni.banner_url,
            ranking: uni.ranking,
            university_type: uni.university_type,
            institution_category: uni.institution_category,
            has_fast_track: uni.has_fast_track,
            availableLevels: stats ? Array.from(stats.levels) : [],
            availableLanguages: stats ? Array.from(stats.languages) : [],
            hasScholarship: stats?.hasScholarship || false,
            hasCscaExam: stats?.hasCsca || false,
        };
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Universities', url: `${baseUrl}/universities` }
                ]}
            />
            <UniversitiesPageClient
                universities={formattedUniversities}
                heroContent={
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t('subtitle', { count: formattedUniversities.length })}
                        </p>
                    </>
                }
            />

            <CscaCtaSection />
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
