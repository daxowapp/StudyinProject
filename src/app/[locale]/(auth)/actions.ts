"use server";

import { redirect } from "@/i18n/routing";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    console.log("Login stub", formData);
    return { success: true, error: undefined };
}

export async function loginWithGoogle() {
    console.log("Google login stub");
    return { success: true };
}

export async function signup(formData: FormData) {
    console.log("Signup stub", formData);
    return { success: true, checkEmail: false, error: undefined };
}

export async function resetPassword(formData: FormData) {
    console.log("Reset password stub", formData);
    return { success: true, error: undefined };
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect({ href: '/login', locale: 'en' });
}
