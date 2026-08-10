/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/site-content/footer-sponsors",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/blogscache/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.pitchpredictions.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pitchpredictions.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.pitchpredictions.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.pitchpredictions.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;