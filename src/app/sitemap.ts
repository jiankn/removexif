import { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { getBlogPostSlugs } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://removexif.com";

  // Static pages
  const staticPages = [
    "",
    "/blog",
    "/privacy",
    "/terms",
    "/about",
  ];

  // Generate sitemap entries for all locales
  const entries: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }

    // Add blog posts for each locale
    try {
      const slugs = getBlogPostSlugs(locale);
      for (const slug of slugs) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error(`Error getting blog posts for ${locale}:`, error);
    }
  }

  return entries;
}

