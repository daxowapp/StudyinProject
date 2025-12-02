import { UniversityHeader } from "@/components/universities/UniversityHeader";
import { UniversityContent } from "@/components/universities/UniversityContent";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: university, error } = await supabase
        .from("universities")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !university) {
        notFound();
    }

    // Fetch programs using the new view
    const { data: programs, error: programsError } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("university_id", university.id)
        .eq("is_active", true);

    console.log("University ID:", university.id);
    console.log("Programs fetched:", programs);
    console.log("Programs error:", programsError);

    const formattedPrograms = programs?.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.display_title || p.program_title,
        level: p.level,
        duration: p.duration,
        tuition: `${p.tuition_fee} ${p.currency}`,
        tuition_fee: p.tuition_fee, // Raw number for Price component
        currency: p.currency || 'CNY', // Currency code
        language: p.language_name || "Not specified",
        intake: p.intake || "Contact university",
    })) || [];

    const universityData = {
        id: university.id,
        slug: university.slug,
        name: university.name,
        nameLocal: university.name_local || university.name,
        city: university.city,
        province: university.province,
        website: university.website,
        logo_url: university.logo_url,
        cover_photo_url: university.cover_photo_url,
        gallery_images: university.gallery_images || [],
        badges: university.features || [],
        stats: {
            founded: university.founded || "N/A",
            students: university.total_students || "N/A",
            ranking: university.ranking || "N/A",
            intlStudents: university.international_students || "N/A",
            programs: formattedPrograms.length.toString() + "+",
            acceptance: "15%"
        },
        overview: university.description || "No description available.",
        highlights: university.features || [],
        programs: formattedPrograms,
        video_url: university.video_url,
        latitude: university.latitude,
        longitude: university.longitude,
        accommodation_available: university.accommodation_available,
        accommodation_description: university.accommodation_description,
        accommodation_fee_range: university.accommodation_fee_range,
        accommodation_features: university.accommodation_features,
        accommodation_types: university.accommodation_types,
        has_fast_track: university.has_fast_track,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <UniversityHeader university={universityData} />
            <UniversityContent university={universityData} />
        </div>
    );
}
