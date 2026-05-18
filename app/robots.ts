import { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/locale";

const blockedPaths = [
  "/admin",
  "/admin/",
  "/api",
  "/api/",
  "/blog",
  "/blog/",
  "/en-in/blog",
  "/en-in/blog/",
];

const aiCrawlerUserAgents = [
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: blockedPaths,
      },
      ...aiCrawlerUserAgents.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: blockedPaths,
      })),
    ],

    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
