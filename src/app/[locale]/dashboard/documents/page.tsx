import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DocumentsManager from "./DocumentsManager";

export default async function DocumentsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get student documents
    const { data: documents } = await supabase
        .from("student_documents")
        .select("*")
        .eq("student_id", user.id)
        .order("uploaded_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Documents</h1>
                <p className="text-muted-foreground">
                    Manage your documents for university applications
                </p>
            </div>

            <DocumentsManager userId={user.id} initialDocuments={documents || []} />
        </div>
    );
}
