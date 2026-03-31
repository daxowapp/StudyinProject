import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

    return {
        rules: [
            // Default: Allow search engines and legitimate bots
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/dashboard/',
                    '/auth/',
                    '/_next/',
                    '/profile/',
                ],
            },

            // ── AI Answer Engines (GEO/AEO) ── ALLOW ──
            // These bots power AI search results (ChatGPT, Perplexity, Google AI, etc.)
            // Allowing them is critical for Generative Engine Optimization
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'Amazonbot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },
            {
                userAgent: 'Applebot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dashboard/', '/auth/'],
            },

            // ── SEO Tool Scrapers ── BLOCK ──
            // These crawl your data for competitor analysis, not for traffic
            {
                userAgent: 'AhrefsBot',
                disallow: ['/'],
            },
            {
                userAgent: 'SemrushBot',
                disallow: ['/'],
            },
            {
                userAgent: 'MJ12bot',
                disallow: ['/'],
            },
            {
                userAgent: 'DotBot',
                disallow: ['/'],
            },
            {
                userAgent: 'BLEXBot',
                disallow: ['/'],
            },
            {
                userAgent: 'ZoominfoBot',
                disallow: ['/'],
            },
            {
                userAgent: 'DataForSeoBot',
                disallow: ['/'],
            },
            {
                userAgent: 'Bytespider',
                disallow: ['/'],
            },

            // ── Generic Scrapers ── BLOCK ──
            {
                userAgent: 'Scrapy',
                disallow: ['/'],
            },
            {
                userAgent: 'HTTrack',
                disallow: ['/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
