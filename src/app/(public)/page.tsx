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
  let universities: any[] = [];

  try {
    const supabase = await createClient();

    // Fetch Featured Programs with timeout
    const programsPromise = supabase
      .from("v_university_programs_full")
      .select(`
        id,
        slug,
        display_title,
        program_title,
        level,
        duration,
        tuition_fee,
        university:universities(name, city)
      `)
      .order("created_at", { ascending: false })
      .limit(4);

    const { data: programs, error: programsError } = await Promise.race([
      programsPromise,
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]).catch(() => ({ data: null, error: null }));

    if (programsError) {
      console.error("Error fetching programs:", programsError);
    }

    // Transform data to match component props
    formattedPrograms = programs?.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.display_title || p.program_title,
      level: p.level,
      duration: p.duration,
      tuition_fee: p.tuition_fee,
      university: { name: p.university_name, city: p.city }
    })) || [];

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
        founded,
        total_students,
        ranking
      `)
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: universitiesData, error: universitiesError } = await Promise.race([
      universitiesPromise,
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]).catch(() => ({ data: null, error: null }));

    if (universitiesError) {
      console.error("Error fetching universities:", universitiesError);
    }

    universities = universitiesData || [];
  } catch (error) {
    console.error("Error in Home page:", error);
    // Continue rendering with empty data
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyStudySection />
      <HowItWorksSection />
      <FeaturedProgramsSection programs={formattedPrograms} />
      <FeaturedUniversitiesSection universities={universities || []} />
      <StatsSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <PartnersSection />
      <FAQPreviewSection />
    </div>
  );
}
