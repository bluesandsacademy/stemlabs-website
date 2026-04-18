import { NextResponse } from "next/server";
import { supabaseAdmin, normalisePost, POST_SELECT } from "@/lib/supabase-admin";

// ── GET /api/blog/[id]  (by UUID or slug) ────────────────────────────────────
export async function GET(request, { params }) {
  const { id } = params;
  const isUUID = /^[0-9a-f-]{36}$/.test(id);

  const query = supabaseAdmin
    .from("posts")
    .select(POST_SELECT)
    .is("deleted_at", null);

  const { data, error } = await (isUUID
    ? query.eq("id", id).single()
    : query.eq("slug", id).single());

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(normalisePost(data));
}

// ── PUT /api/blog/[id] ────────────────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      title, excerpt, content, cover_image, cover_image_public_id,
      status, visibility, featured, allow_comments,
      seo_title, seo_description, og_image, canonical_url,
      publish_date, reading_time,
      tags = [], author, authors = [],
      category, categories = [],
      revision_note,
    } = body;

    // Save a revision before updating
    const { data: current } = await supabaseAdmin
      .from("posts")
      .select("title, excerpt, content, cover_image, status")
      .eq("id", id)
      .single();

    if (current) {
      await supabaseAdmin.from("post_revisions").insert({
        post_id: id,
        title: current.title,
        excerpt: current.excerpt,
        content: current.content,
        cover_image: current.cover_image,
        status: current.status,
        revision_note: revision_note || "Auto-saved before update",
      });
    }

    // Build update payload (only include provided fields)
    const updates = {};
    if (title !== undefined)                updates.title = title?.trim();
    if (excerpt !== undefined)              updates.excerpt = excerpt?.trim();
    if (content !== undefined)              updates.content = content;
    if (cover_image !== undefined)          updates.cover_image = cover_image;
    if (cover_image_public_id !== undefined) updates.cover_image_public_id = cover_image_public_id;
    if (status !== undefined)               updates.status = status;
    if (visibility !== undefined)           updates.visibility = visibility;
    if (featured !== undefined)             updates.featured = featured;
    if (allow_comments !== undefined)       updates.allow_comments = allow_comments;
    if (seo_title !== undefined)            updates.seo_title = seo_title;
    if (seo_description !== undefined)      updates.seo_description = seo_description;
    if (og_image !== undefined)             updates.og_image = og_image;
    if (canonical_url !== undefined)        updates.canonical_url = canonical_url;
    if (reading_time !== undefined)         updates.reading_time = reading_time;
    if (publish_date !== undefined) {
      updates.publish_date = publish_date;
    } else if (status === "published" && !current?.publish_date) {
      updates.publish_date = new Date().toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from("posts")
      .update(updates)
      .eq("id", id)
      .is("deleted_at", null);

    if (updateError) throw updateError;

    // Re-sync tags if provided
    if (body.hasOwnProperty("tags")) {
      await supabaseAdmin.from("post_tags").delete().eq("post_id", id);
      if (tags.length) {
        for (const t of tags) {
          const label = typeof t === "string" ? t : t.label;
          const color = typeof t === "object" ? (t.color || "primary") : "primary";
          const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const { data: tagRow } = await supabaseAdmin
            .from("tags")
            .upsert({ name: label, slug, color }, { onConflict: "slug" })
            .select("id").single();
          if (tagRow?.id) {
            await supabaseAdmin.from("post_tags")
              .upsert({ post_id: id, tag_id: tagRow.id }, { ignoreDuplicates: true });
          }
        }
      }
    }

    // Re-sync author if provided
    if (body.hasOwnProperty("author") || body.hasOwnProperty("authors")) {
      await supabaseAdmin.from("post_authors").delete().eq("post_id", id);
      const names = authors.length ? authors : author ? [author] : [];
      for (const name of names) {
        const authorSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const { data: authorRow } = await supabaseAdmin
          .from("authors")
          .upsert({ name, slug: authorSlug }, { onConflict: "slug" })
          .select("id").single();
        if (authorRow?.id) {
          await supabaseAdmin.from("post_authors")
            .upsert({ post_id: id, author_id: authorRow.id }, { ignoreDuplicates: true });
        }
      }
    }

    // Fetch and return updated post
    const { data: updated } = await supabaseAdmin
      .from("posts")
      .select(POST_SELECT)
      .eq("id", id)
      .single();

    return NextResponse.json(normalisePost(updated));
  } catch (error) {
    console.error("[PUT /api/blog/[id]]", error);
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 });
  }
}

// ── DELETE /api/blog/[id]  (soft delete) ─────────────────────────────────────
export async function DELETE(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const permanent = searchParams.get("permanent") === "true";

  if (permanent) {
    // Hard delete — also deletes media, tags, authors via cascade
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // Soft delete
    const { error } = await supabaseAdmin
      .from("posts")
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
