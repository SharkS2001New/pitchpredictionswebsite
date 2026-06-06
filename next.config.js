/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
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