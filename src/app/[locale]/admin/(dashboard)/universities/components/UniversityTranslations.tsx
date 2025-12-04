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
import { Loader2, Sparkles, Save } from "lucide-react";

export interface Translation {
    id?: string;
    university_id: string;
    locale: string;
    name: string;
    description: string;
    features: string[];
}

interface UniversityTranslationsProps {
    universityId: string;
    initialTranslations: Translation[];
    baseData: {
        name: string;
        description: string;
        features: string[];
    };
}

const LOCALES = [
    { code: "ar", name: "Arabic" },
    { code: "fa", name: "Farsi" },
    { code: "tr", name: "Turkish" },
    { code: "en", name: "English" },
];

export function UniversityTranslations({ universityId, initialTranslations, baseData }: UniversityTranslationsProps) {
    const [translations, setTranslations] = useState<Record<string, Translation>>(() => {
        const map: Record<string, Translation> = {};
        LOCALES.forEach(locale => {
            const existing = initialTranslations.find(t => t.locale === locale.code);
            map[locale.code] = existing || {
                university_id: universityId,
                locale: locale.code,
                name: "",
                description: "",
                features: [],
            };
        });
        return map;
    });
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState<string | null>(null);

    const handleChange = (locale: string, field: keyof Translation, value: string | string[]) => {
        setTranslations(prev => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: value,
            },
        }));
    };

    const handleFeatureChange = (locale: string, index: number, value: string) => {
        const newFeatures = [...translations[locale].features];
        newFeatures[index] = value;
        handleChange(locale, "features", newFeatures);
    };

    const addFeature = (locale: string) => {
        handleChange(locale, "features", [...translations[locale].features, ""]);
    };

    const removeFeature = (locale: string, index: number) => {
        const newFeatures = translations[locale].features.filter((_, i) => i !== index);
        handleChange(locale, "features", newFeatures);
    };

    const handleSave = async (locale: string) => {
        setSaving(true);
        const translation = translations[locale];
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("university_translations")
                .upsert({
                    university_id: universityId,
                    locale: locale,
                    name: translation.name,
                    description: translation.description,
                    features: translation.features,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'university_id, locale' })
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
                    type: "translation",
                    query: `Translate to ${LOCALES.find(l => l.code === locale)?.name}: ${JSON.stringify(baseData)}`
                }),
            });

            if (!response.ok) throw new Error("Failed to generate translation");

            const data = await response.json();

            setTranslations(prev => ({
                ...prev,
                [locale]: {
                    ...prev[locale],
                    name: data.name || prev[locale].name,
                    description: data.description || prev[locale].description,
                    features: data.features || prev[locale].features,
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>University Translations</CardTitle>
                <CardDescription>Manage translations for university information.</CardDescription>
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
                                <Label>Name ({locale.name})</Label>
                                <Input
                                    value={translations[locale.code].name}
                                    onChange={(e) => handleChange(locale.code, "name", e.target.value)}
                                    dir={locale.code === "ar" || locale.code === "fa" ? "rtl" : "ltr"}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description ({locale.name})</Label>
                                <Textarea
                                    value={translations[locale.code].description}
                                    onChange={(e) => handleChange(locale.code, "description", e.target.value)}
                                    rows={5}
                                    dir={locale.code === "ar" || locale.code === "fa" ? "rtl" : "ltr"}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Features ({locale.name})</Label>
                                {translations[locale.code].features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(locale.code, index, e.target.value)}
                                            dir={locale.code === "ar" || locale.code === "fa" ? "rtl" : "ltr"}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFeature(locale.code, index)}
                                        >
                                            <span className="sr-only">Remove</span>
                                            &times;
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addFeature(locale.code)}>
                                    Add Feature
                                </Button>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
