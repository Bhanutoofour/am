import DealerClient from "@/app/(main)/find-a-dealer/DealerClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Find a Dealer in India | Autocracy Machinery",
  description:
    "Find Autocracy Machinery dealer support for trenchers, environmental machines, attachments, and infrastructure equipment in India.",
  alternates: {
    canonical: indiaCanonical("/find-a-dealer"),
    languages: {
      "en-IN": indiaCanonical("/find-a-dealer"),
      "x-default": rootCanonical("/find-a-dealer"),
    },
  },
};

export default function IndiaDealerPage() {
  return <DealerClient />;
}
