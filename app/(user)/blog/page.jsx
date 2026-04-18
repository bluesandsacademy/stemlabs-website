import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";
import ArticleGrid from "@/components/shared/blog/article";
import NewsletterSection from "@/components/shared/blog/newsletter";
import FAQSection from "@/components/shared/home/faq";

export const revalidate = 60;

async function fetchPublishedPosts() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("publish_date", { ascending: false });

  if (error) {
    console.error("[blog/page] fetchPublishedPosts:", error.message);
    return [];
  }
  return (data || []).map(normalisePost);
}

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();

  // Featured post: prefer explicitly featured, fall back to most recent
  const featuredPost = posts.find((p) => p.featured) || posts[0] || null;

  // Article grid excludes the featured post to avoid duplication
  const gridPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <div>
      <NewsletterSection featuredPost={featuredPost} />
      <ArticleGrid posts={gridPosts} />
      <FAQSection />
    </div>
  );
}
