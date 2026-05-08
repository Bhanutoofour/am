import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    unoptimized: true, // <-- Disable Vercel Image Optimization
    domains: [
      "encrypted-tbn0.gstatic.com",
      "d3ioy45kmhqkgq.cloudfront.net",
      "d3du1kxieyd1np.cloudfront.net",
    ],
  },
};

export default nextConfig;
