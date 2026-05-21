import { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/locale";

const blockedPaths = [
  "/admin",
  "/admin/",
  "/api",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: blockedPaths,
    },

    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
