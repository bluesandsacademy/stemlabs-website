import { NextResponse } from "next/server";
import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";

// ── helpers ──────────────────────────────────────────────────────────────────

function estimateReadingTime(content) {
  if (!content?.blocks) return 1;
  const text = content.blocks
    .map((b) => {
      const d = b.data || {};
      if (b.type === "paragraph" || b.type === "heading") return d.text || "";
      if (b.type === "quote") return d.text || "";
      if (b.type === "list") return (d.items || []).join(" ");
      if (b.type === "code") return d.code || "";
      if (b.type === "callout") return `${d.title || ""} ${d.text || ""}`;
      return "";
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function upsertTags(tagInputs = []) {
  if (!tagInputs.length) return [];
  const tagIds = [];
  for (const t of tagInputs) {
    const label = typeof t === "string" ? t : t.label;
    const color = typeof t === "object" ? (t.color || "primary") : "primary";
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data } = await supabaseAdmin
      .from("tags")
      .upsert({ name: label, slug, color }, { onConflict: "slug", ignoreDuplicates: false })
      .select("id")
      .single();
    if (data?.id) tagIds.push(data.id);
  }
  return tagIds;
}

async function upsertAuthor(authorName) {
  if (!authorName) return null;
  const slug = authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const { data } = await supabaseAdmin
    .from("authors")
    .upsert({ name: authorName, slug }, { onConflict: "slug", ignoreDuplicates: false })
    .select("id")
    .single();
  return data?.id || null;
}

// ── GET /api/blog ─────────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status   = searchParams.get("status");
  const limit    = parseInt(searchParams.get("limit") || "50");
  const offset   = parseInt(searchParams.get("offset") || "0");
  const search   = searchParams.get("q");
  const tag      = searchParams.get("tag");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let query = supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status)   query = query.eq("status", status);
  if (featured) query = query.eq("featured", featured === "true");

  if (search) {
    query = query.textSearch("search_vector", search, { type: "websearch" });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let posts = (data || []).map(normalisePost);

  // Client-side filter by tag slug (Supabase nested filters are verbose)
  if (tag) {
    posts = posts.filter((p) => p.tags?.some((t) => t.label?.toLowerCase() === tag.toLowerCase()));
  }
  if (category) {
    posts = posts.filter((p) => p.categories?.some((c) => c.slug === category));
  }

  return NextResponse.json(posts);
}

// ── POST /api/blog ────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title, excerpt, content, cover_image, cover_image_public_id,
      status = "draft", visibility = "public", featured = false,
      allow_comments = true,
      seo_title, seo_description, og_image, canonical_url,
      publish_date, reading_time,
      // relations (passed as arrays)
      tags = [], author, authors = [],
      category, categories = [],
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate slug
    const { data: slugData } = await supabaseAdmin.rpc("generate_slug", { p_title: title });
    const slug = slugData || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Compute reading time if not provided
    const rt = reading_time || estimateReadingTime(content);

    // Build publish_date: if status=published and no date given, use now
    let pubDate = publish_date || null;
    if (status === "published" && !pubDate) pubDate = new Date().toISOString();

    // Insert post
    const { data: post, error: postError } = await supabaseAdmin
      .from("posts")
      .insert({
        slug, title: title.trim(), excerpt: excerpt?.trim(),
        content: content || { time: Date.now(), version: "1.0", blocks: [] },
        cover_image, cover_image_public_id, status, visibility,
        featured, allow_comments, seo_title, seo_description,
        og_image, canonical_url, publish_date: pubDate, reading_time: rt,
      })
      .select("id, slug")
      .single();

    if (postError) throw postError;
    const postId = post.id;

    // Link author(s)
    const authorNames = authors.length ? authors : author ? [author] : [];
    for (const name of authorNames) {
      const authorId = await upsertAuthor(name);
      if (authorId) {
        await supabaseAdmin
          .from("post_authors")
          .upsert({ post_id: postId, author_id: authorId }, { ignoreDuplicates: true });
      }
    }

    // Link tags
    const tagInputs = tags.length ? tags : [];
    const tagIds = await upsertTags(tagInputs);
    for (const tagId of tagIds) {
      await supabaseAdmin
        .from("post_tags")
        .upsert({ post_id: postId, tag_id: tagId }, { ignoreDuplicates: true });
    }

    // Link category if provided
    if (category) {
      const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data: cat } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", catSlug)
        .single();
      if (cat?.id) {
        await supabaseAdmin
          .from("post_categories")
          .upsert({ post_id: postId, category_id: cat.id }, { ignoreDuplicates: true });
      }
    }

    // Fetch the full created post to return
    const { data: fullPost } = await supabaseAdmin
      .from("posts")
      .select(POST_SELECT)
      .eq("id", postId)
      .single();

    return NextResponse.json(normalisePost(fullPost), { status: 201 });
  } catch (error) {
    console.error("[POST /api/blog]", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}
