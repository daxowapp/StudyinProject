'use server';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function adminLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/admin/login?error=Invalid credentials");
    }

    // Check if user is actually an admin
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            await supabase.auth.signOut();
            return redirect("/admin/login?error=Unauthorized access");
        }
    }

    revalidatePath("/admin");
    redirect("/admin");
}

export async function getSidebarStats() {
    const supabase = await createClient();

    const { count: newLeadsCount } = await supabase
        .from("leads")
        .select("*", { count: 'exact', head: true })
        .eq("status", "new");

    const { count: pendingDocumentsCount } = await supabase
        .from("student_documents")
        .select("*", { count: 'exact', head: true })
        .eq("is_verified", false);

    return {
        newLeadsCount: newLeadsCount || 0,
        pendingDocumentsCount: pendingDocumentsCount || 0
    };
}
