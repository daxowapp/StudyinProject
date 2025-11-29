import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, Award, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ScholarshipTypesPage() {
    const supabase = await createClient();
    
    // Fetch university scholarships with university names
    const { data: scholarships, error } = await supabase
        .from("university_scholarships")
        .select(`
            *,
            universities:university_id (
                id,
                name
            )
        `)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching scholarships:", error);
    }

    // Group scholarships by university
    const groupedByUniversity = scholarships?.reduce((acc: any, scholarship: any) => {
        const universityName = scholarship.universities?.name || "Unknown University";
        if (!acc[universityName]) {
            acc[universityName] = [];
        }
        acc[universityName].push(scholarship);
        return acc;
    }, {}) || {};

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Scholarship Types</h1>
                    <p className="text-muted-foreground">Manage scholarship types and service fees.</p>
                </div>
                <Link href="/admin/scholarship-types/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Scholarship Type
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-lg border bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Types</p>
                            <p className="text-3xl font-bold">{scholarshipTypes?.length || 0}</p>
                        </div>
                        <Award className="h-10 w-10 text-emerald-600" />
                    </div>
                </div>
                <div className="p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Types</p>
                            <p className="text-3xl font-bold">
                                {scholarshipTypes?.filter(t => t.is_active).length || 0}
                            </p>
                        </div>
                        <Award className="h-10 w-10 text-blue-600" />
                    </div>
                </div>
                <div className="p-6 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Avg Service Fee</p>
                            <p className="text-3xl font-bold">
                                ${scholarshipTypes && scholarshipTypes.length > 0 
                                    ? Math.round(scholarshipTypes.reduce((sum, t) => sum + (Number(t.service_fee_usd) || 0), 0) / scholarshipTypes.length)
                                    : 0}
                            </p>
                        </div>
                        <DollarSign className="h-10 w-10 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Scholarship Types Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Display Name</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Service Fee (USD)</TableHead>
                            <TableHead>Service Fee (CNY)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scholarshipTypes?.map((type: any) => (
                            <TableRow key={type.id}>
                                <TableCell className="font-medium">{type.name}</TableCell>
                                <TableCell>{type.display_name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-semibold">
                                        {type.tuition_coverage_percentage}%
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-semibold text-green-600">
                                    ${Number(type.service_fee_usd).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    ¥{Number(type.service_fee_cny).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={type.is_active ? "default" : "secondary"}>
                                        {type.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/scholarship-types/${type.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!scholarshipTypes || scholarshipTypes.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No scholarship types found. Click "Add Scholarship Type" to create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Info Card */}
            <div className="p-6 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    About Scholarship Types
                </h3>
                <p className="text-sm text-muted-foreground">
                    Scholarship types define the different coverage options available to students. Each type has a tuition coverage percentage and an associated service fee. 
                    These types are displayed on university and program pages to help students understand their financial options.
                </p>
            </div>
        </div>
    );
}
