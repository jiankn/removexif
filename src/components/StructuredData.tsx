import { type Locale } from "@/i18n";

interface FaqEntry {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  locale: Locale;
  type: "SoftwareApplication" | "FAQPage" | "Article";
  data?: {
    description?: string;
    faqEntries?: FaqEntry[];
    title?: string;
    coverImage?: string;
    date?: string;
    modifiedDate?: string;
    authorName?: string;
    url?: string;
  };
}

export default function StructuredData({
  locale,
  type,
  data,
}: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://removexif.com";

  const defaultDescription =
    "Free online tool to remove EXIF data from photos. Protect your privacy by removing GPS coordinates, camera info, and timestamps.";

  let structuredData: Record<string, unknown> = {};

  if (type === "SoftwareApplication") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: data?.title || "RemovExif",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: data?.description || defaultDescription,
      url: data?.url || `${baseUrl}/${locale}`,
      inLanguage: locale,
    };
  } else if (type === "FAQPage") {
    const fallbackFaq: FaqEntry[] = [
      {
        question: "What is EXIF data?",
        answer:
          "EXIF data is metadata embedded in digital photos that includes information like GPS coordinates, camera settings, and timestamps.",
      },
      {
        question: "Why should I remove EXIF data?",
        answer:
          "Removing EXIF data protects your privacy by eliminating GPS coordinates that could reveal your location and other sensitive information.",
      },
      {
        question: "Is RemovExif free?",
        answer:
          "Yes, RemovExif is completely free to use. All processing happens in your browser - your photos never leave your device.",
      },
    ];

    const entries = data?.faqEntries?.length ? data.faqEntries : fallbackFaq;

    structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entries.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.answer,
        },
      })),
    };
  } else if (type === "Article" && data) {
    const coverImage = data.coverImage
      ? data.coverImage.startsWith("http")
        ? data.coverImage
        : `${baseUrl}${data.coverImage.startsWith("/") ? "" : "/"}${data.coverImage}`
      : undefined;
    const articleUrl = data.url
      ? data.url.startsWith("http")
        ? data.url
        : `${baseUrl}${data.url.startsWith("/") ? "" : "/"}${data.url}`
      : `${baseUrl}/${locale}`;

    structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: coverImage,
      datePublished: data.date,
      dateModified: data.modifiedDate || data.date,
      mainEntityOfPage: articleUrl,
      author: {
        "@type": "Organization",
        name: data.authorName || "RemovExif Team",
      },
      publisher: {
        "@type": "Organization",
        name: "RemovExif",
      },
      inLanguage: locale,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

