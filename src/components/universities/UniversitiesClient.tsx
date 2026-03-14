"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { UniversityCard } from "@/components/universities/UniversityCard";
import { UniversityFilters } from "@/components/universities/UniversityFilters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LayoutGrid,
    List,
    SlidersHorizontal,
    Building2,
    ChevronDown,
    Loader2,
    X,
    GitCompareArrows,
    MapPin,
    GraduationCap,
    Globe,
    Sparkles,
    Zap,
    ClipboardCheck,
    DollarSign,
    Trophy,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from '@/i18n/routing';

export interface University {
    id: string;
    slug: string;
    name: string;
    city: string;
    province: string;
    programs: number;
    minTuition: string;
    minTuitionFee?: number;
    badges: string[];
    logo?: string;
    photo?: string;
    ranking?: string;
    type?: string;
    university_type?: string;
    institution_category?: string;
    has_fast_track?: boolean;
    availableLevels?: string[];
    availableLanguages?: string[];
    hasScholarship?: boolean;
    hasCscaExam?: boolean;
}

interface UniversitiesClientProps {
    universities: University[];
    heroSearchQuery?: string;
}

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 24;

type SortOption = 'name' | 'programs' | 'city' | 'tuitionLow' | 'tuitionHigh' | 'ranking';

// --- Skeleton Card ---
function SkeletonCard({ variant }: { variant: 'grid' | 'list' }) {
    if (variant === 'list') {
        return (
            <div className="bg-card rounded-xl border shadow-sm p-4 animate-pulse">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-40 h-28 bg-muted rounded-lg shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="flex gap-2">
                            <div className="h-5 bg-muted rounded w-16" />
                            <div className="h-5 bg-muted rounded w-20" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:w-32">
                        <div className="h-8 bg-muted rounded" />
                        <div className="h-8 bg-muted rounded" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-pulse">
            <div className="h-40 bg-muted" />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-20" />
                </div>
                <div className="h-9 bg-muted rounded mt-4" />
            </div>
        </div>
    );
}

// --- Compare Dialog ---
function CompareDialog({ universities, onRemove, onClear, t }: {
    universities: University[];
    onRemove: (id: string) => void;
    onClear: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
}) {
    return (
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <GitCompareArrows className="h-5 w-5 text-primary" />
                    {t('compare.title')}
                </DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-start p-3 font-medium text-muted-foreground w-32">{t('compare.criteria')}</th>
                            {universities.map(uni => (
                                <th key={uni.id} className="text-start p-3 min-w-[200px]">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link href={`/universities/${uni.slug}`} className="font-bold hover:text-primary transition-colors line-clamp-2">
                                            {uni.name}
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onRemove(uni.id)}>
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{t('compare.location')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.city}, {uni.province}</td>)}
                        </tr>
                        <tr className="border-b bg-muted/30">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5" />{t('compare.ranking')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.ranking || '—'}</td>)}
                        </tr>
                        <tr className="border-b">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{t('compare.programs')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3 font-semibold">{uni.programs}</td>)}
                        </tr>
                        <tr className="border-b bg-muted/30">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{t('compare.tuition')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.minTuition}</td>)}
                        </tr>
                        <tr className="border-b">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{t('compare.levels')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.availableLevels?.join(', ') || '—'}</td>)}
                        </tr>
                        <tr className="border-b bg-muted/30">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />{t('compare.languages')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.availableLanguages?.join(', ') || '—'}</td>)}
                        </tr>
                        <tr className="border-b">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />{t('compare.scholarship')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.hasScholarship ? '✅' : '—'}</td>)}
                        </tr>
                        <tr className="border-b bg-muted/30">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" />{t('compare.fastTrack')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.has_fast_track ? '✅' : '—'}</td>)}
                        </tr>
                        <tr className="border-b">
                            <td className="p-3 text-muted-foreground flex items-center gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" />{t('compare.cscaExam')}</td>
                            {universities.map(uni => <td key={uni.id} className="p-3">{uni.hasCscaExam ? '✅' : '—'}</td>)}
                        </tr>
                        <tr>
                            <td className="p-3 text-muted-foreground">{t('compare.badges')}</td>
                            {universities.map(uni => (
                                <td key={uni.id} className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {uni.badges.slice(0, 4).map((badge, i) => (
                                            <Badge key={i} variant="secondary" className="text-[10px]">{badge}</Badge>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onClear}>{t('compare.clearAll')}</Button>
            </div>
        </DialogContent>
    );
}

export function UniversitiesClient({ universities, heroSearchQuery }: UniversitiesClientProps) {
    const t = useTranslations('Universities');
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const initialCity = searchParams.get("city") || "all";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    // Debounced search value that actually drives filtering
    const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);
    const sidebarTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const isMobile = useIsMobile();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState<SortOption>('name');

    // Force grid view on mobile (mobile layout is in UniversityGridCard)
    useEffect(() => {
        if (isMobile) {
            setViewMode('grid');
        }
    }, [isMobile]);

    // Compare feature
    const [compareIds, setCompareIds] = useState<string[]>([]);

    // Sync hero search query from parent
    useEffect(() => {
        if (heroSearchQuery !== undefined) {
            setSearchQuery(heroSearchQuery);
            setDebouncedSearch(heroSearchQuery);
            setIsSearching(false);
        }
    }, [heroSearchQuery]);

    // Handle sidebar search with debounce
    const handleSidebarSearch = useCallback((value: string) => {
        setSearchQuery(value);
        setIsSearching(true);
        clearTimeout(sidebarTimerRef.current);
        sidebarTimerRef.current = setTimeout(() => {
            setDebouncedSearch(value);
            setIsSearching(false);
        }, 250);
    }, []);

    // Cleanup sidebar timer
    useEffect(() => () => clearTimeout(sidebarTimerRef.current), []);

    const [selectedCity, setSelectedCity] = useState(initialCity);
    const [selectedInstitutionType, setSelectedInstitutionType] = useState("all");
    const [selectedUniversityCategory, setSelectedUniversityCategory] = useState("all");
    const [filters, setFilters] = useState({
        project985: false,
        project211: false,
        doubleFirst: false,
        fastTrack: false,
        scholarships: false,
        english: false,
    });
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // New program-level filters
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [maxTuition, setMaxTuition] = useState(200000);
    const [scholarshipFilter, setScholarshipFilter] = useState(false);
    const [cscaExamFilter, setCscaExamFilter] = useState(false);

    // Filter universities based on all criteria
    const filteredUniversities = useMemo(() => {
        return universities.filter((uni) => {
            // Search filter — use debounced value for instant feel
            if (debouncedSearch) {
                const query = debouncedSearch.toLowerCase();
                const matchesSearch =
                    uni.name.toLowerCase().includes(query) ||
                    uni.city.toLowerCase().includes(query) ||
                    uni.province.toLowerCase().includes(query) ||
                    (uni.ranking && String(uni.ranking).toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // City filter
            if (selectedCity !== "all" && uni.city.toLowerCase() !== selectedCity.toLowerCase()) {
                return false;
            }

            // Institution type filter
            if (selectedInstitutionType !== "all" && uni.institution_category !== selectedInstitutionType) {
                return false;
            }

            // University category filter
            if (selectedUniversityCategory !== "all" && uni.university_type !== selectedUniversityCategory) {
                return false;
            }

            // Fast Track filter
            if (filters.fastTrack && !uni.has_fast_track) {
                return false;
            }

            // Ranking filters (check badges array)
            if (filters.project985) {
                const has985 = uni.badges.some(badge =>
                    badge.toLowerCase().includes("985") || badge.toLowerCase().includes("project 985")
                );
                if (!has985) return false;
            }

            if (filters.project211) {
                const has211 = uni.badges.some(badge =>
                    badge.toLowerCase().includes("211") || badge.toLowerCase().includes("project 211")
                );
                if (!has211) return false;
            }

            if (filters.doubleFirst) {
                const hasDoubleFirst = uni.badges.some(badge =>
                    badge.toLowerCase().includes("double first") || badge.toLowerCase().includes("first class")
                );
                if (!hasDoubleFirst) return false;
            }

            // Study level filter
            if (selectedLevels.length > 0) {
                const uniLevels = uni.availableLevels || [];
                const hasMatchingLevel = selectedLevels.some(level => uniLevels.includes(level));
                if (!hasMatchingLevel) return false;
            }

            // Language filter
            if (selectedLanguages.length > 0) {
                const uniLangs = uni.availableLanguages || [];
                const hasMatchingLang = selectedLanguages.some(lang => uniLangs.includes(lang));
                if (!hasMatchingLang) return false;
            }

            // Tuition filter
            if (maxTuition < 200000) {
                const tuitionFee = uni.minTuitionFee || 0;
                if (tuitionFee > 0 && tuitionFee > maxTuition) return false;
            }

            // Scholarship filter
            if (scholarshipFilter && !uni.hasScholarship) {
                return false;
            }

            // CSCA exam filter — when toggled ON, hide universities that require CSCA
            if (cscaExamFilter && uni.hasCscaExam) {
                return false;
            }

            return true;
        });
    }, [universities, debouncedSearch, selectedCity, selectedInstitutionType, selectedUniversityCategory, filters, selectedLevels, selectedLanguages, maxTuition, scholarshipFilter, cscaExamFilter]);

    // Sort universities (#1 + #4)
    const sortedUniversities = useMemo(() => {
        const sorted = [...filteredUniversities];
        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'programs':
                sorted.sort((a, b) => b.programs - a.programs);
                break;
            case 'city':
                sorted.sort((a, b) => a.city.localeCompare(b.city));
                break;
            case 'tuitionLow':
                sorted.sort((a, b) => (a.minTuitionFee || Infinity) - (b.minTuitionFee || Infinity));
                break;
            case 'tuitionHigh':
                sorted.sort((a, b) => (b.minTuitionFee || 0) - (a.minTuitionFee || 0));
                break;
            case 'ranking':
                sorted.sort((a, b) => {
                    const rankA = a.ranking ? parseInt(a.ranking) : Infinity;
                    const rankB = b.ranking ? parseInt(b.ranking) : Infinity;
                    return rankA - rankB;
                });
                break;
        }
        return sorted;
    }, [filteredUniversities, sortBy]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [debouncedSearch, selectedCity, selectedInstitutionType, selectedUniversityCategory, filters, selectedLevels, selectedLanguages, maxTuition, scholarshipFilter, cscaExamFilter, sortBy]);

    const visibleUniversities = useMemo(
        () => sortedUniversities.slice(0, visibleCount),
        [sortedUniversities, visibleCount]
    );

    const hasMore = visibleCount < sortedUniversities.length;
    const remaining = sortedUniversities.length - visibleCount;
    const progressPct = Math.round((Math.min(visibleCount, sortedUniversities.length) / sortedUniversities.length) * 100) || 0;

    const handleShowMore = useCallback(() => {
        setIsLoadingMore(true);
        // Small delay for smooth UX with skeleton display
        setTimeout(() => {
            setVisibleCount(prev => prev + ITEMS_PER_PAGE);
            setIsLoadingMore(false);
        }, 400);
    }, []);

    // Get unique cities from universities
    const cities = useMemo(() => {
        const citySet = new Set(universities.map(u => u.city).filter(Boolean));
        return Array.from(citySet).sort();
    }, [universities]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCity("all");
        setSelectedInstitutionType("all");
        setSelectedUniversityCategory("all");
        setFilters({
            project985: false,
            project211: false,
            doubleFirst: false,
            fastTrack: false,
            scholarships: false,
            english: false,
        });
        setSelectedLevels([]);
        setSelectedLanguages([]);
        setMaxTuition(200000);
        setScholarshipFilter(false);
        setCscaExamFilter(false);
    };

    // Compare handlers (#7)
    const toggleCompare = useCallback((id: string) => {
        setCompareIds(prev => {
            if (prev.includes(id)) return prev.filter(x => x !== id);
            if (prev.length >= 3) return prev; // max 3
            return [...prev, id];
        });
    }, []);

    const compareUniversities = useMemo(
        () => universities.filter(u => compareIds.includes(u.id)),
        [universities, compareIds]
    );

    // Active filter chips data (#5)
    const activeFilters = useMemo(() => {
        const chips: { key: string; label: string; onRemove: () => void }[] = [];

        if (searchQuery) {
            chips.push({ key: 'search', label: `"${searchQuery}"`, onRemove: () => setSearchQuery("") });
        }
        if (selectedCity !== "all") {
            chips.push({ key: 'city', label: selectedCity, onRemove: () => setSelectedCity("all") });
        }
        if (selectedInstitutionType !== "all") {
            chips.push({ key: 'type', label: selectedInstitutionType, onRemove: () => setSelectedInstitutionType("all") });
        }
        if (selectedUniversityCategory !== "all") {
            chips.push({ key: 'category', label: selectedUniversityCategory, onRemove: () => setSelectedUniversityCategory("all") });
        }
        if (filters.project985) {
            chips.push({ key: '985', label: 'Project 985', onRemove: () => setFilters(f => ({ ...f, project985: false })) });
        }
        if (filters.project211) {
            chips.push({ key: '211', label: 'Project 211', onRemove: () => setFilters(f => ({ ...f, project211: false })) });
        }
        if (filters.doubleFirst) {
            chips.push({ key: 'dfc', label: 'Double First Class', onRemove: () => setFilters(f => ({ ...f, doubleFirst: false })) });
        }
        if (filters.fastTrack) {
            chips.push({ key: 'ft', label: t('filters.features.fastTrack'), onRemove: () => setFilters(f => ({ ...f, fastTrack: false })) });
        }
        if (scholarshipFilter) {
            chips.push({ key: 'schol', label: t('filters.features.scholarships'), onRemove: () => setScholarshipFilter(false) });
        }
        if (cscaExamFilter) {
            chips.push({ key: 'csca', label: 'No CSCA Exam', onRemove: () => setCscaExamFilter(false) });
        }
        selectedLevels.forEach(level => {
            chips.push({ key: `lvl-${level}`, label: level, onRemove: () => setSelectedLevels(prev => prev.filter(l => l !== level)) });
        });
        selectedLanguages.forEach(lang => {
            chips.push({ key: `lang-${lang}`, label: lang, onRemove: () => setSelectedLanguages(prev => prev.filter(l => l !== lang)) });
        });
        if (maxTuition < 200000) {
            chips.push({ key: 'tuition', label: `≤ ¥${maxTuition.toLocaleString()}`, onRemove: () => setMaxTuition(200000) });
        }

        return chips;
    }, [searchQuery, selectedCity, selectedInstitutionType, selectedUniversityCategory, filters, scholarshipFilter, cscaExamFilter, selectedLevels, selectedLanguages, maxTuition, t]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            {t('filters.title')}
                            {activeFilters.length > 0 && (
                                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                    {activeFilters.length}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>{t('filters.title')}</SheetTitle>
                            <SheetDescription>
                                {t('filters.description')}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <UniversityFilters
                                searchQuery={searchQuery}
                                onSearchChange={handleSidebarSearch}
                                isSearching={isSearching}
                                selectedCity={selectedCity}
                                onCityChange={setSelectedCity}
                                cities={cities}
                                selectedInstitutionType={selectedInstitutionType}
                                onInstitutionTypeChange={setSelectedInstitutionType}
                                selectedUniversityCategory={selectedUniversityCategory}
                                onUniversityCategoryChange={setSelectedUniversityCategory}
                                filters={filters}
                                onFiltersChange={setFilters}
                                onClearFilters={handleClearFilters}
                                selectedLevels={selectedLevels}
                                onLevelsChange={setSelectedLevels}
                                selectedLanguages={selectedLanguages}
                                onLanguagesChange={setSelectedLanguages}
                                maxTuition={maxTuition}
                                onMaxTuitionChange={setMaxTuition}
                                scholarshipFilter={scholarshipFilter}
                                onScholarshipFilterChange={setScholarshipFilter}
                                cscaExamFilter={cscaExamFilter}
                                onCscaExamFilterChange={setCscaExamFilter}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-80 shrink-0">
                <div className="sticky top-28 space-y-6">
                    <div className="bg-card rounded-xl border shadow-sm p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-primary" />
                            {t('filters.title')}
                        </h2>
                        <UniversityFilters
                            searchQuery={searchQuery}
                            onSearchChange={handleSidebarSearch}
                            isSearching={isSearching}
                            selectedCity={selectedCity}
                            onCityChange={setSelectedCity}
                            cities={cities}
                            selectedInstitutionType={selectedInstitutionType}
                            onInstitutionTypeChange={setSelectedInstitutionType}
                            selectedUniversityCategory={selectedUniversityCategory}
                            onUniversityCategoryChange={setSelectedUniversityCategory}
                            filters={filters}
                            onFiltersChange={setFilters}
                            onClearFilters={handleClearFilters}
                            selectedLevels={selectedLevels}
                            onLevelsChange={setSelectedLevels}
                            selectedLanguages={selectedLanguages}
                            onLanguagesChange={setSelectedLanguages}
                            maxTuition={maxTuition}
                            onMaxTuitionChange={setMaxTuition}
                            scholarshipFilter={scholarshipFilter}
                            onScholarshipFilterChange={setScholarshipFilter}
                            cscaExamFilter={cscaExamFilter}
                            onCscaExamFilterChange={setCscaExamFilter}
                        />
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {t('stats.title')}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('stats.total')}</span>
                                <span className="font-bold">{universities.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('stats.showing')}</span>
                                <span className="font-bold text-primary">{filteredUniversities.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('stats.cities')}</span>
                                <span className="font-bold">{cities.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Top Bar */}
                <div className="bg-card rounded-xl border shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1 bg-primary rounded-full" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('stats.showing')}</p>
                                <p className="font-bold text-lg">
                                    {hasMore
                                        ? `${visibleUniversities.length} / ${sortedUniversities.length}`
                                        : sortedUniversities.length
                                    } {t('results.universities')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center border rounded-lg overflow-hidden hidden sm:flex">
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
                            {/* Sort dropdown - wired up! (#1 + #4) */}
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                                <SelectTrigger className="w-full sm:w-[200px] h-10">
                                    <SelectValue placeholder={t('sort.label')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">{t('sort.name')}</SelectItem>
                                    <SelectItem value="programs">{t('sort.programs')}</SelectItem>
                                    <SelectItem value="city">{t('sort.city')}</SelectItem>
                                    <SelectItem value="tuitionLow">{t('sort.tuitionLow')}</SelectItem>
                                    <SelectItem value="tuitionHigh">{t('sort.tuitionHigh')}</SelectItem>
                                    <SelectItem value="ranking">{t('sort.ranking')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips (#5) */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground font-medium">{t('filters.active')}:</span>
                        {activeFilters.map(chip => (
                            <Badge
                                key={chip.key}
                                variant="secondary"
                                className="gap-1 pl-2.5 pr-1 py-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                                onClick={chip.onRemove}
                            >
                                {chip.label}
                                <X className="h-3 w-3" />
                            </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2" onClick={handleClearFilters}>
                            {t('filters.clearAll')}
                        </Button>
                    </div>
                )}

                {/* Results Grid */}
                <div className="relative">
                    {/* Searching overlay */}
                    {isSearching && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-start justify-center pt-24 rounded-lg">
                            <div className="flex items-center gap-3 bg-card border shadow-lg rounded-full px-6 py-3">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span className="text-sm font-medium">{t('search.searching')}</span>
                            </div>
                        </div>
                    )}
                <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
                    {visibleUniversities.map((uni) => (
                        <UniversityCard
                            key={uni.id}
                            university={uni}
                            variant={viewMode}
                            isComparing={compareIds.includes(uni.id)}
                            onToggleCompare={() => toggleCompare(uni.id)}
                            compareDisabled={compareIds.length >= 3 && !compareIds.includes(uni.id)}
                        />
                    ))}
                    {/* Skeleton loading placeholders (#6) */}
                    {isLoadingMore && Array.from({ length: Math.min(ITEMS_PER_PAGE, remaining) }).map((_, i) => (
                        <SkeletonCard key={`skel-${i}`} variant={viewMode} />
                    ))}
                    {sortedUniversities.length === 0 && !isLoadingMore && (
                        <div className="col-span-full">
                            <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                        <Building2 className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{t('noResults.title')}</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {t('noResults.description')}
                                    </p>
                                    <Button variant="outline" onClick={handleClearFilters}>{t('filters.clear')}</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </div>

                {/* Show More Button (#2 - translated) */}
                {hasMore && !isLoadingMore && (
                    <div className="flex flex-col items-center gap-4 pt-4">
                        {/* Progress indicator */}
                        <div className="w-full max-w-xs space-y-2">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                                {t('results.showingOf', {
                                    visible: Math.min(visibleCount, sortedUniversities.length),
                                    total: sortedUniversities.length,
                                })}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleShowMore}
                            disabled={isLoadingMore}
                            className="gap-2 px-8 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                            {isLoadingMore ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                            {t('results.showMore', { count: Math.min(ITEMS_PER_PAGE, remaining) })}
                        </Button>
                    </div>
                )}
            </div>

            {/* Compare Floating Bar (#7) */}
            {compareIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-card border shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <GitCompareArrows className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                                {t('compare.selected', { count: compareIds.length })}
                            </span>
                        </div>
                        <div className="flex -space-x-2">
                            {compareUniversities.map(u => (
                                <div key={u.id} className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                                    {u.name.charAt(0)}
                                </div>
                            ))}
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" disabled={compareIds.length < 2}>
                                    {t('compare.compareNow')}
                                </Button>
                            </DialogTrigger>
                            <CompareDialog
                                universities={compareUniversities}
                                onRemove={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
                                onClear={() => setCompareIds([])}
                                t={t}
                            />
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCompareIds([])}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
