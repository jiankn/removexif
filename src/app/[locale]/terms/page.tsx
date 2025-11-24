import { getTranslations } from "next-intl/server";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";
import Navbar from "@/components/Navbar";

interface TermsPageProps {
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
    title: "Terms of Service - RemovExif",
    description: "Terms of Service for RemovExif.",
    path: "/terms",
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Terms");

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black text-black mb-8 uppercase">{t("title")}</h1>

        <div className="bg-white border-4 border-black shadow-brutal-lg p-8 prose prose-slate max-w-none">
          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("last_updated")}
            </h2>
            <p className="text-black font-bold bg-[#FFD93D] border-4 border-black px-4 py-2 inline-block shadow-brutal">{new Date().toLocaleDateString(locale)}</p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("introduction.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("introduction.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("service_description.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("service_description.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("usage.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("usage.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("usage.item1")}</li>
              <li>{t("usage.item2")}</li>
              <li>{t("usage.item3")}</li>
              <li>{t("usage.item4")}</li>
              <li>{t("usage.item5")}</li>
              <li>{t("usage.item6")}</li>
            </ul>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("user_responsibility.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("user_responsibility.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("user_responsibility.item1")}</li>
              <li>{t("user_responsibility.item2")}</li>
              <li>{t("user_responsibility.item3")}</li>
              <li>{t("user_responsibility.item4")}</li>
            </ul>
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("user_responsibility.note")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("intellectual_property.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("intellectual_property.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("disclaimers.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("disclaimers.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("disclaimers.item1")}</li>
              <li>{t("disclaimers.item2")}</li>
              <li>{t("disclaimers.item3")}</li>
              <li>{t("disclaimers.item4")}</li>
            </ul>
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("disclaimers.note")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("liability.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("liability.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("liability.item1")}</li>
              <li>{t("liability.item2")}</li>
              <li>{t("liability.item3")}</li>
              <li>{t("liability.item4")}</li>
              <li>{t("liability.item5")}</li>
            </ul>
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("liability.note")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("indemnification.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("indemnification.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("modifications.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("modifications.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("termination.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("termination.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("governing_law.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("governing_law.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("contact.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("contact.content")}
            </p>
            <p className="text-black leading-relaxed font-bold font-medium">
              {t("contact.email")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

