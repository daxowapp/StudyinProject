/**
 * In-memory rate limiter for Next.js middleware.
 * 
 * Uses a sliding window approach to track request counts per IP.
 * The store auto-cleans stale entries to prevent memory leaks.
 * 
 * Note: In-memory = per-instance. For multi-instance deployments (Vercel, etc.),
 * consider Upstash Redis or Vercel KV for shared state.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of store) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}

/**
 * Check if a request should be rate-limited.
 * 
 * @param ip - Client IP address
 * @param maxRequests - Max requests per window (default: 60)
 * @param windowMs - Time window in ms (default: 60000 = 1 minute)
 * @returns { limited: boolean, remaining: number, resetTime: number }
 */
export function rateLimit(
    ip: string,
    maxRequests: number = 60,
    windowMs: number = 60_000
): { limited: boolean; remaining: number; resetTime: number } {
    cleanupStaleEntries();

    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now >= entry.resetTime) {
        // New window
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return { limited: false, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    entry.count++;

    if (entry.count > maxRequests) {
        return { limited: true, remaining: 0, resetTime: entry.resetTime };
    }

    return { limited: false, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

// Known scraper/bot User-Agent patterns to block
export const BLOCKED_BOT_PATTERNS = [
    'ahrefsbot',
    'semrushbot',
    'dotbot',
    'megaindex',
    'blexbot',
    'mj12bot',
    'seekport',
    'aspirationbot',
    'zoominfobot',
    'scrapy',
    'httpclient',
    'python-requests',
    'go-http-client',
    'java/',
    'curl/',
    'wget/',
    'libwww',
    'lwp-trivial',
    'httpunit',
    'nutch',
    'phpcrawl',
    'biglotron',
    'teoma',
    'convera',
    'gigablast',
    'ia_archiver',
    'webmon',
    'httrack',
    'grub.org',
    'netresearchserver',
    'speedy',
    'fluffy',
    'bibnum',
    'findlinks',
    'msrbot',
    'panscient',
    'yacybot',
    'adsbot-google',  // Google ad crawlers (not search crawlers)
    'datadog',
];

/**
 * Check if a User-Agent belongs to a known scraper bot.
 */
export function isBlockedBot(userAgent: string): boolean {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return BLOCKED_BOT_PATTERNS.some(pattern => ua.includes(pattern));
}
