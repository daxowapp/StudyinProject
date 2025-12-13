import { ProgramsClient } from "@/components/programs/ProgramsClient";
import { ProgramsWrapper } from "@/components/programs/ProgramsWrapper";
import { AISearchBar } from "@/components/ai/AISearchBar";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { CscaCtaSection } from "@/components/home/CscaCtaSection";

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
    searchParams: Promise<{ university?: string }>;
}) {
    const supabase = await createClient();
    const t = await getTranslations('Programs');
    const params = await searchParams;
    const universitySlug = params.university;

    // Build query - if university filter is provided, fetch only that university's programs
    let query = supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("portal_key", PORTAL_KEY)
        .eq("is_active", true);

    if (universitySlug) {
        // Filter by university slug on server side
        query = query.eq("university_slug", universitySlug);
    } else {
        // Only limit if no specific university is requested
        query = query.limit(200);
    }

    const { data: programs, error } = await query;

    if (error) {
        console.error("Error fetching programs:", error);
    }

    // Fetch universities for slug mapping
    const { data: universities } = await supabase
        .from("universities")
        .select("name, slug, has_fast_track")
        .eq("portal_key", PORTAL_KEY);

    const universityMap = universities?.reduce((acc: Record<string, string>, uni: { slug: string; name: string }) => {
        acc[uni.slug] = uni.name;
        return acc;
    }, {}) || {};

    const fastTrackMap = universities?.reduce((acc: Record<string, boolean>, uni: { slug: string; has_fast_track: boolean }) => {
        acc[uni.slug] = uni.has_fast_track;
        return acc;
    }, {}) || {};

    // Transform data to match ProgramCard props
    const formattedPrograms = programs?.map((p: { id: string; slug: string; display_title: string; program_title: string; university_name: string; university_slug: string; city: string; level: string; duration: string; tuition_fee: number; currency: string; intake: string; language_name: string; category: string; scholarship_chance: string }) => ({
        id: p.id,
        slug: p.slug,
        name: p.display_title || p.program_title,
        university: p.university_name,
        university_slug: p.university_slug, // Add slug for filtering
        city: p.city,
        level: p.level,
        duration: p.duration,
        tuition: `${p.tuition_fee} ${p.currency}/Year`,
        tuition_fee: p.tuition_fee, // Raw number for Price component
        currency: p.currency || 'CNY', // Currency code
        deadline: p.intake,
        badges: [p.language_name, p.level].filter(Boolean),
        category: p.category,
        scholarship_chance: p.scholarship_chance,
        has_fast_track: fastTrackMap[p.university_slug] || false,
    })) || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section with AI Search */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t('subtitle', { count: formattedPrograms.length })}
                        </p>

                        {/* AI-Powered Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <AISearchBar
                                placeholder="Try: 'Master's in Computer Science under 30,000 RMB'"
                                className="shadow-lg"
                            />
                            <p className="text-xs text-muted-foreground mt-3">
                                ✨ AI-powered search - describe what you&apos;re looking for in your own words
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ProgramsWrapper>
                <ProgramsClient programs={formattedPrograms} universityMap={universityMap} />
            </ProgramsWrapper>

            <CscaCtaSection />
        </div>
    );
}

