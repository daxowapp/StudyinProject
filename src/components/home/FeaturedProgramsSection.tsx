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
    university: {
        name: string;
        city: string;
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
                            <Card className="group flex flex-col overflow-hidden h-full border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={`https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop`} // Placeholder for now
                                        alt={program.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Badges */}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge
                                            className="bg-white text-slate-900 border-0 font-semibold text-xs shadow-md"
                                        >
                                            {program.level}
                                        </Badge>
                                    </div>

                                    {/* University Name */}
                                    <div className="absolute bottom-3 left-3">
                                        <p className="text-white text-xs font-semibold">{program.university?.name}</p>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg leading-tight mb-4 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {program.title}
                                    </h3>

                                    {/* Info Grid */}
                                    <div className="space-y-2 mb-4 flex-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-red-600" />
                                            <span className="text-muted-foreground">{program.university?.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-purple-600" />
                                            <span className="text-muted-foreground">{program.duration} • {program.level}</span>
                                        </div>
                                    </div>

                                    {/* Price & Button */}
                                    <div className="pt-4 border-t flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">From</p>
                                            <p className="text-xl font-black text-red-600">
                                                {program.tuition_fee}
                                            </p>
                                        </div>
                                        <Link href={`/programs/${program.slug || program.id}`}>
                                            <Button
                                                size="sm"
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                            >
                                                View Program
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
