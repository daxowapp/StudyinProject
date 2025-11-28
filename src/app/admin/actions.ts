"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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

    // Check if user is admin
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

    return redirect("/admin");
}
