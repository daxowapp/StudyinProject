"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { createProgram, updateProgram, deleteProgram } from "../actions";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2, BookOpen, FileText, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AiGeneratorButton } from "@/components/admin/AiGeneratorButton";

interface Program {
    id: string;
    university_id: string;
    program_catalog_id: string;
    custom_title: string;
    duration: string;
    intake: string;
    tuition_fee: number;
    currency: string;
    language_id: string;
    scholarship_chance: string;
    application_fee: number;
    service_fee: number;
    deadline: string;
    is_active: boolean;
    has_force_payment: boolean;
}

interface University {
    id: string;
    name: string;
}

interface Language {
    id: string;
    name: string;
}

interface ProgramDialogProps {
    program?: Program;
    universities: University[];
    languages: Language[];
    trigger?: React.ReactNode;
    universityId?: string;
    onSuccess?: () => void;
}

export function ProgramDialog({ program, universities, languages, trigger, universityId, onSuccess }: ProgramDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCatalogProgram, setSelectedCatalogProgram] = useState<Record<string, unknown> | null>(null);
    const [programCatalog, setProgramCatalog] = useState<Record<string, unknown>[]>([]);
    const [admissionRequirements, setAdmissionRequirements] = useState<Record<string, unknown>[]>([]);
    const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
    const [formState, setFormState] = useState({
        university_id: program?.university_id || universityId || "",
        program_catalog_id: program?.program_catalog_id || "",
        custom_title: program?.custom_title || "",
        duration: program?.duration || "",
        intake: program?.intake || "",
        tuition_fee: program?.tuition_fee || "",
        currency: program?.currency || "RMB",
        language_id: program?.language_id || "",
        scholarship_chance: program?.scholarship_chance || "",
        application_fee: program?.application_fee || "",
        service_fee: program?.service_fee || "",
        deadline: program?.deadline || "",
        is_active: program?.is_active ?? true,
        has_force_payment: program?.has_force_payment ?? false,
    });

    useEffect(() => {
        if (program) {
            setFormState({
                university_id: program.university_id || "",
                program_catalog_id: program.program_catalog_id || "",
                custom_title: program.custom_title || "",
                duration: program.duration || "",
                intake: program.intake || "",
                tuition_fee: program.tuition_fee || "",
                currency: program.currency || "RMB",
                language_id: program.language_id || "",
                scholarship_chance: program.scholarship_chance || "",
                application_fee: program.application_fee || "",
                service_fee: program.service_fee || "",
                deadline: program.deadline || "",
                is_active: program.is_active ?? true,
                has_force_payment: program.has_force_payment ?? false,
            });
        }
    }, [program]);

    // Calculate AI Query
    const selectedUniversity = universities.find(u => u.id === formState.university_id);
    const selectedProgramFromCatalog = programCatalog.find(p => p.id === formState.program_catalog_id);

    const aiQuery = [
        formState.custom_title || selectedProgramFromCatalog?.title,
        selectedUniversity?.name
    ].filter(Boolean).join(" at ");

    const handleAiDataReceived = (rawData: unknown) => {
        const data = rawData as Record<string, unknown>;
        setFormState(prev => ({
            ...prev,
            custom_title: (data.title as string) || prev.custom_title,
            duration: (data.duration as string) || prev.duration,
            tuition_fee: (data.tuition_fee as string | number) || prev.tuition_fee,
            currency: (data.currency as string) || prev.currency,
            scholarship_chance: (data.scholarship_chance as string) || prev.scholarship_chance,
            application_fee: (data.application_fee as number) || prev.application_fee,
            service_fee: (data.service_fee as number) || prev.service_fee,
            deadline: (data.deadline as string) || prev.deadline,
        }));

        // Try to match language if possible
        if (data.language && typeof data.language === 'string') {
            const langStr = data.language as string;
            const matchedLang = languages.find(l => l.name.toLowerCase().includes(langStr.toLowerCase()));
            if (matchedLang) {
                setFormState(prev => ({ ...prev, language_id: matchedLang.id }));
            }
        }
    };

    // Fetch program catalog and admission requirements from database
    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            // Fetch program catalog
            const { data: catalogData, error: catalogError } = await supabase
                .from("program_catalog")
                .select("*")
                .order("category", { ascending: true })
                .order("title", { ascending: true });

            if (catalogError) {
                console.error("Error fetching program catalog:", catalogError);
                toast.error("Failed to load program catalog");
            } else {
                setProgramCatalog(catalogData || []);
            }

            // Fetch admission requirements catalog
            const { data: requirementsData, error: requirementsError } = await supabase
                .from("admission_requirements_catalog")
                .select("*")
                .order("category", { ascending: true })
                .order("title", { ascending: true });

            if (requirementsError) {
                console.error("Error fetching admission requirements:", requirementsError);
            } else {
                setAdmissionRequirements(requirementsData.map((req: Record<string, unknown>) => ({ ...req, category: req.category || 'other' })));
            }

            // If editing, fetch selected requirements
            if (program?.id) {
                const { data: selectedReqs } = await supabase
                    .from("university_admission_requirements")
                    .select("requirement_id")
                    .eq("university_id", program.university_id);

                if (selectedReqs) {
                    setSelectedRequirements(selectedReqs.map((r: { requirement_id: string }) => r.requirement_id));
                }
            }
        };

        if (open) {
            fetchData();
        }
    }, [open, program]);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = program
                ? await updateProgram(program.id, formData)
                : await createProgram(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(program ? "Program updated" : "Program created");
                setOpen(false);
                if (onSuccess) onSuccess();
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure?")) return;

        setIsLoading(true);
        try {
            if (program?.id) {
                const result = await deleteProgram(program.id);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Program deleted");
                    setOpen(false);
                    if (onSuccess) onSuccess();
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (program ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Program
                    </Button>
                ))}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {program ? "Edit University Program" : "Add Program to University"}
                    </DialogTitle>
                    <DialogDescription>
                        Select a program from the catalog and add university-specific details.
                    </DialogDescription>
                    <div className="mt-2">
                        <AiGeneratorButton
                            type="program"
                            onDataReceived={handleAiDataReceived}
                            initialQuery={aiQuery}
                            buttonText="Auto-fill Program Details"
                        />
                    </div>
                </DialogHeader>
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Program Details
                        </TabsTrigger>
                        <TabsTrigger value="requirements">
                            <FileText className="h-4 w-4 mr-2" />
                            Admission Requirements
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <form action={handleSubmit} className="grid gap-6 py-4">
                            {/* University Selection */}
                            <div className="grid gap-2">
                                <Label htmlFor="university_id">University *</Label>
                                <Select
                                    name="university_id"
                                    value={formState.university_id}
                                    onValueChange={(val) => setFormState({ ...formState, university_id: val })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select University" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {universities?.map((uni) => (
                                            <SelectItem key={uni.id} value={uni.id}>
                                                {uni.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            {/* Program Catalog Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold">Select from Program Catalog</h3>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="program_catalog_id">Standard Program *</Label>
                                    <Select
                                        name="program_catalog_id"
                                        value={formState.program_catalog_id}
                                        onValueChange={(value) => {
                                            setSelectedCatalogProgram(programCatalog.find((p: Record<string, unknown>) => p.id === value) || null);
                                            setFormState({ ...formState, program_catalog_id: value });
                                        }}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a program from catalog" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programCatalog.map((program: Record<string, unknown>) => (
                                                <SelectItem key={program.id as string} value={program.id as string}>
                                                    {(program.title as string)} ({(program.level as string)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedCatalogProgram && (
                                        <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    {selectedCatalogProgram.category as string}
                                                </Badge>
                                                <div className="text-sm text-muted-foreground">
                                                    Level: {selectedCatalogProgram.level as string} |
                                                    Duration: {selectedCatalogProgram.duration as string} months |
                                                    Language: {selectedCatalogProgram.language as string}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Custom Title (Optional) */}
                                <div className="grid gap-2">
                                    <Label htmlFor="custom_title">
                                        Custom Title
                                        <span className="text-muted-foreground text-xs ml-2">
                                            (Optional - if university calls it differently)
                                        </span>
                                    </Label>
                                    <Input
                                        id="custom_title"
                                        name="custom_title"
                                        value={formState.custom_title}
                                        onChange={(e) => setFormState({ ...formState, custom_title: e.target.value })}
                                        placeholder="e.g. Business Management (if different from catalog)"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* University-Specific Details */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">University-Specific Details</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="duration">Duration (Override if different)</Label>
                                        <Input
                                            id="duration"
                                            name="duration"
                                            value={formState.duration}
                                            onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                                            placeholder={(selectedCatalogProgram?.typical_duration as string) || "e.g. 4 Years"}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="intake">Intake</Label>
                                        <Input
                                            id="intake"
                                            name="intake"
                                            value={formState.intake}
                                            onChange={(e) => setFormState({ ...formState, intake: e.target.value })}
                                            placeholder="e.g. September 2025"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tuition_fee">Tuition Fee (Yearly) *</Label>
                                        <Input
                                            id="tuition_fee"
                                            name="tuition_fee"
                                            type="number"
                                            value={formState.tuition_fee}
                                            onChange={(e) => setFormState({ ...formState, tuition_fee: e.target.value })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select
                                            name="currency"
                                            value={formState.currency}
                                            onValueChange={(val) => setFormState({ ...formState, currency: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="RMB">RMB</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="language_id">Language *</Label>
                                        <Select
                                            name="language_id"
                                            value={formState.language_id}
                                            onValueChange={(val) => setFormState({ ...formState, language_id: val })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languages?.map((lang) => (
                                                    <SelectItem key={lang.id} value={lang.id}>
                                                        {lang.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="scholarship_chance">Scholarship Chance</Label>
                                        <Input
                                            id="scholarship_chance"
                                            name="scholarship_chance"
                                            value={formState.scholarship_chance}
                                            onChange={(e) => setFormState({ ...formState, scholarship_chance: e.target.value })}
                                            placeholder="e.g. 10-100%"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="application_fee">Application Fee ($)</Label>
                                        <Input
                                            id="application_fee"
                                            name="application_fee"
                                            type="number"
                                            value={formState.application_fee}
                                            onChange={(e) => setFormState({ ...formState, application_fee: e.target.value })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="service_fee">Service Fee ($)</Label>
                                        <Input
                                            id="service_fee"
                                            name="service_fee"
                                            type="number"
                                            value={formState.service_fee}
                                            onChange={(e) => setFormState({ ...formState, service_fee: e.target.value })}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="deadline">Application Deadline</Label>
                                    <Input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        value={formState.deadline}
                                        onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        name="is_active"
                                        checked={formState.is_active}
                                        onCheckedChange={(checked) => setFormState({ ...formState, is_active: checked })}
                                    />
                                    <Label htmlFor="is_active">Active Program</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="has_force_payment"
                                        name="has_force_payment"
                                        checked={formState.has_force_payment}
                                        onCheckedChange={(checked) => setFormState({ ...formState, has_force_payment: checked })}
                                    />
                                    <Label htmlFor="has_force_payment" className="text-red-600 font-medium">Force Payment</Label>
                                </div>
                            </div>

                            <DialogFooter className="flex justify-between sm:justify-between">
                                {program && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? "Saving..." : (program ? "Update Program" : "Add Program")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="requirements" className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-4">
                            Select admission requirements for this program. These will be displayed on the program page.
                        </div>

                        {/* Group requirements by category */}
                        {['academic', 'language', 'document', 'financial', 'other'].map((category) => {
                            const categoryReqs = admissionRequirements.filter((req: Record<string, unknown>) => req.category === category);
                            if (categoryReqs.length === 0) return null;

                            return (
                                <div key={category} className="space-y-3">
                                    <h3 className="font-semibold capitalize flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        {category} Requirements
                                    </h3>
                                    <div className="grid gap-2 pl-6">
                                        {categoryReqs.map((req: Record<string, unknown>) => (
                                            <div key={req.id as string} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/50">
                                                <Checkbox
                                                    id={req.id as string}
                                                    checked={selectedRequirements.includes(req.id as string)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedRequirements([...selectedRequirements, req.id as string]);
                                                        } else {
                                                            setSelectedRequirements(selectedRequirements.filter(id => id !== req.id));
                                                        }
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <Label htmlFor={req.id as string} className="font-medium cursor-pointer">
                                                        {req.title as string}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {req.description as string}
                                                    </p>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {String(req.requirement_type)}
                                                        </Badge>
                                                        {!!req.is_common && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Common
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Separator />
                                </div>
                            );
                        })}

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={async () => {
                                    if (!program?.university_id) {
                                        toast.error("Please save the program first before adding requirements");
                                        return;
                                    }

                                    setIsLoading(true);
                                    try {
                                        const supabase = createClient();

                                        // Delete existing requirements
                                        await supabase
                                            .from("university_admission_requirements")
                                            .delete()
                                            .eq("university_id", program.university_id);

                                        // Insert new requirements
                                        if (selectedRequirements.length > 0) {
                                            const { error: insertError } = await supabase
                                                .from("university_admission_requirements")
                                                .insert(
                                                    selectedRequirements.map((reqId, index) => ({
                                                        university_id: program.university_id,
                                                        requirement_id: reqId,
                                                        is_required: true,
                                                        display_order: index
                                                    }))
                                                );
                                            if (insertError) throw insertError;
                                        }

                                        toast.success("Admission requirements updated");
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Failed to save program");
                                        toast.error("Failed to update requirements");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }
                                }
                                disabled={isLoading || !program?.university_id
                                }
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Requirements
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
