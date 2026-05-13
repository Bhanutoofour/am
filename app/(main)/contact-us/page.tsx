import React from "react";
import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";

export const metadata: Metadata = {
  title:
    "Contact Autocracy Machinery | Trencher & Equipment Manufacturer India",
  description:
    "Contact Autocracy Machinery for trencher machines, solar EPC equipment, aquatic weed harvesters, tractor attachments, forklifts, rentals, spares, and project support.",
  alternates: { canonical: "https://www.autocracymachinery.com/contact-us" },
  openGraph: {
    title: "Contact Autocracy Machinery",
    description:
      "Get product guidance, quotes, rental support, brochures, and after-sales help for Autocracy Machinery equipment.",
    url: "https://www.autocracymachinery.com/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Autocracy Machinery",
    description:
      "Talk to Autocracy Machinery for trenchers, utility equipment, rentals, spares, and support.",
  },
};

const ContactUsPage = () => {
  return <ContactUsClient />;
};

export default ContactUsPage;
