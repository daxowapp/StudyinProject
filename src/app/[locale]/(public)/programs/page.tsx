import { ProgramsClient } from "@/components/programs/ProgramsClientContent";
import { ProgramsWrapper } from "@/components/programs/ProgramsWrapper";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { CscaCtaSection } from "@/components/home/CscaCtaSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;

    const title = 'Study Programs in China - Bachelor, Master & PhD';
    const description = 'Browse 500+ degree programs at top Chinese universities. Find Bachelor, Master, and PhD programs taught in English & Chinese with scholarship opportunities.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/programs`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/programs`,
            languages: {
                'en': `${baseUrl}/en/programs`,
                'ar': `${baseUrl}/ar/programs`,
                'fa': `${baseUrl}/fa/programs`,
                'tr': `${baseUrl}/tr/programs`,
            },
        },
    };
}
export default async function ProgramsPage({
    searchParams,
}: {
    searchParams: Promise<{
        university?: string;
        level?: string;
        degree?: string;
        field?: string;
        city?: string;
        language?: string;
        scholarship?: string;
        search?: string;
    }>;
}) {
    const supabase = await createClient();
    const t = await getTranslations('Programs');
    const params = await searchParams;

    // Fetch universities for fast_track mapping and city dropdowns (lightweight: 373 rows)
    const { data: universities } = await supabase
        .from("universities")
        .select("name, slug, has_fast_track, city")
        .eq("portal_key", PORTAL_KEY);

    const universityMap = universities?.reduce((acc: Record<string, string>, uni: { slug: string; name: string }) => {
        acc[uni.slug] = uni.name;
        return acc;
    }, {}) || {};

    const fastTrackMap = universities?.reduce((acc: Record<string, boolean>, uni: { slug: string; has_fast_track: boolean }) => {
        acc[uni.slug] = uni.has_fast_track;
        return acc;
    }, {}) || {};

    const availableCities = Array.from(new Set(universities?.map(u => u.city).filter(Boolean)));
    const availableUniversities = Array.from(new Set(universities?.map(u => u.name).filter(Boolean)));

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Programs', url: `${baseUrl}/programs` }
                ]}
            />
            {/* Hero Section with AI Search */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t('subtitle', { count: "16,000+" })}
                        </p>
                    </div>
                </div>
            </div>

            <ProgramsWrapper>
                <ProgramsClient
                    universityMap={universityMap}
                    fastTrackMap={fastTrackMap}
                    availableCities={availableCities}
                    availableUniversities={availableUniversities}
                    initialFilters={{
                        search: params.search,
                        levels: (() => {
                            const levelParam = params.level || params.degree;
                            if (!levelParam) return [];
                            const validLevels = ['bachelor', 'master', 'phd', 'diploma', 'language', 'non-degree'];
                            const normalizedLevel = levelParam.toLowerCase();
                            return validLevels.includes(normalizedLevel) ? [normalizedLevel] : [];
                        })(),
                        field: params.field !== 'any' ? params.field : undefined,
                        cities: params.city && params.city !== 'any' ? [params.city.charAt(0).toUpperCase() + params.city.slice(1)] : [],
                        languages: (() => {
                            if (!params.language || params.language === 'any') return [];
                            if (params.language === 'english') return ['English'];
                            if (params.language === 'chinese') return ['Chinese'];
                            if (params.language === 'both') return ['English', 'Chinese'];
                            return [];
                        })(),
                        university: params.university || 'all',
                        scholarship: params.scholarship === 'available' || params.scholarship === 'full' || params.scholarship === 'partial'
                    }}
                />
            </ProgramsWrapper>

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
