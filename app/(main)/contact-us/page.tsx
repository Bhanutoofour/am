import React from "react";
import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";

export const metadata: Metadata = {
  title:
    "Contact Us - Trencher Manufacturer Equipment Suppliers - Autocracy Machinery",
  description:
    "Get in touch with Autocracy Machinery for durable trenchers and utility equipment. Quick assistance, expert advice, and project-ready solutions.",
  alternates: { canonical: "https://autocracymachinery.com/contact-us" },
  openGraph: {
    title: "Contact Us – Autocracy Machinery",
    description:
      "Get in touch with Autocracy Machinery for durable trenchers and utility equipment. Quick assistance, expert advice, and project-ready solutions.",
    url: "https://autocracymachinery.com/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us – Autocracy Machinery",
    description:
      "Get in touch with Autocracy Machinery for durable trenchers and utility equipment. Quick assistance, expert advice, and project-ready solutions.",
  },
};

const ContactUsPage = () => {
  return <ContactUsClient />;
};

export default ContactUsPage;
