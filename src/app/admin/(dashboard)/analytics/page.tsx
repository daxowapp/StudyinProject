"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
    TrendingUp, 
    Users, 
    FileText, 
    DollarSign,
    Download,
    Calendar,
    ArrowUp,
    ArrowDown,
    BarChart3,
    PieChart,
    Activity
} from "lucide-react";

export default function AnalyticsPage() {
    const stats = {
        applications: {
            total: 1234,
            change: 12.5,
            trend: "up"
        },
        revenue: {
            total: 45678,
            change: 8.3,
            trend: "up"
        },
        users: {
            total: 5432,
            change: -2.1,
            trend: "down"
        },
        conversion: {
            total: 23.4,
            change: 5.2,
            trend: "up"
        }
    };

    const topPrograms = [
        { name: "Computer Science - Tsinghua University", applications: 145, revenue: 7250 },
        { name: "Business Administration - Peking University", applications: 132, revenue: 6600 },
        { name: "Medicine (MBBS) - Fudan University", applications: 118, revenue: 5900 },
        { name: "Engineering - Zhejiang University", applications: 95, revenue: 4750 },
        { name: "International Relations - Shanghai Jiao Tong", applications: 87, revenue: 4350 }
    ];

    const topUniversities = [
        { name: "Tsinghua University", applications: 234, students: 1200 },
        { name: "Peking University", applications: 198, students: 980 },
        { name: "Fudan University", applications: 176, students: 850 },
        { name: "Zhejiang University", applications: 154, students: 720 },
        { name: "Shanghai Jiao Tong University", applications: 142, students: 680 }
    ];

    const monthlyData = [
        { month: "Jan", applications: 45, revenue: 2250 },
        { month: "Feb", applications: 52, revenue: 2600 },
        { month: "Mar", applications: 78, revenue: 3900 },
        { month: "Apr", applications: 95, revenue: 4750 },
        { month: "May", applications: 112, revenue: 5600 },
        { month: "Jun", applications: 134, revenue: 6700 }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Analytics & Reports</h1>
                    <p className="text-muted-foreground">Track performance and generate insights.</p>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <FileText className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.applications.total.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {stats.applications.trend === "up" ? (
                                <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${stats.applications.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                {stats.applications.change}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">${stats.revenue.total.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <ArrowUp className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">
                                {stats.revenue.change}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.users.total.toLocaleString()}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <ArrowDown className="h-4 w-4 text-red-600" />
                            <span className="text-xs font-medium text-red-600">
                                {Math.abs(stats.users.change)}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.conversion.total}%</div>
                        <div className="flex items-center gap-1 mt-1">
                            <ArrowUp className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">
                                {stats.conversion.change}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
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
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Performance</CardTitle>
                            <CardDescription>Applications and revenue over the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-medium text-muted-foreground">
                                            {data.month}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm">Applications</span>
                                                        <span className="text-sm font-bold">{data.applications}</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-blue-600 rounded-full"
                                                            style={{ width: `${(data.applications / 150) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm">Revenue</span>
                                                        <span className="text-sm font-bold">${data.revenue}</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-green-600 rounded-full"
                                                            style={{ width: `${(data.revenue / 7000) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="programs" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Programs</CardTitle>
                            <CardDescription>Programs with the most applications and revenue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topPrograms.map((program, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{program.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {program.applications} applications • ${program.revenue} revenue
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-green-600">
                                                ${program.revenue}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="universities" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Universities</CardTitle>
                            <CardDescription>Universities with the most applications and enrolled students</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topUniversities.map((uni, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple/10 text-purple-600 font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{uni.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {uni.applications} applications • {uni.students} enrolled students
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">
                                                {uni.applications}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                applications
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
