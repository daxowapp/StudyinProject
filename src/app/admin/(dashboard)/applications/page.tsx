import { getApplications } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationDialog } from "./components/ApplicationDialog";
import { format } from "date-fns";

export default async function ApplicationsPage() {
    const applications = await getApplications();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "accepted": return "bg-green-600";
            case "rejected": return "bg-red-600";
            case "under_review": return "bg-yellow-600";
            case "submitted": return "bg-blue-600";
            default: return "bg-gray-600";
        }
    };

    const getPaymentColor = (status: string) => {
        switch (status) {
            case "paid": return "text-green-600 border-green-600";
            case "failed": return "text-red-600 border-red-600";
            default: return "text-yellow-600 border-yellow-600";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground">
                        Manage student applications and pipeline.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {applications?.map((app: any) => (
                    <Card key={app.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    {app.user?.first_name} {app.user?.last_name}
                                    <Badge className={getStatusColor(app.status)}>
                                        {app.status.replace("_", " ").toUpperCase()}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Applied to <span className="font-medium text-foreground">{app.program?.title}</span> at {app.program?.university?.name}
                                </CardDescription>
                            </div>
                            <ApplicationDialog application={app} />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Stage</span>
                                    <span className="font-medium capitalize">{app.stage || "New"}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Payment</span>
                                    <Badge variant="outline" className={getPaymentColor(app.payment_status)}>
                                        {app.payment_status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Submitted</span>
                                    <span className="font-medium">
                                        {app.submitted_at ? format(new Date(app.submitted_at), "MMM d, yyyy") : "Draft"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Email</span>
                                    <span className="font-medium">{app.user?.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {applications?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No applications found</h3>
                        <p className="text-muted-foreground">
                            Waiting for students to apply.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
