import { supabaseAdmin } from "@/lib/supabase-admin";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://bluesandsacademy.com";

export default async function sitemap() {
  // Static pages
  const statics = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Published blog posts
  const { data: posts } = await supabaseAdmin
    .from("posts")
    .select("slug, updated_at, publish_date")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("publish_date", { ascending: false })
    .limit(1000);

  const postEntries = (posts || []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.publish_date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...statics, ...postEntries];
}
