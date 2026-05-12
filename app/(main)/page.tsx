import { Metadata } from "next";
import HomeContent from "./HomeContent";

export default async function Home() {
  return (
    <HomeContent
      contentBuildTitle={
        <>
          Engineered for Global Industries. <br /> Built for Performance.
        </>
      }
    />
  );
}

// Default SEO metadata for home page
export const metadata: Metadata = {
  title:
    "Infrastructure & Environmental Machines Manufacturer India - Autocracy Machinery",
  description:
    "Autocracy Machinery is India's global manufacturer of infrastructure & environmental machines like trenchers, lake cleaners, material handling for various industries.",
  keywords:
    "industrial machinery, construction equipment, agricultural equipment, landscaping equipment, autocracy machinery, trenching machines, excavators, bulldozers",
  openGraph: {
    title:
      "Trencher Machines Manufacturer & Supplier India | Autocracy Machinery",
    description:
      "Autocracy Machinery is India's global manufacturer of equipment and attachments, trenchers, padding, pole stacking, forklift, lake cleaner, sod harvester, sprigger and infielder.",
    images: [
      {
        url: "https://d3du1kxieyd1np.cloudfront.net/assets/hero_section/trenching-machine-rudra-100xt.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Equipment - Autocracy Machinery",
      },
    ],
    siteName: "Autocracy Machinery - Industrial Equipment ",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Trencher Machines Manufacturer & Supplier India | Autocracy Machinery",
    description:
      "Leading manufacturer of industrial machinery and equipment. Specializing in construction, agriculture, and landscaping solutions.",
    images: [
      "https://d3du1kxieyd1np.cloudfront.net/assets/autcracy_machinery_logo.png",
    ],
    site: "@autocracymachinery",
    creator: "@autocracymachinery",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Autocracy Machinery" }],
  alternates: {
    canonical: "https://autocracymachinery.com/",
    languages: {
      "en-IN": "https://autocracymachinery.com/en-in",
      "x-default": "https://autocracymachinery.com/",
    },
  },
  other: {
    "twitter:site": "@autocracymachinery",
    "twitter:creator": "@autocracymachinery",
  },
};
