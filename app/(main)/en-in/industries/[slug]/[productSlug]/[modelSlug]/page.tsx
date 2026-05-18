import {
  getModelByIndustryProductAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import { getIndustryBySlug } from "@/actions/industryAction";
import ProductModalClient from "@/app/(main)/product/[slug]/ProductModalClient";
import ModelStructuredData from "@/app/(main)/product/[slug]/ModelStructuredData";
import ModelQueryCleanup from "@/app/(main)/product/[slug]/ModelQueryCleanup";
import {
  buildModelDetailMetadata,
  modelDetailNotFoundMetadata,
  productsModelPathFromModelData,
} from "@/app/(main)/product/[slug]/modelDetailMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  indiaModelDescription,
  indiaModelKeywords,
  indiaModelTitle,
} from "@/utils/indiaSeo";
import { SITE_URL } from "@/utils/locale";

interface IndiaIndustryProductModelPageProps {
  params: Promise<{ slug: string; productSlug: string; modelSlug: string }>;
}

const SITE = SITE_URL;

export async function generateMetadata({
  params,
}: IndiaIndustryProductModelPageProps): Promise<Metadata> {
  const { slug, productSlug, modelSlug } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    slug,
    productSlug,
    modelSlug
  );

  if (!resolved) return modelDetailNotFoundMetadata;

  const industryResolved = await getIndustryBySlug(slug);
  const industryTitle = industryResolved?.industryData.title;
  const productPath =
    productsModelPathFromModelData(resolved.modelData) ||
    `/products/${productSlug}/${modelSlug}`;
  const canonical = `${SITE}/en-in${productPath}`;
  const metadata = buildModelDetailMetadata(resolved.modelData, canonical);
  const title = industryTitle
    ? `${resolved.modelData.modelNumber} for ${industryTitle} in India | Autocracy Machinery`
    : indiaModelTitle(
        resolved.modelData.modelNumber,
        resolved.modelData.modelTitle
      );
  const description = indiaModelDescription(resolved.modelData);

  return {
    ...metadata,
    title,
    description,
    keywords: indiaModelKeywords(resolved.modelData, industryTitle),
    openGraph: {
      ...metadata.openGraph,
      title,
      description,
      url: canonical,
      siteName: "Autocracy Machinery India",
      locale: "en_IN",
    },
    twitter: {
      ...metadata.twitter,
      title,
      description,
    },
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": `${SITE}${productPath}`,
      },
    },
  };
}

export default async function IndiaIndustryProductModelPage({
  params,
}: IndiaIndustryProductModelPageProps) {
  const { slug, productSlug, modelSlug } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    slug,
    productSlug,
    modelSlug
  );

  if (!resolved) notFound();

  const { modelData } = resolved;
  const industryResolved = await getIndustryBySlug(slug);
  const seriesData = modelData.series
    ? await getModelsBySeries(modelData.series)
    : null;
  const productPath =
    productsModelPathFromModelData(modelData) ||
    `/products/${productSlug}/${modelSlug}`;
  const pageUrl = `${SITE}/en-in${productPath}`;

  return (
    <>
      <ModelQueryCleanup />
      <h1 className="sr-only">{modelData.modelTitle} in India</h1>
      <h2 className="sr-only">
        {modelData?.seoDescription || modelData.modelTitle}
      </h2>
      <ModelStructuredData modelData={modelData} pageUrl={pageUrl} />
      <ProductModalClient
        modelData={modelData}
        seriesData={seriesData}
        pageVariant="industry"
        modelBasePath={`/en-in/industries/${slug}/${productSlug}`}
        industryTitle={industryResolved?.industryData.title}
        industrySlug={slug}
      />
    </>
  );
}
