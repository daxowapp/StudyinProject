"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProgramRequirements(programId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("v_program_admission_requirements")
        .select("*")
        .eq("program_id", programId)
        .order("category")
        .order("display_order");

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getProgramDetails(programId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("v_university_programs_full")
        .select("id, display_title, program_title, has_custom_requirements, university_id, level")
        .eq("id", programId)
        .single();

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
    return data || [];
}

export async function toggleCustomRequirements(
    programId: string,
    hasCustomRequirements: boolean
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("university_programs")
        .update({ has_custom_requirements: hasCustomRequirements })
        .eq("id", programId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/programs/${programId}`);
    revalidatePath(`/admin/programs/${programId}/requirements`);
    return { success: true };
}

export async function addRequirementToProgram(
    programId: string,
    requirementId: string | null,
    category: string,
    customTitle?: string,
    customDescription?: string,
    isRequired: boolean = true
) {
    const supabase = await createClient();

    // Get the current max display_order for this program
    const { data: existing } = await supabase
        .from("program_admission_requirements")
        .select("display_order")
        .eq("program_id", programId)
        .order("display_order", { ascending: false })
        .limit(1);

    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const insertData: {
        program_id: string;
        requirement_id?: string;
        category: string;
        custom_title?: string;
        custom_description?: string;
        is_required: boolean;
        display_order: number;
    } = {
        program_id: programId,
        category,
        is_required: isRequired,
        display_order: nextOrder
    };

    if (requirementId) {
        insertData.requirement_id = requirementId;
    } else {
        insertData.custom_title = customTitle;
        insertData.custom_description = customDescription;
    }

    const { error } = await supabase
        .from("program_admission_requirements")
        .insert(insertData);

    if (error) return { error: error.message };

    revalidatePath(`/admin/programs/${programId}/requirements`);
    return { success: true };
}

export async function removeRequirementFromProgram(
    programId: string,
    requirementRowId: string
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("program_admission_requirements")
        .delete()
        .eq("id", requirementRowId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/programs/${programId}/requirements`);
    return { success: true };
}

export async function updateProgramRequirement(
    requirementRowId: string,
    programId: string,
    isRequired: boolean,
    customTitle?: string,
    customDescription?: string
) {
    const supabase = await createClient();

    const updateData: {
        is_required: boolean;
        custom_title?: string;
        custom_description?: string;
    } = {
        is_required: isRequired
    };

    if (customTitle !== undefined) {
        updateData.custom_title = customTitle;
    }
    if (customDescription !== undefined) {
        updateData.custom_description = customDescription;
    }

    const { error } = await supabase
        .from("program_admission_requirements")
        .update(updateData)
        .eq("id", requirementRowId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/programs/${programId}/requirements`);
    return { success: true };
}

export async function copyRequirementsFromUniversity(programId: string) {
    const supabase = await createClient();

    // Get program details to find university_id and level
    const { data: program, error: programError } = await supabase
        .from("v_university_programs_full")
        .select("university_id, level")
        .eq("id", programId)
        .single();

    if (programError || !program) {
        return { error: "Program not found" };
    }

    // Get university requirements matching the program level
    const { data: uniRequirements, error: reqError } = await supabase
        .from("v_university_admission_requirements")
        .select("*")
        .eq("university_id", program.university_id)
        .in("requirement_type", [program.level.toLowerCase(), "all"]);

    if (reqError) {
        return { error: reqError.message };
    }

    if (!uniRequirements || uniRequirements.length === 0) {
        return { error: "No university requirements found to copy" };
    }

    // Insert as program requirements
    const insertData = uniRequirements.map((req, index) => ({
        program_id: programId,
        requirement_id: req.requirement_id,
        category: req.category,
        is_required: req.is_required,
        display_order: index
    }));

    const { error: insertError } = await supabase
        .from("program_admission_requirements")
        .insert(insertData);

    if (insertError) {
        return { error: insertError.message };
    }

    // Enable custom requirements flag
    await supabase
        .from("university_programs")
        .update({ has_custom_requirements: true })
        .eq("id", programId);

    revalidatePath(`/admin/programs/${programId}/requirements`);
    return { success: true };
}

export async function clearProgramRequirements(programId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("program_admission_requirements")
        .delete()
        .eq("program_id", programId);

    if (error) return { error: error.message };

    // Also disable custom requirements flag
    await supabase
        .from("university_programs")
        .update({ has_custom_requirements: false })
        .eq("id", programId);

    revalidatePath(`/admin/programs/${programId}/requirements`);
    return { success: true };
}
