import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "datesas.com",
      },
    ],
  },
};

export default nextConfig;
