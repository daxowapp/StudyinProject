import { HeroSection } from "@/components/home/HeroSection";
import { WhyStudySection } from "@/components/home/WhyStudySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturedProgramsSection } from "@/components/home/FeaturedProgramsSection";
import { FeaturedUniversitiesSection } from "@/components/home/FeaturedUniversitiesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ScholarshipsSection } from "@/components/home/ScholarshipsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { FAQPreviewSection } from "@/components/home/FAQPreviewSection";
import { createClient } from "@/lib/supabase/server";

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

interface PageProgram {
  id: string;
  slug: string;
  title: string;
  level: string;
  duration: string;
  tuition_fee: string;
  currency: string;
  language: string;
  intake: string;
  university: {
    name: string;
    city: string;
    cover_photo_url?: string;
    logo_url?: string;
  };
}

interface PageUniversity {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  description: string;
  logo_url?: string;
  cover_photo_url?: string;
  founded: string;
  total_students: string;
  ranking: string;
  has_fast_track: boolean;
  programCount?: number;
  minTuitionFee?: number;
  currency?: string;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let formattedPrograms: PageProgram[] = [];
  let universitiesWithStats: PageUniversity[] = [];
  let user = null;

  try {
    const supabase = await createClient();

    // Fetch Featured Programs - get more for variety
    const programsPromise = supabase
      .from("v_university_programs_full")
      .select("*")
      .limit(20); // Fetch 20 to ensure diversity

    const { data: programs, error: programsError } = await Promise.race([
      programsPromise,
      new Promise<{ data: unknown[]; error: unknown }>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]).catch(() => ({ data: null, error: null }));

    if (programsError) {
      console.error("Error fetching programs:", programsError);
    }

    // OPTIMIZED: Fetch all universities in ONE query instead of N+1
    if (programs && programs.length > 0) {
      const universityIds = [...new Set((programs as { university_id: string }[]).map((p) => p.university_id))];

      const { data: universities } = await supabase
        .from("universities")
        .select("id, name, city, cover_photo_url, logo_url")
        .in("id", universityIds);

      // Helper to filter out base64 data URLs (they bloat SSR response)
      const sanitizeImageUrl = (url: string | undefined | null): string | undefined => {
        if (!url) return undefined;
        // Skip base64 images - they cause 20MB+ page sizes
        if (url.startsWith('data:')) return undefined;
        return url;
      };

      // Create a Map for O(1) lookup
      const universityMap = new Map(
        universities?.map((uni) => [uni.id, uni]) || []
      );

      // Transform data to match component props
      formattedPrograms = (programs as { id: string; slug: string; display_title: string; program_title: string; level: string; duration: string; tuition_fee: number; currency: string; language_name: string; intake: string; university_id: string; university_name: string; city: string }[]).map((p) => {
        const university = universityMap.get(p.university_id);
        return {
          id: p.id,
          slug: p.slug,
          title: p.display_title || p.program_title,
          level: p.level,
          duration: p.duration,
          tuition_fee: String(p.tuition_fee), // Convert to string
          currency: p.currency || "CNY",
          language: p.language_name,
          intake: p.intake,
          university: {
            name: university?.name || p.university_name,
            city: university?.city || p.city,
            cover_photo_url: sanitizeImageUrl(university?.cover_photo_url),
            logo_url: sanitizeImageUrl(university?.logo_url)
          }
        };
      });
    }

    // Fetch Featured Universities with timeout
    const universitiesPromise = supabase
      .from("universities")
      .select(`
        id,
        name,
        slug,
        city,
        province,
        description,
        logo_url,
        cover_photo_url,
        founded,
        total_students,
        ranking,
        has_fast_track
      `)
      .order("created_at", { ascending: false })
      .limit(8);

    const { data: universitiesData, error: universitiesError } = await Promise.race([
      universitiesPromise,
      new Promise<{ data: unknown[]; error: unknown }>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]).catch(() => ({ data: null, error: null }));

    // Fetch stats for these universities
    if (universitiesData) {
      const { data: stats } = await supabase
        .from("v_university_stats")
        .select("*")
        .in("university_id", (universitiesData as { id: string }[]).map((u) => u.id));

      // Fetch translations for universities based on locale
      const { data: translations } = await supabase
        .from("university_translations")
        .select("*")
        .in("university_id", (universitiesData as { id: string }[]).map((u) => u.id));

      const statsMap = new Map((stats as { university_id: string; program_count: number; min_tuition_fee: number; currency: string }[] | null)?.map((s) => [s.university_id, s]) || []);
      const translationsMap = new Map((translations as { university_id: string; locale: string; name: string; description: string }[] | null)?.map((t) => [`${t.university_id}_${t.locale}`, t]) || []);

      // Helper to filter out base64 data URLs (they bloat SSR response)
      const sanitizeImageUrl = (url: string | undefined | null): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('data:')) return undefined;
        return url;
      };

      universitiesWithStats = (universitiesData as { id: string; name: string; slug: string; city: string; province: string; description: string; logo_url: string; cover_photo_url: string; founded: number; total_students: number; ranking: number; has_fast_track: boolean }[]).map((uni) => {
        const stat = statsMap.get(uni.id);
        const translation = translationsMap.get(`${uni.id}_${locale}`);
        return {
          ...uni,
          name: translation?.name || uni.name,
          description: translation?.description || uni.description,
          logo_url: sanitizeImageUrl(uni.logo_url),
          cover_photo_url: sanitizeImageUrl(uni.cover_photo_url),
          founded: String(uni.founded),
          total_students: String(uni.total_students),
          ranking: String(uni.ranking),
          programCount: stat?.program_count || 0,
          minTuitionFee: stat?.min_tuition_fee,
          currency: stat?.currency || "CNY"
        };
      });
    }

    if (universitiesError) {
      console.error("Error fetching universities:", universitiesError);
    }
    // Fetch user session for conditional rendering
    const { data: { user: fetchedUser } } = await supabase.auth.getUser();
    user = fetchedUser;

  } catch (error) {
    console.error("Error in Home page:", error);
    // Continue rendering with empty data
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <WhyStudySection />
      <HowItWorksSection isLoggedIn={!!user} />
      <FeaturedProgramsSection programs={formattedPrograms} />
      <FeaturedUniversitiesSection universities={universitiesWithStats} />
      <StatsSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <PartnersSection universities={universitiesWithStats} />
      <FAQPreviewSection />
    </main>
  );
}
