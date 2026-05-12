import React from "react";
import BrochureClient from "./BrochureClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Download Trencher Machine & Equipment Brochures | Autocracy Machinery",
  description:
    "Download Autocracy Machinery brochures for trencher machines, solar EPC equipment, aquatic weed harvesters, tractor attachments, forklifts, sod machines, and utility equipment.",
  keywords: [
    "trencher machine brochure",
    "trenching machine catalogue",
    "solar EPC equipment brochure",
    "aquatic weed harvester brochure",
    "Autocracy Machinery brochure",
  ],
  alternates: { canonical: "https://autocracymachinery.com/brochure" },
  openGraph: {
    title: "Download Autocracy Machinery Brochures",
    description:
      "Get brochures for trenchers, attachments, water management machines, forklifts, and utility equipment.",
    url: "https://autocracymachinery.com/brochure",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Autocracy Machinery Brochures",
    description:
      "Download brochures for trencher machines, attachments, and project-ready equipment.",
  },
};

const BrochurePage = async () => {
  return <BrochureClient />;
};

export default BrochurePage;
