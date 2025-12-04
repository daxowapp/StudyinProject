import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // 1. Verify the request is from an authenticated admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // 2. Get request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // 3. Validate password strength
    if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    // 4. Get User ID
    const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();

    if (listError) {
        return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const targetUser = users.find(u => u.email === email);

    if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Update Password
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
        targetUser.id,
        { password: password, email_confirm: true }
    );

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Password updated for ${email}` });
}
