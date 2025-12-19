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
import { Loader2, Sparkles, Save, Plus, X } from "lucide-react";

export interface ProgramTranslationData {
    id?: string;
    program_id: string;
    locale: string;
    title: string;
    description: string;
    requirements: string[];
    career_prospects: string[];
}

interface ProgramTranslationsProps {
    programId: string;
    initialTranslations: ProgramTranslationData[];
    baseData: {
        title: string;
        description: string;
        requirements: string[];
        career_prospects: string[];
    };
}

const LOCALES = [
    { code: "ar", name: "Arabic", dir: "rtl" },
    { code: "fa", name: "Farsi", dir: "rtl" },
    { code: "tr", name: "Turkish", dir: "ltr" },
    { code: "en", name: "English", dir: "ltr" },
    { code: "zh", name: "Chinese", dir: "ltr" },
    { code: "tk", name: "Turkmen", dir: "ltr" },
    { code: "fr", name: "French", dir: "ltr" },
    { code: "es", name: "Spanish", dir: "ltr" },
    { code: "ru", name: "Russian", dir: "ltr" },
];

export function ProgramTranslations({ programId, initialTranslations, baseData }: ProgramTranslationsProps) {
    const [translations, setTranslations] = useState<Record<string, ProgramTranslationData>>(() => {
        const map: Record<string, ProgramTranslationData> = {};
        LOCALES.forEach(locale => {
            const existing = initialTranslations.find(t => t.locale === locale.code);
            map[locale.code] = existing || {
                program_id: programId,
                locale: locale.code,
                title: "",
                description: "",
                requirements: [],
                career_prospects: [],
            };
        });
        return map;
    });
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState<string | null>(null);

    const handleChange = (locale: string, field: keyof ProgramTranslationData, value: string | string[]) => {
        setTranslations(prev => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: value,
            },
        }));
    };

    const handleArrayChange = (locale: string, field: 'requirements' | 'career_prospects', index: number, value: string) => {
        const newArray = [...translations[locale][field]];
        newArray[index] = value;
        handleChange(locale, field, newArray);
    };

    const addArrayItem = (locale: string, field: 'requirements' | 'career_prospects') => {
        handleChange(locale, field, [...translations[locale][field], ""]);
    };

    const removeArrayItem = (locale: string, field: 'requirements' | 'career_prospects', index: number) => {
        const newArray = translations[locale][field].filter((_, i) => i !== index);
        handleChange(locale, field, newArray);
    };

    const handleSave = async (locale: string) => {
        setSaving(true);
        const translation = translations[locale];
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("program_translations")
                .upsert({
                    program_id: programId,
                    locale: locale,
                    title: translation.title,
                    description: translation.description,
                    requirements: translation.requirements,
                    career_prospects: translation.career_prospects,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'program_id, locale' })
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

    const handleGenerateAI = async (locale: string) => {
        setGenerating(locale);
        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "program_translation",
                    query: `Translate to ${LOCALES.find(l => l.code === locale)?.name}: ${JSON.stringify(baseData)}`
                }),
            });

            if (!response.ok) throw new Error("Failed to generate translation");

            const data = await response.json();

            setTranslations(prev => ({
                ...prev,
                [locale]: {
                    ...prev[locale],
                    title: data.title || prev[locale].title,
                    description: data.description || prev[locale].description,
                    requirements: data.requirements || prev[locale].requirements,
                    career_prospects: data.career_prospects || prev[locale].career_prospects,
                },
            }));
            toast.success("Generated translation with AI");
        } catch (error) {
            toast.error("Failed to generate translation");
            console.error(error);
        } finally {
            setGenerating(null);
        }
    };

    const isRTL = (locale: string) => locale === "ar" || locale === "fa";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Program Translations</CardTitle>
                <CardDescription>Manage translations for this program in multiple languages.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="ar" className="w-full">
                    <TabsList className="flex flex-wrap gap-1 h-auto">
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
                                    disabled={generating === locale.code}
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
                                <Label>Title ({locale.name})</Label>
                                <Input
                                    value={translations[locale.code].title}
                                    onChange={(e) => handleChange(locale.code, "title", e.target.value)}
                                    dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                    placeholder={baseData.title}
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

                            <div className="space-y-2">
                                <Label>Career Prospects ({locale.name})</Label>
                                {translations[locale.code].career_prospects.map((prospect, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={prospect}
                                            onChange={(e) => handleArrayChange(locale.code, "career_prospects", index, e.target.value)}
                                            dir={isRTL(locale.code) ? "rtl" : "ltr"}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArrayItem(locale.code, "career_prospects", index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(locale.code, "career_prospects")}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Career Prospect
                                </Button>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
