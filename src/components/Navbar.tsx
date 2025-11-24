"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Shield, Globe, Menu, X, Check } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { localeNames } from "@/lib/localeNames";
import { cn } from "@/lib/utils";
import { useLanguageAvailability } from "@/context/LanguageAvailabilityContext";

export default function Navbar() {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const languageAvailability = useLanguageAvailability();
  const availableLocales = languageAvailability?.availableLocales;
  const availableLocalesCount = availableLocales?.length ?? 0;
  const hasRestrictedLocales =
    availableLocalesCount > 0 && availableLocalesCount < locales.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLanguageMenuOpen(false);
    // 替换路径中的语言部分
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
    router.refresh();
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white border-b-4 border-black shadow-brutal-sm"
          : "bg-white border-b-4 border-black"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-black font-black text-[1.6875rem] hover-brutal"
          >
            <div className="relative">
              <Shield className="w-[30px] h-[30px]" style={{ color: "#399933" }} fill="#399933" />
              <Check className="w-[15px] h-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" strokeWidth={3} />
            </div>
            <span className="uppercase">{t("brand_name")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href={`/${locale}`}
              className="text-black font-bold uppercase hover-brutal border-2 border-black px-3 py-1.5 text-sm shadow-brutal-sm"
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="text-black font-bold uppercase hover-brutal border-2 border-black px-3 py-1.5 text-sm shadow-brutal-sm"
            >
              {t("blog")}
            </Link>
            <Link
              href={`/${locale}/features`}
              className="text-black font-bold uppercase hover-brutal border-2 border-black px-3 py-1.5 text-sm shadow-brutal-sm"
            >
              {t("features")}
            </Link>
            <Link
              href={`/${locale}/how-to-use`}
              className="text-black font-bold uppercase hover-brutal border-2 border-black px-3 py-1.5 text-sm shadow-brutal-sm"
            >
              {t("how_to_use")}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="text-black font-bold uppercase hover-brutal border-2 border-black px-3 py-1.5 text-sm shadow-brutal-sm"
            >
              {t("faq")}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1.5 text-black font-bold uppercase border-2 border-black px-3 py-1.5 text-sm shadow-brutal-sm hover-brutal bg-white"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{localeNames[locale]}</span>
              </button>

              {languageMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLanguageMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border-4 border-black shadow-brutal py-2 z-20">
                    {locales.map((loc) => {
                      const isAvailable =
                        !availableLocales || availableLocales.includes(loc);

                      return (
                        <button
                          key={loc}
                          onClick={() => {
                            if (!isAvailable) {
                              return;
                            }
                            handleLanguageChange(loc);
                          }}
                          disabled={!isAvailable}
                          aria-disabled={!isAvailable}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-bold uppercase transition-colors",
                            locale === loc
                              ? "bg-[#A3E635] text-black"
                              : "text-black hover:bg-[#FFD93D]",
                            !isAvailable && "opacity-60 cursor-not-allowed"
                          )}
                          title={
                            !isAvailable ? languageAvailability?.message ?? undefined : undefined
                          }
                        >
                          {localeNames[loc]}
                        </button>
                      );
                    })}
                    {hasRestrictedLocales && languageAvailability?.message && (
                      <p className="px-4 pt-2 text-[11px] font-bold uppercase text-black">
                        {languageAvailability.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black border-2 border-black px-2.5 py-1.5 shadow-brutal-sm hover-brutal"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t-4 border-black bg-white">
            <Link
              href={`/${locale}`}
              className="block py-2 px-4 text-black font-bold uppercase border-2 border-black mb-2 mx-4 shadow-brutal-sm hover-brutal text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="block py-2 px-4 text-black font-bold uppercase border-2 border-black mb-2 mx-4 shadow-brutal-sm hover-brutal text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("blog")}
            </Link>
            <Link
              href={`/${locale}/features`}
              className="block py-2 px-4 text-black font-bold uppercase border-2 border-black mb-2 mx-4 shadow-brutal-sm hover-brutal text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href={`/${locale}/how-to-use`}
              className="block py-2 px-4 text-black font-bold uppercase border-2 border-black mb-2 mx-4 shadow-brutal-sm hover-brutal text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("how_to_use")}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="block py-2 px-4 text-black font-bold uppercase border-2 border-black mb-2 mx-4 shadow-brutal-sm hover-brutal text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("faq")}
            </Link>
            <div className="py-2 px-4">
              <div className="text-xs font-black uppercase text-black mb-2">{t("language")}</div>
              {locales.map((loc) => {
                const isAvailable =
                  !availableLocales || availableLocales.includes(loc);

                return (
                  <button
                    key={loc}
                    onClick={() => {
                      if (!isAvailable) {
                        return;
                      }
                      handleLanguageChange(loc);
                      setMobileMenuOpen(false);
                    }}
                    disabled={!isAvailable}
                    aria-disabled={!isAvailable}
                    className={cn(
                      "block w-full text-left py-1.5 px-3 text-sm font-bold uppercase mb-1 border-2 border-black shadow-brutal-sm hover-brutal",
                      locale === loc
                        ? "bg-[#A3E635] text-black"
                        : "bg-white text-black",
                      !isAvailable && "opacity-60 cursor-not-allowed"
                    )}
                    title={
                      !isAvailable ? languageAvailability?.message ?? undefined : undefined
                    }
                  >
                    {localeNames[loc]}
                  </button>
                );
              })}
              {hasRestrictedLocales && languageAvailability?.message && (
                <p className="mt-2 text-[11px] font-bold uppercase text-black">
                  {languageAvailability.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

