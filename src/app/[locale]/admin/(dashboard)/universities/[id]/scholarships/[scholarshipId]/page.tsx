"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Languages } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScholarshipFormContent, ScholarshipFormData } from "../../../components/ScholarshipFormContent";

const LOCALES = [
    { code: "ar", name: "Arabic", dir: "rtl" },
    { code: "fa", name: "Farsi", dir: "rtl" },
    { code: "tr", name: "Turkish", dir: "ltr" },
    { code: "en", name: "English", dir: "ltr" },
];

export default function EditUniversityScholarshipPage() {
    const router = useRouter();
    const params = useParams();
    const universityId = params?.id as string;
    const scholarshipId = params?.scholarshipId as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [universityName, setUniversityName] = useState("");

    // Main English Data
    const [formData, setFormData] = useState<ScholarshipFormData>({
        type_name: "",
        display_name: "",
        description: "",
        tuition_coverage_percentage: 100,
        duration_years: 4,
        includes_accommodation: false,
        accommodation_type: "",
        includes_stipend: false,
        stipend_amount_monthly: 0,
        stipend_currency: "CNY",
        stipend_duration_months: 12,
        includes_medical_insurance: false,
        one_time_allowance: 0,
        one_time_allowance_currency: "CNY",
        service_fee_usd: 0,
        service_fee_cny: 0,
        display_order: 0,
        additional_benefits: [],
        requirements: [],
    });

    const [isActive, setIsActive] = useState(true);

    // Translations Map (locale -> data)
    const [translations, setTranslations] = useState<Record<string, ScholarshipFormData>>({});

    useEffect(() => {
        const init = async () => {
            await fetchUniversity();
            if (scholarshipId && scholarshipId !== "new") {
                await Promise.all([fetchScholarship(), fetchTranslations()]);
            }
            setLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scholarshipId, universityId]);

    const fetchUniversity = async () => {
        const { data } = await supabase.from("universities").select("name").eq("id", universityId).single();
        if (data) setUniversityName(data.name);
    };

    const fetchScholarship = async () => {
        const { data, error } = await supabase.from("university_scholarships").select("*").eq("id", scholarshipId).single();
        if (error || !data) return;

        setFormData({
            type_name: data.type_name || "",
            display_name: data.display_name || "",
            description: data.description || "",
            tuition_coverage_percentage: data.tuition_coverage_percentage || 100,
            duration_years: data.duration_years || 4,
            includes_accommodation: data.includes_accommodation || false,
            accommodation_type: data.accommodation_type || "",
            includes_stipend: data.includes_stipend || false,
            stipend_amount_monthly: Number(data.stipend_amount_monthly) || 0,
            stipend_currency: data.stipend_currency || "CNY",
            stipend_duration_months: data.stipend_duration_months || 12,
            includes_medical_insurance: data.includes_medical_insurance || false,
            one_time_allowance: Number(data.one_time_allowance) || 0,
            one_time_allowance_currency: data.one_time_allowance_currency || "CNY",
            service_fee_usd: Number(data.service_fee_usd) || 0,
            service_fee_cny: Number(data.service_fee_cny) || 0,
            display_order: data.display_order || 0,
            additional_benefits: data.additional_benefits || [],
            requirements: data.requirements || [],
        });
        setIsActive(data.is_active ?? true);
    };

    const fetchTranslations = async () => {
        const { data } = await supabase.from("scholarship_translations").select("*").eq("scholarship_id", scholarshipId);
        if (data) {
            const map: Record<string, ScholarshipFormData> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.forEach((t: any) => {
                map[t.locale] = {
                    display_name: t.display_name || "",
                    description: t.description || "",
                    accommodation_type: t.accommodation_type || "",
                    additional_benefits: t.additional_benefits || [],
                    requirements: t.requirements || [],
                };
            });
            setTranslations(map);
        }
    };

    // Helper to merge shared data into translation view
    const getCombinedData = (locale: string): ScholarshipFormData => {
        if (locale === "en") return formData;

        const trans = translations[locale] || {};

        // Explicitly construct the data to strictly separate shared vs translated fields
        // This prevents any accidental overwrites if 'trans' has undefined keys
        return {
            // Shared numeric/boolean fields - ALWAYS from formData
            tuition_coverage_percentage: formData.tuition_coverage_percentage,
            duration_years: formData.duration_years,
            includes_accommodation: formData.includes_accommodation,
            includes_stipend: formData.includes_stipend,
            stipend_amount_monthly: formData.stipend_amount_monthly,
            stipend_currency: formData.stipend_currency,
            stipend_duration_months: formData.stipend_duration_months,
            includes_medical_insurance: formData.includes_medical_insurance,
            one_time_allowance: formData.one_time_allowance,
            one_time_allowance_currency: formData.one_time_allowance_currency,
            service_fee_usd: formData.service_fee_usd,
            service_fee_cny: formData.service_fee_cny,
            type_name: formData.type_name,
            display_order: formData.display_order,

            // Translated text fields - Try trans first, fallback to empty (NOT formData which is English)
            display_name: trans.display_name || "",
            description: trans.description || "",
            accommodation_type: trans.accommodation_type || "",

            // Arrays - Try trans, fallback to empty
            additional_benefits: trans.additional_benefits || [],
            requirements: trans.requirements || [],
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFieldChange = (locale: string, field: keyof ScholarshipFormData, value: any) => {
        if (locale === "en") {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setTranslations(prev => ({
                ...prev,
                [locale]: {
                    ...(prev[locale] || {}),
                    [field]: value
                }
            }));
        }
    };

    const handleTranslateAll = async () => {
        setGenerating(true);
        let successCount = 0;
        let failCount = 0;

        try {
            for (const locale of LOCALES) {
                if (locale.code === 'en') continue;

                try {
                    const response = await fetch("/api/ai/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            type: "scholarship_translation",
                            query: `Translate to ${locale.name}: ${JSON.stringify(formData)}`
                        }),
                    });

                    if (!response.ok) throw new Error("Failed");
                    const data = await response.json();

                    setTranslations(prev => ({
                        ...prev,
                        [locale.code]: {
                            ...(prev[locale.code] || {}), // preserve existing
                            // Only update translated fields
                            display_name: data.display_name || prev[locale.code]?.display_name || "",
                            description: data.description || prev[locale.code]?.description || "",
                            accommodation_type: data.accommodation_type || prev[locale.code]?.accommodation_type || "",
                            additional_benefits: data.additional_benefits || prev[locale.code]?.additional_benefits || [],
                            requirements: data.requirements || prev[locale.code]?.requirements || [],
                        }
                    }));
                    successCount++;
                } catch (e) {
                    console.error(e);
                    failCount++;
                }
            }
            if (failCount === 0) toast.success(`Translated to ${successCount} languages`);
            else toast.warning(`Translated to ${successCount}, failed ${failCount}`);
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Save Main Scholarship
            const mainData = {
                ...formData,
                university_id: universityId,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            };

            let currentScholarshipId = scholarshipId;

            if (scholarshipId === "new") {
                const { data, error } = await supabase.from("university_scholarships").insert([mainData]).select().single();
                if (error) throw error;
                currentScholarshipId = data.id;
            } else {
                const { error } = await supabase.from("university_scholarships").update(mainData).eq("id", scholarshipId);
                if (error) throw error;
            }

            // 2. Save Translations
            const upsertData = Object.entries(translations).map(([locale, data]) => ({
                scholarship_id: currentScholarshipId,
                locale,
                display_name: data.display_name,
                description: data.description,
                accommodation_type: data.accommodation_type,
                additional_benefits: data.additional_benefits,
                requirements: data.requirements,
                updated_at: new Date().toISOString(),
            }));

            if (upsertData.length > 0) {
                const { error: transError } = await supabase
                    .from("scholarship_translations")
                    .upsert(upsertData, { onConflict: 'scholarship_id, locale' });
                if (transError) throw transError;
            }

            toast.success("Saved successfully");
            router.push(`/admin/universities/${universityId}/scholarships`);
        } catch (error) {
            console.error("Error saving:", error);
            toast.error("Error saving scholarship");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/universities/${universityId}/scholarships`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">
                            {scholarshipId === "new" ? "Create Scholarship" : "Edit Scholarship"}
                        </h1>
                        <p className="text-muted-foreground">
                            {universityName}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleTranslateAll} disabled={generating || saving}>
                        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                        Translate All
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-8">
                            {LOCALES.map(locale => (
                                <TabsTrigger key={locale.code} value={locale.code} className="flex gap-2">
                                    {locale.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {LOCALES.map(locale => (
                            <TabsContent key={locale.code} value={locale.code}>
                                <ScholarshipFormContent
                                    locale={locale.code}
                                    isDefault={locale.code === "en"}
                                    data={getCombinedData(locale.code)}
                                    onChange={(field, value) => handleFieldChange(locale.code, field, value)}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-xs text-muted-foreground">Show to students</p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* Add more sidebar items if needed */}
                </div>
            </div>
        </div>
    );
}
