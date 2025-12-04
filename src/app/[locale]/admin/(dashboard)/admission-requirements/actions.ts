"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function createRequirement(formData: {
    title: string;
    category: string;
    requirement_type: string;
    description: string;
    is_common: boolean;
}) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("admission_requirements_catalog")
        .insert(formData);

    if (error) return { error: error.message };

    revalidatePath("/admin/admission-requirements");
    return { success: true };
}

export async function updateRequirement(
    id: string,
    formData: {
        title: string;
        category: string;
        requirement_type: string;
        description: string;
        is_common: boolean;
    }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("admission_requirements_catalog")
        .update(formData)
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/admission-requirements");
    return { success: true };
}

export async function deleteRequirement(id: string) {
    const supabase = await createClient();

    // Check if requirement is in use
    const { data: inUse } = await supabase
        .from("university_admission_requirements")
        .select("id")
        .eq("requirement_id", id)
        .limit(1);

    if (inUse && inUse.length > 0) {
        return { error: "Cannot delete requirement that is assigned to universities" };
    }

    const { error } = await supabase
        .from("admission_requirements_catalog")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/admission-requirements");
    return { success: true };
}
