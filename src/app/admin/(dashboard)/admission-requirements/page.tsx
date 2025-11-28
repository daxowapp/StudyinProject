import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, GraduationCap, Languages, DollarSign, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAdmissionRequirementsPage() {
    const supabase = await createClient();
    
    // Fetch all admission requirements
    const { data: requirements } = await supabase
        .from("admission_requirements_catalog")
        .select("*")
        .order("category", { ascending: true })
        .order("title", { ascending: true });

    // Count by category
    const academicCount = requirements?.filter(r => r.category === 'academic').length || 0;
    const languageCount = requirements?.filter(r => r.category === 'language').length || 0;
    const documentCount = requirements?.filter(r => r.category === 'document').length || 0;
    const financialCount = requirements?.filter(r => r.category === 'financial').length || 0;
    const otherCount = requirements?.filter(r => r.category === 'other').length || 0;

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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Admission Requirements Catalog</h1>
                    <p className="text-muted-foreground">Manage centralized admission requirements for all universities.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Requirement
                </Button>
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
                    <Input className="pl-9" placeholder="Search requirements..." />
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
                        {requirements?.map((req: any) => (
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
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!requirements || requirements.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No requirements found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
