"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { ProgramFilters, FilterState } from "@/components/programs/ProgramFilters";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, ChevronLeft, ChevronRight, LayoutGrid, List, Search, X, SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Program {
    id: string;
    slug?: string;
    name: string;
    university: string;
    university_slug?: string;
    city: string;
    level: string;
    duration: string;
    language?: string;
    tuition: string;
    deadline: string;
    badges: string[];
    category?: string;
    tuition_fee?: number;
    scholarship_chance?: string;
    has_fast_track?: boolean;
    min_age?: number;
    max_age?: number;
    gpa_requirement?: number;
    csca_exam_require?: boolean;
    application_deadline?: string;
}

interface ProgramsClientProps {
    universityMap?: Record<string, string>;
    fastTrackMap?: Record<string, boolean>;
    availableCities?: string[];
    availableUniversities?: string[];
    initialFilters?: Partial<FilterState>;
}

export function ProgramsClient({ universityMap = {}, fastTrackMap = {}, availableCities = [], availableUniversities = [], initialFilters = {} }: ProgramsClientProps) {
    const t = useTranslations('Programs');
    const searchParams = useSearchParams();
    const universitySlug = searchParams.get('university');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const isMobile = useIsMobile();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('relevance');

    // Force grid view on mobile, restore list view on desktop
    useEffect(() => {
        if (isMobile) {
            setViewMode('grid');
        } else {
            setViewMode('list');
        }
    }, [isMobile]);
    const ITEMS_PER_PAGE = 12;

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        levels: [],
        field: 'all',
        maxTuition: 200000,
        languages: [],
        cities: [],
        duration: 'all',
        scholarship: false,
        university: 'all',
        age: undefined,
        gpa: undefined,
        ...initialFilters
    });

    // Initialize filters from URL parameters
    useEffect(() => {
        const degree = searchParams.get('degree');
        const level = searchParams.get('level');
        const field = searchParams.get('field');
        const city = searchParams.get('city');
        const language = searchParams.get('language');
        const budget = searchParams.get('budget');
        const scholarship = searchParams.get('scholarship');
        const duration = searchParams.get('duration');
        const search = searchParams.get('search');
        const cscaExam = searchParams.get('cscaExam');

        const newFilters: Partial<FilterState> = {};

        const levelParam = level || degree;
        if (levelParam) {
            const validLevels = ['bachelor', 'master', 'phd', 'diploma', 'language', 'non-degree'];
            const normalizedLevel = levelParam.toLowerCase();
            if (validLevels.includes(normalizedLevel)) {
                newFilters.levels = [normalizedLevel];
            }
        }

        if (field && field !== 'any') {
            newFilters.field = field;
        }

        if (city && city !== 'any') {
            const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
            newFilters.cities = [capitalizedCity];
        }

        if (language && language !== 'any') {
            if (language === 'english') {
                newFilters.languages = ['English'];
            } else if (language === 'chinese') {
                newFilters.languages = ['Chinese'];
            } else if (language === 'both') {
                newFilters.languages = ['English', 'Chinese'];
            }
        }

        if (budget && budget !== 'any') {
            const budgetRanges: Record<string, number> = {
                '0-3000': 3000,
                '3000-5000': 5000,
                '5000-8000': 8000,
                '8000+': 200000
            };
            const maxTuition = budgetRanges[budget];
            if (maxTuition) {
                newFilters.maxTuition = maxTuition;
            }
        }

        if (scholarship && scholarship !== 'all') {
            newFilters.scholarship = scholarship === 'available' || scholarship === 'full' || scholarship === 'partial';
        }

        if (cscaExam === 'true') {
            newFilters.cscaExam = true;
        }

        if (duration && duration !== 'any') {
            newFilters.duration = duration;
        }

        if (search) {
            newFilters.search = search;
        }

        if (universitySlug) {
            newFilters.university = universitySlug;
        }

        if (Object.keys(newFilters).length > 0) {
            setFilters(prev => ({ ...prev, ...newFilters }));
        }
    }, [searchParams, universitySlug, universityMap]);

    const debouncedSearch = useDebounce(filters.search, 600);

    // AI Search Expansion — cached per search term
    const searchSynonyms: Record<string, string[]> = {
        'medicine': ['medicine', 'medical', 'mbbs', 'health', 'nursing', 'pharmacy', 'clinical', 'surgery', 'dentistry'],
        'med': ['medicine', 'medical', 'mbbs', 'health', 'nursing', 'pharmacy', 'clinical', 'surgery', 'dentistry'],
        'engineering': ['engineering', 'engineer', 'mechanical', 'civil', 'electrical', 'industrial', 'automation', 'robotics'],
        'eng': ['engineering', 'engineer', 'mechanical', 'civil', 'electrical', 'industrial', 'automation', 'robotics'],
        'business': ['business', 'management', 'mba', 'marketing', 'finance', 'accounting', 'economics', 'commerce'],
        'cs': ['computer science', 'software engineering', 'artificial intelligence', 'information technology', 'cyber security', 'data science'],
        'computer': ['computer science', 'software engineering', 'artificial intelligence', 'information technology', 'cyber security', 'data science'],
        'arts': ['arts', 'design', 'music', 'painting', 'media', 'journalism', 'communication'],
        'language': ['language', 'chinese', 'mandarin', 'english', 'translation', 'interpreting']
    };

    const { data: expandedTerms = [], isFetching: isSearching } = useQuery({
        queryKey: ['search-expand', debouncedSearch],
        queryFn: async () => {
            const searchLower = debouncedSearch.toLowerCase();

            // Check local synonyms first
            const localMatch = Object.keys(searchSynonyms).find(key => searchLower.includes(key));
            if (localMatch) {
                return searchSynonyms[localMatch];
            }

            // Fall back to API
            const response = await fetch(`/api/ai/expand-search?q=${encodeURIComponent(debouncedSearch)}`);
            const data = await response.json();
            if (data.terms && Array.isArray(data.terms)) {
                return data.terms.map((t: string) => t.toLowerCase());
            }
            return [searchLower];
        },
        enabled: !!debouncedSearch && debouncedSearch.length >= 3,
        staleTime: 10 * 60 * 1000, // 10 min — same search term reuses cache
    });

    const supabase = createClient();
    
    const { data: queryData, isFetching: isFetchingPrograms } = useQuery({
        queryKey: ['programs', filters, currentPage, sortBy, expandedTerms],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            let query = supabase
                .from('v_university_programs_full')
                .select('id, slug, display_title, program_title, university_name, university_slug, city, level, duration, tuition_fee, currency, intake, application_deadline, language_name, category, scholarship_chance, gpa_requirement, csca_exam_require', { count: 'exact' })
                .eq('portal_key', PORTAL_KEY)
                .eq('is_active', true);
            
            // Search processing
            if (filters.search) {
                const searchLower = filters.search.toLowerCase().trim();
                const uniqueSearchTerms = Array.from(new Set([searchLower, ...expandedTerms]));
                
                const orConditions = uniqueSearchTerms.map(term => 
                    `program_title.ilike.%${term}%,university_name.ilike.%${term}%,category.ilike.%${term}%`
                ).join(',');
                query = query.or(orConditions);
            }

            // Level filter
            if (filters.levels.length > 0) {
                const levelMap: Record<string, string[]> = {
                    'bachelor': ['bachelor', "bachelor's", 'bachelors', 'undergraduate'],
                    'master': ['master', "master's", 'masters', 'postgraduate'],
                    'phd': ['phd', 'ph.d', 'doctorate', 'doctoral'],
                    'diploma': ['diploma', 'certificate'],
                    'language': ['language course', 'language', 'non-degree', 'chinese'],
                    'non-degree': ['language course', 'language', 'non-degree', 'chinese']
                };
                
                let validVariations: string[] = [];
                filters.levels.forEach(l => {
                    validVariations = validVariations.concat(levelMap[l.toLowerCase()] || [l.toLowerCase()]);
                });
                
                if (validVariations.length > 0) {
                    const orConditions = validVariations.map(variation => `level.ilike.%${variation}%`).join(',');
                    query = query.or(orConditions);
                }
            }

            // Field Filter
            if (filters.field !== 'all') {
                const fieldLower = filters.field.toLowerCase();
                const fieldKeywords: Record<string, string[]> = {
                    'business': ['business', 'mba', 'management', 'economics', 'finance', 'accounting', 'marketing', 'commerce'],
                    'engineering': ['engineering', 'engineer', 'mechanical', 'electrical', 'civil', 'chemical', 'industrial', 'technology'],
                    'medicine': ['medicine', 'medical', 'mbbs', 'health', 'nursing', 'pharmacy', 'clinical', 'surgery'],
                    'cs': ['computer', 'computing', 'software', 'it', 'information technology', 'data science', 'ai', 'artificial intelligence'],
                    'arts': ['arts', 'humanities', 'literature', 'history', 'philosophy', 'language', 'culture'],
                    'science': ['science', 'physics', 'chemistry', 'biology', 'mathematics', 'math'],
                    'law': ['law', 'legal', 'justice', 'jurisprudence'],
                    'education': ['education', 'teaching', 'pedagogy', 'training']
                };
                const keywords = fieldKeywords[fieldLower] || [fieldLower];
                const orConditions = keywords.map(kw => `program_title.ilike.%${kw}%,category.ilike.%${kw}%`).join(',');
                query = query.or(orConditions);
            }

            // Tuition
            if (filters.maxTuition < 200000) {
                query = query.lte('tuition_fee', filters.maxTuition);
            }

            // Languages
            if (filters.languages.length > 0) {
                const orConditions = filters.languages.map(lang => `language_name.ilike.%${lang}%`).join(',');
                query = query.or(orConditions);
            }

            // City
            if (filters.cities.length > 0) {
                const orConditions = filters.cities.map(city => `city.ilike.%${city}%`).join(',');
                query = query.or(orConditions);
            }

            // University
            if (filters.university !== 'all') {
                query = query.or(`university_slug.eq.${filters.university},university_name.eq.${filters.university}`);
            }

            // Duration
            if (filters.duration !== 'all') {
                query = query.eq('duration', filters.duration);
            }

            // Scholarship
            if (filters.scholarship) {
                query = query.not('scholarship_chance', 'is', null).neq('scholarship_chance', '').neq('scholarship_chance', 'None');
            }

            // CSCA
            if (filters.cscaExam) {
                query = query.neq('csca_exam_require', true);
            }
            
            // GPA
            if (filters.gpa !== undefined && filters.gpa !== null) {
                query = query.or(`gpa_requirement.is.null,gpa_requirement.lte.${filters.gpa}`);
            }
            
            // Sorting
            if (sortBy === 'tuition-low') {
                query = query.order('tuition_fee', { ascending: true, nullsFirst: false });
            } else if (sortBy === 'tuition-high') {
                query = query.order('tuition_fee', { ascending: false, nullsFirst: false });
            } else if (sortBy === 'popular') {
                query = query.order('scholarship_chance', { ascending: false });
            }
            // Fallback default sort
            query = query.order('id', { ascending: true });

            // Pagination
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;
            if (error) {
                console.error("Fetch error:", error);
                throw error;
            }
            
            // Transform
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const programs: Program[] = (data || []).map((p: any) => ({
                id: p.id,
                slug: p.slug,
                name: p.display_title || p.program_title,
                university: p.university_name,
                university_slug: p.university_slug,
                city: p.city,
                level: p.level,
                duration: p.duration,
                tuition: `${p.tuition_fee} ${p.currency}/Year`,
                tuition_fee: p.tuition_fee,
                currency: p.currency || 'CNY',
                deadline: p.intake,
                application_deadline: p.application_deadline,
                badges: [p.language_name, p.level].filter(Boolean),
                category: p.category,
                language: p.language_name,
                scholarship_chance: p.scholarship_chance,
                has_fast_track: fastTrackMap[p.university_slug] || false,
                min_age: undefined,
                max_age: undefined,
                gpa_requirement: p.gpa_requirement,
                csca_exam_require: p.csca_exam_require,
            }));
            
            return { programs, count: count || 0 };
        }
    });

    const paginatedPrograms = queryData?.programs || [];
    const totalCount = queryData?.count || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.levels.length > 0) count += filters.levels.length;
        if (filters.cities.length > 0) count += filters.cities.length;
        if (filters.languages.length > 0) count += filters.languages.length;
        if (filters.field !== 'all') count++;
        if (filters.scholarship) count++;
        if (filters.cscaExam) count++;
        if (filters.university !== 'all') count++;
        return count;
    }, [filters]);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Mobile Filters Button */}
                <div className="lg:hidden">
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full justify-between h-12">
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    {t('filters.title')}
                                </span>
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-2">{activeFilterCount}</Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <Search className="h-5 w-5 text-primary" />
                                    {t('filters.title')}
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <ProgramFilters
                                    onFilterChange={setFilters}
                                    availableCities={availableCities}
                                    availableUniversities={availableUniversities}
                                    currentFilters={filters}
                                />
                                
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Sidebar Filters */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-card rounded-xl border shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Search className="h-5 w-5 text-primary" />
                                {t('filters.title')}
                            </h2>
                            <ProgramFilters
                                onFilterChange={setFilters}
                                availableCities={availableCities}
                                availableUniversities={availableUniversities}
                                currentFilters={filters}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Primary Keyword Search */}
                    <div className="relative shadow-sm rounded-xl overflow-hidden border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            className="pl-12 h-14 text-base bg-transparent border-0 focus-visible:ring-0 rounded-none w-full"
                            placeholder={t('filters.searchPlaceholder') || "Search programs, universities, or fields of study..."}
                            value={filters.search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                        {filters.search && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground"
                                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Quick Access Chips */}
                    <div className="flex flex-col space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">{t('quickAccess')}</h3>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {[
                                { label: t('quickChips.cs'), icon: '💻', value: 'cs', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
                                { label: t('quickChips.business'), icon: '💼', value: 'Business & Management', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
                                { label: t('quickChips.engineering'), icon: '🏗️', value: 'Engineering & Technology', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
                                { label: t('quickChips.medicine'), icon: '🏥', value: 'Medicine & Health Sciences', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' },
                                { label: t('quickChips.arts'), icon: '🎨', value: 'Arts & Humanities', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
                                { label: t('quickChips.economics'), icon: '📊', value: 'Economics', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
                            ].map((chip) => (
                                <button
                                    key={chip.value}
                                    onClick={() => setFilters(prev => ({ ...prev, field: chip.value }))}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all
                                        hover:shadow-md hover:scale-105 active:scale-95
                                        ${filters.field === chip.value
                                            ? 'ring-2 ring-primary ring-offset-2 ' + chip.color
                                            : 'bg-background hover:bg-muted/50'}
                                    `}
                                >
                                    <span className="text-base">{chip.icon}</span>
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Search Status */}
                    {(isSearching || (expandedTerms.length > 0 && filters.search)) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                            {isSearching ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-primary font-medium">{t('aiSearch.thinking', { query: filters.search })}</span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">{t('aiSearch.active')}</span>
                                    <span>{t('aiSearch.found', { terms: expandedTerms.slice(0, 3).join(", ") + (expandedTerms.length > 3 ? "..." : "") })}</span>
                                </>
                            )}
                        </div>
                    )}
                    {/* Active Filters Display */}
                    {(filters.levels.length > 0 || filters.cities.length > 0 || filters.languages.length > 0 || filters.field !== 'all' || filters.scholarship || filters.cscaExam) && (
                        <div className="bg-card rounded-xl border shadow-sm p-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-muted-foreground">{t('filters.active')}</span>
                                    {filters.levels.map(level => {
                                        const levelLabels: Record<string, string> = {
                                            'bachelor': t('filters.levels.bachelor'),
                                            'master': t('filters.levels.master'),
                                            'phd': t('filters.levels.phd'),
                                            'diploma': t('filters.levels.diploma'),
                                            'language': t('filters.levels.language'),
                                            'non-degree': t('filters.levels.nonDegree')
                                        };
                                        const displayLabel = levelLabels[level.toLowerCase()] || level;
                                        return (
                                            <Badge key={level} variant="secondary" className="gap-1 pr-1">
                                                🎓 {displayLabel}
                                                <div
                                                    role="button"
                                                    className="cursor-pointer hover:bg-destructive/10 rounded-full p-0.5 pointer-events-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFilters(prev => ({ ...prev, levels: prev.levels.filter(l => l !== level) }));
                                                    }}
                                                >
                                                    <X className="h-3 w-3 hover:text-destructive" />
                                                </div>
                                            </Badge>
                                        );
                                    })}
                                    {filters.cities.map(city => (
                                        <Badge key={city} variant="secondary" className="gap-1 pr-1">
                                            📍 {city}
                                            <div
                                                role="button"
                                                className="cursor-pointer hover:bg-destructive/10 rounded-full p-0.5 pointer-events-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFilters(prev => ({ ...prev, cities: prev.cities.filter(c => c !== city) }));
                                                }}
                                            >
                                                <X className="h-3 w-3 hover:text-destructive" />
                                            </div>
                                        </Badge>
                                    ))}
                                    {filters.languages.map(lang => (
                                        <Badge key={lang} variant="secondary" className="gap-1 pr-1">
                                            🗣️ {lang}
                                            <div
                                                role="button"
                                                className="cursor-pointer hover:bg-destructive/10 rounded-full p-0.5 pointer-events-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFilters(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
                                                }}
                                            >
                                                <X className="h-3 w-3 hover:text-destructive" />
                                            </div>
                                        </Badge>
                                    ))}
                                    {filters.field !== 'all' && (
                                        <Badge variant="secondary" className="gap-1 pr-1">
                                            📚 {['business', 'engineering', 'medicine', 'arts', 'science', 'education', 'cs', 'law'].includes(filters.field) ? t(`filters.fields.${filters.field}`) :
                                                filters.field.charAt(0).toUpperCase() + filters.field.slice(1)}
                                            <div
                                                role="button"
                                                className="cursor-pointer hover:bg-destructive/10 rounded-full p-0.5 pointer-events-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFilters(prev => ({ ...prev, field: 'all' }));
                                                }}
                                            >
                                                <X className="h-3 w-3 hover:text-destructive" />
                                            </div>
                                        </Badge>
                                    )}
                                    {filters.scholarship && (
                                        <Badge variant="secondary" className="gap-1 pr-1">
                                            🎓 {t('filters.scholarshipAvailable')}
                                            <div
                                                role="button"
                                                className="cursor-pointer hover:bg-destructive/10 rounded-full p-0.5 pointer-events-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFilters(prev => ({ ...prev, scholarship: false }));
                                                }}
                                            >
                                                <X className="h-3 w-3 hover:text-destructive" />
                                            </div>
                                        </Badge>
                                    )}
                                    {filters.cscaExam && (
                                        <Badge variant="secondary" className="gap-1 pr-1">
                                            📝 {t('filters.cscaBadge')}
                                            <div
                                                role="button"
                                                className="cursor-pointer hover:bg-destructive/10 rounded-full p-0.5 pointer-events-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFilters(prev => ({ ...prev, cscaExam: false }));
                                                }}
                                            >
                                                <X className="h-3 w-3 hover:text-destructive" />
                                            </div>
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilters({
                                        search: '',
                                        levels: [],
                                        field: 'all',
                                        maxTuition: 200000,
                                        languages: [],
                                        cities: [],
                                        duration: 'all',
                                        scholarship: false,
                                        cscaExam: false,
                                        university: 'all',
                                    })}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    {t('filters.clearAll')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Top Bar */}
                    <div className="bg-card rounded-xl border shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-primary rounded-full" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('stats.showing')}</p>
                                    <p className="font-bold text-lg">{totalCount} {t('stats.total').replace('Total ', '')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-10 w-10 rounded-none ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-10 w-10 rounded-none ${viewMode === 'list' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[200px] h-10">
                                        <SelectValue placeholder={t('sort.label')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">{t('sort.relevance')}</SelectItem>
                                        <SelectItem value="tuition-low">{t('sort.tuitionLow')}</SelectItem>
                                        <SelectItem value="tuition-high">{t('sort.tuitionHigh')}</SelectItem>
                                        <SelectItem value="deadline">{t('sort.deadline')}</SelectItem>
                                        <SelectItem value="popular">{t('sort.popular')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className={`${viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"} ${isFetchingPrograms ? "opacity-50 pointer-events-none transition-opacity duration-200" : "transition-opacity duration-200"}`}>
                        {paginatedPrograms.map((program) => (
                            <ProgramCard key={program.id} program={program} variant={viewMode} />
                        ))}
                        {!totalCount && (
                            <div className="col-span-full">
                                {isSearching ? (
                                    <div className="bg-card rounded-xl border shadow-sm p-12 text-center animate-in fade-in zoom-in-95 duration-200">
                                        <div className="max-w-md mx-auto flex flex-col items-center">
                                            <div className="h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{t('aiSearch.working')}</h3>
                                            <p className="text-muted-foreground">
                                                {t('aiSearch.looking', { query: filters.search })}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
                                        <div className="max-w-md mx-auto">
                                            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                                <Search className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{t('noResults.title')}</h3>
                                            <p className="text-muted-foreground mb-6">
                                                {t('noResults.description')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-card rounded-xl border shadow-sm p-4">
                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className="h-10 w-10"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {getPageNumbers().map((page, index) => (
                                    typeof page === 'number' ? (
                                        <Button
                                            key={index}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className="h-10 min-w-10"
                                        >
                                            {page}
                                        </Button>
                                    ) : (
                                        <span key={index} className="px-2 text-muted-foreground">...</span>
                                    )
                                ))}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className="h-10 w-10"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-center text-sm text-muted-foreground mt-3">
                                {t('stats.showing')} {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
