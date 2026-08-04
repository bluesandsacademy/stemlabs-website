// lib/blog-queries.js
//
// Server-side data layer for the public /blog listing page. Queries
// Supabase directly (this page already did, pre-existing pattern in
// app/(user)/blog/page.jsx) rather than through /api/blog, which exists
// for the admin dashboard's client-side fetches and keeps its own contract.
//
// Filtering by category/tag resolves to a post-ID list BEFORE pagination,
// unlike /api/blog's GET handler (which filters after .range() and would
// silently return wrong/short pages once combined with pagination).

import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";

export const PAGE_SIZE = 12;

// Sentinel UUID that matches no real row — used to force a clean "zero
// results" instead of passing an empty array to `.in()`.
const EMPTY_MATCH_ID = "00000000-0000-0000-0000-000000000000";

async function getPublishedPostIds() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id")
    .eq("status", "published")
    .is("deleted_at", null);
  if (error) {
    console.error("[blog-queries] getPublishedPostIds:", error.message);
  }
  return (data || []).map((row) => row.id);
}

async function getCategoryFacets(publishedIds) {
  if (!publishedIds.length) return [];
  const { data, error } = await supabaseAdmin
    .from("post_categories")
    .select("post_id, categories(id, name, slug)")
    .in("post_id", publishedIds);
  if (error) {
    console.error("[blog-queries] getCategoryFacets:", error.message);
  }

  const counts = new Map();
  for (const row of data || []) {
    const c = row.categories;
    if (!c) continue;
    const entry = counts.get(c.slug) || { name: c.name, slug: c.slug, count: 0 };
    entry.count += 1;
    counts.set(c.slug, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

async function getTagFacets(publishedIds) {
  if (!publishedIds.length) return [];
  const { data, error } = await supabaseAdmin
    .from("post_tags")
    .select("post_id, tags(id, name, slug)")
    .in("post_id", publishedIds);
  if (error) {
    console.error("[blog-queries] getTagFacets:", error.message);
  }

  const counts = new Map();
  for (const row of data || []) {
    const t = row.tags;
    if (!t) continue;
    const entry = counts.get(t.slug) || { name: t.name, slug: t.slug, count: 0 };
    entry.count += 1;
    counts.set(t.slug, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

async function getPostIdsForCategory(slug) {
  const { data, error } = await supabaseAdmin
    .from("post_categories")
    .select("post_id, categories!inner(slug)")
    .eq("categories.slug", slug);
  if (error) {
    console.error("[blog-queries] getPostIdsForCategory:", error.message);
  }
  return (data || []).map((row) => row.post_id);
}

async function getPostIdsForTag(slug) {
  const { data, error } = await supabaseAdmin
    .from("post_tags")
    .select("post_id, tags!inner(slug)")
    .eq("tags.slug", slug);
  if (error) {
    console.error("[blog-queries] getPostIdsForTag:", error.message);
  }
  return (data || []).map((row) => row.post_id);
}

function applyCommonFilters(query, { q, idFilter }) {
  let out = query.eq("status", "published").is("deleted_at", null);
  if (q) out = out.textSearch("search_vector", q, { type: "websearch" });
  if (idFilter) out = out.in("id", idFilter.length ? idFilter : [EMPTY_MATCH_ID]);
  return out;
}

async function countMatchingPosts({ q, idFilter }) {
  const query = applyCommonFilters(
    supabaseAdmin.from("posts").select("id", { count: "exact", head: true }),
    { q, idFilter }
  );
  const { count, error } = await query;
  if (error) {
    console.error("[blog-queries] countMatchingPosts:", error.message);
    return 0;
  }
  return count || 0;
}

async function fetchMatchingPosts({ q, idFilter, sort, page }) {
  let query = applyCommonFilters(
    supabaseAdmin.from("posts").select(POST_SELECT),
    { q, idFilter }
  );

  if (sort === "oldest") query = query.order("publish_date", { ascending: true });
  else if (sort === "popular") query = query.order("views_count", { ascending: false });
  else query = query.order("publish_date", { ascending: false });

  const offset = (page - 1) * PAGE_SIZE;
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, error } = await query;
  if (error) {
    console.error("[blog-queries] fetchMatchingPosts:", error.message);
    return [];
  }
  return (data || []).map(normalisePost);
}

async function getFeaturedPost() {
  const { data: featured, error: featuredError } = await supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .eq("featured", true)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (featuredError) {
    console.error("[blog-queries] getFeaturedPost:", featuredError.message);
  }
  if (featured) return normalisePost(featured);

  const { data: latest, error: latestError } = await supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latestError) {
    console.error("[blog-queries] getFeaturedPost:", latestError.message);
  }
  return latest ? normalisePost(latest) : null;
}

export async function getBlogPageData({ q = "", category = "", tag = "", sort = "newest", page = 1 } = {}) {
  const publishedIds = await getPublishedPostIds();
  const [categories, tags] = await Promise.all([
    getCategoryFacets(publishedIds),
    getTagFacets(publishedIds),
  ]);

  let idFilter = null;
  if (category) {
    idFilter = await getPostIdsForCategory(category);
  }
  if (tag) {
    const tagIds = await getPostIdsForTag(tag);
    idFilter = idFilter ? idFilter.filter((id) => tagIds.includes(id)) : tagIds;
  }

  const isDefaultView = !q && !category && !tag && page <= 1;

  const total = await countMatchingPosts({ q, idFilter });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const fetchedPosts = await fetchMatchingPosts({ q, idFilter, sort, page: currentPage });

  const featuredPost = isDefaultView ? await getFeaturedPost() : null;
  const posts = featuredPost
    ? fetchedPosts.filter((p) => p.id !== featuredPost.id)
    : fetchedPosts;

  return {
    posts,
    total,
    page: currentPage,
    totalPages,
    categories,
    tags,
    isDefaultView,
    featuredPost,
  };
}
