import ContactUsClient from "@/app/(main)/contact-us/ContactUsClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Contact Autocracy Machinery India",
  description:
    "Contact Autocracy Machinery for trenchers, utility equipment, environmental machines, attachments, and project-ready machinery support in India.",
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
