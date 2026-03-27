import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { rateLimit, isBlockedBot } from '@/lib/rate-limit';

const intlMiddleware = createMiddleware(routing);

// ── Geo-Based Locale Detection ─────────────────────────────────────
// Maps Vercel's x-vercel-ip-country (ISO 3166 alpha-2) → app locale
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  // Turkish
  TR: 'tr',
  // Arabic-speaking
  EG: 'ar', SA: 'ar', AE: 'ar', IQ: 'ar', JO: 'ar', MA: 'ar', DZ: 'ar',
  TN: 'ar', LY: 'ar', SY: 'ar', LB: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
  QA: 'ar', YE: 'ar', PS: 'ar', SD: 'ar',
  // Farsi
  IR: 'fa',
  // Turkmen
  TM: 'tk',
  // Chinese
  CN: 'zh', HK: 'zh', MO: 'zh', TW: 'zh',
  // French-speaking
  FR: 'fr', SN: 'fr', CM: 'fr', CI: 'fr', ML: 'fr', BF: 'fr', NE: 'fr',
  TD: 'fr', CG: 'fr', CD: 'fr', GA: 'fr', TG: 'fr', BJ: 'fr', GN: 'fr',
  MG: 'fr', DJ: 'fr', KM: 'fr',
  // Spanish-speaking
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', BO: 'es', PY: 'es', UY: 'es', CR: 'es', PA: 'es', DO: 'es',
  HN: 'es', SV: 'es', GT: 'es', NI: 'es', CU: 'es',
  // Russian-speaking
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', TJ: 'ru', UZ: 'ru',
};

function getGeoLocale(request: NextRequest): string | null {
  const country = request.headers.get('x-vercel-ip-country');
  if (!country) return null;
  return COUNTRY_LOCALE_MAP[country.toUpperCase()] || null;
}

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

    // 1. Rate limiting (skip in development, whitelisted bots, and admin panel)
    const isDev = process.env.NODE_ENV === 'development';
    const isAdminRoute = request.nextUrl.pathname.includes('/admin');
    if (!isDev && !isWhitelistedBot(userAgent) && !isAdminRoute) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';

        // 200 requests per minute for pages, 100 for /api routes
        const isApiRoute = request.nextUrl.pathname.startsWith('/api');
        const maxRequests = isApiRoute ? 100 : 200;

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

    // 2. Geo-based language redirect
    // Only redirect if: no NEXT_LOCALE cookie (user hasn't picked a language manually),
    // and the request is arriving on the default locale or bare path
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (!localeCookie) {
        const geoLocale = getGeoLocale(request);
        if (geoLocale && geoLocale !== routing.defaultLocale) {
            const pathname = request.nextUrl.pathname;
            // Check if user is on default locale prefix or bare path (no locale)
            const isDefaultLocale =
                pathname === '/' ||
                pathname.startsWith(`/${routing.defaultLocale}/`) ||
                pathname === `/${routing.defaultLocale}`;
            const alreadyOnGeoLocale =
                pathname.startsWith(`/${geoLocale}/`) || pathname === `/${geoLocale}`;

            if (isDefaultLocale && !alreadyOnGeoLocale) {
                // Strip default locale prefix if present, then prepend geo locale
                const strippedPath = pathname === `/${routing.defaultLocale}`
                    ? '/'
                    : pathname.startsWith(`/${routing.defaultLocale}/`)
                        ? pathname.slice(routing.defaultLocale.length + 1)
                        : pathname;
                const targetPath = `/${geoLocale}${strippedPath === '/' ? '' : strippedPath}`;

                const url = request.nextUrl.clone();
                url.pathname = targetPath;
                // Query params (UTMs etc.) are preserved automatically via clone()

                const response = NextResponse.redirect(url);
                // Set cookie so we don't redirect again on subsequent navigations
                response.cookies.set('NEXT_LOCALE', geoLocale, {
                    maxAge: 60 * 60 * 24 * 365,
                    path: '/',
                    sameSite: 'lax',
                });
                return response;
            }
        }
    }

    // 3. Run Supabase Auth Middleware to update session
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
