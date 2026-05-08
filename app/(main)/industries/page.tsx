import { getActiveIndustries } from "@/actions/industryAction";
import type { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";

export const metadata: Metadata = {
  title: "Choose Your Industry | Autocracy Machinery",
  description:
    "Explore Autocracy Machinery industry solutions for telecom, water management, solar energy, agriculture, construction, landscaping, and environmental applications.",
};

export default async function IndustriesPage() {
  const industries = await getActiveIndustries();

  return <IndustriesClient industries={industries} />;
}
