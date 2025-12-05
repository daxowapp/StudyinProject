import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

    return {
        rules: [
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
            {
                // Allow AI crawlers for AEO (Answer Engine Optimization)
                userAgent: 'GPTBot',
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
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
