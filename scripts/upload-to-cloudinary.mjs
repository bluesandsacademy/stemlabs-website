/**
 * Uploads all public/ images to Cloudinary under the "bls" folder,
 * preserving folder structure and using the original filename as the public ID.
 *
 * Usage:
 *   node scripts/upload-to-cloudinary.mjs
 *
 * Requirements:
 *   npm install cloudinary dotenv
 *   Fill in CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

cloudinary.config({
  cloud_name: "dgjbx9xqq",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_DIR = "./public";
const SKIP_EXTS = [".json", ".webmanifest", ".docx", ".ico", ".xml"];
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

async function upload(localPath) {
  const ext = path.extname(localPath).toLowerCase();
  if (!IMAGE_EXTS.includes(ext)) return;

  // e.g. public/hero/1.jpg → bls/hero/1
  const rel = path.relative(PUBLIC_DIR, localPath).replace(/\\/g, "/");
  const publicId = "bls/" + rel.replace(/\.[^/.]+$/, ""); // strip extension

  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      use_filename: false, // we set our own public_id
      unique_filename: false,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`✓ ${rel}  →  ${result.secure_url}`);
  } catch (err) {
    console.error(`✗ ${rel}  —  ${err.message}`);
  }
}

const files = walk(PUBLIC_DIR);
console.log(`Found ${files.length} files. Uploading images...\n`);

// Upload sequentially to avoid rate limits
for (const file of files) {
  await upload(file);
}

console.log(
  "\nDone! You can now remove CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET from .env.local",
);
