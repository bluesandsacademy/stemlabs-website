import fs from 'fs';
import path from 'path';

// Keep these local — favicons/PWA icons must be served from public/,
// non-images, and the failed SVG upload
const KEEP = new Set([
  'favicon-16x16.png',
  'favicon-32x32.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'site.webmanifest',
  'animations/404.json',
  'about/blob.svg',          // failed to upload (13MB SVG — too large for free plan)
  'asee/Detailed_Report_Activities.docx',
]);

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

function walk(dir, base) {
  let files = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = path.relative(base, full).split(path.sep).join('/');
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full, base));
    } else {
      files.push({ full, rel });
    }
  }
  return files;
}

function removeEmptyDirs(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      removeEmptyDirs(full);
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
        console.log(`  removed empty dir: ${path.relative('./public', full)}`);
      }
    }
  }
}

const PUBLIC = './public';
const files = walk(PUBLIC, PUBLIC);
let removed = 0, kept = 0;

for (const { full, rel } of files) {
  const ext = path.extname(rel).toLowerCase();
  if (KEEP.has(rel) || !IMAGE_EXTS.has(ext)) {
    console.log(`KEEP: ${rel}`);
    kept++;
    continue;
  }
  fs.unlinkSync(full);
  console.log(`DEL:  ${rel}`);
  removed++;
}

removeEmptyDirs(PUBLIC);
console.log(`\nRemoved ${removed} files, kept ${kept}.`);
