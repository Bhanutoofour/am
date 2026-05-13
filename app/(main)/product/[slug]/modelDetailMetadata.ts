import type { Metadata } from "next";
import { titleToSlug, modelNumberSlug } from "@/utils/slug";
import { SITE_URL } from "@/utils/locale";

export const SITE = SITE_URL;

/** Prefer `/products/{product}/{modelNumber}` when possible (matches primary sitemap URL). */
export function preferredModelCanonicalUrl(
  modelData: ModelObjectTypes,
  legacyProductSlug: string
): string {
  const path = productsModelPathFromModelData(modelData);
  if (path) return `${SITE}${path}`;
  return `${SITE}/product/${legacyProductSlug}`;
}

/** Path only, e.g. `/products/chain-trenchers/rudra-100` — `null` if product/model slug missing. */
export function productsModelPathFromModelData(
  modelData: ModelObjectTypes
): string | null {
  const p = titleToSlug(modelData.productName ?? "");
  const m = modelNumberSlug(modelData.modelNumber ?? "");
  if (!p || !m) return null;
  return `/products/${p}/${m}`;
}

export const modelDetailNotFoundMetadata: Metadata = {
  title: "Model Not Found",
  description: "The model you are looking for does not exist.",
};

/** Same SEO fields for `/product/...`, `/products/.../...`, and `/industries/.../.../...`. */
export function buildModelDetailMetadata(
  modelData: ModelObjectTypes,
  canonicalUrl: string
): Metadata {
  const seoData = modelData.seoMetadata;

  return {
    title:
      seoData?.pageTitle ||
      `${modelData.modelNumber} - ${modelData.modelTitle} | Autocracy Machinery`,
    description:
      seoData?.pageDescription ||
      `Explore the ${modelData.modelNumber} ${
        modelData.modelTitle
      } - a high-performance ${modelData.machineType.toLowerCase()} designed for telecom, irrigation, and utility projects. Engineered for tough soil conditions with exceptional durability.`,
    keywords:
      seoData?.pageKeywords ||
      `${modelData.modelNumber}, ${modelData.modelTitle}, ${modelData.machineType}, trenching equipment, construction machinery, autocracy machinery`,
    openGraph: {
      url: canonicalUrl,
      title:
        seoData?.socialTitle ||
        `${modelData.modelNumber} - ${modelData.modelTitle} | Autocracy Machinery`,
      description:
        seoData?.socialDescription ||
        `Discover the ${modelData.modelNumber} ${
          modelData.modelTitle
        } - premium ${modelData.machineType.toLowerCase()} for professional trenching applications.`,
      images: [
        {
          url: seoData?.socialImage || modelData.coverImage,
          width: 1200,
          height: 630,
          alt: `${modelData.modelNumber} ${modelData.modelTitle}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        seoData?.socialTitle ||
        `${modelData.modelNumber} - ${modelData.modelTitle} | Autocracy Machinery`,
      description:
        seoData?.socialDescription ||
        `Discover the ${modelData.modelNumber} ${
          modelData.modelTitle
        } - premium ${modelData.machineType.toLowerCase()} for professional trenching applications.`,
      images: [seoData?.socialImage || modelData.coverImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
