"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Plus, Trash2, Edit2, Loader2, BookOpen, FileText, DollarSign, Info, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
    getUniversityRequirements,
    getRequirementsCatalog,
    addRequirementToUniversity,
    removeRequirementFromUniversity,
    updateRequirementNote,
    bulkAddRequirements
} from "./actions";

interface RequirementsManagerProps {
    universityId: string;
}

interface Requirement {
    id: string;
    title: string;
    category: string;
    requirement_type: string;
    description: string;
}

interface UniversityRequirement {
    requirement_id: string;
    university_id: string;
    title: string;
    category: string;
    requirement_type: string;
    description: string;
    is_required: boolean;
    custom_note: string | null;
    display_order: number;
}

interface UniversityProgram {
    id: string;
    display_title: string;
    program_title: string;
    level: string;
    has_custom_requirements: boolean;
}

export function RequirementsManager({ universityId }: RequirementsManagerProps) {
    const [loading, setLoading] = useState(true);
    const [universityRequirements, setUniversityRequirements] = useState<UniversityRequirement[]>([]);
    const [catalog, setCatalog] = useState<Requirement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [editingRequirement, setEditingRequirement] = useState<UniversityRequirement | null>(null);
    const [customNote, setCustomNote] = useState("");
    const [isRequired, setIsRequired] = useState(true);
    const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(new Set());
    const [programs, setPrograms] = useState<UniversityProgram[]>([]);
    const [updatingProgram, setUpdatingProgram] = useState<string | null>(null);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [universityId]);

    const loadData = async () => {
        try {
            const supabase = createClient();

            const [requirements, catalogData] = await Promise.all([
                getUniversityRequirements(universityId),
                getRequirementsCatalog()
            ]);
            setUniversityRequirements(requirements || []);
            setCatalog(catalogData || []);

            // Fetch university programs
            const { data: programsData } = await supabase
                .from("v_university_programs_full")
                .select("id, display_title, program_title, level, has_custom_requirements")
                .eq("university_id", universityId)
                .eq("is_active", true)
                .order("display_title");

            setPrograms(programsData || []);
        } catch (error: unknown) {
            toast.error("Error loading requirements: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleProgramCustomRequirements = async (programId: string, enabled: boolean) => {
        setUpdatingProgram(programId);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("university_programs")
                .update({ has_custom_requirements: enabled })
                .eq("id", programId);

            if (error) throw error;

            setPrograms(prev => prev.map(p =>
                p.id === programId ? { ...p, has_custom_requirements: enabled } : p
            ));
            toast.success(enabled ? "Custom requirements enabled" : "Custom requirements disabled");
        } catch (error) {
            toast.error("Failed to update: " + (error as Error).message);
        } finally {
            setUpdatingProgram(null);
        }
    };

    const handleAddRequirement = async (requirementId: string) => {
        // Find the requirement in catalog
        const requirement = catalog.find(r => r.id === requirementId);
        if (!requirement) return;

        // Optimistically add to UI
        const optimisticRequirement = {
            requirement_id: requirementId,
            university_id: universityId,
            title: requirement.title,
            category: requirement.category,
            requirement_type: requirement.requirement_type,
            description: requirement.description,
            is_required: true,
            custom_note: null,
            display_order: universityRequirements.length
        };

        setUniversityRequirements(prev => [...prev, optimisticRequirement]);

        const result = await addRequirementToUniversity(universityId, requirementId);
        if (result.error) {
            toast.error(result.error);
            // Revert on error
            setUniversityRequirements(prev => prev.filter(r => r.requirement_id !== requirementId));
        } else {
            toast.success("Requirement added successfully");
            // Refresh to get the actual data from server
            loadData();
        }
    };

    const handleRemoveRequirement = async (requirementId: string) => {
        if (!confirm("Are you sure you want to remove this requirement?")) return;

        const result = await removeRequirementFromUniversity(universityId, requirementId);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Requirement removed successfully");
            loadData();
        }
    };

    const handleUpdateNote = async () => {
        if (!editingRequirement) return;

        const result = await updateRequirementNote(
            universityId,
            editingRequirement.requirement_id,
            customNote,
            isRequired
        );

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Requirement updated successfully");
            setEditingRequirement(null);
            setCustomNote("");
            setIsRequired(true);
            loadData();
        }
    };

    const handleBulkAdd = async () => {
        if (selectedForBulk.size === 0) {
            toast.error("Please select at least one requirement");
            return;
        }

        const result = await bulkAddRequirements(universityId, Array.from(selectedForBulk));
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`${selectedForBulk.size} requirements added successfully`);
            setSelectedForBulk(new Set());
            loadData();
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "academic": return <BookOpen className="h-4 w-4" />;
            case "language": return <FileText className="h-4 w-4" />;
            case "document": return <FileText className="h-4 w-4" />;
            case "financial": return <DollarSign className="h-4 w-4" />;
            case "other": return <Info className="h-4 w-4" />;
            default: return <CheckCircle2 className="h-4 w-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "academic": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
            case "language": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            case "document": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
            case "financial": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
            case "other": return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Get requirements that are already added
    const addedRequirementIds = new Set(universityRequirements.map(r => r.requirement_id));

    // Filter catalog based on selection
    const filteredCatalog = catalog.filter(req => {
        if (selectedCategory !== "all" && req.category !== selectedCategory) return false;
        if (selectedLevel !== "all" && req.requirement_type !== selectedLevel && req.requirement_type !== "all") return false;
        return !addedRequirementIds.has(req.id);
    });

    // Group university requirements by category
    const groupedRequirements = universityRequirements.reduce((acc: Record<string, UniversityRequirement[]>, req: UniversityRequirement) => {
        if (!acc[req.category]) {
            acc[req.category] = [];
        }
        acc[req.category].push(req);
        return acc;
    }, {});

    const categories = ["all", "academic", "language", "document", "financial", "other"];
    const levels = ["all", "bachelor", "master", "phd"];

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Current Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Admission Requirements</CardTitle>
                    <CardDescription>
                        Requirements currently assigned to this university ({universityRequirements.length} total)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {universityRequirements.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No requirements added yet. Add requirements from the catalog below.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.keys(groupedRequirements).sort().map(category => (
                                <div key={category}>
                                    <div className="flex items-center gap-2 mb-3">
                                        {getCategoryIcon(category)}
                                        <h3 className="font-semibold capitalize">{category}</h3>
                                        <Badge variant="outline" className="ml-auto">
                                            {groupedRequirements[category].length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {groupedRequirements[category].map((req: UniversityRequirement) => (
                                            <div
                                                key={req.requirement_id}
                                                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                            >
                                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-medium">{req.title}</p>
                                                        <Badge className={getCategoryColor(req.category)} variant="secondary">
                                                            {req.requirement_type}
                                                        </Badge>
                                                        {!req.is_required && (
                                                            <Badge variant="outline">Optional</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {req.custom_note || req.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingRequirement(req);
                                                            setCustomNote(req.custom_note || "");
                                                            setIsRequired(req.is_required);
                                                        }}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveRequirement(req.requirement_id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Program-Specific Requirements */}
            {programs.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <CardTitle>Program-Specific Requirements</CardTitle>
                        </div>
                        <CardDescription>
                            Enable custom requirements for individual programs to override university defaults.
                            Programs with custom requirements will display a &quot;Special Requirements&quot; badge.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {programs.map((program) => (
                                <div
                                    key={program.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border ${program.has_custom_requirements
                                            ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700'
                                            : 'bg-card'
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate">
                                                {program.display_title || program.program_title}
                                            </p>
                                            <Badge variant="outline" className="text-xs">
                                                {program.level}
                                            </Badge>
                                            {program.has_custom_requirements && (
                                                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                                    Custom Requirements
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {program.has_custom_requirements
                                                ? "This program uses its own custom requirements"
                                                : "Using university default requirements"
                                            }
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <Label htmlFor={`toggle-${program.id}`} className="text-sm">
                                            Custom
                                        </Label>
                                        <Switch
                                            id={`toggle-${program.id}`}
                                            checked={program.has_custom_requirements}
                                            onCheckedChange={(checked) =>
                                                handleToggleProgramCustomRequirements(program.id, checked)
                                            }
                                            disabled={updatingProgram === program.id}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                            <strong>Tip:</strong> After enabling custom requirements, go to the program&apos;s
                            edit modal → Admission Requirements tab to select specific requirements for that program.
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add Requirements from Catalog */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Add Requirements from Catalog</CardTitle>
                            <CardDescription>
                                Select requirements to add to this university
                            </CardDescription>
                        </div>
                        {selectedForBulk.size > 0 && (
                            <Button onClick={handleBulkAdd}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Selected ({selectedForBulk.size})
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <Label>Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label>Program Level</Label>
                            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map(level => (
                                        <SelectItem key={level} value={level}>
                                            {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Available Requirements */}
                    {filteredCatalog.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No more requirements available to add with the current filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredCatalog.map(req => (
                                <div
                                    key={req.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                                >
                                    <Checkbox
                                        checked={selectedForBulk.has(req.id)}
                                        onCheckedChange={(checked) => {
                                            const newSet = new Set(selectedForBulk);
                                            if (checked) {
                                                newSet.add(req.id);
                                            } else {
                                                newSet.delete(req.id);
                                            }
                                            setSelectedForBulk(newSet);
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium">{req.title}</p>
                                            <Badge className={getCategoryColor(req.category)} variant="secondary">
                                                {req.category}
                                            </Badge>
                                            <Badge variant="outline">
                                                {req.requirement_type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{req.description}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddRequirement(req.id)}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingRequirement} onOpenChange={(open) => !open && setEditingRequirement(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Requirement</DialogTitle>
                        <DialogDescription>
                            Customize this requirement for your university
                        </DialogDescription>
                    </DialogHeader>
                    {editingRequirement && (
                        <div className="space-y-4">
                            <div>
                                <Label className="font-semibold">{editingRequirement.title}</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {editingRequirement.description}
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="custom-note">Custom Note (Optional)</Label>
                                <Textarea
                                    id="custom-note"
                                    placeholder="Add university-specific notes or modifications..."
                                    value={customNote}
                                    onChange={(e) => setCustomNote(e.target.value)}
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    This note will be shown instead of the default description
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is-required"
                                    checked={isRequired}
                                    onCheckedChange={(checked) => setIsRequired(checked as boolean)}
                                />
                                <Label htmlFor="is-required">This requirement is mandatory</Label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingRequirement(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateNote}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
