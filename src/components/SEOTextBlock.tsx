"use client";
import { useTranslations } from "next-intl";

export default function SEOTextBlock() {
  const t = useTranslations("Home");

  const sections = [
    {
      title: t("seo_what_title"),
      content: t("seo_what_content"),
      bgColor: "bg-white",
    },
    {
      title: t("seo_why_title"),
      content: t("seo_why_content"),
      bgColor: "bg-[#FFD93D]",
    },
    {
      title: t("seo_how_title"),
      content: t("seo_how_content"),
      bgColor: "bg-white",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`${section.bgColor} border-4 border-black p-8 shadow-brutal-lg`}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-6 uppercase tracking-tight leading-tight">
                {section.title}
              </h2>
              <p className="text-black leading-relaxed font-bold text-lg">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

