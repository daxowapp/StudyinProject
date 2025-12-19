import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export interface ScholarshipFormData {
    // Shared structure for both Main and Translation data
    type_name?: string; // Shared
    display_name: string; // Translated
    description: string; // Translated
    tuition_coverage_percentage?: number; // Shared
    duration_years?: number; // Shared
    includes_accommodation?: boolean; // Shared
    accommodation_type: string; // Translated
    includes_stipend?: boolean; // Shared
    stipend_amount_monthly?: number; // Shared
    stipend_currency?: string; // Shared
    stipend_duration_months?: number; // Shared
    includes_medical_insurance?: boolean; // Shared
    one_time_allowance?: number; // Shared
    one_time_allowance_currency?: string; // Shared
    service_fee_usd?: number; // Shared
    service_fee_cny?: number; // Shared
    display_order?: number; // Shared

    // Arrays
    additional_benefits?: string[]; // Translated
    requirements?: string[]; // Translated
}

interface ScholarshipFormContentProps {
    locale: string;
    isDefault: boolean;
    data: ScholarshipFormData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (field: keyof ScholarshipFormData, value: any) => void;
}

export function ScholarshipFormContent({ locale, isDefault, data, onChange }: ScholarshipFormContentProps) {
    const isReadOnlyShared = !isDefault;

    const handleArrayChange = (field: 'additional_benefits' | 'requirements', index: number, value: string) => {
        const newArray = [...(data[field] || [])];
        newArray[index] = value;
        onChange(field, newArray);
    };

    const addArrayItem = (field: 'additional_benefits' | 'requirements') => {
        onChange(field, [...(data[field] || []), ""]);
    };

    const removeArrayItem = (field: 'additional_benefits' | 'requirements', index: number) => {
        const newArray = (data[field] || []).filter((_, i) => i !== index);
        onChange(field, newArray);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Core details about the scholarship</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`type_name_${locale}`}>Type Name (e.g., Type A) *</Label>
                                <Input
                                    id={`type_name_${locale}`}
                                    value={data.type_name || ""}
                                    onChange={(e) => onChange("type_name", e.target.value)}
                                    placeholder="Type A"
                                    disabled={isReadOnlyShared}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`display_order_${locale}`}>Display Order</Label>
                                <Input
                                    id={`display_order_${locale}`}
                                    type="number"
                                    value={data.display_order || 0}
                                    onChange={(e) => onChange("display_order", parseInt(e.target.value) || 0)}
                                    disabled={isReadOnlyShared}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`display_name_${locale}`}>Display Name ({locale})</Label>
                            <Input
                                id={`display_name_${locale}`}
                                value={data.display_name || ""}
                                onChange={(e) => onChange("display_name", e.target.value)}
                                placeholder="Type A: Full Scholarship with Stipend"
                                dir={locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`description_${locale}`}>Description ({locale})</Label>
                            <Textarea
                                id={`description_${locale}`}
                                value={data.description || ""}
                                onChange={(e) => onChange("description", e.target.value)}
                                placeholder="Free tuition, free accommodation..."
                                rows={3}
                                dir={locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'}
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
                                <Label htmlFor={`coverage_${locale}`}>Coverage Percentage *</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id={`coverage_${locale}`}
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.tuition_coverage_percentage || 0}
                                        onChange={(e) => onChange("tuition_coverage_percentage", parseInt(e.target.value) || 0)}
                                        disabled={isReadOnlyShared}
                                    />
                                    <Badge className="text-lg px-4 py-2">
                                        {data.tuition_coverage_percentage}%
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`duration_${locale}`}>Duration (Years)</Label>
                                <Input
                                    id={`duration_${locale}`}
                                    type="number"
                                    min="1"
                                    value={data.duration_years || ""}
                                    onChange={(e) => onChange("duration_years", parseInt(e.target.value) || 1)}
                                    placeholder="4"
                                    disabled={isReadOnlyShared}
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
                                <Label htmlFor={`includes_accommodation_${locale}`}>Includes Accommodation</Label>
                                <p className="text-xs text-muted-foreground">Does this scholarship include housing?</p>
                            </div>
                            <Switch
                                id={`includes_accommodation_${locale}`}
                                checked={data.includes_accommodation || false}
                                onCheckedChange={(checked) => onChange("includes_accommodation", checked)}
                                disabled={isReadOnlyShared}
                            />
                        </div>

                        {data.includes_accommodation && (
                            <div className="space-y-2">
                                <Label htmlFor={`accommodation_type_${locale}`}>Accommodation Type ({locale})</Label>
                                <Input
                                    id={`accommodation_type_${locale}`}
                                    value={data.accommodation_type || ""}
                                    onChange={(e) => onChange("accommodation_type", e.target.value)}
                                    placeholder="Free university dormitory"
                                    dir={locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stipend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Salary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                            <div>
                                <Label htmlFor={`includes_stipend_${locale}`}>Includes Salary</Label>
                                <p className="text-xs text-muted-foreground">Monthly living allowance</p>
                            </div>
                            <Switch
                                id={`includes_stipend_${locale}`}
                                checked={data.includes_stipend || false}
                                onCheckedChange={(checked) => onChange("includes_stipend", checked)}
                                disabled={isReadOnlyShared}
                            />
                        </div>

                        {data.includes_stipend && (
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`stipend_amount_${locale}`}>Amount/Month</Label>
                                    <Input
                                        id={`stipend_amount_${locale}`}
                                        type="number"
                                        min="0"
                                        value={data.stipend_amount_monthly || 0}
                                        onChange={(e) => onChange("stipend_amount_monthly", parseFloat(e.target.value) || 0)}
                                        placeholder="2500"
                                        disabled={isReadOnlyShared}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stipend_currency_${locale}`}>Currency</Label>
                                    <Input
                                        id={`stipend_currency_${locale}`}
                                        value={data.stipend_currency || "CNY"}
                                        onChange={(e) => onChange("stipend_currency", e.target.value)}
                                        placeholder="CNY"
                                        disabled={isReadOnlyShared}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stipend_duration_${locale}`}>Months/Year</Label>
                                    <Input
                                        id={`stipend_duration_${locale}`}
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={data.stipend_duration_months || 12}
                                        onChange={(e) => onChange("stipend_duration_months", parseInt(e.target.value) || 12)}
                                        placeholder="12"
                                        disabled={isReadOnlyShared}
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
                                <Label htmlFor={`includes_medical_${locale}`}>Medical Insurance</Label>
                                <p className="text-xs text-muted-foreground">Includes health insurance</p>
                            </div>
                            <Switch
                                id={`includes_medical_${locale}`}
                                checked={data.includes_medical_insurance || false}
                                onCheckedChange={(checked) => onChange("includes_medical_insurance", checked)}
                                disabled={isReadOnlyShared}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`one_time_allowance_${locale}`}>One-Time Allowance (Optional)</Label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    id={`one_time_allowance_${locale}`}
                                    type="number"
                                    min="0"
                                    value={data.one_time_allowance || 0}
                                    onChange={(e) => onChange("one_time_allowance", parseFloat(e.target.value) || 0)}
                                    placeholder="10000"
                                    disabled={isReadOnlyShared}
                                />
                                <Input
                                    value={data.one_time_allowance_currency || "CNY"}
                                    onChange={(e) => onChange("one_time_allowance_currency", e.target.value)}
                                    placeholder="CNY"
                                    disabled={isReadOnlyShared}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">One-time cash allowance (e.g., 10000 RMB)</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Arrays: Additional Benefits & Requirements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Lists ({locale})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Additional Benefits</Label>
                            {(data.additional_benefits || []).map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => handleArrayChange("additional_benefits", index, e.target.value)}
                                        dir={locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem("additional_benefits", index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("additional_benefits")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Benefit
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Requirements</Label>
                            {(data.requirements || []).map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                                        dir={locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem("requirements", index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("requirements")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Requirement
                            </Button>
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
                                <Label htmlFor={`service_fee_usd_${locale}`}>Service Fee (USD) *</Label>
                                <Input
                                    id={`service_fee_usd_${locale}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.service_fee_usd || 0}
                                    onChange={(e) => onChange("service_fee_usd", parseFloat(e.target.value) || 0)}
                                    placeholder="3500.00"
                                    disabled={isReadOnlyShared}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`service_fee_cny_${locale}`}>Service Fee (CNY) *</Label>
                                <Input
                                    id={`service_fee_cny_${locale}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.service_fee_cny || 0}
                                    onChange={(e) => onChange("service_fee_cny", parseFloat(e.target.value) || 0)}
                                    placeholder="25000.00"
                                    disabled={isReadOnlyShared}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar with Preview (Optional: currently hiding it or could pass it as well if needed) */}
            {/* For now, we will render the sidebar in the parent page using the english/current data context if desired. 
                But the user asked for "tabs in top and under each tab all options".
                The sidebar is usually "Status" and "Preview". 
                I will omit the sidebar integration here and leave it to the parent page to render it 
                or pass it in if we want it inside the tab content. 
                Actually, the sidebar is likely global for the scholarship, not per-tab, 
                EXCEPT for the preview which should reflect the current tab's language?
                
                Let's stick to the user screenshot which shows the sidebar on the right.
                For simplicity in this component, I'll just return the main form column div.
            */}
        </div>
    );
}
