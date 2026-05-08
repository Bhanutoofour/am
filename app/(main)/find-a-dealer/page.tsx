import React from "react";
import DealerClient from "./DealerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Find Authorized Dealers for Trenchers & Utility Equipment - Autocracy Machinery",
  description:
    "Use our dealer locator to connect with certified sales and service partners for trenchers, utility, and infrastructure equipment. Get reliable support, genuine parts, and expert assistance near you.",
  alternates: { canonical: "https://autocracymachinery.com/find-a-dealer" },
  openGraph: {
    title: "Find a Dealer – Autocracy Machinery",
    description:
      "Use our dealer locator to connect with certified sales and service partners for trenchers, utility, and infrastructure equipment.",
    url: "https://autocracymachinery.com/find-a-dealer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Dealer – Autocracy Machinery",
    description:
      "Use our dealer locator to connect with certified sales and service partners for trenchers, utility, and infrastructure equipment.",
  },
};

const DealerPage = async () => {
  return <DealerClient />;
};

export default DealerPage;
