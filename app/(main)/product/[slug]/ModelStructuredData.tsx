import Script from "next/script";
import {
  modelSlug,
  modelNumberSlug,
  titleToSlug,
} from "@/utils/slug";
import { SITE } from "./modelDetailMetadata";

interface ModelStructuredDataProps {
  modelData: ModelObjectTypes | null;
  /** Full canonical URL for this model page (e.g. nested /industries/.../.../rudra-100). */
  pageUrl?: string;
}

export default function ModelStructuredData({
  modelData,
  pageUrl,
}: ModelStructuredDataProps) {
  if (!modelData) return null;

  const seoData = modelData.seoMetadata;
  const productSeg = titleToSlug(modelData.productName ?? "");
  const modelSeg = modelNumberSlug(modelData.modelNumber ?? "");
  const defaultProductsUrl =
    productSeg && modelSeg
      ? `${SITE}/products/${productSeg}/${modelSeg}`
      : null;

  const technicalSpecs = [
    modelData.machineType
      ? {
          "@type": "PropertyValue",
          name: "Machine type",
          value: modelData.machineType,
        }
      : undefined,
    modelData.series
      ? {
          "@type": "PropertyValue",
          name: "Series",
          value: modelData.series,
        }
      : undefined,
    ...(modelData.keyFeatures?.map((feature) => ({
      "@type": "PropertyValue",
      name: feature.name,
      value: feature.value,
    })) || []),
  ].filter(Boolean);
  const modelUrl =
    pageUrl ??
    defaultProductsUrl ??
    `${SITE}/product/${modelSlug(
      modelData.productName ?? "",
      modelData.modelTitle ?? "",
      modelData.modelNumber ?? ""
    )}`;
  const images = [
    modelData.coverImage,
    ...(modelData.modelDescription || []).map((item) => item.image),
    modelData.generalImage,
  ].filter(Boolean);
  const description =
    modelData.seoDescription ||
    seoData?.pageDescription ||
    seoData?.structuredData?.description ||
    modelData.modelDescription?.[0]?.description?.join(" ") ||
    `${modelData.modelNumber} ${modelData.modelTitle}`.trim();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${modelUrl}#product`,
    name:
      `${modelData.modelNumber} ${modelData.modelTitle}`.trim() ||
      seoData?.structuredData?.name,
    description,
    sku: modelData.modelNumber,
    model: modelData.modelNumber,
    brand: {
      "@type": "Brand",
      name: "Autocracy Machinery",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Autocracy Machinery",
      url: SITE,
    },
    category: modelData.productName || modelData.machineType,
    ...(seoData?.structuredData?.material
      ? { material: seoData.structuredData.material }
      : {}),
    ...(seoData?.structuredData?.condition
      ? { condition: seoData.structuredData.condition }
      : {}),
    image: images,
    url: modelUrl,
    additionalProperty: technicalSpecs,
    ...(seoData?.structuredData?.certifications?.length
      ? { certifications: seoData.structuredData.certifications }
      : {}),
    isVariantOf: {
      "@type": "ProductGroup",
      ...(productSeg
        ? { "@id": `${SITE}/products/${productSeg}#product-group` }
        : {}),
      name: modelData.productName,
      productGroupID: `autocracy-${productSeg || modelData.productName}`,
    },
    ...(modelData.industries?.length
      ? {
          audience: modelData.industries.map((industry) => ({
            "@type": "Audience",
            audienceType: industry,
          })),
        }
      : {}),
    mainEntityOfPage: modelUrl,
  };

  return (
    <Script
      id="model-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
