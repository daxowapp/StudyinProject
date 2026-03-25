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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Search, X, Zap, GraduationCap, FileCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    isSearching?: boolean;
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
    // New program-level filters
    selectedLevels: string[];
    onLevelsChange: (levels: string[]) => void;
    selectedLanguages: string[];
    onLanguagesChange: (languages: string[]) => void;
    maxTuition: number;
    onMaxTuitionChange: (value: number) => void;
    scholarshipFilter: boolean;
    onScholarshipFilterChange: (value: boolean) => void;
    cscaExamFilter: boolean;
    onCscaExamFilterChange: (value: boolean) => void;
}

export function UniversityFilters({
    searchQuery,
    onSearchChange,
    isSearching,
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
    selectedLevels,
    onLevelsChange,
    selectedLanguages,
    onLanguagesChange,
    maxTuition,
    onMaxTuitionChange,
    scholarshipFilter,
    onScholarshipFilterChange,
    cscaExamFilter,
    onCscaExamFilterChange,
}: UniversityFiltersProps) {
    const t = useTranslations('Universities.filters');
    const tSearch = useTranslations('Universities.search');

    const toggleLevel = (level: string) => {
        const newLevels = selectedLevels.includes(level)
            ? selectedLevels.filter(l => l !== level)
            : [...selectedLevels, level];
        onLevelsChange(newLevels);
    };

    const toggleLanguage = (lang: string) => {
        const newLanguages = selectedLanguages.includes(lang)
            ? selectedLanguages.filter(l => l !== lang)
            : [...selectedLanguages, lang];
        onLanguagesChange(newLanguages);
    };

    return (
        <div className="space-y-4">
            {/* Quick Filters - Scholarship & CSCA toggles */}
            <div className="grid gap-3">
                {/* Scholarship Filter */}
                <div 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        scholarshipFilter 
                            ? 'bg-primary/5 border-primary/20 shadow-sm' 
                            : 'bg-card hover:bg-muted/50 border-border'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${scholarshipFilter ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                            <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="uni-scholarship-toggle" className="text-sm font-semibold cursor-pointer">
                                Scholarship Available
                            </Label>
                            <span className="text-[11px] text-muted-foreground">Has programs with funding</span>
                        </div>
                    </div>
                    <Switch
                        id="uni-scholarship-toggle"
                        checked={scholarshipFilter}
                        onCheckedChange={onScholarshipFilterChange}
                    />
                </div>

                {/* CSCA Exam Filter */}
                <div 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        cscaExamFilter 
                            ? 'bg-amber-500/5 border-amber-500/20 shadow-sm' 
                            : 'bg-card hover:bg-muted/50 border-border'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cscaExamFilter ? 'bg-amber-500/10 text-amber-600' : 'bg-muted'}`}>
                            <FileCheck className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="uni-csca-toggle" className="text-sm font-semibold cursor-pointer">
                                No CSCA Exam Required
                            </Label>
                            <span className="text-[11px] text-muted-foreground">Show programs without CSCA</span>
                        </div>
                    </div>
                    <Switch
                        id="uni-csca-toggle"
                        checked={cscaExamFilter}
                        onCheckedChange={onCscaExamFilterChange}
                        className="data-[state=checked]:bg-amber-500"
                    />
                </div>
            </div>

            {/* Clear Filters Button */}
            <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-medium h-9"
                onClick={onClearFilters}
            >
                <X className="h-3.5 w-3.5 mr-2" />
                {t('clearAll')}
            </Button>

            {/* Search */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{tSearch('label')}</Label>
                <div className="relative">
                    {isSearching ? (
                        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                    ) : (
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                        className="pl-9 h-10"
                        placeholder={tSearch('universityPlaceholder')}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Study Level */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Study Level</Label>
                <div className="space-y-2.5">
                    {["Non-Degree", "Bachelor", "Master", "PhD"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                                id={`uni-level-${level}`}
                                checked={selectedLevels.includes(level)}
                                onCheckedChange={() => toggleLevel(level)}
                            />
                            <Label htmlFor={`uni-level-${level}`} className="font-normal text-sm cursor-pointer">
                                {level}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tuition Range */}
            <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Max Tuition</Label>
                    <span className="text-sm font-medium text-primary">{maxTuition.toLocaleString()} RMB</span>
                </div>
                <Slider
                    value={[maxTuition]}
                    max={200000}
                    step={5000}
                    onValueChange={(value) => onMaxTuitionChange(value[0])}
                    className="py-2"
                />
            </div>

            {/* Language */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Language</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="uni-english"
                            checked={selectedLanguages.includes('English')}
                            onCheckedChange={() => toggleLanguage('English')}
                        />
                        <Label htmlFor="uni-english" className="font-normal text-sm cursor-pointer">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="uni-chinese"
                            checked={selectedLanguages.includes('Chinese')}
                            onCheckedChange={() => toggleLanguage('Chinese')}
                        />
                        <Label htmlFor="uni-chinese" className="font-normal text-sm cursor-pointer">Chinese</Label>
                    </div>
                </div>
            </div>

            {/* Advanced Filters in Accordion */}
            <Accordion type="multiple" className="w-full" defaultValue={[]}>
                {/* City */}
                <AccordionItem value="city" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        {t('city')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-1">
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
                    </AccordionContent>
                </AccordionItem>

                {/* Institution Category */}
                <AccordionItem value="institution" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        {t('institutionType')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-1">
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
                    </AccordionContent>
                </AccordionItem>

                {/* University Type */}
                <AccordionItem value="category" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        {t('universityCategory')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-1">
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

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
                </div>
            </div>
        </div>
    );
}
