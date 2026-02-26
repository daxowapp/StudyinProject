import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, DollarSign, Users, Calendar } from "lucide-react";

export default async function ScholarshipsPage() {

    // Mock data - replace with actual database query
    const scholarships = [
        {
            id: 1,
            name: "Chinese Government Scholarship (CSC)",
            type: "Full Scholarship",
            amount: 10000,
            currency: "USD",
            deadline: "2025-03-31",
            available_slots: 100,
            applicants: 45,
            status: "active"
        },
        {
            id: 2,
            name: "University Excellence Scholarship",
            type: "Partial Scholarship",
            amount: 5000,
            currency: "USD",
            deadline: "2025-04-15",
            available_slots: 50,
            applicants: 23,
            status: "active"
        },
        {
            id: 3,
            name: "Provincial Government Scholarship",
            type: "Partial Scholarship",
            amount: 3000,
            currency: "USD",
            deadline: "2025-05-01",
            available_slots: 75,
            applicants: 12,
            status: "active"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Scholarships</h1>
                    <p className="text-muted-foreground">Manage scholarship programs and applications.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Scholarship
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scholarships</CardTitle>
                        <Award className="h-5 w-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{scholarships.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active programs</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${scholarships.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Available this year</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Applications</CardTitle>
                        <Users className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {scholarships.reduce((sum, s) => sum + s.applicants, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Total applicants</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
                        <Calendar className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {scholarships.reduce((sum, s) => sum + s.available_slots, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Remaining positions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Scholarships List */}
            <div className="grid gap-6">
                {scholarships.map((scholarship) => (
                    <Card key={scholarship.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    {scholarship.name}
                                    <Badge variant="default" className="bg-green-600">
                                        {scholarship.status.toUpperCase()}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    {scholarship.type} • Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Edit</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Award Amount</span>
                                    <span className="font-bold text-lg text-green-600">
                                        ${scholarship.amount.toLocaleString()} {scholarship.currency}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Available Slots</span>
                                    <span className="font-medium">{scholarship.available_slots}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Applicants</span>
                                    <span className="font-medium">{scholarship.applicants}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Fill Rate</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${(scholarship.applicants / scholarship.available_slots) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-medium text-xs">
                                            {Math.round((scholarship.applicants / scholarship.available_slots) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
