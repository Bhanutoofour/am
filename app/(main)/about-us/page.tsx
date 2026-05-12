import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title:
    "About Autocracy Machinery | Trencher Machine Manufacturer in India",
  description:
    "Learn about Autocracy Machinery, an ISO-certified manufacturer of trencher machines, tractor attachments, aquatic weed harvesters, solar EPC equipment, forklifts, and utility machinery in India.",
  alternates: { canonical: "https://autocracymachinery.com/about-us" },
  openGraph: {
    title: "About Autocracy Machinery",
    description:
      "Autocracy Machinery manufactures specialised trenchers, attachments, water management machines, and infrastructure equipment for India and global markets.",
    url: "https://autocracymachinery.com/about-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Autocracy Machinery",
    description:
      "Meet the Hyderabad-based machinery manufacturer behind Autocracy trenchers, attachments, aquatic cleaning machines, and utility equipment.",
  },
};

const AboutUsPage = () => {
  return <AboutUsClient />;
};

export default AboutUsPage;
