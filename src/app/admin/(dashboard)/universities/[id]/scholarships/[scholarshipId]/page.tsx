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
import { ArrowLeft, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function EditUniversityScholarshipPage() {
    const router = useRouter();
    const params = useParams();
    const universityId = params?.id as string;
    const scholarshipId = params?.scholarshipId as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [universityName, setUniversityName] = useState("");
    const [formData, setFormData] = useState({
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
        is_active: true,
        display_order: 0,
    });

    useEffect(() => {
        fetchUniversity();
        if (scholarshipId && scholarshipId !== "new") {
            fetchScholarship();
        } else {
            setLoading(false);
        }
    }, [scholarshipId]);

    const fetchUniversity = async () => {
        try {
            const { data, error } = await supabase
                .from("universities")
                .select("name")
                .eq("id", universityId)
                .single();

            if (error) throw error;
            if (data) setUniversityName(data.name);
        } catch (error) {
            console.error("Error fetching university:", error);
        }
    };

    const fetchScholarship = async () => {
        try {
            const { data, error } = await supabase
                .from("university_scholarships")
                .select("*")
                .eq("id", scholarshipId)
                .single();

            if (error) throw error;

            if (data) {
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
                    is_active: data.is_active ?? true,
                    display_order: data.display_order || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching scholarship:", error);
            alert("Error loading scholarship");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const dataToSave = {
                ...formData,
                university_id: universityId,
                updated_at: new Date().toISOString(),
            };

            if (scholarshipId === "new") {
                const { error } = await supabase
                    .from("university_scholarships")
                    .insert([dataToSave]);

                if (error) throw error;
                alert("Scholarship created successfully!");
            } else {
                const { error } = await supabase
                    .from("university_scholarships")
                    .update(dataToSave)
                    .eq("id", scholarshipId);

                if (error) throw error;
                alert("Scholarship updated successfully!");
            }

            router.push(`/admin/universities/${universityId}/scholarships`);
        } catch (error) {
            console.error("Error saving scholarship:", error);
            alert("Error saving scholarship");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

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
                            {universityName} - {scholarshipId === "new" ? "Add a new scholarship type" : "Update scholarship details"}
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
                            <CardDescription>Core details about the scholarship</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type_name">Type Name (e.g., Type A) *</Label>
                                    <Input
                                        id="type_name"
                                        value={formData.type_name}
                                        onChange={(e) => setFormData({ ...formData, type_name: e.target.value })}
                                        placeholder="Type A"
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
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_name">Display Name</Label>
                                <Input
                                    id="display_name"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    placeholder="Type A: Full Scholarship with Stipend"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Free tuition, free accommodation on campus and 2500RMB/month stipend"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tuition Coverage */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tuition Coverage</CardTitle>
                            <CardDescription>How much tuition is covered</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="coverage">Coverage Percentage *</Label>
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
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (Years)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        value={formData.duration_years}
                                        onChange={(e) => setFormData({ ...formData, duration_years: parseInt(e.target.value) || 1 })}
                                        placeholder="4"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty for full program duration</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Accommodation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Accommodation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                            {formData.includes_accommodation && (
                                <div className="space-y-2">
                                    <Label htmlFor="accommodation_type">Accommodation Type</Label>
                                    <Input
                                        id="accommodation_type"
                                        value={formData.accommodation_type}
                                        onChange={(e) => setFormData({ ...formData, accommodation_type: e.target.value })}
                                        placeholder="Free university dormitory"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stipend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Stipend</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                <div>
                                    <Label htmlFor="includes_stipend">Includes Stipend</Label>
                                    <p className="text-xs text-muted-foreground">Monthly living allowance</p>
                                </div>
                                <Switch
                                    id="includes_stipend"
                                    checked={formData.includes_stipend}
                                    onCheckedChange={(checked) => setFormData({ ...formData, includes_stipend: checked })}
                                />
                            </div>

                            {formData.includes_stipend && (
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stipend_amount">Amount/Month</Label>
                                        <Input
                                            id="stipend_amount"
                                            type="number"
                                            min="0"
                                            value={formData.stipend_amount_monthly}
                                            onChange={(e) => setFormData({ ...formData, stipend_amount_monthly: parseFloat(e.target.value) || 0 })}
                                            placeholder="2500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stipend_currency">Currency</Label>
                                        <Input
                                            id="stipend_currency"
                                            value={formData.stipend_currency}
                                            onChange={(e) => setFormData({ ...formData, stipend_currency: e.target.value })}
                                            placeholder="CNY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stipend_duration">Months/Year</Label>
                                        <Input
                                            id="stipend_duration"
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={formData.stipend_duration_months}
                                            onChange={(e) => setFormData({ ...formData, stipend_duration_months: parseInt(e.target.value) || 12 })}
                                            placeholder="12"
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Other Benefits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Other Benefits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                <div>
                                    <Label htmlFor="includes_medical">Medical Insurance</Label>
                                    <p className="text-xs text-muted-foreground">Includes health insurance</p>
                                </div>
                                <Switch
                                    id="includes_medical"
                                    checked={formData.includes_medical_insurance}
                                    onCheckedChange={(checked) => setFormData({ ...formData, includes_medical_insurance: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="one_time_allowance">One-Time Allowance (Optional)</Label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        id="one_time_allowance"
                                        type="number"
                                        min="0"
                                        value={formData.one_time_allowance}
                                        onChange={(e) => setFormData({ ...formData, one_time_allowance: parseFloat(e.target.value) || 0 })}
                                        placeholder="10000"
                                    />
                                    <Input
                                        value={formData.one_time_allowance_currency}
                                        onChange={(e) => setFormData({ ...formData, one_time_allowance_currency: e.target.value })}
                                        placeholder="CNY"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">One-time cash allowance (e.g., 10000 RMB)</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Fees */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Fees</CardTitle>
                            <CardDescription>What students pay for application support</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                        Show this scholarship to students
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
                                    <Badge>{formData.type_name || "Type Name"}</Badge>
                                </div>
                                <h3 className="font-bold text-lg">{formData.display_name || "Display Name"}</h3>
                                <p className="text-sm text-muted-foreground">{formData.description || "Description"}</p>
                                
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold text-primary">
                                        {formData.tuition_coverage_percentage}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">Tuition Coverage</p>
                                    {formData.duration_years && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formData.duration_years} year{formData.duration_years > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm">
                                    {formData.includes_accommodation && (
                                        <div className="flex items-center gap-2">
                                            <span>🏠</span>
                                            <span>{formData.accommodation_type || "Accommodation"}</span>
                                        </div>
                                    )}
                                    {formData.includes_stipend && (
                                        <div className="flex items-center gap-2">
                                            <span>💰</span>
                                            <span>{formData.stipend_amount_monthly} {formData.stipend_currency}/month</span>
                                        </div>
                                    )}
                                    {formData.includes_medical_insurance && (
                                        <div className="flex items-center gap-2">
                                            <span>🏥</span>
                                            <span>Medical Insurance</span>
                                        </div>
                                    )}
                                    {formData.one_time_allowance > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span>💵</span>
                                            <span>{formData.one_time_allowance} {formData.one_time_allowance_currency}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Service Fee (USD):</span>
                                        <span className="font-bold">${formData.service_fee_usd.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Service Fee (CNY):</span>
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
