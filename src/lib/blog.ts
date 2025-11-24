import fs from "fs";
import path from "path";
import { parseMarkdown, type BlogPost } from "./markdown";
import { locales, type Locale } from "@/i18n";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

/**
 * Get all blog posts for a specific locale
 */
export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const localeDir = path.join(postsDirectory, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);
  const posts: BlogPost[] = [];

  for (const fileName of fileNames) {
    if (fileName.endsWith(".md")) {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(localeDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      try {
        const post = await parseMarkdown(fileContents, slug);
        posts.push(post);
      } catch (error) {
        console.error(`Error parsing ${fileName}:`, error);
      }
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(
  locale: Locale,
  slug: string
): Promise<BlogPost | null> {
  const localeDir = path.join(postsDirectory, locale);
  const fullPath = path.join(localeDir, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    return await parseMarkdown(fileContents, slug);
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog post slugs for a locale
 */
export function getBlogPostSlugs(locale: Locale): string[] {
  const localeDir = path.join(postsDirectory, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

/**
 * Get related posts (same locale, different slug)
 */
export async function getRelatedPosts(
  locale: Locale,
  currentSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts(locale);
  return allPosts.filter((post) => post.slug !== currentSlug).slice(0, limit);
}

/**
 * Get locales that contain a specific slug
 */
export function getAvailableLocalesForSlug(slug: string): Locale[] {
  return locales.filter((locale) => {
    const fullPath = path.join(postsDirectory, locale, `${slug}.md`);
    return fs.existsSync(fullPath);
  });
}

