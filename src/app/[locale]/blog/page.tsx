import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getBlogPosts } from "@/lib/blog";
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata";
import { type Locale } from "@/i18n";
import AdUnit from "@/components/ads/AdUnit";
import Navbar from "@/components/Navbar";
import BlogImage from "@/components/BlogImage";
import { adConfig } from "@/lib/ads-config";
import { formatBlogDate } from "@/lib/stats";

interface BlogListPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogListPageProps): Promise<ReturnType<typeof generateMetadataUtil>> {
  const { locale } = await params;
  return generateMetadataUtil({
    locale: locale as Locale,
    title: "RemovExif Blog - Privacy & Metadata Guides",
    description:
      "Latest tutorials on removing EXIF data, keeping location private, and protecting your photos before sharing them online.",
    path: "/blog",
  });
}

export default async function BlogListPage({ params }: BlogListPageProps) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale as Locale);
  const t = await getTranslations("Common");

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black text-black mb-8 uppercase">{t("blog")}</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black font-bold">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div key={post.slug}>
                {index > 0 && index % 3 === 0 && (
                  <div className="col-span-full mb-6">
                    <AdUnit
                      slotId={adConfig.nativeGrid}
                      format="display"
                      style="auto"
                      fixedHeight={250}
                    />
                  </div>
                )}

                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="block bg-white border-4 border-black shadow-brutal overflow-hidden hover-brutal"
                >
                  {post.coverImage && (
                    <div className="relative w-full h-48 bg-white border-b-4 border-black">
                      <BlogImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-black text-black mb-2 line-clamp-2 uppercase">
                      {post.title}
                    </h2>
                    <p className="text-black text-sm mb-4 line-clamp-3 font-bold">
                      {post.description || post.content.substring(0, 100) + "..."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-black font-bold">
                      <span>{formatBlogDate(locale, post.date)}</span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="px-3 py-1 bg-[#A3E635] border-2 border-black shadow-brutal-sm uppercase font-black">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

