"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStudentDocuments(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("student_documents")
        .select("*")
        .eq("student_id", userId)
        .order("uploaded_at", { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function uploadDocument(
    userId: string,
    documentType: string,
    file: File
) {
    const supabase = await createClient();

    try {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${documentType}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('application-documents')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('application-documents')
            .getPublicUrl(fileName);

        // Save to student_documents
        const { error: dbError } = await supabase
            .from("student_documents")
            .upsert({
                student_id: userId,
                document_type: documentType,
                document_name: file.name,
                file_url: publicUrl,
                file_size: file.size,
                file_type: file.type,
                uploaded_at: new Date().toISOString(),
            }, {
                onConflict: 'student_id,document_type'
            });

        if (dbError) throw dbError;

        revalidatePath("/dashboard/documents");
        return { success: true, url: publicUrl };
    } catch (error: unknown) {
        return { error: (error as Error).message };
    }
}

export async function deleteDocument(userId: string, documentId: string) {
    const supabase = await createClient();

    try {
        // Get document info
        const { data: doc } = await supabase
            .from("student_documents")
            .select("file_url")
            .eq("id", documentId)
            .eq("student_id", userId)
            .single();

        if (!doc) throw new Error("Document not found");

        // Extract file path from URL
        const urlParts = doc.file_url.split('/');
        const filePath = urlParts.slice(urlParts.indexOf('application-documents') + 1).join('/');

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('application-documents')
            .remove([filePath]);

        if (storageError) console.error("Storage delete error:", storageError);

        // Delete from database
        const { error: dbError } = await supabase
            .from("student_documents")
            .delete()
            .eq("id", documentId)
            .eq("student_id", userId);

        if (dbError) throw dbError;

        revalidatePath("/dashboard/documents");
        return { success: true };
    } catch (error: unknown) {
        return { error: (error as Error).message };
    }
}
