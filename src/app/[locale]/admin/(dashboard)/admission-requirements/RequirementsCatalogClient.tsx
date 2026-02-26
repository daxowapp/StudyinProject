"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, GraduationCap, Languages, DollarSign, ClipboardList, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RequirementDialog, DeleteButton } from "./RequirementDialog";
import { getRequirementsCatalog } from "./actions";

interface Requirement {
    id: string;
    title: string;
    description: string;
    category: string;
    requirement_type: string;
    is_common: boolean;
}

export default function AdminAdmissionRequirementsClient() {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const loadRequirements = async () => {
        try {
            const data = await getRequirementsCatalog();
            setRequirements(data || []);
        } catch (error) {
            console.error("Error loading requirements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequirements();
    }, []);

    const filteredRequirements = requirements.filter((req) =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const academicCount = requirements.filter(r => r.category === 'academic').length;
    const languageCount = requirements.filter(r => r.category === 'language').length;
    const documentCount = requirements.filter(r => r.category === 'document').length;
    const financialCount = requirements.filter(r => r.category === 'financial').length;
    const otherCount = requirements.filter(r => r.category === 'other').length;

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'academic': return <GraduationCap className="h-4 w-4" />;
            case 'language': return <Languages className="h-4 w-4" />;
            case 'document': return <FileText className="h-4 w-4" />;
            case 'financial': return <DollarSign className="h-4 w-4" />;
            default: return <ClipboardList className="h-4 w-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'academic': return 'bg-blue-100 text-blue-800';
            case 'language': return 'bg-green-100 text-green-800';
            case 'document': return 'bg-purple-100 text-purple-800';
            case 'financial': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'bachelor': return 'bg-emerald-100 text-emerald-800';
            case 'master': return 'bg-orange-100 text-orange-800';
            case 'phd': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Admission Requirements Catalog</h1>
                    <p className="text-muted-foreground">Manage centralized admission requirements for all universities.</p>
                </div>
                <RequirementDialog onSuccess={loadRequirements} />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-5">
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Academic</CardTitle>
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{academicCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requirements</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Language</CardTitle>
                        <Languages className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{languageCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requirements</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FileText className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{documentCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requirements</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Financial</CardTitle>
                        <DollarSign className="h-5 w-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{financialCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requirements</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Other</CardTitle>
                        <ClipboardList className="h-5 w-5 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{otherCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requirements</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search requirements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Common</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRequirements.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.title}</TableCell>
                                <TableCell>
                                    <Badge className={getCategoryColor(req.category)}>
                                        <span className="mr-1">{getCategoryIcon(req.category)}</span>
                                        {req.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={getTypeColor(req.requirement_type)}>
                                        {req.requirement_type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-md truncate">{req.description}</TableCell>
                                <TableCell>
                                    {req.is_common ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            Common
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Specific</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <RequirementDialog requirement={req} onSuccess={loadRequirements} />
                                        <DeleteButton
                                            requirementId={req.id}
                                            requirementTitle={req.title}
                                            onSuccess={loadRequirements}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredRequirements.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? "No requirements found matching your search." : "No requirements found."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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
