import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Users, DollarSign, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PORTAL_KEY } from "@/lib/constants/portal";

interface DashboardApplication {
    id: string;
    student_name: string;
    status: string;
    updated_at: string;
    university_program: {
        program_catalog: {
            title: string;
        };
        university: {
            name: string;
        };
    };
}

export default async function AdminDashboardPage() {
    let universitiesCount = 0;
    let applicationsCount = 0;
    let usersCount = 0;
    let recentApplications: DashboardApplication[] = [];
    let pendingReviews: DashboardApplication[] = [];

    try {
        const supabase = await createAdminClient();

        // Fetch data independently to prevent one failure from breaking everything
        const [
            universitiesResult,
            applicationsCountResult,
            usersResult,
            recentAppsResult,
            pendingReviewsResult
        ] = await Promise.allSettled([
            supabase.from("universities").select("*", { count: "exact", head: true }).eq("portal_key", PORTAL_KEY),
            supabase.from("applications").select("*", { count: "exact", head: true }).eq("portal_key", PORTAL_KEY),
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("applications").select(`
                *,
                university_program:university_program_id(
                    program_catalog:program_catalog_id(title),
                    university:university_id(name)
                )
            `).eq("portal_key", PORTAL_KEY).order("updated_at", { ascending: false }).limit(10),
            supabase.from("applications").select(`
                *,
                university_program:university_program_id(
                    program_catalog:program_catalog_id(title),
                    university:university_id(name)
                )
            `)
                .eq("portal_key", PORTAL_KEY)
                .in('status', ['payment_verification', 'document_verification', 'submitted'])
                .order("updated_at", { ascending: false })
                .limit(10)
        ]);

        // Process results
        if (universitiesResult.status === 'fulfilled' && universitiesResult.value.count) {
            universitiesCount = universitiesResult.value.count;
        }

        if (applicationsCountResult.status === 'fulfilled' && applicationsCountResult.value.count) {
            applicationsCount = applicationsCountResult.value.count;
        }

        if (usersResult.status === 'fulfilled' && usersResult.value.count) {
            usersCount = usersResult.value.count;
        }

        if (recentAppsResult.status === 'fulfilled') {
            if (recentAppsResult.value.data) {
                recentApplications = recentAppsResult.value.data as unknown as DashboardApplication[];
            }
        } else {
            console.error("Recent Apps Query Rejected:", recentAppsResult.reason);
        }

        if (pendingReviewsResult.status === 'fulfilled' && pendingReviewsResult.value.data) {
            pendingReviews = pendingReviewsResult.value.data as unknown as DashboardApplication[];
        } else if (pendingReviewsResult.status === 'rejected') {
            console.error("Error fetching pending reviews:", pendingReviewsResult.reason);
        }

    } catch (error) {
        console.error("Error initializing admin dashboard:", error);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of platform activity and statistics</p>
            </div>

            {/* Pending Reviews Section */}
            {pendingReviews.length > 0 && (
                <Card className="border-l-4 border-l-yellow-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700">
                            <Calendar className="h-5 w-5" />
                            Pending Reviews ({pendingReviews.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingReviews.map((app) => (
                                <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-semibold">{app.student_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {app.status === 'payment_verification' ? 'Uploaded Payment Receipt' :
                                                app.status === 'document_verification' ? 'Uploaded Documents' :
                                                    'Submitted Application'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(app.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link href={`/admin/applications/${app.id}`}>
                                        <Button size="sm" variant="outline">Review</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            From paid applications
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Applications</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{applicationsCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total applications received</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Universities</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{universitiesCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active universities</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{usersCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registered students</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold">Recent Applications</h2>
                    </div>
                    <Link href="/admin/applications">
                        <Button variant="ghost" size="sm" className="gap-2">
                            View All <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {recentApplications && recentApplications.length > 0 ? (
                    <div className="grid gap-4">
                        {recentApplications.map((app) => (
                            <Card key={app.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold">
                                            {app.student_name || 'Unknown Student'}
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            Applied to <span className="font-medium text-foreground">{app.university_program?.program_catalog?.title}</span> at {app.university_program?.university?.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge
                                            variant="secondary"
                                            className={
                                                app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                    app.status === "submitted" ? "bg-blue-100 text-blue-800" :
                                                        app.status === "accepted" ? "bg-green-100 text-green-800" :
                                                            "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                                        </Badge>
                                        <Link href={`/admin/applications/${app.id}`}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                View Details <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No recent applications found.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
