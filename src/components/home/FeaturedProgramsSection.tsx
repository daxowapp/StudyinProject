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
                            <Card className="group flex flex-col overflow-hidden h-full border-none rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-card">
                                {/* Gradient Top Bar */}
                                <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />
                                
                                {/* Image Section */}
                                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
                                    {program.university?.cover_photo_url ? (
                                        <img
                                            src={program.university.cover_photo_url}
                                            alt={program.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <img
                                            src={`https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop`}
                                            alt={program.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Level Badge */}
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-white/95 backdrop-blur-sm text-slate-900 border-0 font-bold text-xs shadow-lg px-3 py-1">
                                            {program.level}
                                        </Badge>
                                    </div>

                                    {/* University Name */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-white text-sm font-bold drop-shadow-lg truncate">
                                            {program.university?.name}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3 text-white/90" />
                                            <p className="text-white/90 text-xs font-medium">{program.university?.city}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-red-600 transition-colors">
                                        {program.title}
                                    </h3>

                                    {/* Duration Info */}
                                    <div className="flex items-center gap-2 text-sm mb-4 p-2.5 bg-muted/50 rounded-lg">
                                        <Clock className="h-4 w-4 text-red-600 shrink-0" />
                                        <span className="text-muted-foreground font-medium">{program.duration}</span>
                                    </div>

                                    {/* Price Section */}
                                    <div className="mt-auto pt-4 border-t border-dashed">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium mb-0.5">Tuition Fee</p>
                                                <p className="text-2xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                                    {program.currency === "USD" ? "$" : "¥"}{program.tuition_fee?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/programs/${program.slug || program.id}`} className="block">
                                            <Button
                                                size="sm"
                                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all group"
                                            >
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
