import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Update Password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: password, email_confirm: true } // Auto confirm email too
    );

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Password updated for ${email}` });
}
