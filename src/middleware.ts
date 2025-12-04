import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Run Supabase Auth Middleware to update session
    // We pass the request to updateSession, but we don't return its response immediately
    // because we need to let next-intl handle the routing/locale first if possible,
    // OR we need to ensure the session is updated on the response that next-intl generates.

    // Actually, updateSession returns a response with cookies set.
    // We need to merge this with next-intl's response.

    const { supabase, response: supabaseResponse, user } = await updateSession(request)

    // 2. Run next-intl middleware
    // This handles redirects (e.g. / -> /en) and locale detection
    const intlResponse = intlMiddleware(request);

    // 3. Merge responses
    // We need to copy cookies from supabaseResponse to intlResponse
    // because Supabase auth relies on setting cookies on the response.
    if (supabaseResponse.headers.has('set-cookie')) {
        const cookies = supabaseResponse.headers.get('set-cookie');
        if (cookies) {
            intlResponse.headers.set('set-cookie', cookies);
        }
    }

    // 4. Route Protection Logic
    // We need to check permissions based on the path.
    // Note: next-intl might have rewritten the path (e.g. /en/dashboard -> /dashboard internally?)
    // Actually, request.nextUrl.pathname still contains the locale if it was in the URL.

    const pathname = request.nextUrl.pathname;

    // Helper to check if path starts with any locale prefix
    const hasLocalePrefix = routing.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Strip locale to check the actual route
    const pathWithoutLocale = hasLocalePrefix
        ? '/' + pathname.split('/').slice(2).join('/')
        : pathname;

    // Admin Protection
    if (pathWithoutLocale.startsWith('/admin')) {
        // Allow access to login page
        if (pathWithoutLocale === '/admin/login') {
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role === 'admin') {
                    // Redirect to admin dashboard (preserving locale)
                    // If we are at /en/admin/login, go to /en/admin
                    const locale = hasLocalePrefix ? pathname.split('/')[1] : routing.defaultLocale;
                    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
                }
            }
            return intlResponse;
        }

        // Protect other admin routes
        if (!user) {
            const locale = hasLocalePrefix ? pathname.split('/')[1] : routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            const locale = hasLocalePrefix ? pathname.split('/')[1] : routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
    }

    // Dashboard Protection
    if (pathWithoutLocale.startsWith('/dashboard')) {
        if (!user) {
            const locale = hasLocalePrefix ? pathname.split('/')[1] : routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
        }
    }

    return intlResponse;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
