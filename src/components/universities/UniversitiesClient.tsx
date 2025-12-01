"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, Building2 } from "lucide-react";

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

export function UniversitiesClient({ universities }: UniversitiesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
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

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-80 shrink-0">
                <div className="sticky top-28 space-y-6">
                    <div className="bg-card rounded-xl border shadow-sm p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-primary" />
                            Filters
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
                            Quick Stats
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Universities</span>
                                <span className="font-bold">{universities.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Showing</span>
                                <span className="font-bold text-primary">{filteredUniversities.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cities</span>
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
                                <p className="text-sm text-muted-foreground">Showing</p>
                                <p className="font-bold text-lg">{filteredUniversities.length} Universities</p>
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
                            <Select defaultValue="name">
                                <SelectTrigger className="w-[200px] h-10">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name: A-Z</SelectItem>
                                    <SelectItem value="programs">Most Programs</SelectItem>
                                    <SelectItem value="city">City</SelectItem>
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
                                    <h3 className="text-xl font-bold mb-2">No universities found</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Try adjusting your filters or search criteria
                                    </p>
                                    <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
