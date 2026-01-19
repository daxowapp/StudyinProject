"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { ProgramFilters, FilterState } from "@/components/programs/ProgramFilters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, X, SlidersHorizontal } from "lucide-react";
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
    tuition: string;
    deadline: string;
    badges: string[];
    category?: string;
    tuition_fee?: number;
    scholarship_chance?: string;
    has_fast_track?: boolean;
}

interface ProgramsClientProps {
    programs: Program[];
    universityMap?: Record<string, string>;
    initialFilters?: Partial<FilterState>;
}

export function ProgramsClient({ programs, universityMap = {}, initialFilters = {} }: ProgramsClientProps) {
    const t = useTranslations('Programs');
    const searchParams = useSearchParams();
    const universitySlug = searchParams.get('university');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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
        ...initialFilters
    });

    // Extract unique cities and universities
    const availableCities = useMemo(() => {
        return Array.from(new Set(programs.map(p => p.city).filter(Boolean)));
    }, [programs]);

    const availableUniversities = useMemo(() => {
        return Array.from(new Set(programs.map(p => p.university).filter(Boolean)));
    }, [programs]);

    // Initialize filters from URL parameters
    useEffect(() => {
        // If initialFilters are provided and we shouldn't sync, we can skip. 
        // But usually we want URL sync.

        const degree = searchParams.get('degree');
        const level = searchParams.get('level'); // From navbar menu
        const field = searchParams.get('field');
        const city = searchParams.get('city');
        const language = searchParams.get('language');
        const budget = searchParams.get('budget');
        const scholarship = searchParams.get('scholarship');
        const duration = searchParams.get('duration');

        const newFilters: Partial<FilterState> = {};

        // Map degree level from hero search or navbar level
        const levelParam = level || degree;
        if (levelParam) {
            const validLevels = ['bachelor', 'master', 'phd', 'diploma', 'language', 'non-degree'];
            const normalizedLevel = levelParam.toLowerCase();
            if (validLevels.includes(normalizedLevel)) {
                // Store only the canonical level key, not all variations
                newFilters.levels = [normalizedLevel];
            }
        }

        // Map field of study - use keyword matching
        if (field && field !== 'any') {
            newFilters.field = field;
        }

        // Map city
        if (city && city !== 'any') {
            // Capitalize city name
            const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
            newFilters.cities = [capitalizedCity];
        }

        // Map language
        if (language && language !== 'any') {
            if (language === 'english') {
                newFilters.languages = ['English'];
            } else if (language === 'chinese') {
                newFilters.languages = ['Chinese'];
            } else if (language === 'both') {
                newFilters.languages = ['English', 'Chinese'];
            }
        }

        // Map budget
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

        // Map scholarship
        if (scholarship && scholarship !== 'all') {
            newFilters.scholarship = scholarship === 'available' || scholarship === 'full' || scholarship === 'partial';
        }

        // Map duration
        if (duration && duration !== 'any') {
            newFilters.duration = duration;
        }

        // Handle university filter from URL - filter by slug directly
        if (universitySlug) {
            newFilters.university = universitySlug; // Store slug as filter value
        }

        // Apply all filters at once
        if (Object.keys(newFilters).length > 0) {
            setFilters(prev => ({ ...prev, ...newFilters }));
        }
    }, [searchParams, universitySlug, programs, universityMap]);

    // Filter programs based on current filters
    const filteredPrograms = useMemo(() => {
        return programs.filter(program => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    program.name.toLowerCase().includes(searchLower) ||
                    program.university.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Level filter - use level map for matching variations
            if (filters.levels.length > 0) {
                const levelMap: Record<string, string[]> = {
                    'bachelor': ['bachelor', "bachelor's", 'bachelors', 'undergraduate'],
                    'master': ['master', "master's", 'masters', 'postgraduate'],
                    'phd': ['phd', 'ph.d', 'doctorate', 'doctoral'],
                    'diploma': ['diploma', 'certificate'],
                    'language': ['language course', 'language', 'non-degree', 'chinese'],
                    'non-degree': ['language course', 'language', 'non-degree', 'chinese']
                };
                const hasMatchingLevel = filters.levels.some(filterLevel => {
                    const variations = levelMap[filterLevel.toLowerCase()] || [filterLevel.toLowerCase()];
                    return variations.some(variation =>
                        program.level?.toLowerCase().includes(variation)
                    );
                });
                if (!hasMatchingLevel) return false;
            }

            // Field filter - intelligent matching
            if (filters.field !== 'all') {
                const fieldLower = filters.field.toLowerCase();

                // Define field keywords for better matching
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

                // Check if program name or category matches any keyword
                const matchesField = keywords.some(keyword => {
                    const programNameLower = program.name.toLowerCase();
                    const categoryLower = (program.category || '').toLowerCase();
                    return programNameLower.includes(keyword) ||
                        categoryLower.includes(keyword) ||
                        categoryLower === fieldLower;
                });

                if (!matchesField) return false;
            }

            // Tuition filter
            if (program.tuition_fee && program.tuition_fee > filters.maxTuition) {
                return false;
            }

            // Language filter - flexible matching
            if (filters.languages.length > 0) {
                const hasMatchingLanguage = program.badges.some(badge =>
                    filters.languages.some(filterLang =>
                        badge.toLowerCase().includes(filterLang.toLowerCase())
                    )
                );
                if (!hasMatchingLanguage) return false;
            }

            // City filter - case insensitive
            if (filters.cities.length > 0) {
                const hasMatchingCity = filters.cities.some(filterCity =>
                    program.city.toLowerCase() === filterCity.toLowerCase()
                );
                if (!hasMatchingCity) return false;
            }

            // University filter - match by slug if available, otherwise by name
            if (filters.university !== 'all') {
                const matchesBySlug = program.university_slug === filters.university;
                const matchesByName = program.university === filters.university;
                if (!matchesBySlug && !matchesByName) {
                    return false;
                }
            }

            // Duration filter
            if (filters.duration !== 'all' && program.duration !== filters.duration) {
                return false;
            }

            // Scholarship filter
            if (filters.scholarship && !program.scholarship_chance) {
                return false;
            }

            return true;
        });
    }, [programs, filters]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

    // Generate page numbers to display
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

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.levels.length > 0) count += filters.levels.length;
        if (filters.cities.length > 0) count += filters.cities.length;
        if (filters.languages.length > 0) count += filters.languages.length;
        if (filters.field !== 'all') count++;
        if (filters.scholarship) count++;
        if (filters.university !== 'all') count++;
        return count;
    }, [filters]);



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
                    {/* Active Filters Display */}
                    {(filters.levels.length > 0 || filters.cities.length > 0 || filters.languages.length > 0 || filters.field !== 'all' || filters.scholarship) && (
                        <div className="bg-card rounded-xl border shadow-sm p-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-muted-foreground">{t('filters.active')}</span>
                                    {filters.levels.map(level => {
                                        const levelLabels: Record<string, string> = {
                                            'bachelor': 'Bachelor',
                                            'master': 'Master',
                                            'phd': 'PhD',
                                            'diploma': 'Diploma',
                                            'language': 'Language Course',
                                            'non-degree': 'Non-Degree'
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
                                            📚 {filters.field === 'cs' ? 'Computer Science' :
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
                                            🎓 Scholarship
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
                                    <p className="font-bold text-lg">{filteredPrograms.length} {t('stats.total').replace('Total ', '')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/10 text-primary rounded-none">
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none">
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Select defaultValue="relevance">
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
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {paginatedPrograms.map((program) => (
                            <ProgramCard key={program.id} program={program} />
                        ))}
                        {!filteredPrograms.length && (
                            <div className="col-span-full">
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
                                {t('stats.showing')} {startIndex + 1}-{Math.min(endIndex, filteredPrograms.length)} of {filteredPrograms.length}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
