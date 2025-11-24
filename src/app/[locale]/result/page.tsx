import ResultPageClient from "@/components/ResultPageClient";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";

interface ResultPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ResultPageProps): Promise<ReturnType<typeof generateMetadataUtil>> {
  const { locale } = await params;
  return generateMetadataUtil({
    locale: locale as Locale,
    title: "Processed Images Dashboard | RemovExif",
    description:
      "Review processed photos, download cleaned files, and clear EXIF metadata history securely in your browser.",
    path: "/result",
    image: "/upload-bg.webp",
  });
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { locale } = await params;
  return <ResultPageClient locale={locale} />;
}

