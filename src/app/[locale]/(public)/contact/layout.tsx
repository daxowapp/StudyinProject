import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const title = 'Contact Us | Study in China - Studyatchina';
    const description = 'Get in touch with Studyatchina for questions about studying in China, scholarships, admissions, visa assistance, and more. We respond within 24 hours.';

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/${locale}/contact`,
            languages: Object.fromEntries(
                ['en', 'ar', 'fa', 'tr'].map(loc => [loc, `${baseUrl}/${loc}/contact`])
            ),
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/contact`,
            siteName: 'Studyatchina',
            type: 'website',
        },
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
