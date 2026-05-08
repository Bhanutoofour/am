import RenderContent from "@/component/sections/renderContent/RenderContent";
import { TERMS_AND_CONDITIONS } from "@/data/termsCondition";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms And Conditions - Autocracy Machinery",
  description:
    "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
  alternates: { canonical: "https://autocracymachinery.com/terms-and-conditions" },
  openGraph: {
    title: "Terms and Conditions – Autocracy Machinery",
    description:
      "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
    url: "https://autocracymachinery.com/terms-and-conditions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions – Autocracy Machinery",
    description:
      "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
  },
};

const TermsAndConditions = () => {
  return <RenderContent data={TERMS_AND_CONDITIONS} />;
};

export default TermsAndConditions;
