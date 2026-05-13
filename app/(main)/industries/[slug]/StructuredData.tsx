import Script from "next/script";
import { rootCanonical } from "@/utils/locale";

interface StructuredDataProps {
  industryData: IndustryDataType | null;
  /** Route `[slug]` — must match `alternates.canonical` / real URL (not only title-derived slug). */
  pathSlug: string;
  pageUrl?: string;
}

export default function StructuredData({
  industryData,
  pathSlug,
  pageUrl: pageUrlOverride,
}: StructuredDataProps) {
  const pageUrl =
    pageUrlOverride || rootCanonical(`/industries/${pathSlug}`);

  // Structured Data (JSON-LD) - only if industry data exists
  const structuredData = industryData
    ? {
        "@context": "https://schema.org",
        "@type":
          industryData?.seoMetadata?.structuredData?.type || "Organization",
        name:
          industryData?.seoMetadata?.structuredData?.title ||
          `${industryData?.title} Solutions`,
        description:
          industryData?.seoMetadata?.structuredData?.description ||
          industryData?.description,
        url: pageUrl,
        logo: "https://d3du1kxieyd1np.cloudfront.net/assets/autcracy_machinery_logo.png",
        sameAs: [
          "https://www.facebook.com/people/Autocracy-Machinery/61554797280328/ ",
          "https://www.linkedin.com/company/autocracy-machinery",
          "https://x.com/aceautocracy",
          "https://www.youtube.com/@AutocracyMachinery",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-8790473345",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: "English",
        },
      }
    : null;

  if (!structuredData) return null;

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
