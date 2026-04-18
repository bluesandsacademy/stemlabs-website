import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── POST /api/blog/[id]/views  — record a view (deduplicated per 24 h) ───────
// Body: { identifier }  — a stable anonymous fingerprint stored in localStorage
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { identifier, referrer } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: "identifier required" }, { status: 400 });
    }

    // Use the deduplication SQL function
    await supabaseAdmin.rpc("record_post_view", {
      p_post_id:    id,
      p_identifier: identifier,
      p_referrer:   referrer || null,
    });

    // Return current view count
    const { data } = await supabaseAdmin
      .from("posts")
      .select("views_count")
      .eq("id", id)
      .single();

    return NextResponse.json({ views: data?.views_count || 0 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
