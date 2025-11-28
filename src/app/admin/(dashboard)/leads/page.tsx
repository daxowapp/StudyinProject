import { getLeads } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadDialog } from "./components/LeadDialog";
import { format } from "date-fns";
import { Mail, Phone, MessageSquare } from "lucide-react";

export default async function LeadsPage() {
    const leads = await getLeads();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-600";
            case "contacted": return "bg-yellow-600";
            case "qualified": return "bg-green-600";
            case "converted": return "bg-purple-600";
            case "closed": return "bg-gray-600";
            default: return "bg-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">
                        Manage inquiries and potential students.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {leads?.map((lead: any) => (
                    <Card key={lead.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    {lead.name}
                                    <Badge className={getStatusColor(lead.status)}>
                                        {lead.status.toUpperCase()}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Source: {lead.source} • {format(new Date(lead.created_at), "MMM d, yyyy")}
                                </CardDescription>
                            </div>
                            <LeadDialog lead={lead} />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{lead.email}</span>
                                </div>
                                {lead.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{lead.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-2 col-span-full md:col-span-3 bg-muted/50 p-3 rounded-md">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <p className="text-muted-foreground italic">{lead.message}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {leads?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No leads found</h3>
                        <p className="text-muted-foreground">
                            Inquiries from contact forms will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
