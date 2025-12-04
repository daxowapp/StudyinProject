"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLanguages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function createLanguage(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    const { error } = await supabase.from("languages").insert({
        name,
        code,
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/languages");
    return { success: true };
}

export async function updateLanguage(id: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    const { error } = await supabase
        .from("languages")
        .update({ name, code })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/languages");
    return { success: true };
}

export async function deleteLanguage(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("languages").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/languages");
    return { success: true };
}
