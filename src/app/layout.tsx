import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://removexif.com";
const defaultTitle = "RemovExif - Free Online EXIF Viewer & Remover";
const defaultDescription =
  "Remove GPS, camera model, and timestamps from photos instantly. 100% browser-based privacy.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | RemovExif",
  },
  description: defaultDescription,
  applicationName: "RemovExif",
  keywords: [
    "remove exif online",
    "photo metadata remover",
    "gps remover",
    "privacy tool",
    "metadata cleaner",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "RemovExif",
    images: [
      {
        url: `${siteUrl}/upload-bg.webp`,
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/upload-bg.webp`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
