import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import ChameleonSidebarPlaceholder from "@/components/ChameleonSidebarPlaceholder";
import AdUnit from "@/components/ads/AdUnit";
import {
  getChameleonSidebarContent,
  getHowToUsePageContent,
} from "@/content/marketing";
import { adConfig } from "@/lib/ads-config";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import type { Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<ReturnType<typeof generateMetadataUtil>> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "HowToUsePage" });

  return generateMetadataUtil({
    locale: locale as Locale,
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/how-to-use",
  });
}

export default async function HowToUsePage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const [howToUsePageContent, chameleonSidebarContent, tCommon] = await Promise.all([
    getHowToUsePageContent(typedLocale),
    getChameleonSidebarContent(typedLocale),
    getTranslations({ locale: typedLocale, namespace: "Common" }),
  ]);
  const {
    heroBadge,
    heroTitle,
    heroDescription,
    steps,
    checklistTitle,
    checklistItems,
    useCasesTitle,
    useCases,
    cta,
  } = howToUsePageContent;

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4 border-4 border-black bg-white shadow-brutal-lg p-6">
          <span className="inline-flex items-center px-3 py-1 text-xs font-black uppercase bg-[#FFD93D] border-2 border-black shadow-brutal-sm">
            {heroBadge}
          </span>
          <h1 className="text-4xl font-black text-black uppercase">{heroTitle}</h1>
          <p className="text-lg font-bold text-black leading-relaxed">{heroDescription}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {steps.map((step) => (
              <article key={step.title} className="border-4 border-black bg-white shadow-brutal-lg p-6 space-y-3">
                <h2 className="text-2xl font-black text-black uppercase">{step.title}</h2>
                <p className="text-base font-bold text-black leading-relaxed">{step.description}</p>
                {step.metadata && (
                  <ul className="space-y-2">
                    {step.metadata.map((item) => (
                      <li
                        key={item}
                        className="text-sm font-bold text-black border-2 border-black bg-[#E0F2FE] px-3 py-2 shadow-brutal-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            <section className="border-4 border-black bg-[#F1F5F9] shadow-brutal-lg p-6 space-y-4">
              <h3 className="text-xl font-black text-black uppercase">{checklistTitle}</h3>
              <ul className="space-y-2 list-disc list-inside text-sm font-bold text-black">
                {checklistItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="border-4 border-black bg-[#DCFCE7] shadow-brutal-lg p-6 space-y-4">
              <h3 className="text-xl font-black text-black uppercase">{useCasesTitle}</h3>
              <ul className="space-y-2 text-sm font-bold text-black">
                {useCases.map((item) => (
                  <li key={item} className="border-2 border-black px-3 py-2 bg-white shadow-brutal-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-4 border-black bg-[#A3E635]/40 shadow-brutal-lg p-6 space-y-4 text-black">
              <h3 className="text-2xl font-black uppercase">{cta.title}</h3>
              <p className="text-base font-bold leading-relaxed">{cta.description}</p>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center justify-center px-5 py-3 border-2 border-black bg-black text-white text-sm font-black uppercase shadow-brutal hover-brutal"
              >
                {cta.buttonLabel}
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AdUnit
                slotId={adConfig.sidebar}
                format="display"
                style="auto"
                fixedHeight={600}
              />
              <ChameleonSidebarPlaceholder
                title={chameleonSidebarContent.title}
                description={chameleonSidebarContent.description}
                bullets={chameleonSidebarContent.bullets}
                badge={chameleonSidebarContent.badge}
                cta={chameleonSidebarContent.cta}
              />
              <div className="bg-[#A3E635] border-4 border-black shadow-brutal-lg p-6 space-y-3 text-black">
                <h3 className="text-lg font-black uppercase">{tCommon("try_now_title")}</h3>
                <p className="text-sm font-bold leading-relaxed">{tCommon("try_now_description")}</p>
                <Link
                  href={`/${locale}`}
                  className="block w-full text-center px-4 py-2 bg-white text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase"
                >
                  {tCommon("get_started")}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


