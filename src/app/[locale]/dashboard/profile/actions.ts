"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProfile(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateProfile(userId: string, profileData: {
    full_name?: string;
    phone?: string;
    phone_country_code?: string;
    nationality?: string;
    passport_number?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_phone_code?: string;
    emergency_contact_relationship?: string;
}) {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('update_profile', {
        p_user_id: userId,
        p_profile_data: profileData
    });

    if (error) return { error: error.message };
    if (data && !data.success) return { error: data.error || 'Update failed' };

    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function uploadProfilePhoto(userId: string, file: File) {
    const supabase = await createClient();

    try {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName);

        // Update profile
        // Update profile using RPC
        const { data: rpcData, error: updateError } = await supabase.rpc('update_profile', {
            p_user_id: userId,
            p_profile_data: { profile_photo_url: publicUrl }
        });

        if (updateError) throw updateError;
        if (rpcData && !rpcData.success) throw new Error(rpcData.error || 'Update failed');

        revalidatePath("/dashboard/profile");
        return { success: true, url: publicUrl };
    } catch (error: unknown) {
        return { error: (error as Error).message };
    }
}
