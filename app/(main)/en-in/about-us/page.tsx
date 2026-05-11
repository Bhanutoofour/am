import AboutUsClient from "@/app/(main)/about-us/AboutUsClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title:
    "About Autocracy Machinery India - Trencher & Infrastructure Machine Manufacturer",
  description:
    "Learn about Autocracy Machinery, an India-based manufacturer of specialty construction, agricultural, environmental, and infrastructure machinery.",
  alternates: {
    canonical: indiaCanonical("/about-us"),
    languages: {
      "en-IN": indiaCanonical("/about-us"),
      "x-default": rootCanonical("/about-us"),
    },
  },
};

export default function IndiaAboutPage() {
  return <AboutUsClient />;
}
