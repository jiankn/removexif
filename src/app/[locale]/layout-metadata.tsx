import { Metadata } from "next";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataUtil({
    locale: locale as Locale,
  });
}

