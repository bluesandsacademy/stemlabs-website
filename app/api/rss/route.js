import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://bluesandsacademy.com";

function escape(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("publish_date", { ascending: false })
    .limit(50);

  const posts = (data || []).map(normalisePost);

  const items = posts.map((p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <description>${escape(p.excerpt || p.description || "")}</description>
      <pubDate>${new Date(p.publish_date || p.createdAt).toUTCString()}</pubDate>
      <author>${escape(p.author)}</author>
      ${p.cover_image ? `<enclosure url="${escape(p.cover_image)}" type="image/jpeg" />` : ""}
      ${(p.tags || []).map((t) => `<category>${escape(t.label)}</category>`).join("")}
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Blue Sands Academy Blog</title>
    <link>${BASE}/blog</link>
    <description>STEM education insights, lesson ideas, and teaching resources from Blue Sands Academy.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE}/logo.png</url>
      <title>Blue Sands Academy Blog</title>
      <link>${BASE}/blog</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
