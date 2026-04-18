import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── GET /api/blog/[id]/likes  — get reaction counts for a post ───────────────
export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const identifier = searchParams.get("identifier");

  // Aggregate reaction counts
  const { data: counts, error: countError } = await supabaseAdmin
    .from("post_likes")
    .select("reaction")
    .eq("post_id", id);

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

  const reactions = (counts || []).reduce((acc, row) => {
    acc[row.reaction] = (acc[row.reaction] || 0) + 1;
    return acc;
  }, {});
  const total = counts?.length || 0;

  // Check if this identifier already reacted
  let userReaction = null;
  if (identifier) {
    const { data: existing } = await supabaseAdmin
      .from("post_likes")
      .select("reaction")
      .eq("post_id", id)
      .eq("identifier", identifier)
      .single();
    userReaction = existing?.reaction || null;
  }

  return NextResponse.json({ total, reactions, userReaction });
}

// ── POST /api/blog/[id]/likes  — toggle a reaction ──────────────────────────
// Body: { identifier, reaction: "like"|"love"|"insightful"|"fire" }
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { identifier, reaction = "like" } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: "identifier required" }, { status: 400 });
    }

    // Check if already liked
    const { data: existing } = await supabaseAdmin
      .from("post_likes")
      .select("id, reaction")
      .eq("post_id", id)
      .eq("identifier", identifier)
      .single();

    if (existing) {
      if (existing.reaction === reaction) {
        // Same reaction — toggle off (unlike)
        await supabaseAdmin.from("post_likes").delete().eq("id", existing.id);
        return NextResponse.json({ action: "unliked", reaction: null });
      } else {
        // Different reaction — update
        await supabaseAdmin
          .from("post_likes")
          .update({ reaction })
          .eq("id", existing.id);
        return NextResponse.json({ action: "changed", reaction });
      }
    }

    // New reaction
    await supabaseAdmin
      .from("post_likes")
      .insert({ post_id: id, identifier, reaction });

    return NextResponse.json({ action: "liked", reaction });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
