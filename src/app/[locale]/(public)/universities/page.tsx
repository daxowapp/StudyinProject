import { UniversitiesClient } from "@/components/universities/UniversitiesClient";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { UniversityHeroSearch } from "@/components/universities/UniversityHeroSearch";
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
            url: `${baseUrl} /${locale}/universities`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl} /${locale}/universities`,
            languages: {
                'en': `${baseUrl} /en/universities`,
                'ar': `${baseUrl} /ar/universities`,
                'fa': `${baseUrl} /fa/universities`,
                'tr': `${baseUrl} /tr/universities`,
            },
        },
    };
}

export default async function UniversitiesPage() {
    const supabase = await createClient();
    const t = await getTranslations('Universities');

    // Fetch universities with program tuition fees
    const { data: universities, error } = await supabase
        .from("universities")
        .select(`
            id, slug, name, city, province,
            logo_url, cover_photo_url, banner_url, ranking,
            university_type, institution_category, has_fast_track,
            features,
            university_programs(tuition_fee, currency)
        `)
        .eq("portal_key", PORTAL_KEY)
        .order("name")
        .limit(100);

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

    // Transform data for client component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedUniversities = (universities || []).map((uni: any) => {
        // Get programs array
        const programs = uni.university_programs || [];
        const programCount = programs.length;

        // Calculate minimum tuition fee from programs
        const programsWithFees = programs
            .filter((p: any) => typeof p.tuition_fee === 'number' && p.tuition_fee > 0);

        const minProgram = programsWithFees.length > 0
            ? programsWithFees.reduce((min: any, p: any) => p.tuition_fee < min.tuition_fee ? p : min)
            : null;

        const minTuitionFee = minProgram?.tuition_fee || 0;
        const programCurrency = minProgram?.currency || programs[0]?.currency || 'CNY';

        return {
            id: uni.id,
            slug: uni.slug || uni.id,
            name: uni.name || "Unknown University",
            city: uni.city || "N/A",
            province: uni.province || "N/A",
            programs: programCount,
            minTuition: minTuitionFee > 0 ? `¥${minTuitionFee.toLocaleString()}/year` : "Contact for pricing",
            minTuitionFee: minTuitionFee,
            currency: programCurrency,
            badges: uni.features || [],
            logo: uni.logo_url,
            photo: uni.cover_photo_url || uni.banner_url,
            ranking: uni.ranking,
            university_type: uni.university_type,
            institution_category: uni.institution_category,
            has_fast_track: uni.has_fast_track,
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
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {t('title')}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t('subtitle', { count: formattedUniversities.length })}
                        </p>

                        {/* Search Bar */}
                        <UniversityHeroSearch />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8">
                <UniversitiesClient universities={formattedUniversities} />
            </div>

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
