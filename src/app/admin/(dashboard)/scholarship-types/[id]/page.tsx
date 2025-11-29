"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function EditScholarshipTypePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        display_name: "",
        description: "",
        tuition_coverage_percentage: 0,
        service_fee_usd: 0,
        service_fee_cny: 0,
        includes_accommodation: false,
        includes_stipend: false,
        stipend_amount_monthly: 0,
        benefits: [] as string[],
        requirements: [] as string[],
        is_active: true,
        display_order: 0,
    });

    const [newBenefit, setNewBenefit] = useState("");
    const [newRequirement, setNewRequirement] = useState("");

    useEffect(() => {
        if (id && id !== "new") {
            fetchScholarshipType();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchScholarshipType = async () => {
        try {
            const { data, error } = await supabase
                .from("scholarship_types")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    name: data.name || "",
                    display_name: data.display_name || "",
                    description: data.description || "",
                    tuition_coverage_percentage: data.tuition_coverage_percentage || 0,
                    service_fee_usd: Number(data.service_fee_usd) || 0,
                    service_fee_cny: Number(data.service_fee_cny) || 0,
                    includes_accommodation: data.includes_accommodation || false,
                    includes_stipend: data.includes_stipend || false,
                    stipend_amount_monthly: Number(data.stipend_amount_monthly) || 0,
                    benefits: data.benefits || [],
                    requirements: data.requirements || [],
                    is_active: data.is_active ?? true,
                    display_order: data.display_order || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching scholarship type:", error);
            alert("Error loading scholarship type");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const dataToSave = {
                ...formData,
                updated_at: new Date().toISOString(),
            };

            if (id === "new") {
                const { error } = await supabase
                    .from("scholarship_types")
                    .insert([dataToSave]);

                if (error) throw error;
                alert("Scholarship type created successfully!");
            } else {
                const { error } = await supabase
                    .from("scholarship_types")
                    .update(dataToSave)
                    .eq("id", id);

                if (error) throw error;
                alert("Scholarship type updated successfully!");
            }

            router.push("/admin/scholarship-types");
        } catch (error) {
            console.error("Error saving scholarship type:", error);
            alert("Error saving scholarship type");
        } finally {
            setSaving(false);
        }
    };

    const addBenefit = () => {
        if (newBenefit.trim()) {
            setFormData({
                ...formData,
                benefits: [...formData.benefits, newBenefit.trim()],
            });
            setNewBenefit("");
        }
    };

    const removeBenefit = (index: number) => {
        setFormData({
            ...formData,
            benefits: formData.benefits.filter((_, i) => i !== index),
        });
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, newRequirement.trim()],
            });
            setNewRequirement("");
        }
    };

    const removeRequirement = (index: number) => {
        setFormData({
            ...formData,
            requirements: formData.requirements.filter((_, i) => i !== index),
        });
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/scholarship-types">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">
                            {id === "new" ? "Create Scholarship Type" : "Edit Scholarship Type"}
                        </h1>
                        <p className="text-muted-foreground">
                            {id === "new" ? "Add a new scholarship type" : "Update scholarship type details"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Core details about the scholarship type</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name (e.g., Type A) *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Type A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="display_name">Display Name *</Label>
                                    <Input
                                        id="display_name"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        placeholder="Full Scholarship (Type A)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this scholarship type"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                />
                                <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Details</CardTitle>
                            <CardDescription>Coverage and service fees</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="coverage">Tuition Coverage Percentage *</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="coverage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.tuition_coverage_percentage}
                                        onChange={(e) => setFormData({ ...formData, tuition_coverage_percentage: parseInt(e.target.value) || 0 })}
                                    />
                                    <Badge className="text-lg px-4 py-2">
                                        {formData.tuition_coverage_percentage}%
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="service_fee_usd">Service Fee (USD) *</Label>
                                    <Input
                                        id="service_fee_usd"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.service_fee_usd}
                                        onChange={(e) => setFormData({ ...formData, service_fee_usd: parseFloat(e.target.value) || 0 })}
                                        placeholder="3500.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service_fee_cny">Service Fee (CNY) *</Label>
                                    <Input
                                        id="service_fee_cny"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.service_fee_cny}
                                        onChange={(e) => setFormData({ ...formData, service_fee_cny: parseFloat(e.target.value) || 0 })}
                                        placeholder="25000.00"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                <div>
                                    <Label htmlFor="includes_accommodation">Includes Accommodation</Label>
                                    <p className="text-xs text-muted-foreground">Does this scholarship include housing?</p>
                                </div>
                                <Switch
                                    id="includes_accommodation"
                                    checked={formData.includes_accommodation}
                                    onCheckedChange={(checked) => setFormData({ ...formData, includes_accommodation: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                <div>
                                    <Label htmlFor="includes_stipend">Includes Stipend</Label>
                                    <p className="text-xs text-muted-foreground">Does this scholarship include monthly stipend?</p>
                                </div>
                                <Switch
                                    id="includes_stipend"
                                    checked={formData.includes_stipend}
                                    onCheckedChange={(checked) => setFormData({ ...formData, includes_stipend: checked })}
                                />
                            </div>

                            {formData.includes_stipend && (
                                <div className="space-y-2">
                                    <Label htmlFor="stipend_amount">Monthly Stipend Amount</Label>
                                    <Input
                                        id="stipend_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.stipend_amount_monthly}
                                        onChange={(e) => setFormData({ ...formData, stipend_amount_monthly: parseFloat(e.target.value) || 0 })}
                                        placeholder="1000.00"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Benefits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Benefits</CardTitle>
                            <CardDescription>What's included with this scholarship type</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    placeholder="Add a benefit..."
                                    onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                                />
                                <Button onClick={addBenefit} type="button">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                        <span className="flex-1">{benefit}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeBenefit(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {formData.benefits.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No benefits added yet
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                            <CardDescription>Eligibility requirements for this scholarship</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    placeholder="Add a requirement..."
                                    onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                                />
                                <Button onClick={addRequirement} type="button">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.requirements.map((requirement, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                        <span className="flex-1">{requirement}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRequirement(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {formData.requirements.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No requirements added yet
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Show this scholarship type to students
                                    </p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Badge>{formData.name}</Badge>
                                </div>
                                <h3 className="font-bold text-lg">{formData.display_name || "Display Name"}</h3>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold text-primary">
                                        {formData.tuition_coverage_percentage}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">Coverage</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">USD:</span>
                                        <span className="font-bold">${formData.service_fee_usd.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">CNY:</span>
                                        <span className="font-semibold">¥{formData.service_fee_cny.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
