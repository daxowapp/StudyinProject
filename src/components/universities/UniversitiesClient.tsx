"use client";

import { useState, useMemo, useEffect } from "react";
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
import { LayoutGrid, List, SlidersHorizontal, Building2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface University {
    id: string;
    slug: string;
    name: string;
    city: string;
    province: string;
    programs: number;
    minTuition: string;
    badges: string[];
    logo?: string;
    photo?: string;
    ranking?: string;
    type?: string;
    university_type?: string;
    institution_category?: string;
    has_fast_track?: boolean;
}

interface UniversitiesClientProps {
    universities: University[];
}

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function UniversitiesClient({ universities }: UniversitiesClientProps) {
    const t = useTranslations('Universities');
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // Sync with URL changes
    useEffect(() => {
        const query = searchParams.get("search");
        if (query !== null && query !== searchQuery) {
            setSearchQuery(query);
        }
    }, [searchParams, searchQuery]);
    const [selectedCity, setSelectedCity] = useState("all");
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

    // Filter universities based on all criteria
    const filteredUniversities = useMemo(() => {
        return universities.filter((uni) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
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

            return true;
        });
    }, [universities, searchQuery, selectedCity, selectedInstitutionType, selectedUniversityCategory, filters]);

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
    };

    // ... inside component ...

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            {t('filters.title')}
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
                                onSearchChange={setSearchQuery}
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
                            onSearchChange={setSearchQuery}
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
                                <p className="font-bold text-lg">{filteredUniversities.length} {t('stats.total').replace('Total ', '')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center border rounded-lg overflow-hidden hidden sm:flex">
                                <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/10 text-primary rounded-none">
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none">
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Select defaultValue="name">
                                <SelectTrigger className="w-full sm:w-[200px] h-10">
                                    <SelectValue placeholder={t('sort.label')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">{t('sort.name')}</SelectItem>
                                    <SelectItem value="programs">{t('sort.programs')}</SelectItem>
                                    <SelectItem value="city">{t('sort.city')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredUniversities.map((uni) => (
                        <UniversityCard key={uni.id} university={uni} />
                    ))}
                    {filteredUniversities.length === 0 && (
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
        </div>
    );
}
