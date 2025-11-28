"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, GraduationCap, Users, Award, ArrowRight, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface University {
    id: string;
    name: string;
    slug: string;
    city: string;
    province?: string;
    description: string;
    logo_url?: string;
    founded?: string;
    total_students?: string;
    ranking?: string;
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
    const displayUniversities = universities.length > 0 ? universities : [];

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
                        <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">Top Universities</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        Elite Universities
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Study at China's most prestigious institutions
                    </p>
                </motion.div>

                {/* Universities Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                >
                    {displayUniversities.map((uni, index) => (
                        <motion.div
                            key={uni.id}
                            variants={item}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer border-0 rounded-2xl shadow-lg bg-white h-full">
                                <CardContent className="p-0">
                                    {/* Image Banner */}
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={uni.logo_url || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop"}
                                            alt={uni.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* Ranking Badge */}
                                        {uni.ranking && (
                                            <div className="absolute top-3 right-3">
                                                <div className="px-2 py-1 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md">
                                                    {uni.ranking}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                                            {uni.name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <MapPin className="h-4 w-4 text-red-600" />
                                            <span>{uni.city}{uni.province && `, ${uni.province}`}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="space-y-2 mb-4">
                                            {uni.founded && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Founded</span>
                                                    <span className="font-semibold">{uni.founded}</span>
                                                </div>
                                            )}
                                            {uni.total_students && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Students</span>
                                                    <span className="font-semibold">{uni.total_students}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description & Button */}
                                        <div className="pt-4 border-t">
                                            {uni.description && (
                                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                                    {uni.description}
                                                </p>
                                            )}
                                            <Link href={`/universities/${uni.slug}`} className="block">
                                                <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
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
                    <Link href="/universities">
                        <Button size="lg" variant="outline" className="rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold">
                            View All Universities
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section >
    );
}
