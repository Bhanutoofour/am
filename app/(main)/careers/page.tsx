import React from "react";
import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers at Autocracy Machinery | Join India's Industrial Innovation Team",
  description:
    "Explore exciting career opportunities at Autocracy Machinery – a leading Indian industrial & infrastructure machinery manufacturer. Grow with us in engineering, design, production, sales and support.",
  keywords: [
    "Autocracy Machinery careers",
    "jobs",
    "machinery manufacturing jobs",
    "industrial machinery careers",
    "engineering jobs India",
    "mechanical engineering careers",
    "heavy machinery jobs",
    "construction equipment careers",
    "infrastructure machinery jobs",
    "manufacturing company jobs India",
  ],
  alternates: { canonical: "https://autocracymachinery.com/careers" },
  openGraph: {
    title: "Careers – Autocracy Machinery",
    description:
      "Explore exciting career opportunities at Autocracy Machinery – a leading Indian industrial & infrastructure machinery manufacturer.",
    url: "https://autocracymachinery.com/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers – Autocracy Machinery",
    description:
      "Explore exciting career opportunities at Autocracy Machinery – a leading Indian industrial & infrastructure machinery manufacturer.",
  },
};

const CareersPage = () => {
  return <CareersClient />;
};

export default CareersPage;
