import HomeContent from "@/app/(main)/HomeContent";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title:
    "Trencher Machine Manufacturer in India | Autocracy Machinery",
  description:
    "Autocracy Machinery manufactures trencher machines, solar EPC equipment, water body cleaning machines, tractor attachments, forklifts, and infrastructure equipment for Indian worksites.",
  alternates: {
    canonical: indiaCanonical(),
    languages: {
      "en-IN": indiaCanonical(),
      "x-default": rootCanonical(),
    },
  },
  openGraph: {
    title: "Autocracy Machinery India - Trencher Machines & Utility Equipment",
    description:
      "Trenchers, solar EPC equipment, agriculture attachments, water management machines, and utility equipment built for India.",
    url: indiaCanonical(),
    siteName: "Autocracy Machinery India",
    type: "website",
    locale: "en_IN",
  },
};

export default function IndiaHomePage() {
  return <HomeContent />;
}
