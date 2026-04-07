"use client";

/**
 * CloudImage
 *
 * A drop-in replacement for next/image that adds:
 *
 *  1. Blur placeholder  — shows a neutral gray wash while the image loads,
 *                         preventing a blank-then-pop experience on slow networks.
 *
 *  2. Error fallback    — if Cloudinary is unreachable (or an image 404s),
 *                         the broken slot is replaced with a styled placeholder
 *                         div instead of a broken-image icon.
 *
 *  3. Lazy-load default — `loading="lazy"` unless you pass `priority`, matching
 *                         browser best practice for below-the-fold images.
 *
 * Usage — identical to next/image:
 *   import CloudImage from "@/components/common/cloud-image";
 *   import { img } from "@/lib/cloudinary";
 *
 *   <CloudImage src={img("/hero/1.jpg")} alt="Hero" fill className="object-cover" />
 *
 * Override blur for decorative/tiny images where it looks wrong:
 *   <CloudImage … showBlur={false} />
 */

import Image from "next/image";
import { useState } from "react";
import { BLUR_DATA_URL } from "@/lib/cloudinary";

export default function CloudImage({
  src,
  alt = "",
  showBlur = true,
  priority = false,
  className = "",
  style,
  // Spread everything else (fill, width, height, sizes, quality, …) through
  ...props
}) {
  const [errored, setErrored] = useState(false);

  // --- Error state ---
  // Render a sized placeholder so surrounding layout doesn't collapse.
  // The div inherits any className / style the caller passed (e.g. rounded corners).
  if (errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {/* Subtle broken-image indicator — invisible to casual observers */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      priority={priority}
      className={className}
      style={style}
      // Blur placeholder: shows a soft gray wash that fades out as the real image appears.
      // Skip for priority images — they load fast enough that the flash isn't worth it.
      placeholder={showBlur && !priority ? "blur" : "empty"}
      blurDataURL={showBlur && !priority ? BLUR_DATA_URL : undefined}
      onError={() => setErrored(true)}
    />
  );
}
