import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";

// ── GET /api/blog/[id]/comments  — fetch approved comments as a tree ────────
// Returns top-level comments with nested replies array
export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "true"; // admin: include all statuses

  const query = supabaseAdmin
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (!includeAll) query.eq("status", "approved");

  const { data: flat, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build a tree from the flat list
  const map = {};
  const roots = [];
  for (const c of flat || []) {
    map[c.id] = { ...c, replies: [] };
  }
  for (const c of flat || []) {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  }

  return NextResponse.json(roots);
}

// ── POST /api/blog/[id]/comments  — submit a new comment (always pending) ──
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      parent_id = null,
      author_name, author_email, author_website,
      content,
    } = body;

    if (!author_name?.trim() || !author_email?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and comment content are required" },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Use public client so RLS policy "Anyone can submit a comment" applies
    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: id,
        parent_id: parent_id || null,
        author_name: author_name.trim(),
        author_email: author_email.trim().toLowerCase(),
        author_website: author_website?.trim() || null,
        content: content.trim(),
        status: "pending",
      })
      .select("id, created_at, author_name, status")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { ...data, message: "Comment submitted and awaiting moderation." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/blog/[id]/comments]", error);
    return NextResponse.json({ error: error.message || "Failed to submit comment" }, { status: 500 });
  }
}
