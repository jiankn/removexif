"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { type Locale } from "@/i18n";

export default function FeaturedGuidesWidget() {
  const t = useTranslations("Widgets.FeaturedGuides");
  const locale = useLocale() as Locale;

  const guides = [
    {
      title: t("guide_1_title"),
      description: t("guide_1_desc"),
      href: `/${locale}/blog/how-to-remove-gps-from-iphone-photos`,
    },
    {
      title: t("guide_2_title"),
      description: t("guide_2_desc"),
      href: `/${locale}/blog/is-it-safe-to-share-photos-on-reddit`,
    },
    {
      title: t("guide_3_title"),
      description: t("guide_3_desc"),
      href: `/${locale}/blog/check-shutter-count-online-free`,
    },
    {
      title: t("guide_4_title"),
      description: t("guide_4_desc"),
      href: `/${locale}/blog/remove-camera-serial-number-metadata`,
    },
  ];

  return (
    <div className="bg-white border-4 border-black shadow-brutal-lg p-6 h-[600px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#A3E635] border-4 border-black shadow-brutal flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-black" />
        </div>
        <h3 className="text-lg font-black text-black uppercase">
          {t("title")}
        </h3>
      </div>

      {/* Guides List */}
      <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-contain">
        {guides.map((guide, index) => (
          <Link
            key={index}
            href={guide.href}
            className="block bg-white border-4 border-black shadow-brutal p-3 hover-brutal break-words"
          >
            <h4 className="text-sm font-black text-black mb-1 uppercase break-words">
              {guide.title}
            </h4>
            <p className="text-xs text-black line-clamp-2 font-bold break-words">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t-4 border-black">
        <Link
          href={`/${locale}/blog`}
          className="flex items-center justify-between text-sm font-bold text-black uppercase bg-[#FFD93D] border-4 border-black shadow-brutal hover-brutal px-4 py-2"
        >
          <span>{t("read_more")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

