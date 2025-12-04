"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Sparkles, GraduationCap, Globe, Award, TrendingUp, ChevronDown, Zap, HeartPulse, Code } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function HeroSection() {
    const t = useTranslations('Hero');
    const router = useRouter();
    const [filters, setFilters] = useState({
        degree: "",
        field: "",
        city: "",
        language: "",
        budget: "",
        scholarship: "",
        duration: ""
    });

    const handleSearch = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "any" && value !== "all") {
                params.append(key, value);
            }
        });
        router.push(`/programs?${params.toString()}`);
    };

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900">
            {/* Animated Background with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-600/20 via-red-900 to-red-950" />

                <Image
                    src="/hero-bg.png"
                    alt="Study in China"
                    fill
                    className="object-cover mix-blend-soft-light opacity-20"
                    priority
                />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

                {/* Floating Orbs - China Colors */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.25, 0.45, 0.25]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
                />
            </motion.div>

            <motion.div style={{ opacity }} className="container relative z-10 mx-auto px-4 md:px-6 pt-24 pb-12">
                <div className="flex flex-col items-center text-center space-y-6 max-w-5xl mx-auto">

                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl px-6 py-2.5 text-sm font-semibold text-white shadow-2xl border border-white/20"
                    >
                        <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                        <span className="tracking-wide">{t('admissionsOpen')}</span>
                        <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    </motion.div>

                    {/* Hero Heading with Gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter font-heading text-white drop-shadow-2xl">
                            {t('title')}
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-base md:text-xl text-white/90 font-light max-w-2xl leading-relaxed drop-shadow-lg"
                    >
                        {t.rich('subtitle', {
                            bold: (chunks) => <span className="font-bold text-yellow-300">{chunks}</span>
                        })}
                    </motion.p>



                    {/* Enhanced Search Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="w-full max-w-5xl mt-12"
                    >
                        <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-2xl border border-white/50">
                            {/* Search Tabs */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {[t('tabs.programs'), t('tabs.universities'), t('tabs.scholarships')].map((tab) => (
                                    <button
                                        key={tab}
                                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold text-sm whitespace-nowrap first:bg-red-600 hover:bg-red-700 transition-colors"
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Search Fields Grid - All Equal Width */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Degree Level */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, degree: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.degree')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bachelor">Bachelor&apos;s</SelectItem>
                                            <SelectItem value="master">Master&apos;s</SelectItem>
                                            <SelectItem value="phd">PhD</SelectItem>
                                            <SelectItem value="diploma">Diploma</SelectItem>
                                            <SelectItem value="language">Language Course</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Field of Study */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, field: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.field')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="business">Business & Economics</SelectItem>
                                            <SelectItem value="engineering">Engineering</SelectItem>
                                            <SelectItem value="medicine">Medicine</SelectItem>
                                            <SelectItem value="cs">Computer Science</SelectItem>
                                            <SelectItem value="arts">Arts & Humanities</SelectItem>
                                            <SelectItem value="science">Natural Sciences</SelectItem>
                                            <SelectItem value="law">Law</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* City/Location */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, city: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.city')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')} City</SelectItem>
                                            <SelectItem value="beijing">Beijing</SelectItem>
                                            <SelectItem value="shanghai">Shanghai</SelectItem>
                                            <SelectItem value="guangzhou">Guangzhou</SelectItem>
                                            <SelectItem value="shenzhen">Shenzhen</SelectItem>
                                            <SelectItem value="hangzhou">Hangzhou</SelectItem>
                                            <SelectItem value="nanjing">Nanjing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Language */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, language: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.language')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')} Language</SelectItem>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="chinese">Chinese</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Budget */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, budget: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.budget')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')} Budget</SelectItem>
                                            <SelectItem value="0-3000">Under $3,000</SelectItem>
                                            <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                                            <SelectItem value="5000-8000">$5,000 - $8,000</SelectItem>
                                            <SelectItem value="8000+">Above $8,000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Scholarship */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, scholarship: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.scholarship')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('options.all')} Programs</SelectItem>
                                            <SelectItem value="available">Scholarship Available</SelectItem>
                                            <SelectItem value="full">Full Scholarship</SelectItem>
                                            <SelectItem value="partial">Partial Scholarship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Duration */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, duration: v })}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.duration')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')} Duration</SelectItem>
                                            <SelectItem value="1">1 Year</SelectItem>
                                            <SelectItem value="2">2 Years</SelectItem>
                                            <SelectItem value="3">3 Years</SelectItem>
                                            <SelectItem value="4">4 Years</SelectItem>
                                            <SelectItem value="5+">5+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <Button
                                onClick={handleSearch}
                                className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all rounded-xl group"
                            >
                                <Search className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                {t.rich('searchButton', {
                                    bold: (chunks) => <span className="font-black mx-1">{chunks}</span>
                                })}
                            </Button>

                            {/* Quick Search Tags */}
                            <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-slate-200">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('browseByCategory')}</span>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={() => router.push('/programs?field=business&degree=master')}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-medium transition-all hover:scale-105 border border-slate-200 hover:border-red-200"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        MBA Programs
                                    </button>
                                    <button
                                        onClick={() => router.push('/programs?field=engineering&degree=bachelor')}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-medium transition-all hover:scale-105 border border-slate-200 hover:border-red-200"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Engineering
                                    </button>
                                    <button
                                        onClick={() => router.push('/programs?field=medicine&degree=bachelor')}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-medium transition-all hover:scale-105 border border-slate-200 hover:border-red-200"
                                    >
                                        <HeartPulse className="w-4 h-4" />
                                        Medicine (MBBS)
                                    </button>
                                    <button
                                        onClick={() => router.push('/programs?field=cs&degree=bachelor')}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-medium transition-all hover:scale-105 border border-slate-200 hover:border-red-200"
                                    >
                                        <Code className="w-4 h-4" />
                                        Computer Science
                                    </button>
                                    <button
                                        onClick={() => router.push('/programs?scholarship=full')}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-medium transition-all hover:scale-105 border border-slate-200 hover:border-red-200"
                                    >
                                        <Award className="w-4 h-4" />
                                        Full Scholarship
                                    </button>
                                    <button
                                        onClick={() => router.push('/programs?language=english')}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 text-sm font-medium transition-all hover:scale-105 border border-slate-200 hover:border-red-200"
                                    >
                                        <Globe className="w-4 h-4" />
                                        English Taught
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats with Enhanced Design */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 w-full max-w-3xl"
                    >
                        {[
                            { icon: GraduationCap, value: "500+", label: t('stats.universities'), color: "text-yellow-400" },
                            { icon: Globe, value: "50k+", label: t('stats.students'), color: "text-yellow-300" },
                            { icon: Award, value: "98%", label: t('stats.success'), color: "text-amber-400" },
                            { icon: TrendingUp, value: "$2M+", label: t('stats.scholarships'), color: "text-orange-400" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + index * 0.1 }}
                                className="flex flex-col items-center text-white"
                            >
                                <stat.icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                                <span className="text-xl md:text-2xl font-black font-heading">{stat.value}</span>
                                <span className="text-xs opacity-70 mt-1">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center gap-2 text-white/60 cursor-pointer hover:text-white/90 transition-colors"
                        >
                            <span className="text-sm font-medium">{t('scrollToExplore')}</span>
                            <ChevronDown className="h-6 w-6" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
