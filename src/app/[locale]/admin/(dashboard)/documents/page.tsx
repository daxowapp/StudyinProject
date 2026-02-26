import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DocumentsTable from "./DocumentsTable";
import { getAllDocuments } from "./actions";

export default async function AdminDocumentsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/");
    }

    const { data: documents } = await getAllDocuments();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Document Verification</h1>
                <p className="text-muted-foreground">
                    Review and verify documents uploaded by students
                </p>
            </div>

            <DocumentsTable documents={documents || []} />
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
