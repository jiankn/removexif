import {
  getBlogPost,
  getRelatedPosts,
  getAvailableLocalesForSlug,
} from "@/lib/blog";
import { locales, type Locale } from "@/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AdUnit from "@/components/ads/AdUnit";
import StructuredData from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import BlogImage from "@/components/BlogImage";
import { adConfig } from "@/lib/ads-config";
import { insertAdsInContent } from "@/lib/markdown";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { formatBlogDate } from "@/lib/stats";
import { LanguageAvailabilityProvider } from "@/context/LanguageAvailabilityContext";
import { getLocaleName } from "@/lib/localeNames";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<ReturnType<typeof generateMetadataUtil>> {
  const { locale, slug } = await params;
  const post = await getBlogPost(locale as Locale, slug);

  if (!post) {
    return generateMetadataUtil({
      locale: locale as Locale,
      title: "Blog Post - RemovExif",
      description: "Blog post on RemovExif",
      path: `/blog/${slug}`,
    });
  }

  return generateMetadataUtil({
    locale: locale as Locale,
    title: `${post.title} - RemovExif Blog`,
    description: post.description,
    path: `/blog/${slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPost(locale as Locale, slug);
  const t = await getTranslations("Common");

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(locale as Locale, slug, 3);
  const htmlContentWithAds = insertAdsInContent(post.htmlContent);
  const availableLocales = getAvailableLocalesForSlug(slug);
  const availabilityMessage =
    availableLocales.length > 0 && availableLocales.length < locales.length
      ? t("language_unavailable_hint", {
          languages: availableLocales.map((loc) => getLocaleName(loc)).join(", "),
        })
      : null;

  return (
    <LanguageAvailabilityProvider
      value={{ availableLocales, message: availabilityMessage }}
    >
      <div className="min-h-screen bg-white pt-16">
      <Navbar />
      <StructuredData
        locale={locale as Locale}
        type="Article"
        data={{
          title: post.title,
          description: post.description,
          coverImage: post.coverImage,
          date: post.date,
          modifiedDate: post.date,
          authorName: post.author,
          url: `/${locale}/blog/${post.slug}`,
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <Link
              href={`/${locale}/blog`}
              className="bg-white text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase mb-6 inline-block px-4 py-2"
            >
              {t("back_to_blog")}
            </Link>

            <header className="mb-8 bg-white border-4 border-black shadow-brutal-lg p-6">
              <h1 className="text-4xl font-black text-black mb-4 uppercase">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-black font-bold">
                <time
                  dateTime={post.date}
                  className="bg-[#FFD93D] border-2 border-black px-3 py-1 shadow-brutal-sm"
                >
                  {formatBlogDate(locale, post.date, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.author && <span>by {post.author}</span>}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#A3E635] text-black border-2 border-black shadow-brutal-sm text-sm font-black uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {post.coverImage && (
              <div className="relative w-full h-64 md:h-96 bg-white border-4 border-black shadow-brutal-lg mb-8 overflow-hidden">
                <BlogImage
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-slate max-w-none bg-white border-4 border-black shadow-brutal-lg p-8"
              dangerouslySetInnerHTML={{ __html: htmlContentWithAds }}
            />

            {/* Back to Blog Button at Bottom */}
            <div className="mt-8 text-center">
              <Link
                href={`/${locale}/blog`}
                className="bg-white text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase inline-flex items-center gap-2 px-6 py-3"
              >
                {t("back_to_blog")}
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-black text-black mb-6 uppercase">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/${locale}/blog/${relatedPost.slug}`}
                      className="block bg-white border-4 border-black shadow-brutal overflow-hidden hover-brutal"
                    >
                      {relatedPost.coverImage && (
                        <div className="relative w-full h-32 bg-white border-b-4 border-black">
                          <BlogImage
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-black text-black mb-2 line-clamp-2 uppercase">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-black line-clamp-2 font-bold">
                          {relatedPost.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Sidebar Ad */}
              <AdUnit
                slotId={adConfig.sidebar}
                format="display"
                style="auto"
                fixedHeight={600}
              />

              {/* CTA Widget */}
              <div className="bg-[#A3E635] border-4 border-black shadow-brutal-lg p-6">
                <h3 className="text-lg font-black text-black mb-3 uppercase">
                  {t("try_now_title")}
                </h3>
                <p className="text-sm text-black mb-4 font-bold">
                  {t("try_now_description")}
                </p>
                <Link
                  href={`/${locale}`}
                  className="block w-full text-center px-4 py-2 bg-white text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase"
                >
                  {t("get_started")}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </LanguageAvailabilityProvider>
  );
}

