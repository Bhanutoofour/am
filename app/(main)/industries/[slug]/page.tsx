import IndustryClient from "./IndustryClient";
import IndustryQueryCleanup from "./IndustryQueryCleanup";
import {
  getIndustryBySlug,
  getActiveIndustries,
} from "@/actions/industryAction";
import { Metadata } from "next";
import StructuredData from "./StructuredData";
import { Suspense } from "react";
import IndustryPageLoading from "@/component/molecules/loading/IndustryPageLoading";
import { notFound } from "next/navigation";

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function IndustryById({ params }: IndustryPageProps) {
  const { slug } = await params;

  const resolved = await getIndustryBySlug(slug);
  if (!resolved) notFound();

  const industries = await getActiveIndustries();
  const { industryData, industryId } = resolved;

  return (
    <>
      <IndustryQueryCleanup />
      <h1 className="sr-only">{industryData.title}</h1>
      <h2 className="sr-only">{industryData.seoDescription || industryData.description}</h2>
      <StructuredData industryData={industryData} pathSlug={slug} />
      <Suspense fallback={<IndustryPageLoading />}>
        <IndustryClient
          industryData={industryData}
          industries={industries}
          industryId={industryId}
        />
      </Suspense>
    </>
  );
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getIndustryBySlug(slug);

  if (!resolved) {
    return {
      title: "Industry Not Found",
      description: "The industry you are looking for does not exist.",
    };
  }

  const { industryData } = resolved;

  // Default SEO values
  const defaultTitle = "Industry Solutions - Autocracy Machinery";
  const defaultDescription =
    "Complete industry solutions from Autocracy Machinery. Leading manufacturer of industrial machinery and equipment.";
  const defaultKeywords =
    "industrial machinery, construction equipment, agricultural equipment, autocracy machinery";

  // SEO Configuration based on industry data
  const title =
    industryData?.seoMetadata?.pageTitle ||
    `${industryData?.title || "Industry"} Solutions - Autocracy` ||
    defaultTitle;
  const description =
    industryData?.seoMetadata?.pageDescription ||
    industryData?.description ||
    defaultDescription;
  const keywords =
    industryData?.seoMetadata?.pageKeywords ||
    `${industryData?.title || "Industry"}, ${defaultKeywords}`;

  const openGraphTitle =
    industryData?.seoMetadata?.socialTitle ||
    `${industryData?.title || "Industry"} Solutions - Autocracy`;
  const openGraphDescription =
    industryData?.seoMetadata?.socialDescription ||
    industryData?.description ||
    defaultDescription;
  const openGraphImage =
    industryData?.seoMetadata?.socialImage ||
    industryData?.thumbnail ||
    "/images/default-industry.jpg";

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: openGraphTitle,
        },
      ],
      siteName: "Autocracy Machinery",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
      images: [openGraphImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: "Autocracy Machinery" }],
    alternates: {
      canonical: `https://autocracymachinery.com/industries/${slug}`,
    },
    other: {
      "twitter:site": "@autocracymachinery",
      "twitter:creator": "@autocracymachinery",
    },
  };
}
