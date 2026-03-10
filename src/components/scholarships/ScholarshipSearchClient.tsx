"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Search,
    SlidersHorizontal,
    Award,
    GraduationCap,
    X,
    Home,
    Heart,
    Wallet,
    ChevronLeft,
    ChevronRight,
    Star
} from "lucide-react";
import { ScholarshipUniversityGroup } from "./ScholarshipUniversityGroup";
import { useTranslations } from "next-intl";

export interface ScholarshipProgram {
    program_id: string;
    program_slug: string;
    display_title: string;
    program_title: string;
    level: string;
    duration: string;
    tuition_fee: number;
    currency: string;
    language_name: string;
    intake: string;
    category: string;
    field: string;
    university_id: string;
    university_name: string;
    university_slug: string;
    city: string;
    province: string;
    scholarship_id: string;
    scholarship_type: string;
    scholarship_display_name: string;
    tuition_coverage_percentage: number;
    includes_accommodation: boolean;
    accommodation_type: string | null;
    includes_stipend: boolean;
    stipend_amount_monthly: number | null;
    includes_medical_insurance: boolean;
    service_fee_usd: number;
    service_fee_cny: number;
    student_pays_tuition: number;
    university_logo?: string | null;
    is_popular: boolean;
    csca_exam_require?: boolean;
}

interface ScholarshipSearchClientProps {
    programs: ScholarshipProgram[];
    logoMap: Record<string, string | null>;
}

export function ScholarshipSearchClient({ programs, logoMap = {} }: ScholarshipSearchClientProps) {
    const t = useTranslations("Scholarships");

    // Filter state
    const [search, setSearch] = useState("");
    const [coverageFilter, setCoverageFilter] = useState("all"); // all, full, partial
    const [cityFilter, setCityFilter] = useState("all");
    const [universityFilter, setUniversityFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState("all");
    const [semesterFilter, setSemesterFilter] = useState("all");
    const [showAccommodation, setShowAccommodation] = useState(false);
    const [showStipend, setShowStipend] = useState(false);
    const [showInsurance, setShowInsurance] = useState(false);
    const [showPopularOnly, setShowPopularOnly] = useState(false);
    const [requireCsca, setRequireCsca] = useState(false);

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [search, coverageFilter, cityFilter, universityFilter, levelFilter, languageFilter, semesterFilter, showAccommodation, showStipend, showInsurance, showPopularOnly, requireCsca]);

    // Derive unique options from data
    const cities = useMemo(() =>
        [...new Set(programs.map(p => p.city).filter(Boolean))].sort(),
        [programs]
    );

    const universities = useMemo(() => {
        const map = new Map<string, string>();
        programs.forEach(p => map.set(p.university_slug, p.university_name));
        return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    }, [programs]);

    const levels = useMemo(() =>
        [...new Set(programs.map(p => p.level).filter(Boolean))].sort(),
        [programs]
    );

    const languages = useMemo(() =>
        [...new Set(programs.map(p => p.language_name).filter(Boolean))].sort(),
        [programs]
    );

    // Apply filters
    const filtered = useMemo(() => {
        return programs.filter(p => {
            // Text search
            if (search) {
                const q = search.toLowerCase();
                const matchesSearch =
                    (p.display_title || p.program_title || "").toLowerCase().includes(q) ||
                    p.university_name.toLowerCase().includes(q) ||
                    p.city.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }

            // Coverage
            if (coverageFilter === "full" && p.tuition_coverage_percentage < 100) return false;
            if (coverageFilter === "partial" && p.tuition_coverage_percentage >= 100) return false;

            // City
            if (cityFilter !== "all" && p.city !== cityFilter) return false;

            // University
            if (universityFilter !== "all" && p.university_slug !== universityFilter) return false;

            // Level
            if (levelFilter !== "all" && p.level.toLowerCase() !== levelFilter.toLowerCase()) return false;

            // Language
            if (languageFilter !== "all" && p.language_name !== languageFilter) return false;

            // Semester
            if (semesterFilter !== "all") {
                const intake = (p.intake || "").toLowerCase();
                if (semesterFilter === "spring" && !intake.includes("spring") && !intake.includes("mar") && !intake.includes("feb")) return false;
                if (semesterFilter === "autumn" && !intake.includes("autumn") && !intake.includes("fall") && !intake.includes("sep") && !intake.includes("oct")) return false;
            }

            // Benefit filters
            if (showAccommodation && !p.includes_accommodation) return false;
            if (showStipend && !p.includes_stipend) return false;
            if (showInsurance && !p.includes_medical_insurance) return false;

            // Popular filter
            if (showPopularOnly && p.is_popular !== true && String(p.is_popular) !== 'true') return false;

            // CSCA filter
            if (requireCsca && !p.csca_exam_require) return false;

            return true;
        });
    }, [programs, search, coverageFilter, cityFilter, universityFilter, levelFilter, languageFilter, semesterFilter, showAccommodation, showStipend, showInsurance, showPopularOnly, requireCsca]);

    useEffect(() => {
        // Debug log to trace what data client actually receives
        const popularCount = programs.filter(p => p.is_popular === true).length;
        console.log(`[ScholarshipSearchClient] Received ${programs.length} programs. Number of popular: ${popularCount}`);
    }, [programs]);

    // Group by university
    const grouped = useMemo(() => {
        const map = new Map<string, ScholarshipProgram[]>();
        filtered.forEach(p => {
            const key = p.university_id;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(p);
        });
        // Sort universities by number of programs (most first)
        return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
    }, [filtered]);

    const activeFiltersCount = [
        coverageFilter !== "all",
        cityFilter !== "all",
        universityFilter !== "all",
        levelFilter !== "all",
        languageFilter !== "all",
        semesterFilter !== "all",
        showAccommodation,
        showStipend,
        showInsurance,
        showPopularOnly,
        requireCsca,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSearch("");
        setCoverageFilter("all");
        setCityFilter("all");
        setUniversityFilter("all");
        setLevelFilter("all");
        setLanguageFilter("all");
        setSemesterFilter("all");
        setShowAccommodation(false);
        setShowStipend(false);
        setShowInsurance(false);
        setShowPopularOnly(false);
        setRequireCsca(false);
    };

    // Calculate pagination
    const totalPages = Math.ceil(grouped.length / itemsPerPage);
    const paginatedGrouped = grouped.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            {/* Search Header and Bar */}
            <div className="max-w-4xl mx-auto text-center mb-8">
                 <h2 className="text-2xl font-bold mb-4">{t('search.filter')}</h2>
                 <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder={t("search.searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-14 text-lg rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 shadow-sm"
                    />
                </div>
            </div>

            {/* Filter Panel */}
            <Card className="mb-10 border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                             <SlidersHorizontal className="h-5 w-5 text-primary" />
                             <h3 className="font-semibold text-lg">Advanced Filters</h3>
                             {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                                    {activeFiltersCount} Active
                                </Badge>
                            )}
                        </div>
                        {activeFiltersCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors rounded-full">
                                <X className="h-4 w-4 mr-2" />
                                {t("search.clearAll")}
                            </Button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Filter Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                            {/* Coverage */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                                    {t("search.category")}
                                </label>
                                <Select value={coverageFilter} onValueChange={setCoverageFilter}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("search.all")}</SelectItem>
                                        <SelectItem value="full">{t("search.fullScholarship")}</SelectItem>
                                        <SelectItem value="partial">{t("search.partialScholarship")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* City */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                                    {t("search.city")}
                                </label>
                                <Select value={cityFilter} onValueChange={setCityFilter}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("search.all")}</SelectItem>
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* University */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                                    {t("search.university")}
                                </label>
                                <Select value={universityFilter} onValueChange={setUniversityFilter}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("search.all")}</SelectItem>
                                        {universities.map(([slug, name]) => (
                                            <SelectItem key={slug} value={slug}>{name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Degree */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                                    {t("search.degree")}
                                </label>
                                <Select value={levelFilter} onValueChange={setLevelFilter}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("search.all")}</SelectItem>
                                        {levels.map(level => (
                                            <SelectItem key={level} value={level}>{level}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Language */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                                    {t("search.language")}
                                </label>
                                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("search.all")}</SelectItem>
                                        {languages.map(lang => (
                                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Semester */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                                    {t("search.semester")}
                                </label>
                                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("search.all")}</SelectItem>
                                        <SelectItem value="spring">{t("search.spring")}</SelectItem>
                                        <SelectItem value="autumn">{t("search.autumn")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Benefit Checkboxes */}
                        <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Checkbox
                                    checked={showAccommodation}
                                    onCheckedChange={(v) => setShowAccommodation(!!v)}
                                    className="h-5 w-5 rounded-md"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                        <Home className="h-4 w-4" />
                                    </div>
                                    {t("search.freeAccommodation")}
                                </div>
                            </label>
                            
                            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Checkbox
                                    checked={showStipend}
                                    onCheckedChange={(v) => setShowStipend(!!v)}
                                    className="h-5 w-5 rounded-md"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                                        <Wallet className="h-4 w-4" />
                                    </div>
                                    {t("search.monthlyStipend")}
                                </div>
                            </label>
                            
                            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <Checkbox
                                    checked={showInsurance}
                                    onCheckedChange={(v) => setShowInsurance(!!v)}
                                    className="h-5 w-5 rounded-md"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg">
                                        <Heart className="h-4 w-4" />
                                    </div>
                                    {t("search.medicalInsurance")}
                                </div>
                            </label>

                            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800">
                                <Checkbox
                                    checked={showPopularOnly}
                                    onCheckedChange={(v) => setShowPopularOnly(!!v)}
                                    className="h-5 w-5 rounded-md border-amber-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                />
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                                    <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                                        <Star className="h-4 w-4 fill-current" />
                                    </div>
                                    {t("popular.title", { fallback: "Popular Only" })}
                                </div>
                            </label>

                            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800">
                                <Checkbox
                                    checked={requireCsca}
                                    onCheckedChange={(v) => setRequireCsca(!!v)}
                                    className="h-5 w-5 rounded-md"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-600 bg-amber-100 px-1 py-0.5 rounded text-xs font-bold leading-none">CSCA</span>
                                    Requires CSCA Exam
                                </div>
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                        {t("search.scholarshipOptions")}{" "}
                        <span className="font-semibold text-foreground">{grouped.length}</span>{" "}
                        {t("search.universities")}
                    </p>
                </div>
            </div>

            {/* Results */}
            {grouped.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-16 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t("search.noResults")}</h3>
                        <p className="text-muted-foreground mb-4">{t("search.noResultsDescription")}</p>
                        <Button variant="outline" onClick={clearFilters}>
                            {t("search.clearAll")}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {paginatedGrouped.map(([uniId, uniPrograms]) => (
                        <ScholarshipUniversityGroup
                            key={uniId}
                            universityName={uniPrograms[0].university_name}
                            universitySlug={uniPrograms[0].university_slug}
                            city={uniPrograms[0].city}
                            logo={logoMap[uniId] || null}
                            programs={uniPrograms}
                        />
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-10 w-10 shrink-0 rounded-full"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            
                            <div className="flex items-center gap-1 md:gap-2 px-4 text-sm font-medium">
                                <span className="text-muted-foreground hidden sm:inline">Page</span>
                                <span className="text-foreground border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-md min-w-10 text-center">
                                    {page}
                                </span>
                                <span className="text-muted-foreground mx-1">of</span>
                                <span className="text-muted-foreground">{totalPages}</span>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="h-10 w-10 shrink-0 rounded-full"
                            >
                                <ChevronRight className="h-5 w-5" />
                                <span className="sr-only">Next page</span>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
