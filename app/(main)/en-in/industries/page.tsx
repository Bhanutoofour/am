import { getActiveIndustries } from "@/actions/industryAction";
import IndustriesClient from "@/app/(main)/industries/IndustriesClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";
import { permanentRedirect } from "next/navigation";
import { titleToSlug } from "@/utils/slug";

type IndiaIndustriesPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function redirectLegacyIndiaIndustriesQuery(
  searchParams?: IndiaIndustriesPageProps["searchParams"]
) {
  const query: { [key: string]: string | string[] | undefined } = searchParams
    ? await searchParams
    : {};
  const industryId = getSingleQueryValue(query.industryId);

  if (!industryId) return;

  const industries = await getActiveIndustries();
  const industry = industries.find((item) => String(item.id) === industryId);
  permanentRedirect(
    industry
      ? `/en-in/industries/${titleToSlug(industry.title ?? "")}`
      : "/en-in/industries"
  );
}

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

export default async function IndiaIndustriesPage({
  searchParams,
}: IndiaIndustriesPageProps) {
  await redirectLegacyIndiaIndustriesQuery(searchParams);

  const industries = await getActiveIndustries();

  return <IndustriesClient industries={industries} basePath="/en-in" market="india" />;
}
