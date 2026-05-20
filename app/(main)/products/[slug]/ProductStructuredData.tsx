import Script from "next/script";
import { SITE_URL } from "@/utils/locale";
import { modelNumberSlug, titleToSlug } from "@/utils/slug";

interface ProductStructuredDataProps {
  productData: ProductDataType;
  slug: string;
  /** When set (e.g. industry product), must match `alternates.canonical` — usually final `/industries/...` URL. */
  pageUrl?: string;
}

export default function ProductStructuredData({
  productData,
  slug,
  pageUrl,
}: ProductStructuredDataProps) {
  const productUrl = pageUrl ?? `${SITE_URL}/products/${slug}`;
  const productSlug = titleToSlug(productData.title || slug);
  const variants =
    productData.models?.map((model) => {
      const modelUrl = `${SITE_URL}/products/${productSlug}/${modelNumberSlug(
        model.modelNumber
      )}`;
      const additionalProperty = [
        model.series
          ? {
              "@type": "PropertyValue",
              name: "Series",
              value: model.series,
            }
          : undefined,
        model.machineType
          ? {
              "@type": "PropertyValue",
              name: "Machine type",
              value: model.machineType,
            }
          : undefined,
        ...(model.keyFeatures || []).map((feature) => ({
          "@type": "PropertyValue",
          name: feature.name,
          value: feature.value,
        })),
      ].filter(Boolean);

      return {
        "@type": "Product",
        "@id": `${modelUrl}#product`,
        name: [model.modelNumber, model.modelTitle].filter(Boolean).join(" - "),
        model: model.modelNumber,
        sku: model.modelNumber,
        category: model.machineType || productData.title,
        image: model.thumbnail || productData.thumbnail,
        url: modelUrl,
        brand: {
          "@type": "Brand",
          name: "Autocracy Machinery",
        },
        manufacturer: {
          "@type": "Organization",
          name: "Autocracy Machinery",
          url: SITE_URL,
        },
        isVariantOf: {
          "@id": `${productUrl}#product-group`,
        },
        ...(additionalProperty.length ? { additionalProperty } : {}),
      };
    }) || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${productUrl}#product-group`,
    name: productData.title,
    description: productData.seoDescription || productData.description,
    url: productUrl,
    image: [productData.thumbnail, productData.generalImage].filter(Boolean),
    brand: {
      "@type": "Brand",
      name: "Autocracy Machinery",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Autocracy Machinery",
      url: SITE_URL,
    },
    category: productData.title,
    productGroupID: `autocracy-${productSlug || productData.id}`,
    variesBy: ["https://schema.org/model", "https://schema.org/category"],
    hasVariant: variants,
    mainEntityOfPage: productUrl,
    ...(productData.industries?.length
      ? {
          audience: productData.industries.map((industry) => ({
            "@type": "Audience",
            audienceType: industry,
          })),
        }
      : {}),
  };

  return (
    <Script
      id="product-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
