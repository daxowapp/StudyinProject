"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    // Check if user already exists
    const adminClient = await createAdminClient();
    const { data: existingUser } = await adminClient
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

    if (existingUser) {
        return { error: "This email is already registered. Please sign in or reset your password." };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                role: "student",
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (!data.session) {
        return { success: true, checkEmail: true };
    }

    return { success: true };
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/auth/login");
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
