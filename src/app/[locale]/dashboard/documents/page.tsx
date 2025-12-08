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

            <DocumentsManager userId={user.id} initialDocuments={documents || []} />
        </div>
    );
}
