import {
  buildModelDetailMetadata,
  modelDetailNotFoundMetadata,
  preferredModelCanonicalUrl,
  productsModelPathFromModelData,
} from "./modelDetailMetadata";
import {
  resolveModelForLegacyProductPage,
} from "@/actions/modelAction";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

interface ProductModalPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductModalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const modelData = await resolveModelForLegacyProductPage(slug, query.modelId);

  if (!modelData) return modelDetailNotFoundMetadata;

  const canonical = preferredModelCanonicalUrl(modelData, slug);
  return buildModelDetailMetadata(modelData, canonical);
}

/**
 * Old `/product/{combined-slug}?modelId=` → permanent redirect to `/products/{productSlug}/{modelNumberSlug}`.
 */
export default async function ProductModalPage({
  params,
  searchParams,
}: ProductModalPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const modelData = await resolveModelForLegacyProductPage(slug, query.modelId);

  if (!modelData) notFound();

  const path = productsModelPathFromModelData(modelData);
  if (!path) notFound();

  permanentRedirect(path);
}
