import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Get the user to check if profile exists
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Check if profile exists
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                // If no profile exists, create one (for OAuth users)
                if (!profile) {
                    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
                    const [firstName, ...lastNameParts] = fullName.split(' ');
                    const lastName = lastNameParts.join(' ');

                    await supabase.from('profiles').insert({
                        id: user.id,
                        email: user.email,
                        full_name: fullName,
                        first_name: firstName || '',
                        last_name: lastName || '',
                        role: 'student',
                    });
                }
            }

            return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
}
