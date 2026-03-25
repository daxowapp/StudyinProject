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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X, GraduationCap, FileCheck, Check, Loader2, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

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

/**
 * A debounced number input that shows visual feedback when the filter is applied.
 * - Waits 500ms after the user stops typing, then applies the filter
 * - User can press Enter to apply immediately
 * - Shows a brief checkmark animation after applying
 */
function DebouncedNumberInput({
    id,
    value,
    onChange,
    min,
    max,
    step,
    placeholder,
    label,
}: {
    id: string;
    value: number | undefined;
    onChange: (val: number | undefined) => void;
    min: number;
    max: number;
    step?: number;
    placeholder: string;
    label: string;
}) {
    const [localValue, setLocalValue] = useState<string>(value !== undefined ? String(value) : '');
    const [status, setStatus] = useState<'idle' | 'typing' | 'applied'>('idle');
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const appliedTimer = useRef<NodeJS.Timeout | null>(null);

    // Sync local value when external value changes (e.g. clear filters)
    useEffect(() => {
        const externalStr = value !== undefined ? String(value) : '';
        if (externalStr !== localValue) {
            setLocalValue(externalStr);
            setStatus('idle');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const applyFilter = useCallback((rawValue: string) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        const parsed = rawValue ? (step && step < 1 ? parseFloat(rawValue) : parseInt(rawValue)) : undefined;
        onChange(parsed);
        
        setStatus('applied');
        if (appliedTimer.current) clearTimeout(appliedTimer.current);
        appliedTimer.current = setTimeout(() => setStatus('idle'), 1500);
    }, [onChange, step]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        setStatus('typing');

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            applyFilter(newValue);
        }, 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilter(localValue);
        }
    };

    const handleBlur = () => {
        // Apply immediately on blur if still typing
        if (status === 'typing') {
            applyFilter(localValue);
        }
    };

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            if (appliedTimer.current) clearTimeout(appliedTimer.current);
        };
    }, []);

    return (
        <div className="space-y-2 flex-1">
            <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder}
                    value={localValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className={`h-9 pr-8 transition-colors ${
                        status === 'applied' 
                            ? 'border-green-500/50 ring-1 ring-green-500/20' 
                            : status === 'typing' 
                            ? 'border-primary/50 ring-1 ring-primary/20' 
                            : ''
                    }`}
                />
                {/* Status indicator */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {status === 'typing' && (
                        <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                    )}
                    {status === 'applied' && (
                        <Check className="h-3.5 w-3.5 text-green-500 animate-in fade-in zoom-in duration-200" />
                    )}
                </div>
            </div>
        </div>
    );
}

export function ProgramFilters({ onFilterChange, availableCities = [], availableUniversities = [], currentFilters }: ProgramFiltersProps) {
    const t = useTranslations('Programs.filters');
    const [universityOpen, setUniversityOpen] = useState(false);

    // Sort universities alphabetically
    const sortedUniversities = useMemo(
        () => [...availableUniversities].sort((a, b) => a.localeCompare(b)),
        [availableUniversities]
    );

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
                                {t('scholarshipAvailable')}
                            </Label>
                            <span className="text-[11px] text-muted-foreground">{t('scholarshipDesc')}</span>
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
                                {t('cscaLabel')}
                            </Label>
                            <span className="text-[11px] text-muted-foreground">{t('cscaDesc')}</span>
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
                    {["Language", "Bachelor", "Master", "PhD"].map((level) => (
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
                        {t('academicRequirements')}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 px-1">
                        <div className="flex gap-4">
                            <DebouncedNumberInput
                                id="age-filter"
                                value={currentFilters?.age}
                                onChange={(val) => updateFilters({ age: val })}
                                min={10}
                                max={100}
                                placeholder={t('agePlaceholder')}
                                label={t('myAge')}
                            />
                            <DebouncedNumberInput
                                id="gpa-filter"
                                value={currentFilters?.gpa}
                                onChange={(val) => updateFilters({ gpa: val })}
                                min={0}
                                max={100}
                                step={0.1}
                                placeholder={t('gpaPlaceholder')}
                                label={t('minGpa')}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 italic">
                            {t('autoFilterHint')}
                        </p>
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
                        <Popover open={universityOpen} onOpenChange={setUniversityOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={universityOpen}
                                    className="w-full h-10 justify-between font-normal"
                                >
                                    <span className="truncate">
                                        {currentFilters?.university && currentFilters.university !== 'all'
                                            ? currentFilters.university
                                            : t('allUniversities')}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder={t('searchUniversity')} />
                                    <CommandList>
                                        <CommandEmpty>{t('noUniversityFound')}</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value="all"
                                                onSelect={() => {
                                                    updateFilters({ university: 'all' });
                                                    setUniversityOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        (!currentFilters?.university || currentFilters.university === 'all')
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {t('allUniversities')}
                                            </CommandItem>
                                            {sortedUniversities.map((uni) => (
                                                <CommandItem
                                                    key={uni}
                                                    value={uni}
                                                    onSelect={() => {
                                                        updateFilters({ university: uni });
                                                        setUniversityOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            currentFilters?.university === uni
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {uni}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
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

