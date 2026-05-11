import BrochureClient from "@/app/(main)/brochure/BrochureClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Download Brochures | Autocracy Machinery India",
  description:
    "Download Autocracy Machinery brochures for trenchers, attachments, environmental machines, and infrastructure equipment in India.",
  alternates: {
    canonical: indiaCanonical("/brochure"),
    languages: {
      "en-IN": indiaCanonical("/brochure"),
      "x-default": rootCanonical("/brochure"),
    },
  },
};

export default function IndiaBrochurePage() {
  return <BrochureClient />;
}
