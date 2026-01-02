import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { WhyStudySection } from "@/components/home/WhyStudySection";
import { FeaturedProgramsSection } from "@/components/home/FeaturedProgramsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturedUniversitiesSection } from "@/components/home/FeaturedUniversitiesSection";
import { ScholarshipsSection } from "@/components/home/ScholarshipsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { FAQPreviewSection } from "@/components/home/FAQPreviewSection";

export default function Home() {
    return (
        <div className="flex flex-col gap-0">
            <HeroSection />
            <StatsSection />
            <WhyStudySection />
            <FeaturedProgramsSection />
            <HowItWorksSection />
            <FeaturedUniversitiesSection />
            <ScholarshipsSection />
            <TestimonialsSection />
            <PartnersSection />
            <FAQPreviewSection />
        </div>
    );
}
