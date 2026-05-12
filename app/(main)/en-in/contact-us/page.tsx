import ContactUsClient from "@/app/(main)/contact-us/ContactUsClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Contact Autocracy Machinery India | Trenchers & Utility Equipment",
  description:
    "Contact Autocracy Machinery for trencher machines, solar EPC equipment, aquatic weed harvesters, attachments, rentals, spares, and project support in India.",
  alternates: {
    canonical: indiaCanonical("/contact-us"),
    languages: {
      "en-IN": indiaCanonical("/contact-us"),
      "x-default": rootCanonical("/contact-us"),
    },
  },
};

export default function IndiaContactPage() {
  return <ContactUsClient />;
}
