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
import { useTranslations } from "next-intl";

interface UniversityFiltersState {
    project985: boolean;
    project211: boolean;
    doubleFirst: boolean;
    fastTrack: boolean;
    scholarships: boolean;
    english: boolean;
}

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
    filters: UniversityFiltersState;
    onFiltersChange: (filters: UniversityFiltersState) => void;
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
    const t = useTranslations('Universities.filters');
    const tSearch = useTranslations('Universities.search');

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{tSearch('label')}</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 h-10"
                        placeholder={tSearch('universityPlaceholder')}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* City */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('city')}</Label>
                <Select value={selectedCity} onValueChange={onCityChange}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder={t('allCities')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allCities')}</SelectItem>
                        {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Institution Category */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('institutionType')}</Label>
                <Select value={selectedInstitutionType} onValueChange={onInstitutionTypeChange}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder={t('allTypes')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allTypes')}</SelectItem>
                        <SelectItem value="University">{t('institutionTypes.university')}</SelectItem>
                        <SelectItem value="College">{t('institutionTypes.college')}</SelectItem>
                        <SelectItem value="Language Institute">{t('institutionTypes.languageInstitute')}</SelectItem>
                        <SelectItem value="Vocational School">{t('institutionTypes.vocationalSchool')}</SelectItem>
                        <SelectItem value="Technical Institute">{t('institutionTypes.technicalInstitute')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* University Type */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('universityCategory')}</Label>
                <Select value={selectedUniversityCategory} onValueChange={onUniversityCategoryChange}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder={t('allCategories')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        <SelectItem value="Public">{t('categories.public')}</SelectItem>
                        <SelectItem value="Private">{t('categories.private')}</SelectItem>
                        <SelectItem value="Research">{t('categories.research')}</SelectItem>
                        <SelectItem value="Comprehensive">{t('categories.comprehensive')}</SelectItem>
                        <SelectItem value="Specialized">{t('categories.specialized')}</SelectItem>
                        <SelectItem value="Vocational">{t('categories.vocational')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Ranking Type */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">{t('rankingRecognition')}</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="985"
                            checked={filters.project985}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onFiltersChange({ ...filters, project985: checked === true })}
                        />
                        <Label htmlFor="985" className="font-normal text-sm cursor-pointer">{t('rankings.project985')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="211"
                            checked={filters.project211}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onFiltersChange({ ...filters, project211: checked === true })}
                        />
                        <Label htmlFor="211" className="font-normal text-sm cursor-pointer">{t('rankings.project211')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="double-first"
                            checked={filters.doubleFirst}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onFiltersChange({ ...filters, doubleFirst: checked === true })}
                        />
                        <Label htmlFor="double-first" className="font-normal text-sm cursor-pointer">{t('rankings.doubleFirstClass')}</Label>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">{t('specialFeatures')}</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="fast-track"
                            checked={filters.fastTrack}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onFiltersChange({ ...filters, fastTrack: checked === true })}
                        />
                        <Label htmlFor="fast-track" className="font-normal text-sm cursor-pointer flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-yellow-500" />
                            {t('features.fastTrack')}
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="scholarships"
                            checked={filters.scholarships}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onFiltersChange({ ...filters, scholarships: checked === true })}
                        />
                        <Label htmlFor="scholarships" className="font-normal text-sm cursor-pointer">{t('features.scholarships')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="english"
                            checked={filters.english}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onFiltersChange({ ...filters, english: checked === true })}
                        />
                        <Label htmlFor="english" className="font-normal text-sm cursor-pointer">{t('features.englishPrograms')}</Label>
                    </div>
                </div>
            </div>

            {/* Clear Filters */}
            <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm" onClick={onClearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    {t('clearAll')}
                </Button>
            </div>
        </div>
    );
}

