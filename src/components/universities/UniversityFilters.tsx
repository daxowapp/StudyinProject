"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, Zap } from "lucide-react";

interface UniversityFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCity: string;
    onCityChange: (value: string) => void;
    cities: string[];
    selectedInstitutionType: string;
    onInstitutionTypeChange: (value: string) => void;
    selectedUniversityCategory: string;
    onUniversityCategoryChange: (value: string) => void;
    filters: {
        project985: boolean;
        project211: boolean;
        doubleFirst: boolean;
        fastTrack: boolean;
        scholarships: boolean;
        english: boolean;
    };
    onFiltersChange: (filters: any) => void;
    onClearFilters: () => void;
}

export function UniversityFilters({
    searchQuery,
    onSearchChange,
    selectedCity,
    onCityChange,
    cities,
    selectedInstitutionType,
    onInstitutionTypeChange,
    selectedUniversityCategory,
    onUniversityCategoryChange,
    filters,
    onFiltersChange,
    onClearFilters,
}: UniversityFiltersProps) {
    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Search</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 h-10"
                        placeholder="University name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* City */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <Select value={selectedCity} onValueChange={onCityChange}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Institution Category */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Institution Type</Label>
                <Select value={selectedInstitutionType} onValueChange={onInstitutionTypeChange}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="University">University</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Language Institute">Language Institute</SelectItem>
                        <SelectItem value="Vocational School">Vocational School</SelectItem>
                        <SelectItem value="Technical Institute">Technical Institute</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* University Type */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">University Category</Label>
                <Select value={selectedUniversityCategory} onValueChange={onUniversityCategoryChange}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="Specialized">Specialized</SelectItem>
                        <SelectItem value="Vocational">Vocational</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Ranking Type */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Ranking & Recognition</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="985"
                            checked={filters.project985}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, project985: checked })}
                        />
                        <Label htmlFor="985" className="font-normal text-sm cursor-pointer">Project 985</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="211"
                            checked={filters.project211}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, project211: checked })}
                        />
                        <Label htmlFor="211" className="font-normal text-sm cursor-pointer">Project 211</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="double-first"
                            checked={filters.doubleFirst}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, doubleFirst: checked })}
                        />
                        <Label htmlFor="double-first" className="font-normal text-sm cursor-pointer">Double First Class</Label>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Special Features</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="fast-track"
                            checked={filters.fastTrack}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, fastTrack: checked })}
                        />
                        <Label htmlFor="fast-track" className="font-normal text-sm cursor-pointer flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-yellow-500" />
                            Fast Track Acceptance
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="scholarships"
                            checked={filters.scholarships}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, scholarships: checked })}
                        />
                        <Label htmlFor="scholarships" className="font-normal text-sm cursor-pointer">Scholarships Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="english"
                            checked={filters.english}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, english: checked })}
                        />
                        <Label htmlFor="english" className="font-normal text-sm cursor-pointer">English Programs</Label>
                    </div>
                </div>
            </div>

            {/* Clear Filters */}
            <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm" onClick={onClearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                </Button>
            </div>
        </div>
    );
}
