import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DocumentsManager from "./DocumentsManager";

export default async function DocumentsPage() {
    const t = await getTranslations('Documents');
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
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">{t('documentRequest.title')}</h3>
                <div className="text-blue-800 text-sm whitespace-pre-line">
                    {t('documentRequest.description')}
                </div>
                <p className="text-blue-600 text-xs mt-2 font-medium">
                    {t('documentRequest.note')}
                </p>
            </div>

            <DocumentsManager userId={user.id} initialDocuments={documents || []} />
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
