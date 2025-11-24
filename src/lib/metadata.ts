import { Metadata } from "next";
import { locales, type Locale } from "@/i18n";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://removexif.com";
const defaultImage = "/upload-bg.webp";

export interface GenerateMetadataOptions {
  locale: Locale;
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  locale,
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: GenerateMetadataOptions): Metadata {
  const url = `${baseUrl}/${locale}${path}`;
  const defaultTitle = "RemovExif - Remove Metadata Online";
  const defaultDescription =
    "Free tool to view and remove EXIF data from photos. Protect your privacy by removing GPS coordinates, camera info, and timestamps.";
  const resolvedImage = resolveImageUrl(image);

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: title || defaultTitle,
    description: description || defaultDescription,
    applicationName: "RemovExif",
    category: "technology",
    keywords: [
      "remove exif",
      "metadata remover",
      "photo privacy",
      "gps remover",
      "exif viewer",
      "privacy tool",
      "image metadata",
    ],
    alternates: {
      canonical: url,
      languages: generateHreflang(path),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url,
      siteName: "RemovExif",
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: title || defaultTitle,
        },
      ],
      locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: title || defaultTitle,
      description: description || defaultDescription,
      images: [resolvedImage],
    },
  };

  return metadata;
}

function generateHreflang(path: string): Record<string, string> {
  const hreflang: Record<string, string> = {};

  hreflang["x-default"] = `${baseUrl}/en${path}`;

  for (const locale of locales) {
    hreflang[locale] = `${baseUrl}/${locale}${path}`;
  }

  return hreflang;
}

function resolveImageUrl(image?: string): string {
  const fallback = `${baseUrl}${defaultImage}`;
  if (!image) {
    return fallback;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}

