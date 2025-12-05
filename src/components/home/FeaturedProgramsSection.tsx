"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, ArrowRight, Star, GraduationCap, Globe } from "lucide-react";
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
                                <Card className="h-full overflow-hidden border hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-white">
                                    {/* Top accent */}
                                    <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

                                    <CardContent className="p-5">
                                        {/* University Header */}
                                        <div className="flex items-start gap-3 mb-4">
                                            {program.university?.logo_url ? (
                                                <div className="relative w-12 h-12 rounded-lg border bg-white shadow-sm shrink-0 overflow-hidden">
                                                    <Image
                                                        src={program.university.logo_url}
                                                        alt={program.university.name}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                                                    <GraduationCap className="h-6 w-6 text-white" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm text-foreground truncate">
                                                    {program.university?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {program.university?.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Program Title */}
                                        <h3 className="font-semibold text-base leading-tight mb-3 line-clamp-2 min-h-[2.75rem] group-hover:text-primary transition-colors">
                                            {program.title}
                                        </h3>

                                        {/* Badges Row */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5">
                                                {program.level}
                                            </Badge>
                                            {program.language && (
                                                <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5">
                                                    <Globe className="h-2.5 w-2.5 mr-0.5" />
                                                    {program.language}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 pt-3 border-t">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {t('duration')}
                                                </span>
                                                <span className="font-medium">{program.duration}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">{t('tuition')}</span>
                                                <span className="font-semibold text-primary">
                                                    <Price amount={parseFloat(program.tuition_fee)} currency={program.currency || 'CNY'} />
                                                </span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-4 pt-3 border-t">
                                            <div className="flex items-center justify-between text-sm text-primary font-medium group-hover:font-semibold transition-all">
                                                <span>{t('explore')}</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
