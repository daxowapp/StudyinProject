"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, ClipboardList, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { toast } from "sonner";
import { ProgramTranslations, ProgramTranslationData } from "../../universities/components/ProgramTranslations";

interface Program {
    id: string;
    university_id: string;
    program_catalog_id: string;
    custom_title: string;
    display_title: string;
    duration: string;
    intake: string;
    tuition_fee: number;
    currency: string;
    language_id: string;
    scholarship_chance: string;
    application_fee: number;
    deadline: string;
    is_active: boolean;
    description: string;
    requirements: string[];
    career_prospects: string[];
    university_name?: string;
}

export default function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [program, setProgram] = useState<Program | null>(null);
    const [translations, setTranslations] = useState<ProgramTranslationData[]>([]);

    const [formData, setFormData] = useState({
        custom_title: "",
        description: "",
        requirements: [] as string[],
        career_prospects: [] as string[],
        is_active: true,
    });

    useEffect(() => {
        fetchProgram();
        fetchTranslations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProgram = async () => {
        try {
            const { data, error } = await supabase
                .from("v_university_programs_full")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            setProgram(data);
            setFormData({
                custom_title: data.custom_title || data.display_title || "",
                description: data.description || "",
                requirements: data.requirements || [],
                career_prospects: data.career_prospects || [],
                is_active: data.is_active ?? true,
            });
        } catch (error) {
            console.error("Error fetching program:", error);
            toast.error("Error loading program");
        } finally {
            setLoading(false);
        }
    };

    const fetchTranslations = async () => {
        try {
            const { data } = await supabase
                .from("program_translations")
                .select("*")
                .eq("program_id", id);
            setTranslations(data || []);
        } catch (error) {
            console.error("Error fetching translations:", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from("university_programs")
                .update({
                    custom_title: formData.custom_title,
                    description: formData.description,
                    requirements: formData.requirements,
                    career_prospects: formData.career_prospects,
                    is_active: formData.is_active,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id);

            if (error) throw error;

            toast.success("Program updated successfully");
        } catch (error) {
            console.error("Error saving program:", error);
            toast.error("Error saving program");
        } finally {
            setSaving(false);
        }
    };

    const addArrayItem = (field: 'requirements' | 'career_prospects') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], ""],
        }));
    };

    const updateArrayItem = (field: 'requirements' | 'career_prospects', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const removeArrayItem = (field: 'requirements' | 'career_prospects', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!program) {
        return <div className="p-8">Program not found</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/programs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">Edit Program</h1>
                        <p className="text-muted-foreground">
                            {program.display_title} - {program.university_name}
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="details" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="requirements">Admission Requirements</TabsTrigger>
                    <TabsTrigger value="translations">Translations</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Program Information</CardTitle>
                            <CardDescription>Edit the program details and description</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Custom Title</Label>
                                <Input
                                    value={formData.custom_title}
                                    onChange={(e) => setFormData({ ...formData, custom_title: e.target.value })}
                                    placeholder="Custom program title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    placeholder="Program description..."
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                            <CardDescription>Program admission requirements</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={req}
                                        onChange={(e) => updateArrayItem("requirements", index, e.target.value)}
                                        placeholder="Requirement..."
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem("requirements", index)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("requirements")}>
                                Add Requirement
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Career Prospects</CardTitle>
                            <CardDescription>Potential career paths for graduates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.career_prospects.map((prospect, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={prospect}
                                        onChange={(e) => updateArrayItem("career_prospects", index, e.target.value)}
                                        placeholder="Career prospect..."
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem("career_prospects", index)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("career_prospects")}>
                                Add Career Prospect
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Requirements Tab */}
                <TabsContent value="requirements">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                Admission Requirements
                            </CardTitle>
                            <CardDescription>
                                Manage custom admission requirements for this program.
                                By default, programs inherit requirements from their university.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium">Program-Specific Requirements</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Some programs have special requirements that differ from the university&apos;s standard requirements.
                                    You can enable custom requirements for this program and manage them separately.
                                </p>
                                <Link href={`/admin/programs/${id}/requirements`}>
                                    <Button>
                                        <ClipboardList className="h-4 w-4 mr-2" />
                                        Manage Requirements
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Translations Tab */}
                <TabsContent value="translations">
                    <ProgramTranslations
                        programId={id}
                        initialTranslations={translations}
                        baseData={{
                            title: formData.custom_title || program.display_title,
                            description: formData.description,
                            requirements: formData.requirements,
                            career_prospects: formData.career_prospects,
                        }}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
