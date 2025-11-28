"use client";

import { useState, useMemo } from "react";
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
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search } from "lucide-react";

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
}

export function ProgramsClient({ programs }: ProgramsClientProps) {
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

            // Level filter
            if (filters.levels.length > 0 && !filters.levels.includes(program.level)) {
                return false;
            }

            // Field filter
            if (filters.field !== 'all' && program.category !== filters.field) {
                return false;
            }

            // Tuition filter
            if (program.tuition_fee && program.tuition_fee > filters.maxTuition) {
                return false;
            }

            // Language filter
            if (filters.languages.length > 0) {
                const hasMatchingLanguage = program.badges.some(badge => 
                    filters.languages.includes(badge)
                );
                if (!hasMatchingLanguage) return false;
            }

            // City filter
            if (filters.cities.length > 0 && !filters.cities.includes(program.city)) {
                return false;
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

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-card rounded-xl border shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Search className="h-5 w-5 text-primary" />
                                Filters
                            </h2>
                            <ProgramFilters 
                                onFilterChange={setFilters}
                                availableCities={availableCities}
                                availableUniversities={availableUniversities}
                            />
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
                                    <p className="font-bold text-lg">{filteredPrograms.length} Programs</p>
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
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">Most Relevant</SelectItem>
                                        <SelectItem value="tuition-low">Tuition: Low to High</SelectItem>
                                        <SelectItem value="tuition-high">Tuition: High to Low</SelectItem>
                                        <SelectItem value="deadline">Deadline: Soonest</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
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
                                        <h3 className="text-xl font-bold mb-2">No programs found</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Try adjusting your filters or search criteria
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
