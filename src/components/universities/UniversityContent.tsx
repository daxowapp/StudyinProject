"use client";

import { useState, useEffect } from "react";
import { ExpandableText } from "./ExpandableText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UniversityScholarshipsSection } from "@/components/scholarships/UniversityScholarshipsSection";
import { ScholarshipCTA } from "@/components/scholarships/ScholarshipCTA";
import { AccommodationSection } from "./AccommodationSection";
import {
    CheckCircle2, Globe, MapPin, Users, Calendar,
    GraduationCap, Clock, Languages,
    Award, TrendingUp, FileText,
    Download, ChevronRight,
    Sparkles, Video, Phone, MessageCircle
} from "lucide-react";
import { Price } from "@/components/currency/Price";
import { motion } from "framer-motion";
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
}

interface UniversityContentProps {
    university: University;
}

export function UniversityContent({ university }: UniversityContentProps) {
    const t = useTranslations('UniversityDetail');
    const [programLevel, setProgramLevel] = useState<string>("all");

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

    // Filter programs by level
    const filteredPrograms = programLevel === "all"
        ? university.programs
        : university.programs?.filter((p) => p.level === programLevel);

    return (
        <div className="container mx-auto px-4 -mt-8 pb-20">
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Content - 8 columns */}
                <div className="lg:col-span-8 space-y-8">
                    {/* About Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                            <h2 className="text-4xl font-black">{t('about')}</h2>
                        </div>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            <ExpandableText text={university.overview} maxLength={500} />
                        </div>
                    </motion.div>

                    {/* Why Choose Section */}
                    {university.highlights && university.highlights.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Sparkles className="h-8 w-8" />
                                    <h2 className="text-4xl font-black">{t('whyChooseUs')}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {university.highlights.map((highlight: string, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all group"
                                        >
                                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <p className="font-semibold text-lg">{highlight}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Scholarship CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <ScholarshipCTA />
                    </motion.div>

                    {/* Programs Section */}
                    {university.programs && university.programs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-1.5 bg-gradient-to-b from-red-600 to-yellow-600 rounded-full" />
                                    <h2 className="text-4xl font-black">{t('programs.title')}</h2>
                                </div>
                                <Badge className="bg-red-600 text-white px-4 py-2 text-lg">
                                    {filteredPrograms?.length || 0} {t('programs.title')}
                                </Badge>
                            </div>

                            {/* Program Level Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {programLevels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setProgramLevel(level)}
                                        className={`px - 6 py - 3 rounded - xl font - semibold transition - all ${programLevel === level
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-200'
                                            } `}
                                    >
                                        {level === "all" ? t('programs.allPrograms') : level}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {filteredPrograms && filteredPrograms.length > 0 ? (
                                    filteredPrograms.map((program, index) => (
                                        <motion.div
                                            key={program.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:border-red-200"
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
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500 mb-1">{t('programs.tuitionFee')}</div>
                                                        <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                                                            {program.tuition_fee && typeof program.tuition_fee === 'number' ? (
                                                                <Price amount={program.tuition_fee} currency={program.currency || 'CNY'} showCurrency={false} />
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
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500 text-lg">{t('programs.noPrograms')}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Scholarship Types Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
                    >
                        <UniversityScholarshipsSection
                            universityId={university.id}
                            universitySlug={university.slug}
                            title={t('scholarships.title')}
                            description={t('scholarships.description')}
                            showHeader={false}
                        />
                    </motion.div>

                    {/* Accommodation Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
                    >
                        <AccommodationSection
                            accommodationAvailable={university.accommodation_available ?? true}
                            accommodationDescription={university.accommodation_description}
                            accommodationFeeRange={university.accommodation_fee_range}
                            accommodationFeatures={university.accommodation_features}
                            accommodationTypes={accommodations}
                        />
                    </motion.div>

                    {/* Video Section */}
                    {university.video_url && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
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
                        </motion.div>
                    )}

                    {/* Gallery Section */}
                    {university.gallery_images && university.gallery_images.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
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
                        </motion.div>
                    )}

                    {/* Admission Requirements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
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
                    </motion.div>
                </div>

                {/* Sidebar - 4 columns */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Apply CTA - Sticky */}
                    <div className="sticky top-24 space-y-6">
                        {/* Main CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
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
                                    <Button size="lg" className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold text-lg h-14 shadow-xl">
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
                        </motion.div>

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
                                    href={university.advisor_chat_url || "https://wa.me/905492006060"}
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
