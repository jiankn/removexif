import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always", // 强制 URL 显示 /en，避免 SEO 重复内容问题
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(zh-CN|zh-TW|en|es|pt|de|fr|ja)/:path*"],
};

