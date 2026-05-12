import React from "react";
import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQs - Trencher Machines, Rentals & Equipment | Autocracy Machinery",
  description:
    "Find answers about Autocracy Machinery trenchers, solar EPC equipment, aquatic weed harvesters, tractor attachments, rentals, dealers, brochures, spares, and support.",
  alternates: { canonical: "https://autocracymachinery.com/faqs" },
  openGraph: {
    title: "Autocracy Machinery FAQs",
    description:
      "Answers about trenching machines, utility equipment, water body cleaning machines, rentals, dealers, and support.",
    url: "https://autocracymachinery.com/faqs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autocracy Machinery FAQs",
    description:
      "Common questions about Autocracy Machinery products, applications, rentals, and support.",
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
