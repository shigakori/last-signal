const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: [
      "gsap",
      "@gsap/react",
      "three",
      "react-icons",
      "lenis",
    ],
  },
};

export default nextConfig;
