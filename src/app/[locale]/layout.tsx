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
import { Metadata } from 'next';
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

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
    verification: {},
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
        <>
            {/* Set lang, dir on <html> and RTL class on <body> at runtime */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}";${dir === 'rtl' ? 'document.body.classList.add("font-cairo");' : ''}`,
                }}
            />
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
        </>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
