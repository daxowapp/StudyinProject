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

export default async function Home() {
  let formattedPrograms: any[] = [];
  let universitiesWithStats: any[] = [];

  try {
    const supabase = await createClient();

    // Fetch Featured Programs - get more for variety
    const programsPromise = supabase
      .from("v_university_programs_full")
      .select("*")
      .limit(20); // Fetch 20 to ensure diversity

    const { data: programs, error: programsError } = await Promise.race([
      programsPromise,
      new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]).catch(() => ({ data: null, error: null }));

    if (programsError) {
      console.error("Error fetching programs:", programsError);
    }

    // Fetch university details including cover photos
    const programsWithUniversities = await Promise.all(
      (programs || []).map(async (p: any) => {
        const { data: uni } = await supabase
          .from("universities")
          .select("name, city, cover_photo_url, logo_url")
          .eq("id", p.university_id)
          .single();

        return {
          ...p,
          university: uni || { name: p.university_name, city: p.city, cover_photo_url: null, logo_url: null }
        };
      })
    );

    // Transform data to match component props
    formattedPrograms = programsWithUniversities.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.display_title || p.program_title,
      level: p.level,
      duration: p.duration,
      tuition_fee: p.tuition_fee,
      currency: p.currency || "CNY",
      language: p.language_name,
      intake: p.intake,
      university: {
        name: p.university?.name || p.university_name,
        city: p.university?.city || p.city,
        cover_photo_url: p.university?.cover_photo_url,
        logo_url: p.university?.logo_url
      }
    }));

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
      new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]).catch(() => ({ data: null, error: null }));

    // Fetch stats for these universities
    if (universitiesData) {
      const { data: stats } = await supabase
        .from("v_university_stats")
        .select("*")
        .in("university_id", universitiesData.map((u: any) => u.id));

      const statsMap = new Map(stats?.map((s: any) => [s.university_id, s]) || []);

      universitiesWithStats = universitiesData.map((uni: any) => {
        const stat = statsMap.get(uni.id);
        return {
          ...uni,
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
    // Continue rendering with empty data
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <WhyStudySection />
      <HowItWorksSection />
      <FeaturedProgramsSection programs={formattedPrograms} />
      <FeaturedUniversitiesSection universities={universitiesWithStats} />
      <StatsSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <PartnersSection />
      <FAQPreviewSection />
    </main>
  );
}
