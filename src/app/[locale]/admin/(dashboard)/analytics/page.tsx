import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    FileText,
    Building2,
    ArrowUp,
    ArrowDown,
    BarChart3,
    PieChart,
    Activity,
    GraduationCap,
    Globe,
    Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function getAnalyticsData() {
    const supabase = await createClient();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total applications
    const { count: totalApplications } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true });

    // This month applications
    const { count: thisMonthApps } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thisMonth.toISOString());

    // Last month applications
    const { count: lastMonthApps } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", lastMonthEnd.toISOString());

    // Total leads
    const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

    // This month leads
    const { count: thisMonthLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thisMonth.toISOString());

    // Last month leads
    const { count: lastMonthLeadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", lastMonthEnd.toISOString());

    // Total universities
    const { count: totalUniversities } = await supabase
        .from("universities")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

    // Total programs
    const { count: totalPrograms } = await supabase
        .from("university_programs")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

    // Applications by status
    const { data: statusData } = await supabase
        .from("applications")
        .select("status");

    const statusCounts: Record<string, number> = {};
    statusData?.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    // Top universities by applications
    const { data: topUnis } = await supabase
        .from("applications")
        .select(`
            university_program:university_program_id (
                university:university_id (
                    id,
                    name
                )
            )
        `);

    const uniCounts: Record<string, { name: string; count: number }> = {};
    topUnis?.forEach(app => {
        const uni = (app.university_program as unknown as { university: { id: string; name: string } })?.university;
        if (uni) {
            if (!uniCounts[uni.id]) {
                uniCounts[uni.id] = { name: uni.name, count: 0 };
            }
            uniCounts[uni.id].count++;
        }
    });

    const topUniversities = Object.values(uniCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Top programs by applications
    const { data: topProgs } = await supabase
        .from("applications")
        .select(`
            university_program:university_program_id (
                id,
                program_catalog:program_catalog_id (
                    title
                ),
                university:university_id (
                    name
                )
            )
        `);

    const progCounts: Record<string, { name: string; university: string; count: number }> = {};
    topProgs?.forEach(app => {
        const prog = app.university_program as unknown as {
            id: string;
            program_catalog: { title: string };
            university: { name: string }
        };
        if (prog?.program_catalog) {
            if (!progCounts[prog.id]) {
                progCounts[prog.id] = {
                    name: prog.program_catalog.title,
                    university: prog.university?.name || "",
                    count: 0
                };
            }
            progCounts[prog.id].count++;
        }
    });

    const topPrograms = Object.values(progCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Applications by country
    const { data: countryData } = await supabase
        .from("applications")
        .select("student_country");

    const countryCounts: Record<string, number> = {};
    countryData?.forEach(app => {
        if (app.student_country) {
            countryCounts[app.student_country] = (countryCounts[app.student_country] || 0) + 1;
        }
    });

    const topCountries = Object.entries(countryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([country, count]) => ({ country, count }));

    // Monthly applications (last 6 months)
    const monthlyApps: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .gte("created_at", monthStart.toISOString())
            .lte("created_at", monthEnd.toISOString());

        monthlyApps.push({
            month: monthStart.toLocaleString("default", { month: "short" }),
            count: count || 0
        });
    }

    // Calculate trends
    const appChange = lastMonthApps && lastMonthApps > 0
        ? ((((thisMonthApps || 0) - lastMonthApps) / lastMonthApps) * 100).toFixed(1)
        : "0";

    const leadChange = lastMonthLeadsCount && lastMonthLeadsCount > 0
        ? ((((thisMonthLeads || 0) - lastMonthLeadsCount) / lastMonthLeadsCount) * 100).toFixed(1)
        : "0";

    return {
        totalApplications: totalApplications || 0,
        thisMonthApps: thisMonthApps || 0,
        appChange: parseFloat(appChange),
        totalLeads: totalLeads || 0,
        thisMonthLeads: thisMonthLeads || 0,
        leadChange: parseFloat(leadChange),
        totalUniversities: totalUniversities || 0,
        totalPrograms: totalPrograms || 0,
        statusCounts,
        topUniversities,
        topPrograms,
        topCountries,
        monthlyApps
    };
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    const statusColors: Record<string, string> = {
        submitted: "bg-blue-500",
        under_review: "bg-yellow-500",
        accepted: "bg-green-500",
        rejected: "bg-red-500",
        pending_documents: "bg-orange-500",
        pending_payment: "bg-purple-500",
        completed: "bg-emerald-500"
    };

    const maxMonthlyCount = Math.max(...data.monthlyApps.map(m => m.count), 1);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Analytics & Reports</h1>
                <p className="text-muted-foreground">Real-time insights from your data.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <FileText className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.totalApplications.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {data.appChange >= 0 ? (
                                <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${data.appChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {Math.abs(data.appChange)}%
                            </span>
                            <span className="text-xs text-muted-foreground">this month ({data.thisMonthApps})</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Users className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.totalLeads.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {data.leadChange >= 0 ? (
                                <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${data.leadChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {Math.abs(data.leadChange)}%
                            </span>
                            <span className="text-xs text-muted-foreground">this month ({data.thisMonthLeads})</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Universities</CardTitle>
                        <Building2 className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.totalUniversities}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Active universities in catalog
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Programs</CardTitle>
                        <GraduationCap className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.totalPrograms}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Active programs available
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Tables */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">
                        <Activity className="h-4 w-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="programs">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Programs
                    </TabsTrigger>
                    <TabsTrigger value="universities">
                        <PieChart className="h-4 w-4 mr-2" />
                        Universities
                    </TabsTrigger>
                    <TabsTrigger value="countries">
                        <Globe className="h-4 w-4 mr-2" />
                        Countries
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Application Status Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-primary" />
                                    Application Status
                                </CardTitle>
                                <CardDescription>Distribution by current status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(data.statusCounts).map(([status, count]) => (
                                        <div key={status} className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full ${statusColors[status] || "bg-gray-500"}`} />
                                            <div className="flex-1 flex items-center justify-between">
                                                <span className="text-sm capitalize">{status.replace(/_/g, " ")}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${statusColors[status] || "bg-gray-500"}`}
                                                            style={{ width: `${(count / data.totalApplications) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold w-8 text-right">{count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Monthly Trend
                                </CardTitle>
                                <CardDescription>Applications over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {data.monthlyApps.map((month) => (
                                        <div key={month.month} className="flex items-center gap-3">
                                            <div className="w-10 text-sm font-medium text-muted-foreground">
                                                {month.month}
                                            </div>
                                            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-end pr-2"
                                                    style={{ width: `${Math.max((month.count / maxMonthlyCount) * 100, 5)}%` }}
                                                >
                                                    <span className="text-xs font-bold text-primary-foreground">
                                                        {month.count}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="programs" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Programs</CardTitle>
                            <CardDescription>Programs with the most applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.topPrograms.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No application data yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.topPrograms.map((program, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{program.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {program.university}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-base px-3 py-1">
                                                {program.count} apps
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="universities" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Universities</CardTitle>
                            <CardDescription>Universities with the most applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.topUniversities.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No application data yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.topUniversities.map((uni, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/10 text-purple-600 font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{uni.name}</div>
                                            </div>
                                            <Badge variant="secondary" className="text-base px-3 py-1">
                                                {uni.count} apps
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="countries" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Top Countries
                            </CardTitle>
                            <CardDescription>Where your applicants are from</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.topCountries.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No country data yet</p>
                            ) : (
                                <div className="grid gap-3 md:grid-cols-2">
                                    {data.topCountries.map((item, index) => (
                                        <div key={item.country} className="flex items-center gap-3 p-3 rounded-lg border">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{item.country}</div>
                                            </div>
                                            <Badge>{item.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
