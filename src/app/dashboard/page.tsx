import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Clock, CheckCircle, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch user's applications
    const { data: { user } } = await supabase.auth.getUser();
    const { data: applications } = await supabase
        .from("applications")
        .select(`
            *,
            university_program:university_program_id (
                id,
                slug,
                program_catalog:program_catalog_id (
                    title,
                    level
                ),
                university:university_id (
                    name,
                    slug
                )
            )
        `)
        .eq("student_id", user?.id)
        .order("created_at", { ascending: false });

    const stats = {
        total: applications?.length || 0,
        submitted: applications?.filter(a => a.status === "submitted" || a.status === "under_review").length || 0,
        pending: applications?.filter(a => ['pending_payment', 'pending_documents', 'rejected'].includes(a.status)).length || 0,
        offers: applications?.filter(a => a.status === "accepted").length || 0,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here&apos;s your application overview.</p>
                </div>
                <Link href="/programs">
                    <Button size="lg" className="gap-2">
                        <Plus className="h-5 w-5" /> New Application
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.submitted} submitted, {stats.pending} pending
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires your attention</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.offers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Congratulations!</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Acceptance rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Applications */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold">My Applications</h2>
                </div>

                {applications && applications.length > 0 ? (
                    <Card className="border-none shadow-lg">
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {applications.map((app: any) => (
                                    <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                                        <div className="space-y-2 mb-4 md:mb-0">
                                            <p className="font-semibold text-lg">{app.university_program?.program_catalog?.title || "Program"}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                {app.university_program?.university?.name || "University"}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Applied on {new Date(app.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    app.status === "pending_documents" || app.status === "pending_payment" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                                                        app.status === "submitted" || app.status === "under_review" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                                                            app.status === "accepted" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                                                                app.status === "rejected" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                                                                    "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                }
                                            >
                                                {app.status?.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "Unknown"}
                                            </Badge>
                                            <Link href={`/dashboard/applications/${app.id}`}>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    View Details <ArrowRight className="h-3 w-3" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-none shadow-lg">
                        <CardContent className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
                                <p className="text-muted-foreground mb-6">
                                    Start your journey by browsing programs and submitting your first application.
                                </p>
                                <Link href="/programs">
                                    <Button size="lg" className="gap-2">
                                        <Plus className="h-5 w-5" /> Browse Programs
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
