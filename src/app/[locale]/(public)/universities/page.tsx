import { UniversitiesClient } from "@/components/universities/UniversitiesClient";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { UniversityHeroSearch } from "@/components/universities/UniversityHeroSearch";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

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

    // Fetch universities from optimized view
    const { data: universities, error } = await supabase
        .from("v_universities_search")
        .select("*")
        .order("name");

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
    const formattedUniversities = (universities || []).map((uni) => {
        return {
            id: uni.id,
            slug: uni.slug || uni.id,
            name: uni.name || "Unknown University",
            city: uni.city || "N/A",
            province: uni.province || "N/A",
            programs: uni.program_count || 0,
            minTuition: uni.min_tuition_fee ? `${uni.currency === "USD" ? "$" : "¥"}${uni.min_tuition_fee.toLocaleString()}` : "Contact for pricing",
            minTuitionFee: uni.min_tuition_fee, // Raw number for Price component
            currency: uni.currency || 'CNY', // Currency code
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
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
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
        </div>
    );
}
