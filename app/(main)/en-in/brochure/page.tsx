import BrochureClient from "@/app/(main)/brochure/BrochureClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Download Trencher & Equipment Brochures | Autocracy Machinery India",
  description:
    "Download Autocracy Machinery brochures for trenchers, solar EPC equipment, aquatic weed harvesters, attachments, forklifts, and infrastructure equipment in India.",
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
