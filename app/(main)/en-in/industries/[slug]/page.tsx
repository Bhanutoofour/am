import IndustryClient from "@/app/(main)/industries/[slug]/IndustryClient";
import IndustryQueryCleanup from "@/app/(main)/industries/[slug]/IndustryQueryCleanup";
import StructuredData from "@/app/(main)/industries/[slug]/StructuredData";
import IndustryPageLoading from "@/component/molecules/loading/IndustryPageLoading";
import {
  getIndustryBySlug,
  getActiveIndustries,
} from "@/actions/industryAction";
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

interface IndiaIndustryPageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://autocracymachinery.com";

export async function generateMetadata({
  params,
}: IndiaIndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getIndustryBySlug(slug);

  if (!resolved) {
    return {
      title: "Industry Not Found",
      description: "The industry you are looking for does not exist.",
    };
  }

  const { industryData } = resolved;
  const canonical = `${SITE}/en-in/industries/${slug}`;
  const title =
    industryData?.seoMetadata?.pageTitle ||
    `${industryData?.title || "Industry"} Machinery Solutions in India | Autocracy`;
  const description =
    industryData?.seoMetadata?.pageDescription ||
    industryData?.description ||
    "Industry-specific machinery solutions for India from Autocracy Machinery.";
  const image =
    industryData?.seoMetadata?.socialImage ||
    industryData?.thumbnail ||
    "/images/default-industry.jpg";

  return {
    title,
    description,
    keywords:
      industryData?.seoMetadata?.pageKeywords ||
      `${industryData?.title || "Industry"} India, industrial machinery India, Autocracy Machinery`,
    openGraph: {
      url: canonical,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      siteName: "Autocracy Machinery India",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
    authors: [{ name: "Autocracy Machinery" }],
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": `${SITE}/industries/${slug}`,
      },
    },
  };
}

export default async function IndiaIndustryPage({
  params,
}: IndiaIndustryPageProps) {
  const { slug } = await params;
  const resolved = await getIndustryBySlug(slug);

  if (!resolved) notFound();

  const industries = await getActiveIndustries();
  const { industryData, industryId } = resolved;

  return (
    <>
      <IndustryQueryCleanup />
      <h1 className="sr-only">{industryData.title} Machinery in India</h1>
      <h2 className="sr-only">
        {industryData.seoDescription || industryData.description}
      </h2>
      <StructuredData
        industryData={industryData}
        pathSlug={slug}
        pageUrl={`${SITE}/en-in/industries/${slug}`}
      />
      <Suspense fallback={<IndustryPageLoading />}>
        <IndustryClient
          industryData={industryData}
          industries={industries}
          industryId={industryId}
          basePath="/en-in"
        />
      </Suspense>
    </>
  );
}
