import { getTranslations } from "next-intl/server";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";
import Navbar from "@/components/Navbar";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReturnType<typeof generateMetadataUtil>> {
  const { locale } = await params;
  return generateMetadataUtil({
    locale: locale as Locale,
    title: "About Us - RemovExif",
    description: "Learn about RemovExif and our mission to protect user privacy.",
    path: "/about",
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations("About");

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black text-black mb-8 uppercase">{t("title")}</h1>

        <div className="bg-white border-4 border-black shadow-brutal-lg p-8 prose prose-slate max-w-none">
          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("mission.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("mission.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("how_it_works.title")}
            </h2>
            <p className="text-black leading-relaxed mb-4 font-bold">
              {t("how_it_works.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("how_it_works.item1")}</li>
              <li>{t("how_it_works.item2")}</li>
              <li>{t("how_it_works.item3")}</li>
              <li>{t("how_it_works.item4")}</li>
              <li>{t("how_it_works.item5")}</li>
            </ul>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("features.title")}
            </h2>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("features.item1")}</li>
              <li>{t("features.item2")}</li>
              <li>{t("features.item3")}</li>
              <li>{t("features.item4")}</li>
              <li>{t("features.item5")}</li>
              <li>{t("features.item6")}</li>
            </ul>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("open_source.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("open_source.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("contact.title")}
            </h2>
            <p className="text-black leading-relaxed mb-4 font-bold">
              {t("contact.content")}
            </p>
            <p className="text-black leading-relaxed font-black bg-[#FFD93D] border-4 border-black px-4 py-2 inline-block shadow-brutal">
              {t("contact.email")}
            </p>
            <p className="text-black leading-relaxed mt-4 font-bold">
              {t("contact.note")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("support.title")}
            </h2>
            <p className="text-black leading-relaxed mb-4 font-bold">
              {t("support.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("support.item1")}</li>
              <li>{t("support.item2")}</li>
              <li>{t("support.item3")}</li>
              <li>{t("support.item4")}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

