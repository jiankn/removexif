"use client";

import { useTranslations } from "next-intl";
import { Share2, Twitter, Facebook } from "lucide-react";

export default function TransparencyWidget() {
  const t = useTranslations("Widgets.Transparency");

  const handleShare = (platform: "twitter" | "facebook") => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text = t("share_text");
    
    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="bg-white border-4 border-black shadow-brutal-lg p-6 text-center">
      <h3 className="text-lg font-black text-black mb-2 uppercase">
        {t("title")}
      </h3>
      <p className="text-sm text-black mb-6 leading-relaxed font-bold">
        {t("description")}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white border-4 border-black shadow-brutal hover-brutal text-sm font-bold uppercase"
        >
          <Twitter className="w-4 h-4" />
          <span>{t("share_on_x")}</span>
        </button>
        <button
          onClick={() => handleShare("facebook")}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D9FF] text-black border-4 border-black shadow-brutal hover-brutal text-sm font-bold uppercase"
        >
          <Facebook className="w-4 h-4" />
          <span>{t("share_on_facebook")}</span>
        </button>
      </div>
    </div>
  );
}

