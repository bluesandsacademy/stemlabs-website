import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── GET /api/comments/[id]  — get a single comment ───────────────────────────
export async function GET(request, { params }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

// ── PATCH /api/comments/[id]  — admin moderation ─────────────────────────────
// Body: { status: "approved"|"spam"|"trash" }  OR  { is_pinned: boolean }
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allowed = ["status", "is_pinned", "content"];
    const updates = Object.fromEntries(
      Object.entries(body).filter(([k]) => allowed.includes(k))
    );

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE /api/comments/[id]  — soft delete ─────────────────────────────────
export async function DELETE(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const permanent = searchParams.get("permanent") === "true";

  if (permanent) {
    const { error } = await supabaseAdmin.from("comments").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabaseAdmin
      .from("comments")
      .update({ deleted_at: new Date().toISOString(), status: "trash" })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
