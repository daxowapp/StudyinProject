"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Plus, Search, BookOpen, Filter, Loader2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CATEGORIES = [
    "Business & Management",
    "Engineering & Technology",
    "Medicine & Health Sciences",
    "Arts & Humanities",
    "Natural Sciences",
    "Education",
    "Agriculture",
    "Social Sciences"
];

const LEVELS = ["Bachelor", "Master", "PhD", "Diploma"];

interface Program {
    id: number;
    title: string;
    category: string;
    field: string;
    level: string;
    typical_duration: string;
    description: string;
    universities_count: number;
}

export default function ProgramCatalogPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterLevel, setFilterLevel] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        field: "",
        level: "",
        typical_duration: "",
        description: ""
    });

    // Mock data - replace with actual database query
    const programs = [
        {
            id: 1,
            title: "Business Administration",
            category: "Business & Management",
            field: "General Business",
            level: "Bachelor",
            typical_duration: "4 years",
            description: "Comprehensive business education covering management, finance, marketing, and operations.",
            universities_count: 45
        },
        {
            id: 2,
            title: "Computer Science",
            category: "Engineering & Technology",
            field: "Computer Science",
            level: "Bachelor",
            typical_duration: "4 years",
            description: "Programming, algorithms, software engineering, and computer systems.",
            universities_count: 38
        },
        {
            id: 3,
            title: "MBBS",
            category: "Medicine & Health Sciences",
            field: "Medicine",
            level: "Bachelor",
            typical_duration: "6 years",
            description: "Clinical medicine and surgery training.",
            universities_count: 25
        },
        {
            id: 4,
            title: "MBA",
            category: "Business & Management",
            field: "General Business",
            level: "Master",
            typical_duration: "2 years",
            description: "Executive business administration program.",
            universities_count: 32
        },
        {
            id: 5,
            title: "International Relations",
            category: "Arts & Humanities",
            field: "Political Science",
            level: "Bachelor",
            typical_duration: "4 years",
            description: "Global politics, diplomacy, and international affairs.",
            universities_count: 18
        }
    ];

    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            program.field.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || program.category === filterCategory;
        const matchesLevel = filterLevel === "all" || program.level === filterLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            "Business & Management": "bg-blue-100 text-blue-800",
            "Engineering & Technology": "bg-purple-100 text-purple-800",
            "Medicine & Health Sciences": "bg-red-100 text-red-800",
            "Arts & Humanities": "bg-yellow-100 text-yellow-800",
            "Natural Sciences": "bg-green-100 text-green-800",
            "Education": "bg-orange-100 text-orange-800"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    const handleEdit = (program: Program) => {
        setEditingProgram(program);
        setFormData({
            title: program.title,
            category: program.category,
            field: program.field,
            level: program.level,
            typical_duration: program.typical_duration,
            description: program.description
        });
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingProgram(null);
        setFormData({
            title: "",
            category: "",
            field: "",
            level: "",
            typical_duration: "",
            description: ""
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (editingProgram) {
            toast.success("Program updated successfully");
        } else {
            toast.success("Program added successfully");
        }

        setSaving(false);
        setDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingProgram(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading programs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Program Catalog</h1>
                    <p className="text-muted-foreground">
                        Master list of standardized academic programs
                    </p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Program
                </Button>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProgram ? "Edit Program" : "Add New Program to Catalog"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProgram 
                                    ? "Update the program details"
                                    : "Create a standardized program that universities can offer"
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Program Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Business Administration"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Level *</Label>
                                    <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LEVELS.map(level => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field">Field/Specialization</Label>
                                    <Input
                                        id="field"
                                        placeholder="e.g., General Business"
                                        value={formData.field}
                                        onChange={(e) => setFormData({...formData, field: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Typical Duration</Label>
                                <Input
                                    id="duration"
                                    placeholder="e.g., 4 years"
                                    value={formData.typical_duration}
                                    onChange={(e) => setFormData({...formData, typical_duration: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Brief description of the program..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={saving}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingProgram ? "Update Program" : "Add Program"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
                        <BookOpen className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{programs.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">In catalog</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <Filter className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{CATEGORIES.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Available</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bachelor Programs</CardTitle>
                        <BookOpen className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {programs.filter(p => p.level === "Bachelor").length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Undergraduate</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Master Programs</CardTitle>
                        <BookOpen className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {programs.filter(p => p.level === "Master").length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Postgraduate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Programs</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or field..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category-filter">Category</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level-filter">Level</Label>
                            <Select value={filterLevel} onValueChange={setFilterLevel}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {LEVELS.map(level => (
                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Programs List */}
            <div className="grid gap-6">
                {filteredPrograms.map((program) => (
                    <Card key={program.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <CardTitle className="text-xl">{program.title}</CardTitle>
                                        <Badge variant="outline">{program.level}</Badge>
                                        <Badge className={getCategoryColor(program.category)}>
                                            {program.category}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-4">
                                        <span>Field: {program.field}</span>
                                        <span>•</span>
                                        <span>Duration: {program.typical_duration}</span>
                                        <span>•</span>
                                        <span className="font-medium text-foreground">
                                            {program.universities_count} universities offering
                                        </span>
                                    </CardDescription>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(program)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{program.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPrograms.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No programs found matching your filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
