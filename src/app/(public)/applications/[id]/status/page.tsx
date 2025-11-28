import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

const timeline = [
    {
        status: "Application Submitted",
        date: "Oct 24, 2023",
        description: "Your application has been successfully submitted and payment received.",
        completed: true,
    },
    {
        status: "Document Review",
        date: "Oct 25, 2023",
        description: "Our team is reviewing your documents for completeness.",
        completed: true,
    },
    {
        status: "Submitted to University",
        date: "Oct 26, 2023",
        description: "Application forwarded to Tsinghua University admissions office.",
        completed: true,
    },
    {
        status: "University Review",
        date: "In Progress",
        description: "The university is currently reviewing your application. This usually takes 2-4 weeks.",
        completed: false,
        current: true,
    },
    {
        status: "Admission Decision",
        date: "Pending",
        description: "Final decision from the university.",
        completed: false,
    },
];

export default function ApplicationStatusPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-heading">Application Status</h1>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main Status Column */}
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-muted ml-3 space-y-8 pb-4">
                                {timeline.map((item, index) => (
                                    <div key={index} className="relative pl-8">
                                        <div
                                            className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${item.completed
                                                    ? "bg-primary border-primary"
                                                    : item.current
                                                        ? "bg-background border-primary animate-pulse"
                                                        : "bg-background border-muted"
                                                }`}
                                        />
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-semibold ${item.completed || item.current ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {item.status}
                                                </h3>
                                                {item.completed && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.date}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Application Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Program</p>
                                <p className="font-medium">Computer Science</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">University</p>
                                <p className="font-medium">Tsinghua University</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Application ID</p>
                                <p className="font-medium font-mono">APP-2023-8392</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Status</p>
                                <Badge className="mt-1">Under Review</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="p-4 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Need Help?</p>
                                <p>If you have questions about your application status, please contact support.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
