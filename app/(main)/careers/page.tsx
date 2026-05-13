import React from "react";
import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers at Autocracy Machinery | Manufacturing & Engineering Jobs",
  description:
    "Explore careers at Autocracy Machinery in engineering, production, design, sales, service, and manufacturing for trenchers, attachments, water management machines, and utility equipment.",
  keywords: [
    "Autocracy Machinery careers",
    "machinery manufacturing jobs",
    "mechanical engineering jobs India",
    "production jobs Hyderabad",
    "industrial equipment careers",
    "manufacturing company jobs India",
  ],
  alternates: { canonical: "https://www.autocracymachinery.com/careers" },
  openGraph: {
    title: "Careers at Autocracy Machinery",
    description:
      "Build a career in machinery manufacturing, engineering, production, sales, service, and field-ready equipment innovation.",
    url: "https://www.autocracymachinery.com/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at Autocracy Machinery",
    description:
      "Explore engineering and manufacturing careers at Autocracy Machinery.",
  },
};

const CareersPage = () => {
  return <CareersClient />;
};

export default CareersPage;
