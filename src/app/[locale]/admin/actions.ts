'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function adminLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    return redirect("/admin");
}

export async function getSidebarStats() {
    return {
        newLeadsCount: 0,
        pendingDocumentsCount: 0
    };
}
