"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Sparkles, GraduationCap, Globe, Award, TrendingUp, ChevronDown, Zap, HeartPulse, Code, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export function HeroSection() {
    const t = useTranslations('Hero');
    const tNavbar = useTranslations('Navbar');
    const tPrograms = useTranslations('Programs');

    const router = useRouter();
    const locale = useLocale();
    const isRTL = locale === 'ar' || locale === 'fa';

    // Initial State
    const [filters, setFilters] = useState({
        degree: "",
        field: "",
        city: "",
        language: "",
        budget: "",
        scholarship: "",
        duration: ""
    });

    interface FilterOptions {
        degrees: string[];
        fields: string[];
        cities: string[];
        languages: string[];
        durations: string[];
    }

    const [availableOptions, setAvailableOptions] = useState<FilterOptions>({
        degrees: [],
        fields: [],
        cities: [],
        languages: [],
        durations: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    // Debounce filter updating
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Helper to map DB values to translation keys
    const getLevelKey = (level: string): string | null => {
        const l = level.toLowerCase();
        if (l.includes('bachelor')) return 'bachelor';
        if (l.includes('master')) return 'master';
        if (l.includes('phd') || l.includes('doctor')) return 'phd';
        if (l.includes('diploma')) return 'diploma';
        if (l.includes('language') || l.includes('non-degree')) return 'language';
        return null;
    };

    const getFieldKey = (field: string): string | null => {
        const l = field.toLowerCase();
        if (l.includes('business') || l.includes('economic') || l.includes('management')) return 'business';
        if (l.includes('engineering') || l.includes('technology')) return 'engineering';
        if (l.includes('medicine') || l.includes('health') || l.includes('clinical') || l.includes('mbbs')) return 'medicine';
        if (l.includes('arts') || l.includes('humanities') || l.includes('design')) return 'arts';
        if (l.includes('science') && !l.includes('computer')) return 'science';
        if (l.includes('computer') || l.includes('it') || l.includes('software')) return 'cs';
        if (l.includes('education')) return 'education';
        if (l.includes('law')) return 'law';
        return null;
    };

    // Deduplicate options by their translation key
    const getUniqueDegrees = () => {
        const seen = new Set<string>();
        return availableOptions.degrees.filter((degree) => {
            const key = getLevelKey(degree) || degree;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    const getUniqueFields = () => {
        const seen = new Set<string>();
        return availableOptions.fields.filter((field) => {
            const key = getFieldKey(field) || field;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    // Function to fetch options - defined outside useEffect to be callable
    const [hasFetchedOptions, setHasFetchedOptions] = useState(false);

    const fetchOptions = useCallback(async (currentFilters: Partial<typeof filters>) => {
        setIsLoadingOptions(true);
        try {
            const { getFilterOptions } = await import('@/app/actions/getFilterOptions');
            const options = await getFilterOptions(currentFilters);
            setAvailableOptions(options);
            setHasFetchedOptions(true);
        } catch (error) {
            console.error("Failed to fetch filter options", error);
        } finally {
            setIsLoadingOptions(false);
        }
    }, []);

    // Lazy fetch - only when user interacts with filters
    const handleDropdownOpen = useCallback(() => {
        if (!hasFetchedOptions) {
            fetchOptions({});
        }
    }, [hasFetchedOptions, fetchOptions]);

    // Update options when filters change (debounced) - only if already fetched
    useEffect(() => {
        if (!hasFetchedOptions) return;
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, hasFetchedOptions]);

    useEffect(() => {
        if (!hasFetchedOptions) return;
        fetchOptions(debouncedFilters);
    }, [debouncedFilters, fetchOptions, hasFetchedOptions]);


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

    return (
        <section ref={ref} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900">
            {/* Background with CSS-based animations - no parallax for performance */}
            <div className="absolute inset-0 z-0">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-600/20 via-red-900 to-red-950" />

                <Image
                    src="/hero-bg.png"
                    alt="Study in China"
                    fill
                    className="object-cover mix-blend-soft-light opacity-20"
                    priority
                    loading="eager"
                    sizes="100vw"
                />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

                {/* Floating Orbs - CSS Animations (no framer-motion) */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-orb-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-orb-float-delayed" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-orb-float-slow" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-24 pb-12">
                <div className="flex flex-col items-center text-center space-y-6 max-w-5xl mx-auto">

                    {/* Premium Badge - CSS Animation */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl px-6 py-2.5 text-sm font-semibold text-white shadow-2xl border border-white/20 animate-fade-in">
                        <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                        <span className="tracking-wide">{t('admissionsOpen')}</span>
                        <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    </div>

                    {/* Hero Heading - CSS Animation */}
                    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter font-heading text-white drop-shadow-2xl">
                            {t('title')}
                        </h1>
                    </div>

                    <p className="text-base md:text-xl text-white/90 font-light max-w-2xl leading-relaxed drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {t.rich('subtitle', {
                            bold: (chunks) => <span className="font-bold text-yellow-300">{chunks}</span>
                        })}
                    </p>




                    {/* Enhanced Search Widget - CSS Animation */}
                    <div className="w-full max-w-5xl mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-2xl border border-white/50" dir={isRTL ? 'rtl' : 'ltr'}>
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
                                    <Select
                                        value={filters.degree}
                                        onValueChange={(v) => setFilters({ ...filters, degree: v })}
                                        onOpenChange={handleDropdownOpen}
                                    >
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.degree')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')}</SelectItem>
                                            {getUniqueDegrees().map((degree: string) => {
                                                const key = getLevelKey(degree);
                                                return (
                                                    <SelectItem key={degree} value={degree}>
                                                        {key ? tNavbar(`levels.${key}.title`) : degree}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Field of Study */}
                                <div className="w-full">
                                    <Select
                                        value={filters.field}
                                        onValueChange={(v) => setFilters({ ...filters, field: v })}
                                        onOpenChange={handleDropdownOpen}
                                    >
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.field')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')}</SelectItem>
                                            {getUniqueFields().map((field: string) => {
                                                const key = getFieldKey(field);
                                                return (
                                                    <SelectItem key={field} value={field}>
                                                        {key ? tPrograms(`filters.fields.${key}`) : field}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* City/Location */}
                                <div className="w-full">
                                    <Select
                                        value={filters.city}
                                        onValueChange={(v) => setFilters({ ...filters, city: v })}
                                        onOpenChange={handleDropdownOpen}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.city')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoadingOptions ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                </div>
                                            ) : (
                                                <>
                                                    <SelectItem value="any">{t('options.any')} {t('placeholders.city')}</SelectItem>
                                                    {availableOptions.cities.map((city: string) => (
                                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                                    ))}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Language */}
                                <div className="w-full">
                                    <Select
                                        value={filters.language}
                                        onValueChange={(v) => setFilters({ ...filters, language: v })}
                                        onOpenChange={handleDropdownOpen}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.language')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoadingOptions ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                </div>
                                            ) : (
                                                <>
                                                    <SelectItem value="any">{t('options.any')} {t('placeholders.language')}</SelectItem>
                                                    {availableOptions.languages.map((lang: string) => (
                                                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                                    ))}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Budget */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, budget: v })} disabled={isLoading}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.budget')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')} {t('placeholders.budget')}</SelectItem>
                                            <SelectItem value="0-3000">Under $3,000</SelectItem>
                                            <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                                            <SelectItem value="5000-8000">$5,000 - $8,000</SelectItem>
                                            <SelectItem value="8000+">Above $8,000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Scholarship */}
                                <div className="w-full">
                                    <Select onValueChange={(v) => setFilters({ ...filters, scholarship: v })} disabled={isLoading}>
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
                                    <Select onValueChange={(v) => setFilters({ ...filters, duration: v })} disabled={isLoading}>
                                        <SelectTrigger className="w-full h-12 bg-white border-2 border-slate-200 text-foreground font-medium text-sm rounded-xl hover:border-red-500 transition-colors">
                                            <SelectValue placeholder={t('placeholders.duration')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t('options.any')} {t('placeholders.duration')}</SelectItem>
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
                                disabled={isLoading}
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
                    </div>

                    {/* Stats with Enhanced Design - CSS Animation */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 w-full max-w-3xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {[
                            { icon: GraduationCap, value: "500+", label: t('stats.universities'), color: "text-yellow-400" },
                            { icon: Globe, value: "50k+", label: t('stats.students'), color: "text-yellow-300" },
                            { icon: Award, value: "98%", label: t('stats.success'), color: "text-amber-400" },
                            { icon: TrendingUp, value: "$2M+", label: t('stats.scholarships'), color: "text-orange-400" }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-white"
                            >
                                <stat.icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                                <span className="text-xl md:text-2xl font-black font-heading">{stat.value}</span>
                                <span className="text-xs opacity-70 mt-1">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Scroll Indicator - CSS Animation */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div className="flex flex-col items-center gap-2 text-white/60 cursor-pointer hover:text-white/90 transition-colors animate-bounce">
                            <span className="text-sm font-medium">{t('scrollToExplore')}</span>
                            <ChevronDown className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
