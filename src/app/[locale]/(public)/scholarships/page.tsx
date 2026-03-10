import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { ScholarshipPageContent } from "@/components/scholarships/ScholarshipPageContent";
import { Award, GraduationCap, MapPin, Building2, BookOpen, Clock, ArrowRight, Languages } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';
const PORTAL_KEY = process.env.NEXT_PUBLIC_PORTAL_KEY || 'studyatchina';

// Force dynamic rendering to ensure fresh data from DB views (especially for new columns like is_popular)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;

    const title = 'China Scholarships | Search Scholarship Programs Online';
    const description = 'Browse scholarship programs at top Chinese universities. Filter by coverage, city, degree, and benefits. Find full and partial scholarships with accommodation and stipend.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/scholarships`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/scholarships`,
            languages: {
                'en': `${baseUrl}/en/scholarships`,
                'ar': `${baseUrl}/ar/scholarships`,
                'fa': `${baseUrl}/fa/scholarships`,
                'tr': `${baseUrl}/tr/scholarships`,
            },
        },
    };
}

export default async function ScholarshipsPage() {
    const supabase = await createClient();
    const t = await getTranslations('Scholarships');

    // Fetch ALL scholarship programs from the new view bypassing the 1000 PostgREST limit
    let allPrograms: Record<string, unknown>[] = [];
    let pageOffset = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data: chunk, error } = await supabase
            .from("v_scholarship_programs")
            .select("*, is_popular, csca_exam_require")
            .eq("portal_key", PORTAL_KEY)
            .eq("is_active", true)
            .range(pageOffset, pageOffset + pageSize - 1);

        if (error) {
            console.error("Error fetching scholarship programs:", error);
            break;
        }

        if (chunk && chunk.length > 0) {
            allPrograms = [...allPrograms, ...chunk];
            pageOffset += pageSize;
        } else {
            hasMore = false;
        }
        
        // Stop if we got less than requested, meaning we reached the end
        if (chunk && chunk.length < pageSize) {
            hasMore = false;
        }
    }
    
    const scholarshipPrograms = allPrograms;

    // Fetch university logos separately (view may not include them)
    const universityIds = [...new Set((scholarshipPrograms || []).map((p) => p.university_id as string))];

    const { data: universities } = universityIds.length > 0
        ? await supabase
            .from("universities")
            .select("id, logo_url")
            .in("id", universityIds)
        : { data: [] };

    const logoMapObj: Record<string, string | null> = {};
    (universities || []).forEach((u: { id: string; logo_url: string | null }) => {
        logoMapObj[u.id] = u.logo_url;
    });

    // Transform data
    const formattedPrograms = (scholarshipPrograms || []).map((p: Record<string, unknown>) => ({
        program_id: p.program_id as string,
        program_slug: p.program_slug as string,
        display_title: p.display_title as string,
        program_title: p.program_title as string,
        level: p.level as string,
        duration: p.duration as string,
        tuition_fee: p.tuition_fee as number,
        currency: p.currency as string,
        language_name: p.language_name as string,
        intake: p.intake as string,
        category: p.category as string,
        field: p.field as string,
        university_id: p.university_id as string,
        university_name: p.university_name as string,
        university_slug: p.university_slug as string,
        city: p.city as string,
        province: p.province as string,
        scholarship_id: p.scholarship_id as string,
        scholarship_type: p.scholarship_type as string,
        scholarship_display_name: p.scholarship_display_name as string,
        tuition_coverage_percentage: p.tuition_coverage_percentage as number,
        includes_accommodation: p.includes_accommodation as boolean,
        accommodation_type: p.accommodation_type as string | null,
        includes_stipend: p.includes_stipend as boolean,
        stipend_amount_monthly: p.stipend_amount_monthly as number | null,
        includes_medical_insurance: p.includes_medical_insurance as boolean,
        service_fee_usd: p.service_fee_usd as number,
        service_fee_cny: p.service_fee_cny as number,
        student_pays_tuition: p.student_pays_tuition as number,
        is_popular: p.is_popular as boolean || false,
        csca_exam_require: p.csca_exam_require as boolean || false,
    }));

    // Stats for hero
    const uniqueUniversities = new Set(formattedPrograms.map(p => p.university_id)).size;
    const uniquePrograms = new Set(formattedPrograms.map(p => p.program_id)).size;
    
    // Get Popular Scholarships (one per university to avoid spamming the same programs)
    const popularScholarshipsRaw = formattedPrograms.filter(p => p.is_popular === true);
    const popularScholarshipsMAP = new Map();
    for (const p of popularScholarshipsRaw) {
        if (!popularScholarshipsMAP.has(p.university_id) || p.tuition_coverage_percentage > popularScholarshipsMAP.get(p.university_id).tuition_coverage_percentage) {
            popularScholarshipsMAP.set(p.university_id, p);
        }
    }
    const popularScholarships = Array.from(popularScholarshipsMAP.values()).slice(0, 4);

    console.log("TOTAL RAW:", formattedPrograms.length, "POPULAR RAW:", popularScholarshipsRaw.length, "POPULAR FINAL:", popularScholarships.length);


    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Scholarships', url: `${baseUrl}/scholarships` }
                ]}
            />

            {/* Hero Section */}
            <div className="bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl">
                        <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 font-medium px-4 py-1.5 border-primary/20">
                            {t('badge')}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
                            {t('subtitle')}
                        </p>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                                <div className="text-3xl font-bold text-primary mb-1">{formattedPrograms.length}</div>
                                <div className="text-sm font-medium text-muted-foreground">{t('stats.scholarshipOptions')}</div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                                <div className="text-3xl font-bold text-primary mb-1">{uniqueUniversities}</div>
                                <div className="text-sm font-medium text-muted-foreground">{t('stats.universities')}</div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                                <div className="text-3xl font-bold text-primary mb-1">{uniquePrograms}</div>
                                <div className="text-sm font-medium text-muted-foreground">{t('stats.programs')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Scholarships Feature */}
            {popularScholarships.length > 0 && (
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-600 p-1.5 rounded-md">🔥</span> 
                        {t('popular.title', { fallback: 'Featured & Popular Scholarships' })}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularScholarships.map(p => (
                            <a key={`${p.program_id}-${p.scholarship_id}`} href={`/scholarships/${p.program_slug}`} className="block group">
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden h-full flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <Award className="w-16 h-16" />
                                    </div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm border p-1 shrink-0 flex items-center justify-center overflow-hidden">
                                           {logoMapObj[p.university_id] ? (
                                                <img src={logoMapObj[p.university_id] as string} alt={p.university_name as string} className="w-full h-full object-contain" />
                                           ) : (
                                                <Award className="w-6 h-6 text-primary/40" />
                                           )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors">{p.program_title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.university_name}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium">
                                                {p.tuition_coverage_percentage}% {t('search.coverage', { fallback: 'Tuition' })}
                                            </Badge>
                                            {p.includes_stipend && (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium">
                                                    + {t('search.stipend', { fallback: 'Stipend' })}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabbed Content */}
            <ScholarshipPageContent programs={formattedPrograms} logoMap={logoMapObj} />
        </div>
    );
}
