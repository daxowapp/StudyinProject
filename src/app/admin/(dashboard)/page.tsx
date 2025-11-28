import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Users, DollarSign, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboardPage() {
    let universitiesCount = 0;
    let applicationsCount = 0;
    let usersCount = 0;
    let recentApplications: any[] = [];
    let recentUsers: any[] = [];

    try {
        const supabase = await createClient();

        // Fetch stats in parallel with timeout
        const results = await Promise.race([
            Promise.all([
                supabase.from("universities").select("*", { count: "exact", head: true }),
                supabase.from("applications").select("*", { count: "exact", head: true }),
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("applications").select(`
                    *,
                    program:programs(title, university:universities(name))
                `).order("created_at", { ascending: false }).limit(5),
                supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5)
            ]),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
            )
        ]).catch(() => [
            { count: 0 },
            { count: 0 },
            { count: 0 },
            { data: [] },
            { data: [] }
        ]);

        if (Array.isArray(results)) {
            universitiesCount = results[0]?.count || 0;
            applicationsCount = results[1]?.count || 0;
            usersCount = results[2]?.count || 0;
            recentApplications = results[3]?.data || [];
            recentUsers = results[4]?.data || [];
        }
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of platform activity and statistics</p>
            </div>

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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-6">
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
                    <Card className="border-none shadow-lg">
                        <CardContent className="p-0">
                            {recentApplications && recentApplications.length > 0 ? (
                                <div className="divide-y">
                                    {recentApplications.map((app: any) => (
                                        <div key={app.id} className="p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 flex-1">
                                                    <p className="font-medium">{app.program?.title || "Program"}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {app.program?.university?.name || "University"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    No recent applications
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1 bg-primary rounded-full" />
                            <h2 className="text-2xl font-bold">Recent Signups</h2>
                        </div>
                        <Link href="/admin/users">
                            <Button variant="ghost" size="sm" className="gap-2">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <Card className="border-none shadow-lg">
                        <CardContent className="p-0">
                            {recentUsers && recentUsers.length > 0 ? (
                                <div className="divide-y">
                                    {recentUsers.map((user: any) => (
                                        <div key={user.id} className="p-4 hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-medium">
                                                    {user.first_name && user.last_name 
                                                        ? `${user.first_name} ${user.last_name}`
                                                        : "New User"
                                                    }
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    No recent signups
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
