import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const title = 'Download Free Study Guide | Study in China - Studyatchina';
    const description = 'Download the comprehensive free guide to studying in China. Covers scholarships, application process, visa requirements, and campus life. Join 10,000+ students.';

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/${locale}/download-guide`,
            languages: Object.fromEntries(
                ['en', 'ar', 'fa', 'tr'].map(loc => [loc, `${baseUrl}/${loc}/download-guide`])
            ),
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/download-guide`,
            siteName: 'Studyatchina',
            type: 'website',
        },
    };
}

export default function DownloadGuideLayout({ children }: { children: React.ReactNode }) {
    return children;
}
