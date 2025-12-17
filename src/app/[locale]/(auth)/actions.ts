"use server";

import { redirect } from "@/i18n/routing";

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
    redirect({ href: '/auth/login', locale: 'en' });
}
