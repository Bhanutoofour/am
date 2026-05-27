import {
  getModelByIndustryProductAndModelNumberSlug,
} from "@/actions/modelAction";
import { getIndustryBySlug } from "@/actions/industryAction";
import { getProductById } from "@/actions/productAction";
import ProductModalClient from "@/app/(main)/product/[slug]/ProductModalClient";
import ModelStructuredData from "@/app/(main)/product/[slug]/ModelStructuredData";
import ModelQueryCleanup from "@/app/(main)/product/[slug]/ModelQueryCleanup";
import {
  buildModelDetailMetadata,
  modelDetailNotFoundMetadata,
  productsModelPathFromModelData,
  SITE,
} from "@/app/(main)/product/[slug]/modelDetailMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IndustryProductModelPageProps {
  params: Promise<{ slug: string; productSlug: string; modelSlug: string }>;
}

export async function generateMetadata({
  params,
}: IndustryProductModelPageProps): Promise<Metadata> {
  const { slug, productSlug, modelSlug: modelNumberSegment } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    slug,
    productSlug,
    modelNumberSegment
  );

  if (!resolved) return modelDetailNotFoundMetadata;

  const { modelData } = resolved;
  const canonicalPath =
    productsModelPathFromModelData(modelData) ||
    `/products/${productSlug}/${modelNumberSegment}`;
  return buildModelDetailMetadata(modelData, `${SITE}${canonicalPath}`);
}

export default async function IndustryProductModelPage({
  params,
}: IndustryProductModelPageProps) {
  const { slug, productSlug, modelSlug: modelNumberSegment } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    slug,
    productSlug,
    modelNumberSegment
  );

  if (!resolved) notFound();

  const { modelData } = resolved;
  const industryResolved = await getIndustryBySlug(slug);

  const parentProductData = modelData.productId
    ? await getProductById(modelData.productId)
    : null;
  const parentProductModels =
    parentProductData?.models.filter((model) => model.id !== modelData.id) ||
    null;

  const pagePath =
    productsModelPathFromModelData(modelData) ||
    `/products/${productSlug}/${modelNumberSegment}`;

  return (
    <>
      <ModelQueryCleanup />
      <h1 className="sr-only">{modelData.modelTitle}</h1>
      <h2 className="sr-only">
        {modelData?.seoDescription || modelData.modelTitle}
      </h2>
      <ModelStructuredData modelData={modelData} pageUrl={`${SITE}${pagePath}`} />
      <ProductModalClient
        modelData={modelData}
        seriesData={parentProductModels}
        pageVariant="industry"
        modelBasePath={`/industries/${slug}/${productSlug}`}
        industryTitle={industryResolved?.industryData.title}
        industrySlug={slug}
      />
    </>
  );
}
