import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
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
                url: '/og-image.png',
                width: 1200,
                height: 630,
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
                {/* Preconnect to Supabase for faster API calls */}
                <link rel="preconnect" href="https://mxmrdnzmaztskbkqeusm.supabase.co" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://mxmrdnzmaztskbkqeusm.supabase.co" />
                {/* Preload hero image for LCP */}
                <link rel="preload" as="image" href="/hero-bg.png" fetchPriority="high" />
            </head>
            <body className={`${jakarta.variable} ${playfair.variable} ${cairo.variable} font-body antialiased flex flex-col min-h-screen ${dir === 'rtl' ? 'font-cairo' : ''}`}>
                <Script
                    id="zoho-pagesense-script"
                    src="https://cdn.pagesense.io/js/daxowportal/643005dce2df4eb1810be296f6a79272.js"
                    strategy="beforeInteractive"
                />
                <NextIntlClientProvider messages={messages}>
                    <CurrencyProvider>
                        <LoadingBar />
                        {children}
                        <Toaster />
                    </CurrencyProvider>
                </NextIntlClientProvider>
                <Script
                    id="fb-pixel"
                    strategy="afterInteractive"
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
                <Script
                    id="zoho-salesiq-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`
                    }}
                />
                <Script
                    id="zsiqscript"
                    src="https://salesiq.zohopublic.com/widget?wc=siqc671c2f53632c30a591a902bec55f9bdcfc7670e7f9cbdd86f64bdc1d326a19a"
                    strategy="afterInteractive"
                    defer
                />

                {/* Google tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-47QZWWTPZ1"
                    strategy="afterInteractive"
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', 'G-47QZWWTPZ1');
                        `,
                    }}
                />
            </body>
        </html>
    );
}
