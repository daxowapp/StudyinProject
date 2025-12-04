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
    city: string;
    level: string;
    duration: string;
    tuition: string;
    deadline: string;
    badges: string[];
    category?: string;
    tuition_fee?: number;
    scholarship_chance?: string;
}

interface ProgramsClientProps {
    programs: Program[];
    universityMap?: Record<string, string>;
}

export function ProgramsClient({ programs, universityMap = {} }: ProgramsClientProps) {
    const t = useTranslations('Programs');
    const searchParams = useSearchParams();
    const universitySlug = searchParams.get('university');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
        const degree = searchParams.get('degree');
        const field = searchParams.get('field');
        const city = searchParams.get('city');
        const language = searchParams.get('language');
        const budget = searchParams.get('budget');
        const scholarship = searchParams.get('scholarship');
        const duration = searchParams.get('duration');

        const newFilters: Partial<FilterState> = {};

        // Map degree level from hero search
        if (degree) {
            const levelMap: Record<string, string[]> = {
                'bachelor': ['Bachelor', "Bachelor's", 'Bachelors', 'Undergraduate'],
                'master': ['Master', "Master's", 'Masters', 'Postgraduate'],
                'phd': ['PhD', 'Ph.D', 'Doctorate', 'Doctoral'],
                'diploma': ['Diploma', 'Certificate'],
                'language': ['Language Course', 'Language', 'Non-Degree']
            };
            const possibleLevels = levelMap[degree];
            if (possibleLevels) {
                newFilters.levels = possibleLevels;
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

        // Handle university filter from URL
        if (universitySlug) {
            // First try to look up in the map
            const mappedName = universityMap[universitySlug];

            if (mappedName) {
                newFilters.university = mappedName;
            } else if (programs.length > 0) {
                // Fallback to existing logic
                const universityFromSlug = programs.find(p =>
                    p.university.toLowerCase().replace(/\s+/g, '-') === universitySlug
                )?.university;

                if (universityFromSlug) {
                    newFilters.university = universityFromSlug;
                }
            }
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

            // Level filter - case insensitive matching
            if (filters.levels.length > 0) {
                const hasMatchingLevel = filters.levels.some(filterLevel =>
                    program.level.toLowerCase() === filterLevel.toLowerCase()
                );
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

            // University filter
            if (filters.university !== 'all' && program.university !== filters.university) {
                return false;
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

    // Filter content component for reuse
    const FilterContent = () => (
        <ProgramFilters
            onFilterChange={setFilters}
            availableCities={availableCities}
            availableUniversities={availableUniversities}
            currentFilters={filters}
        />
    );

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
                                <FilterContent />
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
                            <FilterContent />
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
                                    {filters.levels.map(level => (
                                        <Badge key={level} variant="secondary" className="gap-1">
                                            {level}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => setFilters(prev => ({ ...prev, levels: prev.levels.filter(l => l !== level) }))}
                                            />
                                        </Badge>
                                    ))}
                                    {filters.cities.map(city => (
                                        <Badge key={city} variant="secondary" className="gap-1">
                                            📍 {city}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => setFilters(prev => ({ ...prev, cities: prev.cities.filter(c => c !== city) }))}
                                            />
                                        </Badge>
                                    ))}
                                    {filters.languages.map(lang => (
                                        <Badge key={lang} variant="secondary" className="gap-1">
                                            🗣️ {lang}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => setFilters(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))}
                                            />
                                        </Badge>
                                    ))}
                                    {filters.field !== 'all' && (
                                        <Badge variant="secondary" className="gap-1">
                                            📚 {filters.field === 'cs' ? 'Computer Science' :
                                                filters.field.charAt(0).toUpperCase() + filters.field.slice(1)}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => setFilters(prev => ({ ...prev, field: 'all' }))}
                                            />
                                        </Badge>
                                    )}
                                    {filters.scholarship && (
                                        <Badge variant="secondary" className="gap-1">
                                            🎓 Scholarship
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => setFilters(prev => ({ ...prev, scholarship: false }))}
                                            />
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
                        {filteredPrograms.map((program) => (
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
                    {filteredPrograms.length > 0 && (
                        <div className="bg-card rounded-xl border shadow-sm p-4">
                            <div className="flex justify-center items-center gap-2">
                                <Button variant="outline" size="icon" disabled className="h-10 w-10">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="h-10 min-w-10">
                                    1
                                </Button>
                                <Button variant="outline" size="sm" className="h-10 min-w-10">
                                    2
                                </Button>
                                <Button variant="outline" size="sm" className="h-10 min-w-10">
                                    3
                                </Button>
                                <span className="px-2 text-muted-foreground">...</span>
                                <Button variant="outline" size="sm" className="h-10 min-w-10">
                                    10
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
