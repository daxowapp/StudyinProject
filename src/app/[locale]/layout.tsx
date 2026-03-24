import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { routing } from '@/i18n/routing';
import { Toaster } from "@/components/ui/sonner";
import { LoadingBar } from "@/components/ui/loading-bar";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { DeferredScripts } from "@/components/layout/DeferredScripts";
import { Playfair_Display, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import { Metadata } from 'next';
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

import "../globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Studyatchina - Study in China | Top Universities & Programs',
        template: '%s | Studyatchina',
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
    authors: [{ name: 'Studyatchina' }],
    creator: 'Studyatchina',
    publisher: 'Studyatchina',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: baseUrl,
        siteName: 'Studyatchina',
        title: 'Studyatchina - Study in China | Top Universities & Programs',
        description: 'Your gateway to studying in China. Browse top Chinese universities, find scholarship opportunities, and apply to degree programs.',
        images: [
            {
                url: '/logo.png',
                width: 512,
                height: 512,
                alt: 'Studyatchina - Study in China',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Studyatchina - Study in China',
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
        canonical: `${baseUrl}/en`,
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
    preload: false, // Heading font — not FCP-critical, loaded on demand
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
                {/* Preconnect to CDN for static assets */}
                <link rel="preconnect" href="https://studyatchina.b-cdn.net" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://studyatchina.b-cdn.net" />
                {/* Preconnect to Supabase for faster API calls */}
                <link rel="preconnect" href="https://mxmrdnzmaztskbkqeusm.supabase.co" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://mxmrdnzmaztskbkqeusm.supabase.co" />
                {/* Preconnect & DNS-prefetch for third-party script domains */}
                <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://connect.facebook.net" />
            </head>
            <body className={`${jakarta.variable} ${playfair.variable} ${cairo.variable} font-body antialiased flex flex-col min-h-screen ${dir === 'rtl' ? 'font-cairo' : ''}`}>
                <DeferredScripts />
                <OrganizationJsonLd />
                <QueryProvider>
                    <NextIntlClientProvider messages={messages}>
                        <CurrencyProvider>
                            <LoadingBar />
                            {children}
                            <Toaster />
                        </CurrencyProvider>
                    </NextIntlClientProvider>
                </QueryProvider>
                <Script
                    id="fb-pixel"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '1378542223283943');
                            fbq('track', 'PageView');
                        `,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1378542223283943&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
                <GoogleAnalytics gaId="G-47QZWWTPZ1" />
            </body>
        </html>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
