export const locales = [
  "en",
  "es",
  "pt",
  "de",
  "fr",
  "ja",
  "zh-CN",
  "zh-TW",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

