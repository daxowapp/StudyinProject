"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, ArrowRight, Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Price } from "@/components/currency/Price";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Program {
    id: string;
    slug?: string;
    title: string;
    level: string;
    duration: string;
    tuition_fee: string;
    currency?: string;
    language?: string;
    intake?: string;
    university: {
        name: string;
        city: string;
        cover_photo_url?: string;
        logo_url?: string;
    } | {
        name: string;
        city: string;
        cover_photo_url?: string;
        logo_url?: string;
        [key: string]: unknown;
    };
}

interface FeaturedProgramsSectionProps {
    programs?: Program[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function FeaturedProgramsSection({ programs = [] }: FeaturedProgramsSectionProps) {
    const t = useTranslations('FeaturedPrograms');
    const [shuffledPrograms, setShuffledPrograms] = useState<Program[]>(programs);

    // Shuffle programs on client side with diversity (different universities)
    useEffect(() => {
        const shuffleWithDiversity = (array: Program[]) => {
            if (array.length === 0) return [];

            // First, shuffle the entire array
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Then, ensure diversity by spacing out programs from same university
            const result: Program[] = [];
            const usedUniversities = new Set<string>();
            const remaining: Program[] = [];

            // First pass: pick one from each university
            for (const program of shuffled) {
                const uniName = typeof program.university === 'string'
                    ? program.university
                    : program.university?.name || '';

                if (!usedUniversities.has(uniName)) {
                    result.push(program);
                    usedUniversities.add(uniName);
                } else {
                    remaining.push(program);
                }
            }

            // Second pass: add remaining programs
            return [...result, ...remaining];
        };

        if (programs.length > 0) {
            setShuffledPrograms(shuffleWithDiversity(programs));
        }
    }, [programs]);

    // Fallback if no programs provided (e.g. error or loading)
    const displayPrograms = shuffledPrograms.length > 0 ? shuffledPrograms.slice(0, 4) : [];

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/20 font-semibold text-sm mb-4">
                        <Star className="h-4 w-4 text-red-600" />
                        <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Programs Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                >
                    {displayPrograms.map((program) => (
                        <motion.div
                            key={program.id}
                            variants={item}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="group flex flex-col overflow-hidden h-full border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                                {/* Image Section with Overlay */}
                                <div className="relative h-48 overflow-hidden">
                                    {program.university?.cover_photo_url ? (
                                        <Image
                                            src={program.university.cover_photo_url}
                                            alt={program.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* University Logo */}
                                    {program.university?.logo_url && (
                                        <div className="absolute top-4 left-4">
                                            <div className="w-14 h-14 rounded-xl bg-white shadow-xl flex items-center justify-center p-2 border-2 border-white/50">
                                                <Image
                                                    src={program.university.logo_url}
                                                    alt={program.university.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Level Badge */}
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-xs shadow-lg px-3 py-1.5">
                                            {program.level}
                                        </Badge>
                                    </div>

                                    {/* University Info */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white text-sm font-bold drop-shadow-lg mb-1 truncate">
                                            {program.university?.name}
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-white/90 shrink-0" />
                                            <p className="text-white/90 text-xs font-medium">{program.university?.city}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Program Title */}
                                    <h3 className="font-bold text-xl leading-tight mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-red-600 transition-colors">
                                        {program.title}
                                    </h3>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="secondary" className="text-xs font-semibold">
                                            {program.level}
                                        </Badge>
                                        {program.language && (
                                            <Badge variant="outline" className="text-xs font-semibold border-blue-200 text-blue-700">
                                                🗣️ {program.language}
                                            </Badge>
                                        )}
                                        {program.intake && (
                                            <Badge variant="outline" className="text-xs font-semibold border-green-200 text-green-700">
                                                📅 {program.intake}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Info Grid */}
                                    <div className="space-y-3 mb-5">
                                        {/* Duration */}
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">{t('duration')}</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{program.duration}</p>
                                            </div>
                                        </div>

                                        {/* Tuition */}
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                                                <span className="text-white font-bold text-lg">💰</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">{t('tuition')}</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    <Price amount={parseFloat(program.tuition_fee)} currency={program.currency || 'CNY'} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="mt-auto">
                                        <Link href={`/programs/${program.slug || program.id}`} className="block">
                                            <Button
                                                size="lg"
                                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                            >
                                                {t('explore')}
                                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <Link href="/programs">
                        <Button size="lg" variant="outline" className="rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold">
                            {t('viewAll')}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
