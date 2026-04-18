import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgjbx9xqq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── POST /api/blog/upload ─────────────────────────────────────────────────────
// Accepts multipart/form-data with one or more "file" entries.
// Returns: { files: [{ url, public_id, resource_type, width, height, duration, format, size_bytes, thumbnail_url }] }
export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Detect resource type from MIME type
        const mime = file.type || "";
        const resourceType = mime.startsWith("video/") ? "video"
          : mime.startsWith("image/") ? "image"
          : "auto";

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "bls/blog",
                resource_type: resourceType,
                // Auto-generate a video thumbnail poster
                ...(resourceType === "video" && {
                  eager: [{ format: "jpg", transformation: [{ width: 1280, height: 720, crop: "fill" }] }],
                  eager_async: false,
                }),
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        return {
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          width: result.width || null,
          height: result.height || null,
          size_bytes: result.bytes || null,
          duration: result.duration || null,
          // Thumbnail for videos (first eager transform)
          thumbnail_url: result.eager?.[0]?.secure_url || null,
        };
      })
    );

    return NextResponse.json({ files: results });
  } catch (error) {
    console.error("[POST /api/blog/upload]", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
