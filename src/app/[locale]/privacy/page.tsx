import { getTranslations } from "next-intl/server";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";
import Navbar from "@/components/Navbar";

interface PrivacyPageProps {
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
    title: "Privacy Policy - RemovExif",
    description: "Privacy Policy for RemovExif. Learn how we protect your data and privacy.",
    path: "/privacy",
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Privacy");

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black text-black mb-8 uppercase">
          {t("title")}
        </h1>

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
              {t("data_collection.title")}
            </h2>
            <p className="text-black leading-relaxed mb-4 font-bold">
              {t("data_collection.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("data_collection.item1")}</li>
              <li>{t("data_collection.item2")}</li>
              <li>{t("data_collection.item3")}</li>
              <li>{t("data_collection.item4")}</li>
              <li>{t("data_collection.item5")}</li>
            </ul>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("automated_data.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("automated_data.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("automated_data.item1")}</li>
              <li>{t("automated_data.item2")}</li>
              <li>{t("automated_data.item3")}</li>
              <li>{t("automated_data.item4")}</li>
            </ul>
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("automated_data.note")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("legal_basis.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("legal_basis.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("legal_basis.item1")}</li>
              <li>{t("legal_basis.item2")}</li>
              <li>{t("legal_basis.item3")}</li>
            </ul>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("your_rights.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("your_rights.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("your_rights.right1")}</li>
              <li>{t("your_rights.right2")}</li>
              <li>{t("your_rights.right3")}</li>
              <li>{t("your_rights.right4")}</li>
              <li>{t("your_rights.right5")}</li>
              <li>{t("your_rights.right6")}</li>
              <li>{t("your_rights.right7")}</li>
            </ul>
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("your_rights.note")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("data_retention.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("data_retention.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("data_security.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("data_security.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("advertising.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("advertising.content")}
            </p>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("advertising.partners")}
            </p>
            <p className="text-black leading-relaxed font-bold">
              {t("advertising.opt_out")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("cookies.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("cookies.content")}
            </p>
            <p className="text-black leading-relaxed font-bold mb-2">
              {t("cookies.types")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("cookies.type1")}</li>
              <li>{t("cookies.type2")}</li>
            </ul>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("third_party.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold mb-4">
              {t("third_party.content")}
            </p>
            <ul className="list-disc list-inside text-black space-y-2 font-bold">
              <li>{t("third_party.service1")}</li>
              <li>{t("third_party.service2")}</li>
            </ul>
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("third_party.note")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("children.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("children.content")}
            </p>
          </section>

          <section className="mb-8 border-b-4 border-black pb-8">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              {t("changes.title")}
            </h2>
            <p className="text-black leading-relaxed font-bold">
              {t("changes.content")}
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
            <p className="text-black leading-relaxed font-bold mt-4">
              {t("contact.note")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

