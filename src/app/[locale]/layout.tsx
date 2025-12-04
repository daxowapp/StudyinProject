import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from "@/components/ui/sonner";
import { LoadingBar } from "@/components/ui/loading-bar";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Playfair_Display, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import "../globals.css";

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
