import { getActiveIndustries } from "@/actions/industryAction";
import type { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";
import { permanentRedirect } from "next/navigation";
import { indiaCanonical, rootCanonical } from "@/utils/locale";
import { titleToSlug } from "@/utils/slug";

type IndustriesPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function redirectLegacyIndustriesQuery(
  searchParams?: IndustriesPageProps["searchParams"]
) {
  const query: { [key: string]: string | string[] | undefined } = searchParams
    ? await searchParams
    : {};
  const industryId = getSingleQueryValue(query.industryId);

  if (!industryId) return;

  const industries = await getActiveIndustries();
  const industry = industries.find((item) => String(item.id) === industryId);
  permanentRedirect(
    industry ? `/industries/${titleToSlug(industry.title ?? "")}` : "/industries"
  );
}

export const metadata: Metadata = {
  title: "Industry Equipment for Telecom, Solar, Water & Agriculture | Autocracy",
  description:
    "Explore industry-specific trenchers, solar EPC equipment, water management machines, agriculture attachments, construction utility equipment, and environmental cleaning solutions.",
  alternates: {
    canonical: rootCanonical("/industries"),
    languages: {
      "en-IN": indiaCanonical("/industries"),
      "x-default": rootCanonical("/industries"),
    },
  },
};

export default async function IndustriesPage({ searchParams }: IndustriesPageProps) {
  await redirectLegacyIndustriesQuery(searchParams);

  const industries = await getActiveIndustries();

  return <IndustriesClient industries={industries} />;
}
