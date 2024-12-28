const isDevelopment = process.env.NODE_ENV === "development";

/**
 * @type {import('next').NextConfig}
 */
const rewrite = {
  rewrites: async () => [
    {
      source: "/socket.io/:path*",
      destination: "http://localhost:4000/socket.io/:path*",
    },
    {
      source: "/readyz",
      destination: "http://localhost:4000/readyz",
    },
    {
      source: "/healthz",
      destination: "http://localhost:4000/healthz",
    },
  ],
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: true,
  output: isDevelopment ? undefined : "export",
  distDir: "build",
  images: {
    unoptimized: true,
  },
  ...(isDevelopment ? rewrite : {}),
};

/**
 * @type {import('next-pwa').PWAConfig}
 */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDevelopment,
  dynamicStartUrl: true,
  sw: "/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: ({ url }) =>
        url.pathname.includes("socket.io") || url.pathname.includes("cache"),
      handler: "NetworkOnly",
    },
  ],
});

module.exports = withPWA(nextConfig);
