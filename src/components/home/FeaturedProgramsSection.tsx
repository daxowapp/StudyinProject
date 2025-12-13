"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, ArrowRight, Star, GraduationCap, Globe, Zap } from "lucide-react";
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
        has_fast_track?: boolean;
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

            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            const result: Program[] = [];
            const usedUniversities = new Set<string>();
            const remaining: Program[] = [];

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

            return [...result, ...remaining];
        };

        if (programs.length > 0) {
            setShuffledPrograms(shuffleWithDiversity(programs));
        }
    }, [programs]);

    const displayPrograms = shuffledPrograms.length > 0 ? shuffledPrograms.slice(0, 4) : [];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14 max-w-2xl mx-auto"
                >
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        <Star className="h-3 w-3 mr-1 fill-primary" />
                        {t('badge')}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Programs Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                >
                    {displayPrograms.map((program) => (
                        <motion.div
                            key={program.id}
                            variants={item}
                            className="group"
                        >
                            <Link href={`/programs/${program.slug || program.id}`}>
                                <Card className="h-full overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group rounded-2xl">
                                    <CardContent className="p-6">
                                        {/* University Header */}
                                        <div className="flex items-start gap-4 mb-5">
                                            {program.university?.logo_url ? (
                                                <div className="relative w-14 h-14 rounded-xl border border-gray-100 bg-white shadow-sm shrink-0 overflow-hidden group-hover:shadow-md transition-shadow">
                                                    <Image
                                                        src={program.university.logo_url}
                                                        alt={program.university.name}
                                                        fill
                                                        className="object-contain p-1.5"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                                                    <GraduationCap className="h-7 w-7" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1 pt-1">
                                                <p className="font-bold text-sm text-foreground truncate leading-tight mb-1">
                                                    {program.university?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-primary/70" />
                                                    {program.university?.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Program Title */}
                                        <h3 className="font-bold text-lg leading-snug mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors text-slate-800">
                                            {program.title}
                                        </h3>

                                        {/* Badges Row */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {program.university?.has_fast_track && (
                                                <Badge className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 border shadow-sm">
                                                    <Zap className="h-3 w-3 mr-1 fill-amber-500 text-amber-600" />
                                                    {t('fastTrack')}
                                                </Badge>
                                            )}
                                            <Badge variant="secondary" className="text-[10px] font-medium px-2.5 py-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                {program.level}
                                            </Badge>
                                            {program.language && (
                                                <Badge variant="outline" className="text-[10px] font-medium px-2.5 py-0.5 text-slate-500">
                                                    <Globe className="h-3 w-3 mr-1" />
                                                    {program.language}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-3 pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-400" />
                                                    {t('duration')}
                                                </span>
                                                <span className="font-semibold text-slate-700">{program.duration}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10">
                                                        <span className="text-[10px] font-bold text-primary">¥</span>
                                                    </div>
                                                    {t('tuition')}
                                                </span>
                                                <span className="font-bold text-primary text-base">
                                                    <Price amount={parseFloat(program.tuition_fee)} currency={program.currency || 'CNY'} />
                                                </span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-5 pt-4 border-t border-dashed border-slate-200">
                                            <div className="flex items-center justify-between text-sm text-primary font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                                                <span>{t('explore')}</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
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
                        <Button size="lg" variant="outline" className="border-2 font-medium">
                            {t('viewAll')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
