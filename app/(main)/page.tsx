import { Metadata } from "next";
import HomeContent from "./HomeContent";

export default async function Home() {
  return (
    <HomeContent
      contentBuildTitle={
        <>
          Trencher Machines for Global Projects. <br /> Built for Performance.
        </>
      }
    />
  );
}

// Default SEO metadata for home page
export const metadata: Metadata = {
  title:
    "Trencher Machine Manufacturer & Utility Equipment | Autocracy Machinery",
  description:
    "Autocracy Machinery manufactures trencher machines, solar EPC equipment, aquatic weed harvesters, lake cleaning machines, tractor attachments, forklifts, and utility machinery for global infrastructure projects.",
  keywords:
    "trencher machine manufacturer, trenching machine, chain trencher, rock wheel trencher, solar EPC equipment, aquatic weed harvester, lake cleaning machine, tractor attachments, utility equipment",
  openGraph: {
    title:
      "Trencher Machine Manufacturer & Utility Equipment | Autocracy Machinery",
    description:
      "Explore Autocracy Machinery trenchers, attachments, solar EPC equipment, aquatic cleaning machines, forklifts, and utility equipment for infrastructure, agriculture, water, and construction work.",
    images: [
      {
        url: "https://d3du1kxieyd1np.cloudfront.net/assets/hero_section/trenching-machine-rudra-100xt.jpg",
        width: 1200,
        height: 630,
        alt: "Autocracy Machinery trencher machine and utility equipment",
      },
    ],
    siteName: "Autocracy Machinery",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Trencher Machine Manufacturer & Utility Equipment | Autocracy Machinery",
    description:
      "Manufacturer of trenchers, solar EPC equipment, aquatic weed harvesters, tractor attachments, and utility machines for field projects.",
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
