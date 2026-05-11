import TermsPage from "@/app/(main)/terms-and-conditions/page";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Terms and Conditions | Autocracy Machinery India",
  description: "Terms and conditions for Autocracy Machinery India website visitors.",
  alternates: {
    canonical: indiaCanonical("/terms-and-conditions"),
    languages: {
      "en-IN": indiaCanonical("/terms-and-conditions"),
      "x-default": rootCanonical("/terms-and-conditions"),
    },
  },
};

export default TermsPage;
