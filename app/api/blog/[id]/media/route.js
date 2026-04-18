import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgjbx9xqq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── GET /api/blog/[id]/media  — list all media for a post ──────────────────
export async function GET(request, { params }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("post_media")
    .select("*")
    .eq("post_id", id)
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// ── POST /api/blog/[id]/media  — attach uploaded Cloudinary media to a post ─
// Body: { url, public_id, resource_type, role, title, caption, alt_text,
//         width, height, duration_sec, size_bytes, format, thumbnail_url, display_order }
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("post_media")
      .insert({ post_id: id, ...body })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE /api/blog/[id]/media?media_id=...  — remove media ───────────────
export async function DELETE(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("media_id");

  if (!mediaId) return NextResponse.json({ error: "media_id required" }, { status: 400 });

  // Fetch to get Cloudinary public_id for deletion
  const { data: media } = await supabaseAdmin
    .from("post_media")
    .select("public_id, resource_type")
    .eq("id", mediaId)
    .single();

  if (media?.public_id) {
    try {
      await cloudinary.uploader.destroy(media.public_id, {
        resource_type: media.resource_type || "image",
      });
    } catch (e) {
      console.warn("[Cloudinary delete]", e.message);
    }
  }

  const { error } = await supabaseAdmin
    .from("post_media")
    .delete()
    .eq("id", mediaId)
    .eq("post_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
