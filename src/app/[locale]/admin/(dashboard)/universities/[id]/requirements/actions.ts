"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUniversityRequirements(universityId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("v_university_admission_requirements")
        .select("*")
        .eq("university_id", universityId)
        .order("category")
        .order("display_order");

    if (error) throw new Error(error.message);
    return data;
}

export async function getRequirementsCatalog() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("admission_requirements_catalog")
        .select("*")
        .order("category")
        .order("title");

    if (error) throw new Error(error.message);
    return data;
}

export async function addRequirementToUniversity(
    universityId: string,
    requirementId: string,
    isRequired: boolean = true,
    customNote?: string
) {
    const supabase = await createClient();

    // Get the current max display_order for this university
    const { data: existing } = await supabase
        .from("university_admission_requirements")
        .select("display_order")
        .eq("university_id", universityId)
        .order("display_order", { ascending: false })
        .limit(1);

    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const { error } = await supabase
        .from("university_admission_requirements")
        .insert({
            university_id: universityId,
            requirement_id: requirementId,
            is_required: isRequired,
            custom_note: customNote,
            display_order: nextOrder
        });

    if (error) return { error: error.message };

    revalidatePath(`/admin/universities/${universityId}`);
    return { success: true };
}

export async function removeRequirementFromUniversity(
    universityId: string,
    requirementId: string
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("university_admission_requirements")
        .delete()
        .eq("university_id", universityId)
        .eq("requirement_id", requirementId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/universities/${universityId}`);
    return { success: true };
}

export async function updateRequirementNote(
    universityId: string,
    requirementId: string,
    customNote: string,
    isRequired: boolean
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("university_admission_requirements")
        .update({
            custom_note: customNote,
            is_required: isRequired
        })
        .eq("university_id", universityId)
        .eq("requirement_id", requirementId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/universities/${universityId}`);
    return { success: true };
}

export async function bulkAddRequirements(
    universityId: string,
    requirementIds: string[]
) {
    const supabase = await createClient();

    // Get current max display_order
    const { data: existing } = await supabase
        .from("university_admission_requirements")
        .select("display_order")
        .eq("university_id", universityId)
        .order("display_order", { ascending: false })
        .limit(1);

    let nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const insertData = requirementIds.map(reqId => ({
        university_id: universityId,
        requirement_id: reqId,
        is_required: true,
        display_order: nextOrder++
    }));

    const { error } = await supabase
        .from("university_admission_requirements")
        .insert(insertData);

    if (error) return { error: error.message };

    revalidatePath(`/admin/universities/${universityId}`);
    return { success: true };
}
