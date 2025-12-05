import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from "@/components/ui/sonner";
import { LoadingBar } from "@/components/ui/loading-bar";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Playfair_Display, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import { Metadata } from 'next';
import "../globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'StudyAtChina - Study in China | Top Universities & Programs',
        template: '%s | StudyAtChina',
    },
    description: 'Your gateway to studying in China. Browse top Chinese universities, find scholarship opportunities, and apply to degree programs taught in English and Chinese.',
    keywords: [
        'study in China',
        'Chinese universities',
        'China scholarships',
        'CSC scholarship',
        'international students China',
        'learn Chinese',
        'study abroad China',
        'Chinese government scholarship',
        'bachelor in China',
        'master in China',
        'PhD in China',
    ],
    authors: [{ name: 'StudyAtChina' }],
    creator: 'StudyAtChina',
    publisher: 'StudyAtChina',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: baseUrl,
        siteName: 'StudyAtChina',
        title: 'StudyAtChina - Study in China | Top Universities & Programs',
        description: 'Your gateway to studying in China. Browse top Chinese universities, find scholarship opportunities, and apply to degree programs.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'StudyAtChina - Study in China',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'StudyAtChina - Study in China',
        description: 'Your gateway to studying in China. Browse top universities and scholarship opportunities.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Add your verification codes here when you have them
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
    },
    alternates: {
        canonical: baseUrl,
        languages: {
            'en': `${baseUrl}/en`,
            'ar': `${baseUrl}/ar`,
            'fa': `${baseUrl}/fa`,
            'tr': `${baseUrl}/tr`,
        },
    },
};

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
    preload: true,
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
    preload: true,
});

const cairo = Cairo({
    subsets: ['arabic'],
    variable: '--font-cairo',
    display: 'swap',
    preload: false, // Only preload for RTL users
});

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;

    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    // Determine direction based on locale
    const dir = ['ar', 'fa'].includes(locale) ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <head>
                {/* Preconnect to critical origins */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Preload hero image for LCP */}
                <link rel="preload" as="image" href="/hero-bg.png" fetchPriority="high" />
                {/* DNS prefetch */}
                <link rel="dns-prefetch" href="https://jhxujkhfzsahwjxuaydl.supabase.co" />
            </head>
            <body className={`${jakarta.variable} ${playfair.variable} ${cairo.variable} font-body antialiased flex flex-col min-h-screen ${dir === 'rtl' ? 'font-cairo' : ''}`}>
                <NextIntlClientProvider messages={messages}>
                    <CurrencyProvider>
                        <LoadingBar />
                        {children}
                        <Toaster />
                    </CurrencyProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
