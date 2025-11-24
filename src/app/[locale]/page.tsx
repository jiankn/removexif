import { getTranslations } from "next-intl/server";
import HomePageClient from "@/components/HomePageClient";
import StructuredData from "@/components/StructuredData";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<ReturnType<typeof generateMetadataUtil>> {
  const { locale } = await params;
  return generateMetadataUtil({
    locale: locale as Locale,
    title: "Free Online EXIF Viewer & Remover | RemovExif",
    description:
      "Remove GPS coordinates, camera model, timestamps, and all EXIF metadata from photos directly in your browser.",
    path: "",
    image: "/upload-bg.webp",
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  const faqEntries = [
    {
      question: t("seo_what_title"),
      answer: t("seo_what_content"),
    },
    {
      question: t("seo_why_title"),
      answer: t("seo_why_content"),
    },
    {
      question: t("seo_how_title"),
      answer: t("seo_how_content"),
    },
  ];

  return (
    <>
      <StructuredData
        locale={locale as Locale}
        type="SoftwareApplication"
        data={{
          description: t("hero_subtitle"),
        }}
      />
      <StructuredData
        locale={locale as Locale}
        type="FAQPage"
        data={{ faqEntries }}
      />
      <HomePageClient locale={locale} />
    </>
  );
}
