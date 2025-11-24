import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  coverImage?: string;
  content: string;
  htmlContent: string;
}

/**
 * Parse markdown file with front matter
 */
export async function parseMarkdown(
  fileContent: string,
  slug: string
): Promise<BlogPost> {
  const { data, content } = matter(fileContent);

  // Process markdown to HTML
  const processedContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);

  let htmlContent = processedContent.toString();

  // Auto-link insertion: Replace keywords with links to homepage
  htmlContent = insertInternalLinks(htmlContent);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    author: data.author || "RemovExif Team",
    tags: data.tags || [],
    coverImage: data.coverImage,
    content,
    htmlContent,
  };
}

/**
 * Insert internal links for keywords
 */
function insertInternalLinks(html: string): string {
  // Keywords to link (case-insensitive)
  const keywords = [
    { pattern: /EXIF remover/gi, link: "/" },
    { pattern: /clean photos/gi, link: "/" },
    { pattern: /remove EXIF/gi, link: "/" },
    { pattern: /EXIF data remover/gi, link: "/" },
  ];

  let result = html;

  keywords.forEach(({ pattern, link }) => {
    result = result.replace(
      pattern,
      (match) => `<a href="${link}" class="text-indigo-600 font-bold hover:underline">${match}</a>`
    );
  });

  return result;
}

/**
 * Insert ads every 500 words in HTML content
 */
export function insertAdsInContent(htmlContent: string): string {
  // Split by paragraphs
  const paragraphs = htmlContent.split("</p>");
  const wordsPerParagraph = 100; // Approximate
  let wordCount = 0;
  const adPlaceholder = '<div class="blog-ad-placeholder" data-ad-slot="in-article"></div>';

  const result: string[] = [];
  let adInserted = false;

  paragraphs.forEach((para, index) => {
    if (para.trim()) {
      result.push(para + (index < paragraphs.length - 1 ? "</p>" : ""));
      
      // Count words in paragraph (rough estimate)
      const words = para.split(/\s+/).length;
      wordCount += words;

      // Insert ad every 500 words
      if (wordCount >= 500 && !adInserted && index < paragraphs.length - 1) {
        result.push(adPlaceholder);
        wordCount = 0;
        adInserted = true;
      } else {
        adInserted = false;
      }
    }
  });

  return result.join("");
}

