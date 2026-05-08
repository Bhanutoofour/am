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
} from "@/app/(main)/product/[slug]/modelDetailMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IndiaIndustryProductModelPageProps {
  params: Promise<{ slug: string; productSlug: string; modelSlug: string }>;
}

const SITE = "https://autocracymachinery.com";

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

  const canonical = `${SITE}/en-in/industries/${slug}/${productSlug}/${modelSlug}`;
  return buildModelDetailMetadata(resolved.modelData, canonical);
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
  const pageUrl = `${SITE}/en-in/industries/${slug}/${productSlug}/${modelSlug}`;

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
