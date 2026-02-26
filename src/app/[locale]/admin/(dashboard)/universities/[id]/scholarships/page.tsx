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
import { Plus, Edit, ArrowLeft, Award, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Scholarship {
    id: string;
    type_name: string;
    display_name: string;
    tuition_coverage_percentage: number;
    duration_years: number;
    includes_accommodation: boolean;
    includes_stipend: boolean;
    stipend_amount_monthly: number;
    includes_medical_insurance: boolean;
    one_time_allowance: number;
    service_fee_usd: number;
    service_fee_cny: number;
    is_active: boolean;
}

export default async function UniversityScholarshipsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch university details
    const { data: university, error: universityError } = await supabase
        .from("universities")
        .select("id, name")
        .eq("id", id)
        .single();

    if (universityError || !university) {
        notFound();
    }

    // Fetch scholarships for this university
    const { data: scholarships, error } = await supabase
        .from("university_scholarships")
        .select("*")
        .eq("university_id", id)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching scholarships:", error);
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/universities">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">{university.name} - Scholarships</h1>
                        <p className="text-muted-foreground">Manage scholarship types for this university</p>
                    </div>
                </div>
                <Link href={`/admin/universities/${id}/scholarships/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Scholarship
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-lg border bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Scholarships</p>
                            <p className="text-3xl font-bold">{scholarships?.length || 0}</p>
                        </div>
                        <Award className="h-10 w-10 text-emerald-600" />
                    </div>
                </div>
                <div className="p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Scholarships</p>
                            <p className="text-3xl font-bold">
                                {scholarships?.filter((s: Scholarship) => s.is_active).length || 0}
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
                                ${scholarships && scholarships.length > 0
                                    ? Math.round(scholarships.reduce((sum: number, s: Scholarship) => sum + (Number(s.service_fee_usd) || 0), 0) / scholarships.length)
                                    : 0}
                            </p>
                        </div>
                        <DollarSign className="h-10 w-10 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Scholarships Table */}
            <div className="border rounded-md bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type Name</TableHead>
                            <TableHead>Display Name</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Benefits</TableHead>
                            <TableHead>Service Fee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scholarships?.map((scholarship: Scholarship) => (
                            <TableRow key={scholarship.id}>
                                <TableCell className="font-medium">{scholarship.type_name}</TableCell>
                                <TableCell className="max-w-xs truncate">{scholarship.display_name || "-"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-semibold">
                                        {scholarship.tuition_coverage_percentage}%
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {scholarship.duration_years ? `${scholarship.duration_years} year${scholarship.duration_years > 1 ? 's' : ''}` : "Full program"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {scholarship.includes_accommodation && (
                                            <Badge variant="secondary" className="text-xs">🏠 Accommodation</Badge>
                                        )}
                                        {scholarship.includes_stipend && (
                                            <Badge variant="secondary" className="text-xs">
                                                💰 ¥{scholarship.stipend_amount_monthly}/mo
                                            </Badge>
                                        )}
                                        {scholarship.includes_medical_insurance && (
                                            <Badge variant="secondary" className="text-xs">🏥 Insurance</Badge>
                                        )}
                                        {scholarship.one_time_allowance && (
                                            <Badge variant="secondary" className="text-xs">
                                                💵 ¥{scholarship.one_time_allowance}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div className="font-semibold text-green-600">${Number(scholarship.service_fee_usd).toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">¥{Number(scholarship.service_fee_cny).toLocaleString()}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={scholarship.is_active ? "default" : "secondary"}>
                                        {scholarship.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/universities/${id}/scholarships/${scholarship.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!scholarships || scholarships.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                    <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-semibold mb-2">No scholarships yet</p>
                                    <p className="text-sm">Click &quot;Add Scholarship&quot; to create scholarship types for this university</p>
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
                    About University Scholarships
                </h3>
                <p className="text-sm text-muted-foreground">
                    Each university can have its own unique scholarship types with different benefits.
                    These scholarships will be displayed on the university page and all its program pages.
                    Students can see exactly what each scholarship type includes before applying.
                </p>
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
