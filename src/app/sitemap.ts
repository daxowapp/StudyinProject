import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const locales = ['en', 'tr', 'ar', 'fa'];
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Static pages
    const staticPages = [
        '',
        '/universities',
        '/programs',
        '/scholarships',
        '/how-to-apply',
        '/articles',
        '/contact',
        '/faq',
    ];

    // Generate entries for static pages with all locales
    const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}${page}`,
            lastModified: new Date(),
            changeFrequency: page === '' ? 'daily' : 'weekly' as const,
            priority: page === '' ? 1.0 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
                ),
            },
        }))
    );

    // Fetch universities
    const { data: universities } = await supabase
        .from('universities')
        .select('slug, updated_at')
        .order('name');

    const universityEntries: MetadataRoute.Sitemap = (universities || []).flatMap(
        (university) =>
            locales.map((locale) => ({
                url: `${baseUrl}/${locale}/universities/${university.slug}`,
                lastModified: new Date(university.updated_at || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((loc) => [
                            loc,
                            `${baseUrl}/${loc}/universities/${university.slug}`,
                        ])
                    ),
                },
            }))
    );

    // Fetch programs
    const { data: programs } = await supabase
        .from('v_university_programs_full')
        .select('slug, updated_at')
        .eq('is_active', true);

    const programEntries: MetadataRoute.Sitemap = (programs || []).flatMap(
        (program) =>
            locales.map((locale) => ({
                url: `${baseUrl}/${locale}/programs/${program.slug}`,
                lastModified: new Date(program.updated_at || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.85,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((loc) => [
                            loc,
                            `${baseUrl}/${loc}/programs/${program.slug}`,
                        ])
                    ),
                },
            }))
    );

    // Fetch published articles
    const { data: articles } = await supabase
        .from('v_published_articles')
        .select('slug, published_at');

    const articleEntries: MetadataRoute.Sitemap = (articles || []).flatMap(
        (article) =>
            locales.map((locale) => ({
                url: `${baseUrl}/${locale}/articles/${article.slug}`,
                lastModified: new Date(article.published_at || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((loc) => [
                            loc,
                            `${baseUrl}/${loc}/articles/${article.slug}`,
                        ])
                    ),
                },
            }))
    );

    return [
        ...staticEntries,
        ...universityEntries,
        ...programEntries,
        ...articleEntries,
    ];
}
