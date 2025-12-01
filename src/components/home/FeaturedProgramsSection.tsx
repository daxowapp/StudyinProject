"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, MapPin, ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Program {
    id: string;
    slug?: string;
    title: string;
    level: string;
    duration: string;
    tuition_fee: string;
    currency?: string;
    university: {
        name: string;
        city: string;
        cover_photo_url?: string;
        logo_url?: string;
    } | any;
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
    // Fallback if no programs provided (e.g. error or loading)
    const displayPrograms = programs.length > 0 ? programs : [];

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
                        <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">Featured Programs</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        Popular Programs
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Explore our most sought-after programs at China's top universities
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
                    {displayPrograms.map((program, index) => (
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
                                        <img
                                            src={program.university.cover_photo_url}
                                            alt={program.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* University Logo */}
                                    {program.university?.logo_url && (
                                        <div className="absolute top-4 left-4">
                                            <div className="w-14 h-14 rounded-xl bg-white shadow-xl flex items-center justify-center p-2 border-2 border-white/50">
                                                <img
                                                    src={program.university.logo_url}
                                                    alt={program.university.name}
                                                    className="w-full h-full object-contain"
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
                                    <h3 className="font-bold text-xl leading-tight mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-red-600 transition-colors">
                                        {program.title}
                                    </h3>

                                    {/* Info Grid */}
                                    <div className="space-y-3 mb-5">
                                        {/* Duration */}
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Duration</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{program.duration}</p>
                                            </div>
                                        </div>

                                        {/* Tuition */}
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                                                <span className="text-white font-bold text-lg">{program.currency === "USD" ? "$" : "¥"}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Tuition/Year</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {program.currency === "USD" ? "$" : "¥"}{program.tuition_fee?.toLocaleString()}
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
                                                Explore Program
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
                            View All Programs
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
