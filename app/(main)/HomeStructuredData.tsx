import Script from "next/script";

export default function HomeStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Trencher Machines Manufacturer & Supplier India – Autocracy Machinery",
    description:
      "Autocracy Machinery is India's global manufacturer of equipment and attachments, trenchers, padding, pole stacking, forklift, lake cleaner, sod harvester, sprigger and infielder.",
    url: "https://autocracymachinery.com",
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
    address: {
      "@type": "PostalAddress",
      address:
        "I.D, Plot No.72/A, Lane-3, B N Reddy Nagar, Cherlapalli, Secunderabad, Hyderabad, Telangana 500051",
      addressCountry: "IN",
      addressLocality: "India",
    },
    foundingDate: "2020",
    industry: "Manufacturing",
    knowsAbout: [
      "Industrial Machinery",
      "Construction Equipment",
      "Agricultural Equipment",
      "Landscaping Equipment",
      "Trenching Machines",
      "Excavators",
      "Bulldozers",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Industrial Equipment Catalog",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Trenching Machines",
            description:
              "High-quality trenching machines for various industries",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Excavators",
            description: "Reliable excavators for construction projects",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Agricultural Equipment",
            description: "Specialized equipment for agricultural applications",
          },
        },
      ],
    },
  };

  return (
    <Script
      id="home-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
