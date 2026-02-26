"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, Trash2, Copy, AlertTriangle, Check, FileText, GraduationCap, Globe, DollarSign, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    getProgramRequirements,
    getProgramDetails,
    getRequirementsCatalog,
    toggleCustomRequirements,
    addRequirementToProgram,
    removeRequirementFromProgram,
    copyRequirementsFromUniversity,
    clearProgramRequirements
} from "./actions";

interface RequirementItem {
    id: string;
    program_id: string;
    requirement_id?: string;
    title: string;
    category: string;
    description: string;
    is_custom: boolean;
    is_required: boolean;
    display_order: number;
}

interface CatalogItem {
    id: string;
    title: string;
    category: string;
    requirement_type: string;
    description: string;
    is_common: boolean;
}

interface Program {
    id: string;
    display_title?: string;
    program_title: string;
    has_custom_requirements: boolean;
    university_id: string;
    level: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    academic: <GraduationCap className="h-4 w-4" />,
    language: <Globe className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    financial: <DollarSign className="h-4 w-4" />,
    other: <Info className="h-4 w-4" />
};

const CATEGORY_COLORS: Record<string, string> = {
    academic: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    language: "bg-green-500/10 text-green-600 border-green-500/20",
    document: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    financial: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    other: "bg-purple-500/10 text-purple-600 border-purple-500/20"
};

export default function ProgramRequirementsManager({ programId }: { programId: string }) {
    const [program, setProgram] = useState<Program | null>(null);
    const [requirements, setRequirements] = useState<RequirementItem[]>([]);
    const [catalog, setCatalog] = useState<CatalogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [addMode, setAddMode] = useState<"catalog" | "custom">("catalog");
    const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
    const [customTitle, setCustomTitle] = useState("");
    const [customDescription, setCustomDescription] = useState("");
    const [customCategory, setCustomCategory] = useState<string>("academic");
    const [isRequired, setIsRequired] = useState(true);

    useEffect(() => {
        loadData();
    }, [programId]);

    async function loadData() {
        setIsLoading(true);
        try {
            const [programData, requirementsData, catalogData] = await Promise.all([
                getProgramDetails(programId),
                getProgramRequirements(programId),
                getRequirementsCatalog()
            ]);
            setProgram(programData);
            setRequirements(requirementsData || []);
            setCatalog(catalogData || []);
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleToggleCustomRequirements = async (enabled: boolean) => {
        startTransition(async () => {
            const result = await toggleCustomRequirements(programId, enabled);
            if (result.error) {
                toast.error(result.error);
            } else {
                setProgram(prev => prev ? { ...prev, has_custom_requirements: enabled } : null);
                toast.success(enabled ? "Custom requirements enabled" : "Using university requirements");
            }
        });
    };

    const handleCopyFromUniversity = async () => {
        startTransition(async () => {
            const result = await copyRequirementsFromUniversity(programId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Requirements copied from university");
                loadData();
            }
        });
    };

    const handleClearRequirements = async () => {
        if (!confirm("Are you sure you want to clear all custom requirements?")) return;

        startTransition(async () => {
            const result = await clearProgramRequirements(programId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Requirements cleared");
                loadData();
            }
        });
    };

    const handleAddRequirement = async () => {
        startTransition(async () => {
            let result;
            if (addMode === "catalog" && selectedCatalogId) {
                const catalogItem = catalog.find(c => c.id === selectedCatalogId);
                result = await addRequirementToProgram(
                    programId,
                    selectedCatalogId,
                    catalogItem?.category || "other",
                    undefined,
                    undefined,
                    isRequired
                );
            } else if (addMode === "custom" && customTitle) {
                result = await addRequirementToProgram(
                    programId,
                    null,
                    customCategory,
                    customTitle,
                    customDescription,
                    isRequired
                );
            } else {
                toast.error("Please fill in all required fields");
                return;
            }

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Requirement added");
                setShowAddDialog(false);
                resetAddForm();
                loadData();
            }
        });
    };

    const handleRemoveRequirement = async (reqId: string) => {
        startTransition(async () => {
            const result = await removeRequirementFromProgram(programId, reqId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Requirement removed");
                loadData();
            }
        });
    };

    const resetAddForm = () => {
        setAddMode("catalog");
        setSelectedCatalogId("");
        setCustomTitle("");
        setCustomDescription("");
        setCustomCategory("academic");
        setIsRequired(true);
    };

    // Group requirements by category
    const groupedRequirements = requirements.reduce((acc, req) => {
        if (!acc[req.category]) acc[req.category] = [];
        acc[req.category].push(req);
        return acc;
    }, {} as Record<string, RequirementItem[]>);

    // Filter catalog to match program level
    const filteredCatalog = catalog.filter(item =>
        item.requirement_type === "all" ||
        item.requirement_type === program?.level?.toLowerCase()
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!program) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Program not found</AlertDescription>
            </Alert>
        );
    }

    const programTitle = program.display_title || program.program_title;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/programs/${programId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Program Requirements</h1>
                        <p className="text-muted-foreground">{programTitle}</p>
                    </div>
                </div>
                <Badge variant="outline" className="text-sm">
                    {program.level}
                </Badge>
            </div>

            {/* Toggle Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Custom Requirements Mode
                    </CardTitle>
                    <CardDescription>
                        Enable this to override university-level requirements with program-specific requirements.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="custom-toggle" className="font-medium">
                                Use custom requirements for this program
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {program.has_custom_requirements
                                    ? "This program has custom requirements that override university defaults"
                                    : "This program uses the university&apos;s default requirements"
                                }
                            </p>
                        </div>
                        <Switch
                            id="custom-toggle"
                            checked={program.has_custom_requirements}
                            onCheckedChange={handleToggleCustomRequirements}
                            disabled={isPending}
                        />
                    </div>

                    {!program.has_custom_requirements && requirements.length === 0 && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-3">
                                Want to customize requirements? You can start from scratch or copy the university&apos;s requirements as a starting point.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyFromUniversity}
                                disabled={isPending}
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy from University Requirements
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Requirements List - Only show if custom requirements enabled */}
            {program.has_custom_requirements && (
                <>
                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {requirements.length} custom requirement{requirements.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearRequirements}
                                disabled={isPending || requirements.length === 0}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Requirement
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Requirement</DialogTitle>
                                        <DialogDescription>
                                            Add a requirement from the catalog or create a custom one.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {/* Mode Selection */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant={addMode === "catalog" ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setAddMode("catalog")}
                                            >
                                                From Catalog
                                            </Button>
                                            <Button
                                                variant={addMode === "custom" ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setAddMode("custom")}
                                            >
                                                Custom
                                            </Button>
                                        </div>

                                        {addMode === "catalog" ? (
                                            <div className="space-y-3">
                                                <Label>Select Requirement</Label>
                                                <Select value={selectedCatalogId} onValueChange={setSelectedCatalogId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose a requirement..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filteredCatalog.map(item => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                <span className="flex items-center gap-2">
                                                                    {CATEGORY_ICONS[item.category]}
                                                                    {item.title}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label>Category</Label>
                                                    <Select value={customCategory} onValueChange={setCustomCategory}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="academic">Academic</SelectItem>
                                                            <SelectItem value="language">Language</SelectItem>
                                                            <SelectItem value="document">Document</SelectItem>
                                                            <SelectItem value="financial">Financial</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={customTitle}
                                                        onChange={e => setCustomTitle(e.target.value)}
                                                        placeholder="e.g., Work Experience"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <Textarea
                                                        value={customDescription}
                                                        onChange={e => setCustomDescription(e.target.value)}
                                                        placeholder="Detailed description..."
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="req-required"
                                                checked={isRequired}
                                                onCheckedChange={setIsRequired}
                                            />
                                            <Label htmlFor="req-required">Required</Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddRequirement} disabled={isPending}>
                                            Add Requirement
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Requirements by Category */}
                    {Object.keys(groupedRequirements).length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground mb-4">No custom requirements added yet.</p>
                                <Button onClick={() => setShowAddDialog(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Requirement
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedRequirements).map(([category, items]) => (
                                <Card key={category}>
                                    <CardHeader className="py-3">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {CATEGORY_ICONS[category]}
                                            <span className="capitalize">{category}</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {items.length}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-0 pb-4">
                                        <div className="space-y-2">
                                            {items.map(req => (
                                                <div
                                                    key={req.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-sm">{req.title}</p>
                                                            {req.description && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {req.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {req.is_custom && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Custom
                                                            </Badge>
                                                        )}
                                                        <Badge className={CATEGORY_COLORS[category]}>
                                                            {req.is_required ? "Required" : "Optional"}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={() => handleRemoveRequirement(req.id)}
                                                            disabled={isPending}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
