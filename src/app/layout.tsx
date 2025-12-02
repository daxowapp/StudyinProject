import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LoadingBar } from "@/components/ui/loading-bar";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export const metadata: Metadata = {
  title: "StudyAtChina.com - Apply to Top Chinese Universities",
  description: "One smart portal to search programs, apply online, and track your admission to Chinese universities.",
};



// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`font-body antialiased flex flex-col min-h-screen`}
      >
        <CurrencyProvider>
          <Suspense fallback={null}>
            <LoadingBar />
          </Suspense>
          {children}
          <Toaster />
        </CurrencyProvider>
      </body>
    </html>
  );
}
