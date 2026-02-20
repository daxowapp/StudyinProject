"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PORTAL_KEY } from "@/lib/constants/portal";

export async function getPrograms() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("v_university_programs_full")
        .select("*")
        .eq("portal_key", PORTAL_KEY)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getUniversities() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("universities")
        .select("id, name")
        .eq("portal_key", PORTAL_KEY)
        .order("name");

    if (error) throw new Error(error.message);
    return data;
}

export async function getLanguages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("languages")
        .select("id, name")
        .order("name");

    if (error) throw new Error(error.message);
    return data;
}

export async function createProgram(formData: FormData) {
    const supabase = await createClient();

    const university_id = formData.get("university_id") as string;
    const program_catalog_id = formData.get("program_catalog_id") as string;
    const custom_title = formData.get("custom_title") as string;
    const duration = formData.get("duration") as string;
    const tuition_fee = parseInt(formData.get("tuition_fee") as string) || 0;
    const currency = formData.get("currency") as string || "RMB";
    const language_id = formData.get("language_id") as string;
    const intake = formData.get("intake") as string;

    // New fields
    const is_active = formData.get("is_active") === "on" || true;
    const scholarship_chance = formData.get("scholarship_chance") as string;
    const application_fee = parseInt(formData.get("application_fee") as string) || 0;
    const force_payment = formData.get("has_force_payment") === "on";
    const deadline = formData.get("deadline") as string;
    const gpa_requirement = formData.get("gpa_requirement") as string;
    const score_ielts = formData.get("score_ielts") ? parseFloat(formData.get("score_ielts") as string) : null;
    const score_toefl = formData.get("score_toefl") ? parseInt(formData.get("score_toefl") as string) : null;
    const score_duolingo = formData.get("score_duolingo") ? parseInt(formData.get("score_duolingo") as string) : null;

    const { error } = await supabase.from("university_programs").insert({
        university_id,
        program_catalog_id,
        custom_title: custom_title || null,
        duration: duration || null,
        tuition_fee,
        currency,
        language_id: language_id || null,
        intake: intake || null,
        is_active,
        scholarship_chance: scholarship_chance || null,
        application_fee,
        force_payment,
        application_deadline: deadline || null,
        gpa_requirement: gpa_requirement || null,
        score_ielts,
        score_toefl,
        score_duolingo,
        portal_key: PORTAL_KEY,
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/programs");
    return { success: true };
}

export async function updateProgram(id: string, formData: FormData) {
    const supabase = await createClient();

    const university_id = formData.get("university_id") as string;
    const program_catalog_id = formData.get("program_catalog_id") as string;
    const custom_title = formData.get("custom_title") as string;
    const duration = formData.get("duration") as string;
    const tuition_fee = parseInt(formData.get("tuition_fee") as string) || 0;
    const currency = formData.get("currency") as string || "RMB";
    const language_id = formData.get("language_id") as string;
    const intake = formData.get("intake") as string;

    // New fields
    const is_active = formData.get("is_active") === "on" || true;
    const scholarship_chance = formData.get("scholarship_chance") as string;
    const application_fee = parseInt(formData.get("application_fee") as string) || 0;
    const force_payment = formData.get("has_force_payment") === "on";
    const deadline = formData.get("deadline") as string;
    const gpa_requirement = formData.get("gpa_requirement") as string;
    const score_ielts = formData.get("score_ielts") ? parseFloat(formData.get("score_ielts") as string) : null;
    const score_toefl = formData.get("score_toefl") ? parseInt(formData.get("score_toefl") as string) : null;
    const score_duolingo = formData.get("score_duolingo") ? parseInt(formData.get("score_duolingo") as string) : null;

    const { error } = await supabase
        .from("university_programs")
        .update({
            university_id,
            program_catalog_id,
            custom_title: custom_title || null,
            duration: duration || null,
            tuition_fee,
            currency,
            language_id: language_id || null,
            intake: intake || null,
            is_active,
            scholarship_chance: scholarship_chance || null,
            application_fee,
            force_payment,
            application_deadline: deadline || null,
            gpa_requirement: gpa_requirement || null,
            score_ielts,
            score_toefl,
            score_duolingo,
        })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/programs");
    return { success: true };
}

export async function deleteProgram(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("university_programs").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/programs");
    return { success: true };
}
