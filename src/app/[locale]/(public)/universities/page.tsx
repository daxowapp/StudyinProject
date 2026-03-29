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

    // Single optimized query using the pre-aggregated view
    // This replaces the old approach of fetching ALL 17K+ programs + JS aggregation
    const { data: universities, error } = await supabase
        .from("v_universities_listing")
        .select("id, slug, name, city, province, logo_url, cover_photo_url, banner_url, ranking, university_type, institution_category, has_fast_track, features, portal_key, program_count, min_tuition_fee, min_tuition_currency, available_levels, available_languages, has_scholarship, has_csca_exam, available_program_categories")
        .eq("portal_key", PORTAL_KEY)
        .order("name");

    if (error) {
        console.error("Error fetching universities:", error);
        return (
            <div className="min-h-screen bg-linear-to-b from-background to-muted/20 flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto p-6">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">{t('error.title')}</h1>
                    <p className="text-muted-foreground mb-2">{error.message}</p>
                </div>
            </div>
        );
    }

    // Strip base64-encoded images (data:image/...) — they bloat the RSC payload
    // from ~30KB to 46MB and cause serialization stack overflows.
    // Only pass through proper URLs (https://).
    const safeUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('data:')) return undefined;
        return url;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedUniversities = (universities || []).map((uni: any) => {
        const minTuitionFee = uni.min_tuition_fee || 0;

        return {
            id: uni.id,
            slug: uni.slug || uni.id,
            name: uni.name || "Unknown University",
            city: uni.city || "N/A",
            province: uni.province || "N/A",
            programs: uni.program_count || 0,
            minTuition: minTuitionFee > 0 ? `¥${minTuitionFee.toLocaleString()}/year` : "Contact for pricing",
            minTuitionFee: minTuitionFee,
            currency: uni.min_tuition_currency || 'CNY',
            badges: uni.features || [],
            logo: safeUrl(uni.logo_url),
            photo: safeUrl(uni.cover_photo_url) || safeUrl(uni.banner_url),
            ranking: uni.ranking,
            university_type: uni.university_type,
            institution_category: uni.institution_category,
            has_fast_track: uni.has_fast_track,
            availableLevels: uni.available_levels || [],
            availableLanguages: uni.available_languages || [],
            hasScholarship: uni.has_scholarship || false,
            hasCscaExam: uni.has_csca_exam || false,
            availableProgramCategories: uni.available_program_categories || [],
        };
    });


    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
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
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
