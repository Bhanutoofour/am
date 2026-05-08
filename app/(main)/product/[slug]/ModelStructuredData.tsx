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

  // Extract technical specifications from keyFeatures
  const technicalSpecs =
    modelData.keyFeatures?.map((feature) => ({
      "@type": "PropertyValue",
      name: feature.name,
      value: feature.value,
    })) || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": seoData?.structuredData?.type || "Product",
    name:
      seoData?.structuredData?.name ||
      `${modelData.modelNumber} - ${modelData.modelTitle}`,
    description:
      seoData?.structuredData?.description ||
      `Fuel-efficient and durable ${modelData.machineType.toLowerCase()} designed for high-performance telecom infrastructure, irrigation systems, and utility projects. Engineered for tough soil conditions, ensuring reliable trenching results and optimal performance.`,
    sku: seoData?.structuredData?.sku || "RUD100",
    brand: {
      "@type": "Brand",
      name: seoData?.structuredData?.brand || "Autocracy Machinery",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Autocracy Machinery",
      description: "Leaders in trenching equipment",
    },
    category:
      seoData?.structuredData?.category ||
      "Trenching Machines, Telecom Equipment, Agricultural Equipment, Construction",
    material: seoData?.structuredData?.material || "High tensile steel",
    color: "#F9C300", // Specific color for all products
    condition: seoData?.structuredData?.condition || "New",
    image: modelData.coverImage,
    imageAlt: modelData.coverImageAltText || modelData.modelNumber,
    url:
      pageUrl ??
      defaultProductsUrl ??
      `${SITE}/product/${modelSlug(
        modelData.productName ?? "",
        modelData.modelTitle ?? "",
        modelData.modelNumber ?? ""
      )}`,
    offers: {
      "@type": "Offer",
      availability:
        seoData?.structuredData?.offers?.availability ||
        "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Autocracy Machinery",
      },
      warranty: {
        "@type": "WarrantyPromise",
        duration: seoData?.structuredData?.warrantyDuration || "P2Y",
        scope: "Global warranty for up to 2 years of product protection",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue:
        seoData?.structuredData?.aggregateRating?.ratingValue?.toString() ||
        "4.9",
      reviewCount:
        seoData?.structuredData?.aggregateRating?.reviewCount?.toString() ||
        "15",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "John D.",
        },
        reviewBody:
          "Exceptional performance in agricultural applications. The Rudra 100 provides strong performance and excellent fuel efficiency, making it a perfect choice for large-scale irrigation and utility trenching projects.",
        reviewTitle: "Excellent Agricultural Performance",
      },
    ],
    additionalProperty: technicalSpecs,
    specialFeatures: [
      {
        "@type": "TechArticle",
        name: "Sustainable Construction Materials",
        description:
          "Crafted using eco-conscious materials to minimize environmental impact, ensuring a greener, more sustainable approach to trenching equipment manufacturing.",
      },
      {
        "@type": "TechArticle",
        name: "Quality Certifications",
        description:
          "ISO 9001 Certified, adhering to international standards for quality management systems, ensuring exceptional performance and reliability across industries.",
      },
    ],
    certifications: seoData?.structuredData?.certifications || ["ISO 9001"],
    isAccessoryOrSparePartFor: {
      "@type": "Product",
      name: modelData.productName,
      category: "Trenching Equipment",
    },
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
