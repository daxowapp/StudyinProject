import { UniversityHeader } from "@/components/universities/UniversityHeader";
import { UniversityContent } from "@/components/universities/UniversityContent";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { UniversityJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
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

    const { data: university } = await supabase
        .from("universities")
        .select("name, description, city, province, cover_photo_url")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    if (!university) {
        return {
            title: 'University Not Found',
        };
    }

    const title = `${university.name} - Programs, Fees & How to Apply`;
    const description = university.description?.slice(0, 160) ||
        `Study at ${university.name} in ${university.city}, China. Explore programs, scholarships, and application requirements.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/universities/${slug}`,
            type: 'website',
            images: university.cover_photo_url ? [
                {
                    url: university.cover_photo_url,
                    width: 1200,
                    height: 630,
                    alt: university.name,
                },
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: university.cover_photo_url ? [university.cover_photo_url] : undefined,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/universities/${slug}`,
            languages: {
                'en': `${baseUrl}/en/universities/${slug}`,
                'ar': `${baseUrl}/ar/universities/${slug}`,
                'fa': `${baseUrl}/fa/universities/${slug}`,
                'tr': `${baseUrl}/tr/universities/${slug}`,
            },
        },
    };
}
export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: university } = await supabase
        .from("universities")
        .select("*")
        .eq("slug", slug)
        .eq("portal_key", PORTAL_KEY)
        .single();

    if (!university) {
        notFound();
    }

    // Fetch programs using the new view
    const { data: programs } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("university_id", university.id)
        .eq("is_active", true);

    const formattedPrograms = programs?.map((p: unknown) => {
        const prog = p as {
            id: string;
            slug: string;
            display_title: string;
            program_title: string;
            level: string;
            duration: string;
            tuition_fee: number;
            currency: string;
            language_name: string;
            intake: string;
        };
        return {
            id: prog.id,
            slug: prog.slug,
            name: prog.display_title || prog.program_title,
            level: prog.level,
            duration: prog.duration,
            tuition: `${prog.tuition_fee} ${prog.currency}`,
            tuition_fee: prog.tuition_fee, // Raw number for Price component
            currency: prog.currency || 'CNY', // Currency code
            language: prog.language_name || "Not specified",
            intake: prog.intake || "Contact university",
        };
    }) || [];

    // Fetch translations in parallel for better performance
    const { locale } = await params;
    const [translationResult, accommodationResult] = await Promise.all([
        supabase
            .from("university_translations")
            .select("*")
            .eq("university_id", university.id)
            .eq("locale", locale)
            .single(),
        supabase
            .from("accommodation_translations")
            .select("*")
            .eq("university_id", university.id)
            .eq("locale", locale)
            .single()
    ]);

    const translation = translationResult.data;
    const accommodationTranslation = accommodationResult.data;

    const universityData = {
        id: university.id,
        slug: university.slug,
        name: translation?.name || university.name,
        nameLocal: university.name_local || university.name,
        city: university.city,
        province: university.province,
        website: university.website,
        logo_url: university.logo_url,
        cover_photo_url: university.cover_photo_url,
        gallery_images: university.gallery_images || [],
        badges: translation?.features || university.features || [],
        stats: {
            founded: university.founded || "N/A",
            students: university.total_students || "N/A",
            ranking: university.ranking || "N/A",
            intlStudents: university.international_students || "N/A",
            programs: formattedPrograms.length.toString() + "+",
            acceptance: "15%"
        },
        overview: translation?.description || university.description || "No description available.",
        highlights: translation?.features || university.features || [],
        programs: formattedPrograms,
        video_url: university.video_url,
        latitude: university.latitude,
        longitude: university.longitude,
        accommodation_available: university.accommodation_available,
        accommodation_description: accommodationTranslation?.accommodation_description || university.accommodation_description,
        accommodation_fee_range: university.accommodation_fee_range,
        accommodation_features: accommodationTranslation?.accommodation_features || university.accommodation_features,
        accommodation_types: accommodationTranslation?.accommodation_types || university.accommodation_types,
        has_fast_track: university.has_fast_track,
        brochure_url: university.brochure_url,
        virtual_tour_url: university.virtual_tour_url,
        schedule_call_url: university.schedule_call_url,
        advisor_chat_url: university.advisor_chat_url,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <UniversityJsonLd
                name={universityData.name}
                url={`${baseUrl}/en/universities/${universityData.slug}`}
                logo={universityData.logo_url}
                description={universityData.overview}
                address={{ city: universityData.city, province: universityData.province }}
                foundingDate={universityData.stats.founded}
                numberOfStudents={parseInt(universityData.stats.students) || undefined}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Universities', url: `${baseUrl}/en/universities` },
                    { name: universityData.name, url: `${baseUrl}/en/universities/${universityData.slug}` },
                ]}
            />
            <UniversityHeader university={universityData} />
            <UniversityContent university={universityData} />
            <CscaCtaSection />
        </div>
    );
}
