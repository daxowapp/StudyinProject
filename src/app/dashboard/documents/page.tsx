import { createClient } from "@/lib/supabase/server";
import { DocumentRequestCard } from "../applications/components/DocumentRequestCard";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }

    // Get user's applications
    const { data: applications } = await supabase
        .from("applications")
        .select("id")
        .eq("student_id", user.id);

    const applicationIds = applications?.map(app => app.id) || [];

    let documentRequests: any[] = [];

    if (applicationIds.length > 0) {
        const { data: requests } = await supabase
            .from("document_requests")
            .select("*")
            .in("application_id", applicationIds)
            .order("created_at", { ascending: false });

        documentRequests = requests || [];
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
                    <p className="text-muted-foreground">
                        Manage your application documents
                    </p>
                </div>
            </div>

            {documentRequests.length > 0 ? (
                <DocumentRequestCard requests={documentRequests} />
            ) : (
                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-white text-center">
                    <p className="text-muted-foreground mb-2">No document requests found.</p>
                    <p className="text-sm text-gray-500">
                        When an administrator requests documents for your application, they will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
