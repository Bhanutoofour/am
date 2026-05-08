import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title:
    "About Us - Trencher Digger Equipment Machines Manufacturer Company - Autocracy Machinery",
  description:
    "Autocracy Machinery is India's leading manufacturer of specialty construction, agricultural, and infrastructure machinery and attachments.",
  alternates: { canonical: "https://autocracymachinery.com/about-us" },
  openGraph: {
    title: "About Us – Autocracy Machinery",
    description:
      "Autocracy Machinery is India's leading manufacturer of specialty construction, agricultural, and infrastructure machinery and attachments.",
    url: "https://autocracymachinery.com/about-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us – Autocracy Machinery",
    description:
      "Autocracy Machinery is India's leading manufacturer of specialty construction, agricultural, and infrastructure machinery and attachments.",
  },
};

const AboutUsPage = () => {
  return <AboutUsClient />;
};

export default AboutUsPage;
