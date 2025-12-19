"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, Award, Home, Heart, Wallet, Filter, X, MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

interface Scholarship {
    id: string;
    university_id: string;
    university_name: string;
    university_slug: string;
    university_city: string;
    university_logo: string | null;
    type_name: string;
    tuition_coverage_percentage: number;
    service_fee_usd: number;
    includes_accommodation: boolean;
    includes_stipend: boolean;
    stipend_amount_monthly: number | null;
    includes_medical_insurance: boolean;
}

interface ScholarshipFilterClientProps {
    scholarships: Scholarship[];
}

// Group scholarships by university
interface UniversityGroup {
    university_id: string;
    university_name: string;
    university_slug: string;
    university_city: string;
    university_logo: string | null;
    scholarships: Scholarship[];
    hasAccommodation: boolean;
    hasMedicalInsurance: boolean;
    hasStipend: boolean;
    maxCoverage: number;
    scholarshipCount: number;
}

export function ScholarshipFilterClient({ scholarships }: ScholarshipFilterClientProps) {
    const locale = useLocale();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState({
        hasAccommodation: false,
        hasMedicalInsurance: false,
        hasStipend: false,
        coverage100: false,
        coverage75: false,
        coverage50: false,
    });

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    // Group scholarships by university
    const universityGroups = useMemo(() => {
        const groups: Record<string, UniversityGroup> = {};
        
        scholarships.forEach((s) => {
            if (!groups[s.university_id]) {
                groups[s.university_id] = {
                    university_id: s.university_id,
                    university_name: s.university_name,
                    university_slug: s.university_slug,
                    university_city: s.university_city,
                    university_logo: s.university_logo,
                    scholarships: [],
                    hasAccommodation: false,
                    hasMedicalInsurance: false,
                    hasStipend: false,
                    maxCoverage: 0,
                    scholarshipCount: 0,
                };
            }
            
            groups[s.university_id].scholarships.push(s);
            groups[s.university_id].scholarshipCount++;
            
            if (s.includes_accommodation) groups[s.university_id].hasAccommodation = true;
            if (s.includes_medical_insurance) groups[s.university_id].hasMedicalInsurance = true;
            if (s.includes_stipend) groups[s.university_id].hasStipend = true;
            if (s.tuition_coverage_percentage > groups[s.university_id].maxCoverage) {
                groups[s.university_id].maxCoverage = s.tuition_coverage_percentage;
            }
        });
        
        return Object.values(groups);
    }, [scholarships]);

    // Filter universities based on selected criteria
    const filteredUniversities = useMemo(() => {
        return universityGroups.filter((uni) => {
            // Accommodation filter
            if (filters.hasAccommodation && !uni.hasAccommodation) return false;
            
            // Medical insurance filter
            if (filters.hasMedicalInsurance && !uni.hasMedicalInsurance) return false;
            
            // Stipend filter
            if (filters.hasStipend && !uni.hasStipend) return false;
            
            // Coverage filters (OR logic if any are checked)
            const coverageFiltersActive = filters.coverage100 || filters.coverage75 || filters.coverage50;
            if (coverageFiltersActive) {
                const matchesCoverage = 
                    (filters.coverage100 && uni.maxCoverage >= 100) ||
                    (filters.coverage75 && uni.maxCoverage >= 75) ||
                    (filters.coverage50 && uni.maxCoverage >= 50);
                if (!matchesCoverage) return false;
            }
            
            return true;
        });
    }, [universityGroups, filters]);

    const clearFilters = () => {
        setFilters({
            hasAccommodation: false,
            hasMedicalInsurance: false,
            hasStipend: false,
            coverage100: false,
            coverage75: false,
            coverage50: false,
        });
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </h3>
                {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                        Clear All
                    </Button>
                )}
            </div>

            {/* Benefits Filters */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Scholarship Benefits</h4>
                
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="accommodation" 
                            checked={filters.hasAccommodation}
                            onCheckedChange={(checked) => setFilters({...filters, hasAccommodation: !!checked})}
                        />
                        <Label htmlFor="accommodation" className="text-sm flex items-center gap-2 cursor-pointer">
                            <Home className="h-4 w-4 text-blue-500" />
                            Free Accommodation
                        </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="medical" 
                            checked={filters.hasMedicalInsurance}
                            onCheckedChange={(checked) => setFilters({...filters, hasMedicalInsurance: !!checked})}
                        />
                        <Label htmlFor="medical" className="text-sm flex items-center gap-2 cursor-pointer">
                            <Heart className="h-4 w-4 text-red-500" />
                            Medical Insurance
                        </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="stipend" 
                            checked={filters.hasStipend}
                            onCheckedChange={(checked) => setFilters({...filters, hasStipend: !!checked})}
                        />
                        <Label htmlFor="stipend" className="text-sm flex items-center gap-2 cursor-pointer">
                            <Wallet className="h-4 w-4 text-green-500" />
                            Monthly Salary
                        </Label>
                    </div>
                </div>
            </div>

            {/* Coverage Filters */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Tuition Coverage</h4>
                
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="coverage100" 
                            checked={filters.coverage100}
                            onCheckedChange={(checked) => setFilters({...filters, coverage100: !!checked})}
                        />
                        <Label htmlFor="coverage100" className="text-sm cursor-pointer">
                            100% (Full Scholarship)
                        </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="coverage75" 
                            checked={filters.coverage75}
                            onCheckedChange={(checked) => setFilters({...filters, coverage75: !!checked})}
                        />
                        <Label htmlFor="coverage75" className="text-sm cursor-pointer">
                            75% or more
                        </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="coverage50" 
                            checked={filters.coverage50}
                            onCheckedChange={(checked) => setFilters({...filters, coverage50: !!checked})}
                        />
                        <Label htmlFor="coverage50" className="text-sm cursor-pointer">
                            50% or more
                        </Label>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredUniversities.length}</span> universities
                </p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <Button 
                    variant="outline" 
                    onClick={() => setShowMobileFilters(true)}
                    className="w-full"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 shadow-xl overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-semibold text-lg">Filters</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            )}

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 shrink-0">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <FilterSidebar />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {filteredUniversities.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                            <h3 className="text-lg font-semibold mb-2">No universities found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your filters to see more results
                            </p>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear All Filters
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredUniversities.map((uni) => (
                                <Card 
                                    key={uni.university_id} 
                                    className="border hover:shadow-lg transition-all overflow-hidden"
                                >
                                    {/* University Header with Logo */}
                                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
                                        <div className="flex items-center gap-3">
                                            {uni.university_logo ? (
                                                <Image
                                                    src={uni.university_logo}
                                                    alt={uni.university_name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <GraduationCap className="h-6 w-6 text-primary" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <Link 
                                                    href={`/${locale}/universities/${uni.university_slug}`}
                                                    className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2"
                                                >
                                                    {uni.university_name}
                                                </Link>
                                                {uni.university_city && (
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {uni.university_city}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-4 space-y-4">
                                        {/* Maximum Coverage */}
                                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                                            <div className="text-2xl font-bold text-primary">
                                                Up to {uni.maxCoverage}%
                                            </div>
                                            <p className="text-xs text-muted-foreground">Tuition Coverage</p>
                                        </div>

                                        {/* Benefits Available */}
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground">Benefits Available:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {uni.hasAccommodation && (
                                                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                                        <Home className="h-3 w-3" />
                                                        Accommodation
                                                    </Badge>
                                                )}
                                                {uni.hasMedicalInsurance && (
                                                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                                        <Heart className="h-3 w-3" />
                                                        Insurance
                                                    </Badge>
                                                )}
                                                {uni.hasStipend && (
                                                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                                        <Wallet className="h-3 w-3" />
                                                        Salary
                                                    </Badge>
                                                )}
                                                {!uni.hasAccommodation && !uni.hasMedicalInsurance && !uni.hasStipend && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Tuition Only
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Scholarship Types */}
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {uni.scholarshipCount} scholarship type{uni.scholarshipCount > 1 ? 's' : ''} available:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {uni.scholarships.slice(0, 4).map((s) => (
                                                    <Badge key={s.id} variant="outline" className="text-xs">
                                                        {s.type_name} ({s.tuition_coverage_percentage}%)
                                                    </Badge>
                                                ))}
                                                {uni.scholarships.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{uni.scholarships.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <Link href={`/${locale}/universities/${uni.university_slug}`}>
                                            <Button className="w-full" variant="default">
                                                <Check className="h-4 w-4 mr-2" />
                                                View University
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
