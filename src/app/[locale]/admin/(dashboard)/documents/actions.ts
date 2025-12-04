"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAllDocuments() {
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

    if (!data || data.length === 0) {
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

            if (storageError) console.error("Storage delete error:", storageError);
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
