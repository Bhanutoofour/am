import { Metadata } from "next";
import HomeContent from "./HomeContent";

export default async function Home() {
  return (
    <HomeContent
      srOnlyHeading="Global Trencher Machines and Utility Equipment Manufacturer"
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
  title: "Trencher Machines & Utility Equipment | Autocracy Machinery",
  description:
    "Explore trenchers, solar EPC equipment, aquatic weed harvesters, attachments, forklifts, and utility machines for field projects.",
  keywords:
    "trencher machine manufacturer, trenching machine, chain trencher, rock wheel trencher, solar EPC equipment, aquatic weed harvester, lake cleaning machine, tractor attachments, utility equipment",
  openGraph: {
    title:
      "Trencher Machines & Utility Equipment | Autocracy Machinery",
    description:
      "Explore trenchers, solar EPC equipment, aquatic cleaning machines, attachments, forklifts, and utility machines for field projects.",
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
      "Trencher Machines & Utility Equipment | Autocracy Machinery",
    description:
      "Trenchers, solar EPC equipment, aquatic weed harvesters, attachments, and utility machines for field projects.",
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
    canonical: "https://www.autocracymachinery.com/",
    languages: {
      "en-IN": "https://www.autocracymachinery.com/en-in",
      "x-default": "https://www.autocracymachinery.com/",
    },
  },
  other: {
    "twitter:site": "@autocracymachinery",
    "twitter:creator": "@autocracymachinery",
  },
};
