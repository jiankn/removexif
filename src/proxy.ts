import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always",
});

export const config = {
  matcher: [
    // 单独列出根路径，确保 '/' 会被重定向到默认语言
    "/",
    // 匹配除 api/_next/_vercel 及静态文件以外的所有路径
    "/:path((?!api|_next|_vercel|.*\\..*).*)",
  ],
};