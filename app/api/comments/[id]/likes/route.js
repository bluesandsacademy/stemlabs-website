import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── POST /api/comments/[id]/likes  — toggle like on a comment ────────────────
// Body: { identifier }
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: "identifier required" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("comment_likes")
      .select("id")
      .eq("comment_id", id)
      .eq("identifier", identifier)
      .single();

    if (existing) {
      await supabaseAdmin.from("comment_likes").delete().eq("id", existing.id);
      return NextResponse.json({ action: "unliked" });
    }

    await supabaseAdmin
      .from("comment_likes")
      .insert({ comment_id: id, identifier });

    return NextResponse.json({ action: "liked" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
