"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getApplications() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("applications")
        .select(`
            *,
            user:profiles(first_name, last_name, email),
            program:programs(title, university:universities(name))
        `)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplicationStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/applications");
    return { success: true };
}

export async function updateApplicationStage(id: string, stage: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("applications")
        .update({ stage })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/applications");
    return { success: true };
}

export async function updatePaymentStatus(id: string, payment_status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("applications")
        .update({ payment_status })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/applications");
    return { success: true };
}

export async function addComment(id: string, comment: string) {
    const supabase = await createClient();

    // First get existing comments
    const { data: app, error: fetchError } = await supabase
        .from("applications")
        .select("comments")
        .eq("id", id)
        .single();

    if (fetchError) return { error: fetchError.message };

    const currentComments = app.comments || [];
    const newComment = {
        text: comment,
        created_at: new Date().toISOString(),
        // In a real app, we'd add the author here
    };

    const { error } = await supabase
        .from("applications")
        .update({ comments: [...currentComments, newComment] })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/applications");
    return { success: true };
}
