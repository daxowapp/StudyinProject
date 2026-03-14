"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdminRole } from "@/lib/auth/admin-guard";

export async function getAllDocuments() {
    await requireAdminRole();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("student_documents")
        .select(`
            *,
            profiles:student_id (
                full_name,
                email,
                first_name,
                last_name
            )
        `)
        .order("uploaded_at", { ascending: false });

    if (error) {
        return { error: error.message };
    }


    // Transform data to handle missing profiles or split names
    const documents = data.map(doc => ({
        ...doc,
        student_name: doc.profiles?.full_name ||
            (doc.profiles?.first_name ? `${doc.profiles.first_name} ${doc.profiles.last_name || ''}` : 'Unknown Student'),
        student_email: doc.profiles?.email
    }));

    return { data: documents };
}

export async function verifyDocument(documentId: string) {
    await requireAdminRole();
    const supabase = await createClient();

    const { error } = await supabase
        .from("student_documents")
        .update({ is_verified: true })
        .eq("id", documentId);

    if (error) return { error: error.message };

    revalidatePath("/admin/documents");
    return { success: true };
}

export async function deleteDocument(documentId: string, fileUrl: string) {
    await requireAdminRole();
    const supabase = await createClient();

    try {
        // Extract file path from URL
        // URL format: .../application-documents/userId/type/filename
        const urlParts = fileUrl.split('/');
        const filePath = urlParts.slice(urlParts.indexOf('application-documents') + 1).join('/');

        if (filePath) {
            const { error: storageError } = await supabase.storage
                .from('application-documents')
                .remove([filePath]);

            // Storage delete errors are non-critical, continue with DB delete
        }

        const { error } = await supabase
            .from("student_documents")
            .delete()
            .eq("id", documentId);

        if (error) throw error;

        revalidatePath("/admin/documents");
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}
