"use client";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Home");

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block border-4 border-black bg-[#A3E635] px-8 py-4 mb-8 shadow-brutal-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-black mb-0 leading-none uppercase tracking-tight">
            {t("hero_title")}
          </h1>
        </div>
        <div className="max-w-2xl mx-auto border-4 border-black bg-white px-6 py-4 shadow-brutal">
          <p className="text-lg sm:text-xl text-black leading-relaxed font-bold">
            {t("hero_subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}

