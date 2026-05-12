import FaqClient from "@/app/(main)/faqs/FaqClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "FAQs - Trencher Machines & Utility Equipment | Autocracy India",
  description:
    "Answers to common questions about Autocracy Machinery trenchers, solar EPC equipment, aquatic weed harvesters, rentals, dealers, support, and project enquiries in India.",
  alternates: {
    canonical: indiaCanonical("/faqs"),
    languages: {
      "en-IN": indiaCanonical("/faqs"),
      "x-default": rootCanonical("/faqs"),
    },
  },
};

export default function IndiaFaqPage() {
  return <FaqClient />;
}
