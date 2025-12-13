"use client";

import dynamic from 'next/dynamic';

const StatsSection = dynamic(() => import("./StatsSection").then(mod => ({ default: mod.StatsSection })), { ssr: false });
const ScholarshipsSection = dynamic(() => import("./ScholarshipsSection").then(mod => ({ default: mod.ScholarshipsSection })), { ssr: false });
const TestimonialsSection = dynamic(() => import("./TestimonialsSection").then(mod => ({ default: mod.TestimonialsSection })), { ssr: false });
const PartnersSection = dynamic(() => import("./PartnersSection").then(mod => ({ default: mod.PartnersSection })), { ssr: false });
const FAQPreviewSection = dynamic(() => import("./FAQPreviewSection").then(mod => ({ default: mod.FAQPreviewSection })), { ssr: false });

interface University {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    // other props if needed by PartnersSection, but it only strictly needs id, name, slug, logo_url
    // We can use any to bypass strict type check for the wrapper if we want to avoid importing types,
    // or we can reproduce the interface. Since it's passed down, 'any' or a loose interface is often fine for a wrapper.
    [key: string]: unknown;
}

export function LazyHomeSections({ universities }: { universities: University[] }) {
    return (
        <>
            <StatsSection />
            <ScholarshipsSection />
            <TestimonialsSection />
            <PartnersSection universities={universities} />
            <FAQPreviewSection />
        </>
    );
}
