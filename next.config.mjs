/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hand all image URL construction to our Cloudinary loader.
    // Next.js will call this function for every srcset breakpoint and use the
    // returned URL directly — no /_next/image proxy, no server-side re-encoding,
    // no timeouts. Browsers fetch straight from the Cloudinary CDN (edge-cached).
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.js",

    // Breakpoints passed to the loader as `width`. Next.js picks the closest
    // value above the rendered image size and puts it in the srcset.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Still needed so Next.js allows these hostnames in <Image src="https://…">.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],

    // Note: formats, minimumCacheTTL, and qualities are built-in-optimizer
    // settings — they have no effect with a custom loader. Cloudinary handles
    // format negotiation (f_auto → AVIF/WebP) and caching via its own CDN.
  },
};

export default nextConfig;
