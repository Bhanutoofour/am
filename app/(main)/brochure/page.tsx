import React from "react";
import BrochureClient from "./BrochureClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Download Autocracy Machinery Brochure – Industrial & Infrastructure Machines",
  description:
    "Get the latest brochure from Autocracy Machinery – India's manufacturer of trenchers, multi-utility machines & industrial solutions built for performance across construction, telecom, agriculture and infrastructure projects.",
  keywords: [
    "Autocracy Machinery brochure",
    "industrial machinery brochure",
    "trenchers catalogue",
    "infrastructure equipment India",
    "construction & agri machines PDF",
  ],
  alternates: { canonical: "https://autocracymachinery.com/brochure" },
  openGraph: {
    title: "Download Brochure – Autocracy Machinery",
    description:
      "Get the latest brochure from Autocracy Machinery – India's manufacturer of trenchers, multi-utility machines & industrial solutions.",
    url: "https://autocracymachinery.com/brochure",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Brochure – Autocracy Machinery",
    description:
      "Get the latest brochure from Autocracy Machinery – India's manufacturer of trenchers, multi-utility machines & industrial solutions.",
  },
};

const BrochurePage = async () => {
  return <BrochureClient />;
};

export default BrochurePage;
