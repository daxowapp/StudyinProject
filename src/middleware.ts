import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { rateLimit, isBlockedBot } from '@/lib/rate-limit';

const intlMiddleware = createMiddleware(routing);

// AI answer engine bots that should NEVER be rate-limited (GEO/AEO)
const AI_BOT_WHITELIST = [
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider',
    'gptbot', 'chatgpt-user', 'perplexitybot', 'claudebot',
    'google-extended', 'amazonbot', 'applebot',
];

function isWhitelistedBot(userAgent: string): boolean {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return AI_BOT_WHITELIST.some(bot => ua.includes(bot));
}

export async function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';

    // 0. Block known scraper bots immediately (before any processing)
    if (isBlockedBot(userAgent)) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    // 1. Rate limiting (skip for whitelisted AI/search bots)
    if (!isWhitelistedBot(userAgent)) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';

        // 60 requests per minute for regular users, 30 for /api routes
        const isApiRoute = request.nextUrl.pathname.startsWith('/api');
        const maxRequests = isApiRoute ? 30 : 60;

        const { limited, resetTime } = rateLimit(ip, maxRequests);

        if (limited) {
            const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfter),
                    'X-RateLimit-Limit': String(maxRequests),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(resetTime),
                },
            });
        }

    }

    // 2. Run Supabase Auth Middleware to update session
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

        if (profile?.role !== 'admin' && profile?.role !== 'data_entry' && profile?.role !== 'marketing') {
            const locale = hasLocalePrefix ? pathname.split('/')[1] : routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
    }

    // Dashboard Protection
    if (pathWithoutLocale.startsWith('/dashboard')) {
        if (!user) {
            const locale = hasLocalePrefix ? pathname.split('/')[1] : routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
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
