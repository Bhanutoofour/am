import React from "react";
import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - FAQs – Autocracy Machinery",
  description:
    "Quick answers to common questions about Autocracy Machinery products and services.",
  alternates: { canonical: "https://autocracymachinery.com/faqs" },
  openGraph: {
    title: "FAQs – Autocracy Machinery",
    description:
      "Quick answers to common questions about Autocracy Machinery products and services.",
    url: "https://autocracymachinery.com/faqs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs – Autocracy Machinery",
    description:
      "Quick answers to common questions about Autocracy Machinery products and services.",
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
