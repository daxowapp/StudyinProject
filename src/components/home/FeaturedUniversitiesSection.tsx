"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Award, ArrowRight, Trophy, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useState } from "react";
import { Price } from "@/components/currency/PriceDisplay";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface University {
    id: string;
    name: string;
    slug: string;
    city: string;
    province?: string;
    description: string;
    logo_url?: string;
    cover_photo_url?: string;
    founded?: string;
    total_students?: string;
    ranking?: string;
    has_fast_track?: boolean;
    programCount?: number;
    minTuitionFee?: number;
    currency?: string;
}

interface FeaturedUniversitiesSectionProps {
    universities?: University[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

export function FeaturedUniversitiesSection({ universities = [] }: FeaturedUniversitiesSectionProps) {
    const t = useTranslations('FeaturedUniversities');
    const displayUniversities = universities.length > 0 ? universities : [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(displayUniversities.length / itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const visibleUniversities = displayUniversities.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

    return (
        <section className="py-16 bg-muted/20 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/20 font-semibold text-sm mb-4">
                        <Trophy className="h-4 w-4 text-red-600" />
                        <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Universities Carousel */}
                <div className="relative">
                    <motion.div
                        key={currentIndex}
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                        style={{ gridAutoRows: '1fr' }}
                    >
                        {visibleUniversities.map((uni) => (
                            <motion.div
                                key={uni.id}
                                variants={item}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="flex"
                            >
                                <Card className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer border-0 rounded-2xl shadow-lg bg-white flex flex-col w-full">
                                    <CardContent className="p-0 flex flex-col flex-1">
                                        {/* Image Banner */}
                                        <Link href={`/universities/${uni.slug}`}>
                                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 shrink-0">
                                                {(() => {
                                                    const PLACEHOLDER_IMAGES = [
                                                        "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop", // Existing
                                                        "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop", // Library
                                                        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop", // Campus
                                                        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop", // Students
                                                        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600&auto=format&fit=crop", // Architecture
                                                        "https://images.unsplash.com/photo-1590012314607-6da59983c8b6?q=80&w=600&auto=format&fit=crop"  // Modern building
                                                    ];

                                                    const getPlaceholder = (id: string, name: string) => {
                                                        const str = id + name;
                                                        let hash = 0;
                                                        for (let i = 0; i < str.length; i++) {
                                                            hash = str.charCodeAt(i) + ((hash << 5) - hash);
                                                        }
                                                        const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
                                                        return PLACEHOLDER_IMAGES[index];
                                                    };

                                                    const imgSrc = uni.cover_photo_url || getPlaceholder(uni.id, uni.name);

                                                    return (
                                                        <Image
                                                            src={imgSrc}
                                                            alt={uni.name}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                            unoptimized={imgSrc.startsWith('http') || imgSrc.startsWith('data:')}
                                                        />
                                                    );
                                                })()}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                {/* Ranking Badge */}
                                                {uni.has_fast_track && (
                                                    <div className="absolute top-3 left-3">
                                                        <div className="px-2 py-1 rounded-full bg-yellow-400 text-yellow-950 text-xs font-bold shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center gap-1 border border-yellow-300">
                                                            <Zap className="w-3 h-3 animate-pulse fill-yellow-950" />
                                                            {t('fastTrack')}
                                                        </div>
                                                    </div>
                                                )}
                                                {uni.ranking && (
                                                    <div className="absolute top-3 right-3 max-w-[45%]">
                                                        <div className="px-2.5 py-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 border border-amber-300">
                                                            <Award className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="truncate">{uni.ranking}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-start gap-3 mb-2">
                                                {uni.logo_url && (
                                                    <Link href={`/universities/${uni.slug}`}>
                                                        <div className="relative w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1 shrink-0 hover:border-red-300 transition-colors">
                                                            <Image
                                                                src={uni.logo_url}
                                                                alt={uni.name}
                                                                fill
                                                                className="object-contain p-1"
                                                                unoptimized={uni.logo_url.startsWith('data:')}
                                                            />
                                                        </div>
                                                    </Link>
                                                )}
                                                <Link href={`/universities/${uni.slug}`} className="flex-1">
                                                    <h3 className="font-bold text-lg line-clamp-1 min-h-[1.75rem] group-hover:text-red-600 transition-colors">
                                                        {uni.name}
                                                    </h3>
                                                </Link>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                                <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                                                <span className="truncate">{uni.city}{uni.province && `, ${uni.province}`}</span>
                                            </div>

                                            {/* Stats - Fixed height */}
                                            <div className="space-y-2 mb-4 min-h-[4rem]">
                                                {uni.programCount !== undefined && uni.programCount > 0 && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">{t('programs')}</span>
                                                        <span className="font-semibold">{uni.programCount}+</span>
                                                    </div>
                                                )}
                                                {uni.minTuitionFee !== undefined && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">{t('tuitionFrom')}</span>
                                                        <span className="font-semibold">
                                                            <Price amount={uni.minTuitionFee} currency={uni.currency || 'CNY'} />
                                                        </span>
                                                    </div>
                                                )}
                                                {!uni.minTuitionFee && uni.total_students && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">{t('students')}</span>
                                                        <span className="font-semibold">{uni.total_students}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description & Button - Push to bottom */}
                                            <div className="pt-4 border-t mt-auto">
                                                {uni.description && (
                                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                                                        {uni.description.length > 150
                                                            ? `${uni.description.substring(0, 150)}...`
                                                            : uni.description}
                                                    </p>
                                                )}
                                                <Link href={`/universities/${uni.slug}`} className="block">
                                                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg">
                                                        {t('viewDetails')}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Navigation Buttons */}
                    {totalPages > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 hidden lg:flex items-center justify-center"
                                aria-label="Previous universities"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 hidden lg:flex items-center justify-center"
                                aria-label="Next universities"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Pagination Dots */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'w-8 bg-red-600'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <Link href="/universities">
                        <Button size="lg" variant="outline" className="rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold">
                            {t('viewAll')}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section >
    );
}
