import VideosPage from "@/app/(main)/videos/page";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Machine Videos India | Autocracy Machinery",
  description:
    "Watch Autocracy Machinery trenchers, environmental machines, and infrastructure equipment working across real Indian applications.",
  alternates: {
    canonical: indiaCanonical("/videos"),
    languages: {
      "en-IN": indiaCanonical("/videos"),
      "x-default": rootCanonical("/videos"),
    },
  },
};

export default VideosPage;
