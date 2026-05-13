import SitemapHtmlPage from "@/app/(main)/sitemap.html/page";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Sitemap | Autocracy Machinery India",
  description: "India sitemap for Autocracy Machinery website pages.",
  alternates: {
    canonical: indiaCanonical("/sitemap"),
    languages: {
      "en-IN": indiaCanonical("/sitemap"),
      "x-default": rootCanonical("/sitemap"),
    },
  },
};

export default SitemapHtmlPage;
