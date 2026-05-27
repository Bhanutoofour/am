import {
  getModelByProductSlugAndModelNumberSlug,
} from "@/actions/modelAction";
import { getProductById } from "@/actions/productAction";
import ProductModalClient from "@/app/(main)/product/[slug]/ProductModalClient";
import ModelStructuredData from "@/app/(main)/product/[slug]/ModelStructuredData";
import ModelQueryCleanup from "@/app/(main)/product/[slug]/ModelQueryCleanup";
import {
  buildModelDetailMetadata,
  modelDetailNotFoundMetadata,
  SITE,
} from "@/app/(main)/product/[slug]/modelDetailMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductModelPageProps {
  params: Promise<{ slug: string; modelSlug: string }>;
}

export async function generateMetadata({
  params,
}: ProductModelPageProps): Promise<Metadata> {
  const { slug: productSlug, modelSlug: modelNumberSegment } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(
    productSlug,
    modelNumberSegment
  );

  if (!resolved) return modelDetailNotFoundMetadata;

  const { modelData } = resolved;
  const canonical = `${SITE}/products/${productSlug}/${modelNumberSegment}`;
  return buildModelDetailMetadata(modelData, canonical);
}

export default async function ProductNestedModelPage({
  params,
}: ProductModelPageProps) {
  const { slug: productSlug, modelSlug: modelNumberSegment } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(
    productSlug,
    modelNumberSegment
  );

  if (!resolved) notFound();

  const { modelData } = resolved;

  const parentProductData = modelData.productId
    ? await getProductById(modelData.productId)
    : null;
  const parentProductModels =
    parentProductData?.models.filter((model) => model.id !== modelData.id) ||
    null;

  const pageUrl = `${SITE}/products/${productSlug}/${modelNumberSegment}`;

  return (
    <>
      <ModelQueryCleanup />
      <h1 className="sr-only">{modelData.modelTitle}</h1>
      <h2 className="sr-only">
        {modelData?.seoDescription || modelData.modelTitle}
      </h2>
      <ModelStructuredData modelData={modelData} pageUrl={pageUrl} />
      <ProductModalClient
        modelData={modelData}
        seriesData={parentProductModels}
        pageVariant="productModel"
        modelBasePath={`/products/${productSlug}`}
      />
    </>
  );
}
