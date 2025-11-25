import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { locales } from "@/i18n";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AdSenseLoader from "@/components/AdSenseLoader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect to AdSense domains for performance */}
        {adsEnabled && publisherId && (
          <>
            <link
              rel="preconnect"
              href="https://pagead2.googlesyndication.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://googleads.g.doubleclick.net"
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} antialiased bg-slate-50 font-sans flex flex-col min-h-screen`}>
        {/* Google Analytics - Loads on all pages */}
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
        
        {/* AdSense Script - Only load if user has consented to advertising cookies */}
        <AdSenseLoader />
      </body>
    </html>
  );
}

