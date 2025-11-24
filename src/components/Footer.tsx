"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Shield, Check, Twitter, Facebook, Instagram } from "lucide-react";
import { type Locale } from "@/i18n";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function Footer() {
  const t = useTranslations("Footer");
  const tCommon = useTranslations("Common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { hasConsent, clearConsent } = useCookieConsent();
  
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(`${window.location.origin}${pathname}`);
  }, [pathname]);

  const handleManageCookies = () => {
    clearConsent();
  };

  return (
    <footer className="bg-white border-t-4 border-black mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          {/* Brand Section */}
          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 text-black font-black text-[1.6875rem] mb-2 hover-brutal"
            >
              <div className="relative">
                <Shield className="w-[30px] h-[30px]" style={{ color: "#399933" }} fill="#399933" />
                <Check className="w-[15px] h-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" strokeWidth={3} />
              </div>
              <span className="uppercase">{tCommon("brand_name")}</span>
            </Link>
            <p className="text-xs text-black leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-xs font-black text-black uppercase mb-2 border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm">
              {t("legal")}
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {t("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {t("terms_of_service")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {t("about_us")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@removexif.com"
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {t("contact_us")}
                </a>
              </li>
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-xs font-black text-black uppercase mb-2 border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm">
              {t("resources")}
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href={`/${locale}/features`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {tCommon("features")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/how-to-use`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {tCommon("how_to_use")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  {tCommon("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                >
                  Blog
                </Link>
              </li>
              {hasConsent() && (
                <li>
                  <button
                    onClick={handleManageCookies}
                    className="text-xs text-black font-bold hover-brutal border-2 border-black px-2 py-0.5 inline-block shadow-brutal-sm"
                  >
                    {t("manage_cookies")}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="border-t-4 border-black pt-4 pb-3">
          <div className="flex items-center justify-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border-2 border-black shadow-brutal hover-brutal bg-white text-black transition-all"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border-2 border-black shadow-brutal hover-brutal bg-white text-black transition-all"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border-2 border-black shadow-brutal hover-brutal bg-white text-black transition-all"
              aria-label="Follow on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t-4 border-black pt-4">
          <p className="text-xs text-black font-bold text-center">
            {t("copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}

