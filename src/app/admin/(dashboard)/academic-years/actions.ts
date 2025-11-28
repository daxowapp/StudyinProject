"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAcademicYears() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("academic_years")
        .select("*, intakes(*)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function createAcademicYear(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase.from("academic_years").insert({
        name,
        start_date,
        end_date,
        is_active,
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/academic-years");
    return { success: true };
}

export async function updateAcademicYear(id: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase
        .from("academic_years")
        .update({ name, start_date, end_date, is_active })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/academic-years");
    return { success: true };
}

export async function deleteAcademicYear(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("academic_years").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/academic-years");
    return { success: true };
}

export async function createIntake(academicYearId: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const is_open = formData.get("is_open") === "on";

    const { error } = await supabase.from("intakes").insert({
        academic_year_id: academicYearId,
        name,
        start_date,
        end_date,
        is_open,
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/academic-years");
    return { success: true };
}

export async function updateIntake(id: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const is_open = formData.get("is_open") === "on";

    const { error } = await supabase
        .from("intakes")
        .update({ name, start_date, end_date, is_open })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/academic-years");
    return { success: true };
}

export async function deleteIntake(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("intakes").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/academic-years");
    return { success: true };
}
