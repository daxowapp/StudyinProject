"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Save, Plus, X, Languages } from "lucide-react";

// Define LOCALES and helpers locally as they seem to be missing from imports
const LOCALES = [
    { code: "ar", name: "Arabic", dir: "rtl" },
    { code: "fa", name: "Farsi", dir: "rtl" },
    { code: "tr", name: "Turkish", dir: "ltr" },
    { code: "en", name: "English", dir: "ltr" },
];

const isRTL = (locale: string) => ["ar", "fa"].includes(locale);

interface ScholarshipTranslationsProps {
    scholarshipId: string;
    // initialTranslations is not used in the original code's logic flow for initial validation, 
    // but we might need it if we wanted to pre-load. 
    // For now we'll make it optional or ignore it to fix the unused var error if we don't use it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialTranslations?: any;
    baseData: {
        display_name: string;
        description: string;
        accommodation_type: string;
        additional_benefits?: string[];
        requirements?: string[];
    };
}

interface TranslationData {
    id?: string;
    display_name: string;
    description: string;
    accommodation_type: string;
    additional_benefits: string[];
    requirements: string[];
}

export function ScholarshipTranslations({ scholarshipId, baseData }: ScholarshipTranslationsProps) {
    const [translations, setTranslations] = useState<Record<string, TranslationData>>(() => {
        const initial: Record<string, TranslationData> = {};
        LOCALES.forEach(locale => {
            initial[locale.code] = {
                display_name: "",
                description: "",
                accommodation_type: "",
                additional_benefits: [],
                requirements: []
            };
        });
        return initial;
    });

    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState<string | null>(null);
    const [translatingAll, setTranslatingAll] = useState(false);

    const handleChange = (locale: string, field: keyof TranslationData, value: string) => {
        setTranslations(prev => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (locale: string, field: 'additional_benefits' | 'requirements', index: number, value: string) => {
        setTranslations(prev => {
            const currentArray = [...prev[locale][field]];
            currentArray[index] = value;
            return {
                ...prev,
                [locale]: {
                    ...prev[locale],
                    [field]: currentArray
                }
            };
        });
    };

    const addArrayItem = (locale: string, field: 'additional_benefits' | 'requirements') => {
        setTranslations(prev => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: [...prev[locale][field], ""]
            }
        }));
    };

    const removeArrayItem = (locale: string, field: 'additional_benefits' | 'requirements', index: number) => {
        setTranslations(prev => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: prev[locale][field].filter((_, i) => i !== index)
            }
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateForLocale = async (targetLocale: string, sourceData: any) => {
        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "scholarship_translation",
                    query: `Translate to ${LOCALES.find(l => l.code === targetLocale)?.name}: ${JSON.stringify(sourceData)}`
                }),
            });

            if (!response.ok) throw new Error("Failed to generate translation");

            const data = await response.json();

            setTranslations(prev => ({
                ...prev,
                [targetLocale]: {
                    ...prev[targetLocale],
                    display_name: data.display_name || prev[targetLocale].display_name,
                    description: data.description || prev[targetLocale].description,
                    accommodation_type: data.accommodation_type || prev[targetLocale].accommodation_type,
                    additional_benefits: data.additional_benefits || prev[targetLocale].additional_benefits,
                    requirements: data.requirements || prev[targetLocale].requirements,
                },
            }));
            return true;
        } catch (error) {
            console.error(`Failed to translate for ${targetLocale}:`, error);
            return false;
        }
    };

    const handleGenerateAI = async (locale: string) => {
        setGenerating(locale);
        // Use current English data as source if available, otherwise base data
        const sourceData = translations['en']?.display_name ? translations['en'] : baseData;

        try {
            await generateForLocale(locale, sourceData);
            toast.success("Generated translation with AI");
        } catch {
            toast.error("Failed to generate translation");
        } finally {
            setGenerating(null);
        }
    };

    const handleTranslateAll = async () => {
        setTranslatingAll(true);
        const sourceData = translations['en']?.display_name ? translations['en'] : baseData;
        let successCount = 0;
        let failCount = 0;

        try {
            for (const locale of LOCALES) {
                if (locale.code === 'en') continue;

                // We'll proceed to generate.
                const success = await generateForLocale(locale.code, sourceData);
                if (success) successCount++;
                else failCount++;
            }

            if (failCount === 0) {
                toast.success(`Successfully translated to all ${successCount} languages`);
            } else {
                toast.warning(`Translated to ${successCount} languages, failed: ${failCount}`);
            }
        } finally {
            setTranslatingAll(false);
        }
    };

    const handleSave = async (locale: string) => {
        setSaving(true);
        const translation = translations[locale];
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("scholarship_translations")
                .upsert({
                    scholarship_id: scholarshipId,
                    locale: locale,
                    display_name: translation.display_name,
                    description: translation.description,
                    accommodation_type: translation.accommodation_type,
                    additional_benefits: translation.additional_benefits,
                    requirements: translation.requirements,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'scholarship_id, locale' })
                .select()
                .single();

            if (error) throw error;

            setTranslations(prev => ({
                ...prev,
                [locale]: { ...prev[locale], id: data.id },
            }));
            toast.success(`Saved ${LOCALES.find(l => l.code === locale)?.name} translation`);
        } catch (error) {
            toast.error("Error saving translation: " + (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Scholarship Translations</CardTitle>
                    <CardDescription>Manage translations for this scholarship in multiple languages.</CardDescription>
                </div>
                <Button
                    variant="secondary"
                    onClick={handleTranslateAll}
                    disabled={translatingAll || generating !== null}
                    className="ml-auto"
                >
                    {translatingAll ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Languages className="mr-2 h-4 w-4" />
                    )}
                    Translate All
                </Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="ar" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        {LOCALES.map(locale => (
                            <TabsTrigger key={locale.code} value={locale.code}>
                                {locale.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {LOCALES.map(locale => (
                        <TabsContent key={locale.code} value={locale.code} className="space-y-4 mt-4">
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateAI(locale.code)}
                                    disabled={generating === locale.code || translatingAll}
                                >
                                    {generating === locale.code ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                                    )}
                                    Generate with AI
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleSave(locale.code)}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label>Display Name ({locale.name})</Label>
                                <Input
                                    value={translations[locale.code].display_name}
                                    onChange={(e) => handleChange(locale.code, "display_name", e.target.value)}
                                    dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                    placeholder={baseData.display_name}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description ({locale.name})</Label>
                                <Textarea
                                    value={translations[locale.code].description}
                                    onChange={(e) => handleChange(locale.code, "description", e.target.value)}
                                    rows={4}
                                    dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                    placeholder={baseData.description}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Accommodation Type ({locale.name})</Label>
                                <Input
                                    value={translations[locale.code].accommodation_type}
                                    onChange={(e) => handleChange(locale.code, "accommodation_type", e.target.value)}
                                    dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                    placeholder={baseData.accommodation_type}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Additional Benefits ({locale.name})</Label>
                                {translations[locale.code].additional_benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={benefit}
                                            onChange={(e) => handleArrayChange(locale.code, "additional_benefits", index, e.target.value)}
                                            dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArrayItem(locale.code, "additional_benefits", index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(locale.code, "additional_benefits")}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Benefit
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label>Requirements ({locale.name})</Label>
                                {translations[locale.code].requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={req}
                                            onChange={(e) => handleArrayChange(locale.code, "requirements", index, e.target.value)}
                                            dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArrayItem(locale.code, "requirements", index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(locale.code, "requirements")}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Requirement
                                </Button>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
