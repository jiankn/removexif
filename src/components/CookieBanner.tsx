"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Cookie } from "lucide-react";
import { type Locale } from "@/i18n";

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const locale = useLocale() as Locale;
  const { hasConsent, acceptAll, rejectAll, isLoading, consent } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Wait for consent state to load, then show banner if no consent
    if (!isLoading && !hasConsent()) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, consent]);

  const handleAccept = () => {
    setIsAnimating(false);
    setTimeout(() => {
      acceptAll();
      setIsVisible(false);
    }, 300);
  };

  const handleReject = () => {
    setIsAnimating(false);
    setTimeout(() => {
      rejectAll();
      setIsVisible(false);
    }, 300);
  };

  // Don't render if user has already made a choice
  if (hasConsent() || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t-4 border-black shadow-brutal-lg transition-transform duration-300 ease-out ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`}
      role="dialog"
      aria-label={t("title")}
      aria-modal="true"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {/* Cookie Icon and Text */}
          <div className="flex items-start gap-2 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-black text-black uppercase mb-0.5">
                {t("title")}
              </h3>
              <p className="text-xs sm:text-sm text-black font-bold leading-tight">
                {t("description")}{" "}
                <Link
                  href={`/${locale}/privacy`}
                  className="underline hover:no-underline font-black"
                >
                  {t("learn_more")}
                </Link>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border-4 border-black text-black font-black uppercase text-xs sm:text-sm hover-brutal shadow-brutal-sm transition-all"
              aria-label={t("reject")}
            >
              {t("reject")}
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white font-black uppercase text-xs sm:text-sm hover-brutal shadow-brutal-sm transition-all"
              aria-label={t("accept")}
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

