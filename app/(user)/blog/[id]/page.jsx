import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";
import RichRenderer from "@/components/shared/blog/rich-renderer";
import CommentsSection from "@/components/shared/blog/comments-section";
import ReadingProgress from "@/components/shared/blog/reading-progress";
import ShareButtons from "@/components/shared/blog/share-buttons";

export const revalidate = 60;

// ── Helpers ───────────────────────────────────────────────────────────────────
async function fetchPost(id) {
  const isUUID = /^[0-9a-f-]{36}$/.test(id);
  const query = supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .is("deleted_at", null)
    .eq("status", "published");
  const { data } = await (isUUID ? query.eq("id", id).single() : query.eq("slug", id).single());
  return data ? normalisePost(data) : null;
}

async function fetchRelated(post) {
  if (!post.tags?.length) return [];
  const tagNames = post.tags.map((t) => t.label);
  const { data } = await supabaseAdmin
    .from("posts")
    .select("id, slug, title, cover_image, excerpt, publish_date, post_authors(authors(name)), post_tags(tags(name))")
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", post.id)
    .limit(30);

  if (!data) return [];
  return data
    .filter((p) => p.post_tags?.some((pt) => tagNames.includes(pt.tags?.name)))
    .slice(0, 3)
    .map((p) => ({
      id: p.id, slug: p.slug, title: p.title,
      cover_image: p.cover_image, excerpt: p.excerpt,
      date: p.publish_date ? new Date(p.publish_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "",
      author: p.post_authors?.[0]?.authors?.name || "Blue Sands Academy",
    }));
}

// ── Extract headings for ToC ──────────────────────────────────────────────────
function extractHeadings(content) {
  if (!content?.content) return [];
  return content.content
    .filter((n) => n.type === "heading" && n.attrs?.level <= 3)
    .map((n) => ({
      level: n.attrs.level,
      text: n.content?.map((c) => c.text || "").join("") || "",
      id: (n.content?.map((c) => c.text || "").join("") || "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);
  if (!post) return {};
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const image = post.og_image || post.cover_image;
  return {
    title,
    description,
    alternates: { canonical: post.canonical_url || `/blog/${post.slug}` },
    openGraph: {
      title, description,
      type: "article",
      publishedTime: post.publish_date,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: image ? [image] : [],
    },
  };
}

// =============================================================================
// PAGE
// =============================================================================
export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const [post, related] = await Promise.all([
    fetchPost(id),
    fetchPost(id).then((p) => p ? fetchRelated(p) : []),
  ]);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bluesandsacademy.com";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.cover_image ? [post.cover_image] : [],
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Blue Sands Academy",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
    },
    datePublished: post.publish_date || post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    keywords: post.tags?.map((t) => t.label).join(", "),
    wordCount: post.content?.content
      ?.filter((n) => n.type === "paragraph")
      .flatMap((n) => n.content || [])
      .filter((n) => n.type === "text")
      .map((n) => n.text || "").join(" ").split(/\s+/).filter(Boolean).length || 0,
  };

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Reading progress bar */}
      <ReadingProgress />

      <article>
        {/* Hero */}
        <div className="relative w-full h-72 sm:h-96 lg:h-[500px] bg-gray-900 overflow-hidden">
          {post.cover_image ? (
            <Image src={post.cover_image} alt={post.title} fill className="object-cover opacity-80" priority sizes="100vw" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/30 to-secondary/60" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-16 max-w-5xl mx-auto">
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, i) => (
                  <Link key={i} href={`/blog?tag=${encodeURIComponent(tag.label)}`}
                    className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors">
                    {tag.label}
                  </Link>
                ))}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {post.author?.[0]?.toUpperCase() || "B"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-400">{post.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 ml-auto">
              <span>{post.reading_time} min read</span>
              {post.views_count > 0 && <span>{post.views_count.toLocaleString()} views</span>}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-12">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {post.excerpt && (
                <p className="text-xl text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100 italic font-light">
                  {post.excerpt}
                </p>
              )}

              {/* Render TipTap content */}
              <RichRenderer content={post.content} />

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Author card */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                  {post.author?.[0]?.toUpperCase() || "B"}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Educator at Blue Sands Academy
                  </p>
                </div>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-secondary mb-6">Related Posts</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {related.map((r) => (
                      <Link key={r.id} href={`/blog/${r.slug}`}
                        className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
                        {r.cover_image ? (
                          <div className="relative w-full h-36 overflow-hidden">
                            <Image src={r.cover_image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="300px" />
                          </div>
                        ) : (
                          <div className="w-full h-36 bg-linear-to-br from-primary/10 to-secondary/10" />
                        )}
                        <div className="p-3">
                          <p className="text-xs text-gray-400 mb-1">{r.date}</p>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              {post.allow_comments && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <CommentsSection postId={post.id} />
                </div>
              )}
            </div>

            {/* Table of contents (sticky sidebar on lg+) */}
            {headings.length >= 3 && (
              <aside className="hidden xl:block w-56 shrink-0">
                <div className="sticky top-24">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Contents</p>
                  <nav className="space-y-1">
                    {headings.map((h, i) => (
                      <a key={i} href={`#${h.id}`}
                        className={`block text-sm text-gray-500 hover:text-primary transition-colors leading-snug py-0.5
                          ${h.level === 1 ? "font-semibold" : h.level === 2 ? "pl-2" : "pl-4 text-xs"}`}>
                        {h.text}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link href="/blog" className="text-xs text-gray-400 hover:text-primary transition-colors">
                      ← All posts
                    </Link>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
