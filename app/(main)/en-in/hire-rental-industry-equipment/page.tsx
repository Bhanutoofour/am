import HireEquipmentPage from "@/app/(main)/hire-rental-industry-equipment/page";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Hire or Rent Industry Equipment in India | Autocracy Machinery",
  description:
    "Hire or rent trenchers, infrastructure machines, and industry equipment from Autocracy Machinery for Indian project requirements.",
  alternates: {
    canonical: indiaCanonical("/hire-rental-industry-equipment"),
    languages: {
      "en-IN": indiaCanonical("/hire-rental-industry-equipment"),
      "x-default": rootCanonical("/hire-rental-industry-equipment"),
    },
  },
};

export default HireEquipmentPage;
