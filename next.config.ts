import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
