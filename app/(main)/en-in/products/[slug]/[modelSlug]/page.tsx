import {
  getModelByProductSlugAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import ProductModalClient from "@/app/(main)/product/[slug]/ProductModalClient";
import ModelStructuredData from "@/app/(main)/product/[slug]/ModelStructuredData";
import ModelQueryCleanup from "@/app/(main)/product/[slug]/ModelQueryCleanup";
import {
  buildModelDetailMetadata,
  modelDetailNotFoundMetadata,
} from "@/app/(main)/product/[slug]/modelDetailMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  indiaModelDescription,
  indiaModelKeywords,
  indiaModelTitle,
} from "@/utils/indiaSeo";

interface IndiaProductModelPageProps {
  params: Promise<{ slug: string; modelSlug: string }>;
}

const SITE = "https://autocracymachinery.com";

export async function generateMetadata({
  params,
}: IndiaProductModelPageProps): Promise<Metadata> {
  const { slug: productSlug, modelSlug } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(
    productSlug,
    modelSlug
  );

  if (!resolved) return modelDetailNotFoundMetadata;

  const canonical = `${SITE}/en-in/products/${productSlug}/${modelSlug}`;
  const metadata = buildModelDetailMetadata(resolved.modelData, canonical);

  return {
    ...metadata,
    title: indiaModelTitle(
      resolved.modelData.modelNumber,
      resolved.modelData.modelTitle
    ),
    description: indiaModelDescription(resolved.modelData),
    keywords: indiaModelKeywords(resolved.modelData),
    openGraph: {
      ...metadata.openGraph,
      title: indiaModelTitle(
        resolved.modelData.modelNumber,
        resolved.modelData.modelTitle
      ),
      description: indiaModelDescription(resolved.modelData),
      url: canonical,
      siteName: "Autocracy Machinery India",
      locale: "en_IN",
    },
    twitter: {
      ...metadata.twitter,
      title: indiaModelTitle(
        resolved.modelData.modelNumber,
        resolved.modelData.modelTitle
      ),
      description: indiaModelDescription(resolved.modelData),
    },
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": `${SITE}/products/${productSlug}/${modelSlug}`,
      },
    },
  };
}

export default async function IndiaProductModelPage({
  params,
}: IndiaProductModelPageProps) {
  const { slug: productSlug, modelSlug } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(
    productSlug,
    modelSlug
  );

  if (!resolved) notFound();

  const { modelData } = resolved;
  const seriesData = modelData.series
    ? await getModelsBySeries(modelData.series)
    : null;
  const pageUrl = `${SITE}/en-in/products/${productSlug}/${modelSlug}`;

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
        pageVariant="productModel"
        modelBasePath={`/en-in/products/${productSlug}`}
      />
    </>
  );
}
