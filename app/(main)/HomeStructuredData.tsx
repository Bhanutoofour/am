import Script from "next/script";

export default function HomeStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.autocracymachinery.com/#localbusiness",
    name: "Autocracy Machinery Private Limited",
    alternateName: "Autocracy Machinery",
    description:
      "Manufacturer of trenchers, solar EPC equipment, aquatic weed harvesters, attachments, forklifts, and utility machines.",
    url: "https://www.autocracymachinery.com",
    logo: "https://d3du1kxieyd1np.cloudfront.net/assets/autcracy_machinery_logo.png",
    image:
      "https://d3du1kxieyd1np.cloudfront.net/assets/hero_section/trenching-machine-rudra-100xt.jpg",
    telephone: "+91-8790473345",
    priceRange: "$$",
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Plot No.72/A, I.D.A. Phase-1, Lane-3, B N Reddy Nagar, Cherlapalli",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500051",
      addressCountry: "IN",
    },
    areaServed: ["India", "Asia", "Africa", "Global"],
    sameAs: [
      "https://www.facebook.com/people/Autocracy-Machinery/61554797280328/",
      "https://www.linkedin.com/company/autocracy-machinery",
      "https://www.instagram.com/autocracymachinery/",
      "https://x.com/aceautocracy",
      "https://www.youtube.com/@AutocracyMachinery",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8790473345",
      contactType: "sales and customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
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
