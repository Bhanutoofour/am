import Script from "next/script";

export default function HomeStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Autocracy Machinery",
    description:
      "Autocracy Machinery manufactures trencher machines, tractor attachments, solar EPC equipment, aquatic weed harvesters, floating trash collectors, forklifts, sod machines, and utility equipment for infrastructure, agriculture, water management, telecom, and construction projects.",
    url: "https://autocracymachinery.com",
    logo: "https://d3du1kxieyd1np.cloudfront.net/assets/autcracy_machinery_logo.png",
    sameAs: [
      "https://www.facebook.com/people/Autocracy-Machinery/61554797280328/",
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
        "Plot No.72/A, Lane-3, B N Reddy Nagar, Cherlapalli, Hyderabad, Telangana 500051",
      addressCountry: "IN",
      addressLocality: "Hyderabad",
    },
    foundingDate: "2020",
    industry: "Machinery Manufacturing",
    knowsAbout: [
      "Trencher Machines",
      "Chain Trenchers",
      "Rock Wheel Trenchers",
      "Solar EPC Equipment",
      "Aquatic Weed Harvesters",
      "Lake Cleaning Machines",
      "Tractor Attachments",
      "Utility Equipment",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Autocracy Machinery Equipment Catalog",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Trencher Machines",
            description:
              "Chain trenchers, rock wheel trenchers, and compact trenching machines for OFC cable laying, irrigation pipelines, solar cable routes, and utility corridors.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Solar EPC and Utility Attachments",
            description:
              "Sand fillers, pole stackers, forklifts, and tractor attachments for solar, construction, and infrastructure sites.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Water Body Cleaning Machines",
            description:
              "Aquatic weed harvesters, floating trash collectors, and pontoons for lake, canal, pond, and reservoir maintenance.",
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
