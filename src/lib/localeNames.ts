import { type Locale } from "@/i18n";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

export function getLocaleName(locale: Locale): string {
  return localeNames[locale] ?? locale;
}

