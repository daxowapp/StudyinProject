import { HeroSection } from "@/components/home/HeroSection";
import { WhyStudySection } from "@/components/home/WhyStudySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { PORTAL_KEY } from "@/lib/constants/portal";

// Lazy load below-fold sections for faster initial page load
const FeaturedProgramsSection = dynamic(
  () => import("@/components/home/FeaturedProgramsSection").then(mod => ({ default: mod.FeaturedProgramsSection })),
  { ssr: true }
);
const FeaturedUniversitiesSection = dynamic(
  () => import("@/components/home/FeaturedUniversitiesSection").then(mod => ({ default: mod.FeaturedUniversitiesSection })),
  { ssr: true }
);
const CscaCtaSection = dynamic(
  () => import("@/components/home/CscaCtaSection").then(mod => ({ default: mod.CscaCtaSection })),
  { ssr: true }
);

import { LazyHomeSections } from '@/components/home/LazyHomeSections';

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
    has_fast_track?: boolean;
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
  [key: string]: unknown;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let formattedPrograms: PageProgram[] = [];
  let universitiesWithStats: PageUniversity[] = [];
  let user = null;

  try {
    const supabase = await createClient();

    // 1. Start Fast Track Fetch
    const fastTrackPromise = supabase
      .from("universities")
      .select("id")
      .eq("portal_key", PORTAL_KEY)
      .eq("has_fast_track", true);

    // 2. Start Featured Universities Fetch
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
      .eq("portal_key", PORTAL_KEY)
      .order("created_at", { ascending: false })
      .limit(8);

    // 3. Start User Session Fetch
    const userPromise = supabase.auth.getUser();

    // Await 1 & 2 & 3 in parallel
    const [fastTrackResult, universitiesResult, userResult] = await Promise.all([
      fastTrackPromise,
      universitiesPromise,
      userPromise
    ]);

    const fastTrackUnis = fastTrackResult.data;
    const universitiesData = universitiesResult.data;
    const universitiesError = universitiesResult.error;
    user = userResult.data.user;

    // 4. Process Fast Track Programs if IDs exist
    interface Program {
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
      university_id: string;
      university_name: string;
      city: string;
    }
    const fastTrackIds = fastTrackUnis?.map(u => u.id) || [];
    let programs: Program[] | null = null;
    let programsError = null;

    if (fastTrackIds.length > 0) {
      const { data, error } = await supabase
        .from("v_university_programs_full")
        .select("id, slug, display_title, program_title, level, duration, tuition_fee, currency, language_name, intake, university_id, university_name, city")
        .eq("portal_key", PORTAL_KEY)
        .in('university_id', fastTrackIds)
        .limit(80);

      programs = data as unknown as Program[];
      programsError = error;
    }

    if (programsError) {
      console.error("Error fetching programs:", programsError);
    }

    // Process Programs
    let randomPrograms = programs ? [...programs] : [];
    if (randomPrograms.length > 0) {
      // Shuffle
      for (let i = randomPrograms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomPrograms[i], randomPrograms[j]] = [randomPrograms[j], randomPrograms[i]];
      }
      // Take top 40 after shuffle
      randomPrograms = randomPrograms.slice(0, 40);

      // Fetch Universities for Programs (Optimized: Single Query)
      const universityIds = [...new Set(randomPrograms.map((p) => p.university_id))];
      const { data: programUniversities } = await supabase
        .from("universities")
        .select("id, name, city, cover_photo_url, logo_url, has_fast_track")
        .in("id", universityIds);

      // Helper to filter out base64
      const sanitizeImageUrl = (url: string | undefined | null, id?: string): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('data:')) return id ? `/api/university-cover/${id}` : undefined;
        return url;
      };

      const universityMap = new Map(programUniversities?.map((uni) => [uni.id, uni]) || []);

      formattedPrograms = randomPrograms.map((p) => {
        const university = universityMap.get(p.university_id);
        return {
          id: p.id,
          slug: p.slug,
          title: p.display_title || p.program_title,
          level: p.level,
          duration: p.duration,
          tuition_fee: String(p.tuition_fee),
          currency: p.currency || "CNY",
          language: p.language_name,
          intake: p.intake,
          university: {
            name: university?.name || p.university_name,
            city: university?.city || p.city,
            cover_photo_url: sanitizeImageUrl(university?.cover_photo_url, university?.id),
            logo_url: university?.logo_url,
            has_fast_track: university?.has_fast_track
          }
        };
      });
    }

    // Process Universities (with Stats & Translations)
    if (universitiesData) {
      // Fetch stats and translations in parallel
      const uniIds = universitiesData.map(u => u.id);
      const [statsResult, translationsResult] = await Promise.all([
        supabase.from("v_university_stats").select("*").in("university_id", uniIds),
        supabase.from("university_translations").select("*").in("university_id", uniIds)
      ]);

      const stats = statsResult.data;
      const translations = translationsResult.data;

      // Define interfaces for stats and translations to avoid 'any'
      interface UniStat { university_id: string; program_count: number; min_tuition_fee: number; currency: string; }
      interface UniTranslation { university_id: string; locale: string; name: string; description: string; }

      const statsMap = new Map((stats as unknown as UniStat[] || []).map((s) => [s.university_id, s]));
      const translationsMap = new Map((translations as unknown as UniTranslation[] || []).map((t) => [`${t.university_id}_${locale}`, t]));

      const sanitizeImageUrl = (url: string | undefined | null, id?: string): string | undefined => {
        if (!url) return undefined;
        if (url.startsWith('data:')) return id ? `/api/university-cover/${id}` : undefined;
        return url;
      };

      universitiesWithStats = universitiesData.map((uni) => {
        const stat = statsMap.get(uni.id);
        const translation = translationsMap.get(`${uni.id}_${locale}`);
        return {
          ...uni,
          name: translation?.name || uni.name,
          description: translation?.description || uni.description,
          logo_url: uni.logo_url,
          cover_photo_url: sanitizeImageUrl(uni.cover_photo_url, uni.id),
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

  } catch (error) {
    console.error("Error in Home page:", error);
  }

  return (
    <main className="min-h-screen bg-background">
      <OrganizationJsonLd />
      <HeroSection />
      <WhyStudySection />
      <HowItWorksSection isLoggedIn={!!user} />
      <FeaturedProgramsSection programs={formattedPrograms} />
      <FeaturedUniversitiesSection universities={universitiesWithStats} />
      <CscaCtaSection />
      <LazyHomeSections universities={universitiesWithStats} />
    </main>
  );
}
