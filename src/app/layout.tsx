import { Playfair_Display, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import "./globals.css";

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
    preload: false,
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
    preload: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
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
            <body className={`${jakarta.variable} ${playfair.variable} ${cairo.variable} font-body antialiased flex flex-col min-h-screen`}>
                {children}
            </body>
        </html>
    );
}
