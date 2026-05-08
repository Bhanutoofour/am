import Script from "next/script";

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
  const seoData = productData.seoMetadata;
  const productUrl =
    pageUrl ?? `https://autocracymachinery.com/products/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": seoData?.structuredData?.type || "Product",
    name: seoData?.structuredData?.title || productData.title,
    description:
      seoData?.structuredData?.description || productData.description,
    brand: {
      "@type": "Brand",
      name: seoData?.structuredData?.brand || "Autocracy Machinery",
    },
    category: seoData?.structuredData?.category || "Construction Equipment",
    image: productData.thumbnail,
    imageAlt: productData.thumbnailAltText || productData.title,
    url: productUrl,
    manufacturer: {
      "@type": "Organization",
      name: "Autocracy Machinery",
      url: "https://autocracymachinery.com",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Autocracy Machinery",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
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
          name: "Construction Professional",
        },
        reviewBody:
          "Excellent quality and performance. Highly recommended for construction projects.",
      },
    ],
    hasOfferCatalog: seoData?.structuredData?.hasOfferCatalog
      ? {
          "@type": "OfferCatalog",
          name: seoData.structuredData.hasOfferCatalog.name || "Product Models",
          description:
            seoData.structuredData.hasOfferCatalog.description ||
            `Complete range of ${productData.title} models`,
          itemListElement:
            productData.models?.map((model, index) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: model.modelNumber,
                description: model.modelTitle,
                category: model.machineType,
                brand: {
                  "@type": "Brand",
                  name: "Autocracy Machinery",
                },
              },
            })) || [],
        }
      : undefined,
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
