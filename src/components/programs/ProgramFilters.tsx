"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, GraduationCap, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FilterState {
    search: string;
    levels: string[];
    field: string;
    maxTuition: number;
    languages: string[];
    cities: string[];
    duration: string;
    scholarship: boolean;
    cscaExam?: boolean;
    university: string;
    age?: number;
    gpa?: number;
}

interface ProgramFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    availableCities?: string[];
    availableUniversities?: string[];
    currentFilters: FilterState;
}

export function ProgramFilters({ onFilterChange, availableCities = [], availableUniversities = [], currentFilters }: ProgramFiltersProps) {
    const t = useTranslations('Programs.filters');

    const updateFilters = (updates: Partial<FilterState>) => {
        const newFilters = { ...currentFilters, ...updates };
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = (key: keyof FilterState, value: string) => {
        const currentArray = currentFilters[key] as string[];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value];
        updateFilters({ [key]: newArray });
    };

    const clearFilters = () => {
        const defaultFilters: FilterState = {
            search: '',
            levels: [],
            field: 'all',
            maxTuition: 200000,
            languages: [],
            cities: [],
            duration: 'all',
            scholarship: false,
            cscaExam: false,
            university: 'all',
            age: undefined,
            gpa: undefined,
        };
        onFilterChange(defaultFilters);
    };

    return (
        <div className="space-y-6">
            {/* Quick Filters Grid (High Priority) */}
            <div className="grid gap-3">
                {/* Scholarship Filter */}
                <div 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        currentFilters.scholarship 
                            ? 'bg-primary/5 border-primary/20 shadow-sm' 
                            : 'bg-card hover:bg-muted/50 border-border'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${currentFilters.scholarship ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                            <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="scholarship-toggle" className="text-sm font-semibold cursor-pointer">
                                Scholarship Available
                            </Label>
                            <span className="text-[11px] text-muted-foreground">Show programs with funding</span>
                        </div>
                    </div>
                    <Switch
                        id="scholarship-toggle"
                        checked={currentFilters.scholarship || false}
                        onCheckedChange={(checked) => updateFilters({ scholarship: checked })}
                    />
                </div>

                {/* CSCA Exam Filter */}
                <div 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        currentFilters.cscaExam 
                            ? 'bg-amber-500/5 border-amber-500/20 shadow-sm' 
                            : 'bg-card hover:bg-muted/50 border-border'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${currentFilters.cscaExam ? 'bg-amber-500/10 text-amber-600' : 'bg-muted'}`}>
                            <FileCheck className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="csca-toggle" className="text-sm font-semibold cursor-pointer">
                                Requires CSCA Exam
                            </Label>
                            <span className="text-[11px] text-muted-foreground">Filter by test requirement</span>
                        </div>
                    </div>
                    <Switch
                        id="csca-toggle"
                        checked={currentFilters.cscaExam || false}
                        onCheckedChange={(checked) => updateFilters({ cscaExam: checked })}
                        className="data-[state=checked]:bg-amber-500"
                    />
                </div>
            </div>

            {/* Clear Filters Button */}
            <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-medium h-9"
                onClick={clearFilters}
            >
                <X className="h-3.5 w-3.5 mr-2" />
                {t('clearAll')}
            </Button>

            {/* Study Level */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">{t('studyLevel')}</Label>
                <div className="space-y-2.5">
                    {["Bachelor", "Master", "PhD"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                                id={level}
                                checked={currentFilters?.levels?.includes(level) || false}
                                onCheckedChange={() => toggleArrayFilter('levels', level)}
                            />
                            <Label htmlFor={level} className="font-normal text-sm cursor-pointer">
                                {t(`levels.${level.toLowerCase()}`)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Advanced Filters */}
            <Accordion type="multiple" className="w-full" defaultValue={['academic']}>
                {/* Academic Requirements (Age & GPA) */}
                <AccordionItem value="academic" className="border-b-0">
                    <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                        Academic Requirements
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 px-1">
                        <div className="flex gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="age-filter" className="text-xs text-muted-foreground">My Age</Label>
                                <Input
                                    id="age-filter"
                                    type="number"
                                    min={10}
                                    max={100}
                                    placeholder="e.g. 21"
                                    value={currentFilters?.age || ''}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseInt(e.target.value) : undefined;
                                        updateFilters({ age: val });
                                    }}
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="gpa-filter" className="text-xs text-muted-foreground">Min GPA</Label>
                                <Input
                                    id="gpa-filter"
                                    type="number"
                                    min={0.0}
                                    max={100.0}
                                    step={0.1}
                                    placeholder="e.g. 3.0"
                                    value={currentFilters?.gpa || ''}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseFloat(e.target.value) : undefined;
                                        updateFilters({ gpa: val });
                                    }}
                                    className="h-9"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            {/* Field of Study */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('fieldOfStudy')}</Label>
                <Select value={currentFilters?.field || 'all'} onValueChange={(value) => updateFilters({ field: value })}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder={t('allFields')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allFields')}</SelectItem>
                        <SelectItem value="Business & Management">{t('fields.business')}</SelectItem>
                        <SelectItem value="Engineering & Technology">{t('fields.engineering')}</SelectItem>
                        <SelectItem value="Medicine & Health Sciences">{t('fields.medicine')}</SelectItem>
                        <SelectItem value="Arts & Humanities">{t('fields.arts')}</SelectItem>
                        <SelectItem value="Natural Sciences">{t('fields.science')}</SelectItem>
                        <SelectItem value="Education">{t('fields.education')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tuition Range */}
            <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{t('maxTuition')}</Label>
                    <span className="text-sm font-medium text-primary">{(currentFilters?.maxTuition || 200000).toLocaleString()} RMB</span>
                </div>
                <Slider
                    value={[currentFilters?.maxTuition || 200000]}
                    max={200000}
                    step={5000}
                    onValueChange={(value) => updateFilters({ maxTuition: value[0] })}
                    className="py-2"
                />
            </div>

            {/* Language */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">{t('language')}</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="english-prog"
                            checked={currentFilters?.languages?.includes('English') || false}
                            onCheckedChange={() => toggleArrayFilter('languages', 'English')}
                        />
                        <Label htmlFor="english-prog" className="font-normal text-sm cursor-pointer">{t('languages.english')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="chinese-prog"
                            checked={currentFilters?.languages?.includes('Chinese') || false}
                            onCheckedChange={() => toggleArrayFilter('languages', 'Chinese')}
                        />
                        <Label htmlFor="chinese-prog" className="font-normal text-sm cursor-pointer">{t('languages.chinese')}</Label>
                    </div>
                </div>
            </div>

                {/* City */}
                <AccordionItem value="city" className="border-b-0 mt-2">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        {t('city')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-1">
                        <Select value={currentFilters?.cities?.[0] || 'all'} onValueChange={(value) => updateFilters({ cities: value === 'all' ? [] : [value] })}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('allCities')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allCities')}</SelectItem>
                                {availableCities.map((city) => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </AccordionContent>
                </AccordionItem>

                {/* University */}
                <AccordionItem value="university" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        {t('university')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-1">
                        <Select value={currentFilters?.university || 'all'} onValueChange={(value) => updateFilters({ university: value })}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('allUniversities')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allUniversities')}</SelectItem>
                                {availableUniversities.map((uni) => (
                                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </AccordionContent>
                </AccordionItem>

                {/* Duration */}
                <AccordionItem value="duration" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        {t('duration')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-1">
                        <Select value={currentFilters?.duration || 'all'} onValueChange={(value) => updateFilters({ duration: value })}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t('allDurations')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allDurations')}</SelectItem>
                                <SelectItem value="2 years">{t('durations.2years')}</SelectItem>
                                <SelectItem value="3 years">{t('durations.3years')}</SelectItem>
                                <SelectItem value="4 years">{t('durations.4years')}</SelectItem>
                                <SelectItem value="5 years">{t('durations.5years')}</SelectItem>
                                <SelectItem value="6 years">{t('durations.6years')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


        </div>
    );
}

