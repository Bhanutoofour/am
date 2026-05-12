import { getActiveIndustries } from "@/actions/industryAction";
import IndustriesClient from "@/app/(main)/industries/IndustriesClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Industry Machinery in India for Telecom, Solar & Water | Autocracy",
  description:
    "Explore Autocracy Machinery solutions for Indian telecom OFC trenching, solar EPC, water management, agriculture, construction, landscaping, defence, and environmental projects.",
  alternates: {
    canonical: indiaCanonical("/industries"),
    languages: {
      "en-IN": indiaCanonical("/industries"),
      "x-default": rootCanonical("/industries"),
    },
  },
};

export default async function IndiaIndustriesPage() {
  const industries = await getActiveIndustries();

  return <IndustriesClient industries={industries} basePath="/en-in" market="india" />;
}
