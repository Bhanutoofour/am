import Caraousel from "@/component/sections/caraousel/Caraousel";
import Industries from "@/component/sections/Industries/Industries";
import Products from "@/component/sections/products/Products";
import Recognitions from "@/component/sections/recognitions/Recognitions";
import Testimonials from "@/component/sections/testimonials/Testimonials";
import { getActiveProducts } from "@/actions/productAction";
import { getHeroSections } from "@/actions/heroAction";
import { getActiveIndustries } from "@/actions/industryAction";
import {
  AwardsData,
  BuildForIndiaContent,
  CertificateData,
  MediaData,
} from "@/data/recognitionsData";
import { testimonials, clients } from "@/data/customerTestimonials";
import Media from "@/component/sections/media/Media";
import ContentBuild from "@/component/sections/contentBuild/ContentBuild";
import { Metadata } from "next";
import HomeStructuredData from "./HomeStructuredData";
import Certificates from "@/component/sections/certificate/Certificates";

export default async function Home() {
  const products = await getActiveProducts();
  const heroData = await getHeroSections();
  const industries = await getActiveIndustries();
  const headingText =
    "Built for India – Leading Heavy Machinery and Trencher Manufacturer";

  return (
    <>
      <h1 className="sr-only">{headingText}</h1>
      <HomeStructuredData />
      <Caraousel heroData={heroData} />
      <Industries industries={industries} />
      <Products products={products} />
      <ContentBuild data={BuildForIndiaContent} />
      <Recognitions data={AwardsData} title="Awards" />
      <Certificates data={CertificateData} />
      <Media data={MediaData} />
      <Testimonials testimonials={testimonials} clients={clients} />
    </>
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
  },
  other: {
    "twitter:site": "@autocracymachinery",
    "twitter:creator": "@autocracymachinery",
  },
};
