import { getActiveIndustries } from "@/actions/industryAction";
import type { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";

export const metadata: Metadata = {
  title: "Industry Equipment for Telecom, Solar, Water & Agriculture | Autocracy",
  description:
    "Explore industry-specific trenchers, solar EPC equipment, water management machines, agriculture attachments, construction utility equipment, and environmental cleaning solutions.",
};

export default async function IndustriesPage() {
  const industries = await getActiveIndustries();

  return <IndustriesClient industries={industries} />;
}
