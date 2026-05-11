import Home from "@/app/(main)/page";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title:
    "Industrial & Infrastructure Machines Manufacturer India - Autocracy Machinery",
  description:
    "Autocracy Machinery builds trenchers, environmental machines, attachments, forklifts, and infrastructure equipment for Indian worksites and industries.",
  alternates: {
    canonical: indiaCanonical(),
    languages: {
      "en-IN": indiaCanonical(),
      "x-default": rootCanonical(),
    },
  },
  openGraph: {
    title: "Autocracy Machinery India",
    description:
      "Infrastructure, telecom, agriculture, water management, and environmental machinery built for India.",
    url: indiaCanonical(),
    siteName: "Autocracy Machinery India",
    type: "website",
    locale: "en_IN",
  },
};

export default Home;
