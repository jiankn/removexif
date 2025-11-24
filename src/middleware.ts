import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always",
});

export const config = {
  // ✅ 修复：使用通用匹配规则，确保根路径 '/' 一定会被拦截
  matcher: [
    // 匹配所有路径，除了：
    // 1. /api 开头的 (API routes)
    // 2. /_next 开头的 (Next.js internals)
    // 3. /_vercel 开头的 (Vercel internals)
    // 4. 包含点的文件 (static files like .css, .png, .ico)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};