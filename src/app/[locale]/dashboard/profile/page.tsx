import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileEditForm from "./ProfileEditForm";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
    const supabase = await createClient();
    const t = await getTranslations('Profile');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single() as unknown as { data: Record<string, unknown> };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <ProfileEditForm user={user} profile={profile} />
        </div>
    );
}
