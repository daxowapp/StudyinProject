"use server";

import { redirect } from "@/i18n/routing";

export async function signout() {
    // Mock implementation or real supabase signout if needed
    // For now, just redirect to login to satisfy the interface used in Navbar
    redirect({ href: '/auth/login', locale: 'en' });
}
