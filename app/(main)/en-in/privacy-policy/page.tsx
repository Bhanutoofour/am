import PrivacyPage from "@/app/(main)/privacy-policy/page";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Privacy Policy | Autocracy Machinery India",
  description: "Privacy policy for Autocracy Machinery India website visitors.",
  alternates: {
    canonical: indiaCanonical("/privacy-policy"),
    languages: {
      "en-IN": indiaCanonical("/privacy-policy"),
      "x-default": rootCanonical("/privacy-policy"),
    },
  },
};

export default PrivacyPage;
