"use client";

import { useState, useEffect } from "react";
import { ExpandableText } from "./ExpandableText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UniversityScholarshipsSection } from "@/components/scholarships/UniversityScholarshipsSection";
import { ScholarshipCTA } from "@/components/scholarships/ScholarshipCTA";
import { UpcomingDeadlines } from "./UpcomingDeadlines";
import { AccommodationSection } from "./AccommodationSection";
import { UniversityMap } from "./UniversityMap";
import {
    CheckCircle2, Globe, MapPin, Users, Calendar,
    GraduationCap, Clock, Languages,
    Award, TrendingUp, FileText,
    Download, ChevronRight, ChevronLeft,
    Sparkles, Video, Phone, MessageCircle,
    HelpCircle, AlertCircle, CalendarClock
} from "lucide-react";
import { Price } from "@/components/currency/PriceDisplay";
import { differenceInDays, format, parseISO, isValid } from "date-fns";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RequestInformationDialog } from "./RequestInformationDialog";

import Image from "next/image";
import { useTranslations } from "next-intl";



interface AccommodationType {
    type: string;
    room_type?: string;
    price_cny?: number | null;
    price_usd?: number | null;
    price_min?: number | null;
    price_max?: number | null;
    currency?: string;
    billing_period?: string;
    features: string[];
    description: string;
}

interface Program {
    id: string;
    slug?: string;
    name: string;
    level: string;
    duration: string;
    language: string;
    intake: string;
    tuition: string;
    tuition_fee?: number;
    currency?: string;
    application_deadline?: string | null;
}

interface University {
    id: string;
    slug: string;
    name: string;
    overview: string;
    highlights?: string[];
    programs?: Program[];
    accommodation_available?: boolean;
    accommodation_description?: string;
    accommodation_fee_range?: string;
    accommodation_features?: string[];
    latitude?: number | string | null;
    longitude?: number | string | null;
    address?: string;
    video_url?: string;
    gallery_images?: string[];
    brochure_url?: string;
    advisor_chat_url?: string;
    virtual_tour_url?: string;
    schedule_call_url?: string;
    website?: string;
    city: string;
    province: string;
    stats: {
        founded: string;
        students: string;
        intlStudents: string;
        ranking: string;
    };
    faqs?: { question: string; answer: string }[];
}

interface UniversityContentProps {
    university: University;
}

const PROGRAMS_PER_PAGE = 10;

export function UniversityContent({ university }: UniversityContentProps) {
    const t = useTranslations('UniversityDetail');
    const [programLevel, setProgramLevel] = useState<string>("all");
    const [programLanguage, setProgramLanguage] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [programLevel, programLanguage]);

    // Get unique program levels
    const [accommodations, setAccommodations] = useState<AccommodationType[]>([]);

    useEffect(() => {
        const fetchAccommodations = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("university_accommodation")
                .select("*")
                .eq("university_id", university.id)
                .order("display_order", { ascending: true });

            setAccommodations(data || []);
        };

        fetchAccommodations();
    }, [university.id]);

    const uniqueLevels = university.programs?.map((p) => p.level) || [];
    const programLevels: string[] = ["all", ...(Array.from(new Set(uniqueLevels)) as string[])];

    // Get unique program languages
    const uniqueLanguages = university.programs?.map((p) => p.language).filter(Boolean) || [];
    const programLanguages: string[] = ["all", ...(Array.from(new Set(uniqueLanguages)) as string[])];

    // Filter programs by level AND language
    const filteredPrograms = university.programs?.filter((p) => {
        const levelMatch = programLevel === "all" || p.level === programLevel;
        const languageMatch = programLanguage === "all" || p.language === programLanguage;
        return levelMatch && languageMatch;
    });

    // Pagination
    const totalFilteredPrograms = filteredPrograms?.length || 0;
    const totalPages = Math.ceil(totalFilteredPrograms / PROGRAMS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROGRAMS_PER_PAGE;
    const endIndex = Math.min(startIndex + PROGRAMS_PER_PAGE, totalFilteredPrograms);
    const paginatedPrograms = filteredPrograms?.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="container mx-auto px-4 -mt-8 pb-20">
            {/* Quick Jump Navigation */}
            <div className="sticky top-16 z-40 -mx-4 px-4 py-3 mb-6 bg-white/80 backdrop-blur-md border-b shadow-sm">
                <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide py-1">
                    <button
                        onClick={() => document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary/10 text-foreground hover:text-primary font-medium text-sm transition-all whitespace-nowrap border border-transparent hover:border-primary/20"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">📚</span>
                        {t('quickLinks.exploreCourses')}
                    </button>
                    <button
                        onClick={() => document.getElementById('deadlines-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary/10 text-foreground hover:text-primary font-medium text-sm transition-all whitespace-nowrap border border-transparent hover:border-primary/20"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">⏰</span>
                        {t('deadlines.quickJump')}
                    </button>
                    <button
                        onClick={() => document.getElementById('scholarships-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary/10 text-foreground hover:text-primary font-medium text-sm transition-all whitespace-nowrap border border-transparent hover:border-primary/20"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">💰</span>
                        {t('quickLinks.getFunded')}
                    </button>
                    <button
                        onClick={() => document.getElementById('accommodation-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary/10 text-foreground hover:text-primary font-medium text-sm transition-all whitespace-nowrap border border-transparent hover:border-primary/20"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">🏠</span>
                        {t('quickLinks.findHousing')}
                    </button>
                    {university.latitude && university.longitude && (
                        <button
                            onClick={() => document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary/10 text-foreground hover:text-primary font-medium text-sm transition-all whitespace-nowrap border border-transparent hover:border-primary/20"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">📍</span>
                            {t('quickLinks.findLocation')}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Content - 8 columns */}
                <div className="lg:col-span-8 space-y-8">
                    {/* About Section */}
                    <div
                        className="bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-gray-100 animate-[fadeInUp_0.4s_ease-out_both]"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-1.5 bg-primary rounded-full" />
                            <h2 className="text-4xl font-bold tracking-tight">{t('about')}</h2>
                        </div>
                        <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                            <ExpandableText text={university.overview} maxLength={500} />
                        </div>
                    </div>

                    {/* Why Choose Section */}
                    {university.highlights && university.highlights.length > 0 && (
                        <div
                            className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl shadow-xl p-8 md:p-12 text-white relative overflow-hidden animate-[fadeInUp_0.4s_ease-out_0.1s_both]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Sparkles className="h-8 w-8 text-yellow-300" />
                                    <h2 className="text-3xl font-bold">{t('whyChooseUs')}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {university.highlights.map((highlight: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all group animate-[fadeInRight_0.3s_ease-out_both]"
                                            style={{ animationDelay: `${200 + index * 100}ms` }}
                                        >
                                            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-5 w-5 text-white" />
                                            </div>
                                            <p className="font-medium">{highlight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scholarship CTA */}
                    <div className="animate-[fadeInUp_0.4s_ease-out_0.15s_both]"
                    >
                        <ScholarshipCTA />
                    </div>

                    {/* Upcoming Deadlines */}
                    {university.programs && university.programs.length > 0 && (
                        <UpcomingDeadlines programs={university.programs} />
                    )}

                    {/* Programs Section */}
                    {university.programs && university.programs.length > 0 && (
                        <div
                            id="programs-section"
                            className="scroll-mt-32 animate-[fadeInUp_0.4s_ease-out_0.2s_both]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-1.5 bg-primary rounded-full" />
                                    <h2 className="text-3xl font-bold">{t('programs.title')}</h2>
                                </div>
                                <Badge variant="secondary" className="text-primary font-bold px-4 py-1.5 text-base rounded-full">
                                    {filteredPrograms?.length || 0} {t('programs.title')}
                                </Badge>
                            </div>

                            {/* Program Level Tabs */}
                            <div className="flex flex-wrap gap-2 mb-8 bg-muted/30 p-1.5 rounded-2xl w-fit">
                                {programLevels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setProgramLevel(level)}
                                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${programLevel === level
                                            ? 'bg-primary text-primary-foreground shadow-md scale-100 ring-1 ring-primary/20'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {level === "all" ? t('programs.allPrograms') : level}
                                    </button>
                                ))}
                            </div>

                            {/* Language Filter */}
                            {programLanguages.length > 2 && (
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium shrink-0">
                                        <Languages className="h-4 w-4" />
                                        {t('programs.filterByLanguage')}:
                                    </div>
                                    <div className="flex flex-wrap gap-2 bg-muted/30 p-1.5 rounded-2xl w-fit">
                                        {programLanguages.map((language) => (
                                            <button
                                                key={language}
                                                onClick={() => setProgramLanguage(language)}
                                                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${programLanguage === language
                                                    ? 'bg-green-600 text-white shadow-md scale-100 ring-1 ring-green-600/20'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                    }`}
                                            >
                                                {language === "all" ? t('programs.allLanguages') : language}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {paginatedPrograms && paginatedPrograms.length > 0 ? (
                                    paginatedPrograms.map((program, index) => (
                                        <div
                                            key={program.id}
                                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:border-red-200 animate-[fadeInRight_0.3s_ease-out_both]"
                                            style={{ animationDelay: `${100 + index * 50}ms` }}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                                        {program.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1">
                                                            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                                                            {program.level}
                                                        </Badge>
                                                        <Badge className="bg-purple-100 text-purple-700 border-0 px-3 py-1">
                                                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                            {program.duration}
                                                        </Badge>
                                                        <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1">
                                                            <Languages className="h-3.5 w-3.5 mr-1.5" />
                                                            {program.language}
                                                        </Badge>
                                                        <Badge className="bg-orange-100 text-orange-700 border-0 px-3 py-1">
                                                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                                            {program.intake}
                                                        </Badge>
                                                        {(() => {
                                                            if (!program.application_deadline) return null;
                                                            const date = parseISO(program.application_deadline);
                                                            if (!isValid(date)) return null;
                                                            const daysRemaining = differenceInDays(date, new Date());
                                                            const isExpired = daysRemaining < 0;
                                                            const isUrgent = !isExpired && daysRemaining <= 30;
                                                            return (
                                                                <Badge className={`border-0 px-3 py-1 ${
                                                                    isExpired ? 'bg-red-100 text-red-700' :
                                                                    isUrgent ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-teal-100 text-teal-700'
                                                                }`}>
                                                                    {isExpired ? <AlertCircle className="h-3.5 w-3.5 mr-1.5" /> : <CalendarClock className="h-3.5 w-3.5 mr-1.5" />}
                                                                    {isExpired ? t('programs.deadlineClosed') : t('programs.deadlineLabel', { date: format(date, 'MMM d, yyyy') })}
                                                                </Badge>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500 mb-1">{t('programs.tuitionFee')}</div>
                                                        <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                                                            {program.tuition_fee && typeof program.tuition_fee === 'number' ? (
                                                                <Price amount={program.tuition_fee} currency={program.currency || 'CNY'} showCurrency={true} />
                                                            ) : (
                                                                program.tuition || 'Contact'
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{t('programs.perYear')}</div>
                                                    </div>
                                                    <Link href={`/programs/${program.slug || program.id}`}>
                                                        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shrink-0">
                                                            {t('programs.viewProgram')}
                                                            <ChevronRight className="ml-1 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500 text-lg">{t('programs.noPrograms')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-muted-foreground">
                                        {t('programs.showing', { start: startIndex + 1, end: endIndex, total: totalFilteredPrograms })}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage <= 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            {t('programs.previousPage')}
                                        </Button>
                                        <span className="text-sm font-medium px-3">
                                            {t('programs.pageOf', { current: currentPage, total: totalPages })}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage >= totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className="gap-1"
                                        >
                                            {t('programs.nextPage')}
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Scholarship Types Section */}
                    <div
                        id="scholarships-section"
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 scroll-mt-32 animate-[fadeInUp_0.4s_ease-out_0.25s_both]"
                    >
                        <UniversityScholarshipsSection
                            universityId={university.id}
                            universitySlug={university.slug}
                            title={t('scholarships.title')}
                            description={t('scholarships.description')}
                            showHeader={false}
                        />
                    </div>

                    {/* Accommodation Section */}
                    <div
                        id="accommodation-section"
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 scroll-mt-32 animate-[fadeInUp_0.4s_ease-out_0.3s_both]"
                    >
                        <AccommodationSection
                            accommodationAvailable={university.accommodation_available ?? true}
                            accommodationDescription={university.accommodation_description}
                            accommodationFeeRange={university.accommodation_fee_range}
                            accommodationFeatures={university.accommodation_features}
                            accommodationTypes={accommodations}
                        />
                    </div>

                    {/* Location Map Section */}
                    {university.latitude && university.longitude && (
                        <div
                            id="location-section"
                            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 scroll-mt-32 animate-[fadeInUp_0.4s_ease-out_0.35s_both]"
                        >
                            <UniversityMap
                                latitude={Number(university.latitude)}
                                longitude={Number(university.longitude)}
                                name={university.name}
                                address={university.address}
                            />
                        </div>
                    )}

                    {/* Video Section */}
                    {university.video_url && (
                        <div
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-[fadeInUp_0.4s_ease-out_0.3s_both]"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                                    <h2 className="text-4xl font-black">{t('campus.tour')}</h2>
                                </div>
                            </div>
                            <div className="aspect-video bg-black">
                                {university.video_url.includes('youtube.com') || university.video_url.includes('youtu.be') ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${university.video_url.includes('youtu.be')
                                            ? university.video_url.split('youtu.be/')[1]?.split('?')[0]
                                            : university.video_url.split('v=')[1]?.split('&')[0]
                                            }`}
                                        title="University Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {/* Gallery Section */}
                    {university.gallery_images && university.gallery_images.length > 0 && (
                        <div
                            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-[fadeInUp_0.4s_ease-out_0.4s_both]"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                                <h2 className="text-4xl font-black">{t('campus.gallery')}</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {university.gallery_images.map((image: string, index: number) => (
                                    <div key={index} className="group relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-red-200 transition-all">
                                        <Image
                                            src={image}
                                            alt={`Campus ${index + 1} `}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <p className="text-white font-semibold">{t('campus.viewImage')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Admission Requirements */}
                    <div
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 animate-[fadeInUp_0.4s_ease-out_0.5s_both]"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                            <h2 className="text-4xl font-black">{t('admission.title')}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-900">
                                    <FileText className="h-6 w-6" />
                                    {t('admission.academic')}
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>{t('admission.highSchool')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>{t('admission.gpa')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>{t('admission.transcripts')}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-900">
                                    <Languages className="h-6 w-6" />
                                    {t('admission.language')}
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>{t('admission.ielts')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>{t('admission.hsk')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>{t('admission.english')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* University FAQ Section */}
                    {university.faqs && university.faqs.length > 0 && (
                        <div
                            className="bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-gray-100 animate-[fadeInUp_0.4s_ease-out_0.45s_both]"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-12 w-1.5 bg-primary rounded-full" />
                                <HelpCircle className="h-7 w-7 text-primary" />
                                <h2 className="text-3xl font-bold tracking-tight">{t('faq.title')}</h2>
                            </div>

                            <div className="space-y-3">
                                {university.faqs.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group rounded-2xl border border-gray-100 bg-gray-50/50 transition-all hover:border-primary/20 hover:bg-primary/5 open:border-primary/30 open:bg-primary/5"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer p-5 text-base font-semibold text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden">
                                            <span className="flex items-center gap-3 pr-4">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">
                                                    {index + 1}
                                                </span>
                                                {faq.question}
                                            </span>
                                            <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                                        </summary>
                                        <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 ml-10">
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - 4 columns */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Apply CTA - Sticky */}
                    <div className="sticky top-24 space-y-6">
                        {/* Main CTA */}
                        <div
                            className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden animate-[fadeInScale_0.4s_ease-out_both]"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />

                            <div className="relative z-10">
                                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                                    <GraduationCap className="h-8 w-8" />
                                </div>
                                <h3 className="text-3xl font-black mb-2">{t('sidebar.ready')}</h3>
                                <p className="text-white/90 mb-6">
                                    {t('sidebar.startJourney', { university: university.name })}
                                </p>
                                <div className="space-y-3">
                                    <Button
                                        size="lg"
                                        className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold text-lg h-14 shadow-xl"
                                        onClick={() => {
                                            const programsSection = document.getElementById('programs-section');
                                            if (programsSection) {
                                                programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                programsSection.classList.add('ring-4', 'ring-red-500', 'ring-opacity-50');
                                                setTimeout(() => programsSection.classList.remove('ring-4', 'ring-red-500', 'ring-opacity-50'), 2000);
                                            }
                                        }}
                                    >
                                        {t('sidebar.applyNow')}
                                    </Button>
                                    {university.brochure_url && (
                                        <Button size="lg" variant="outline" className="w-full border-2 border-white text-red-600 hover:bg-white/10 h-12" asChild>
                                            <a href={university.brochure_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" />
                                                {t('sidebar.downloadBrochure')}
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">{t('sidebar.quickActions')}</h3>
                            <div className="space-y-3">
                                <RequestInformationDialog
                                    universityId={university.id}
                                    universityName={university.name}
                                    trigger={
                                        <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group text-left">
                                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{t('sidebar.requestInfo')}</div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    }
                                />

                                <a
                                    href={university.advisor_chat_url || "https://wa.me/905453081000"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group text-left"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <MessageCircle className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{t('sidebar.chatAdvisor')}</div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </a>

                                {university.virtual_tour_url && (
                                    <a
                                        href={university.virtual_tour_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group text-left"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Video className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{t('sidebar.virtualTour')}</div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}

                                <a
                                    href={university.schedule_call_url || "https://booking.studyinturkiye.com/"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group text-left"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Phone className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{t('sidebar.scheduleCall')}</div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">{t('sidebar.quickFacts')}</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, label: t('sidebar.location'), value: `${university.city}, ${university.province} `, color: "text-red-600" },
                                    { icon: Calendar, label: t('sidebar.founded'), value: university.stats.founded, color: "text-blue-600" },
                                    { icon: Users, label: t('sidebar.students'), value: university.stats.students, color: "text-purple-600" },
                                    { icon: TrendingUp, label: t('sidebar.international'), value: university.stats.intlStudents, color: "text-green-600" },
                                    { icon: Award, label: t('sidebar.ranking'), value: university.stats.ranking, color: "text-yellow-600" },
                                ].map((fact, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <fact.icon className={`h - 5 w - 5 ${fact.color} `} />
                                            <span className="text-sm text-gray-600">{fact.label}</span>
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">{fact.value}</span>
                                    </div>
                                ))}
                            </div>
                            {university.website && (
                                <Link href={university.website} target="_blank">
                                    <Button variant="outline" className="w-full mt-4">
                                        <Globe className="h-4 w-4 mr-2" />
                                        {t('sidebar.officialWebsite')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
