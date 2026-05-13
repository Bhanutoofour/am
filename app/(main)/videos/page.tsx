import { Metadata } from "next";
import { Suspense } from "react";
import VideosClient from "./VideosClient";
import { getActiveVideos } from "@/actions/videoAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import { getActiveModels } from "@/actions/modelAction";
import VideosLoading from "./VideosLoading";

export const metadata: Metadata = {
  title: "Watch Our Machines in Action – Proven Performance Across Industries",
  description:
    "Watch Autocracy Machinery in real-world operations delivering proven performance. Our machines ensure efficiency, durability, and reliable results across utilities, agriculture, and infrastructure projects.",
  alternates: { canonical: "https://www.autocracymachinery.com/videos" },
  openGraph: {
    title: "Videos – Autocracy Machinery",
    description:
      "Watch Autocracy Machinery in real-world operations delivering proven performance across utilities, agriculture, and infrastructure projects.",
    url: "https://www.autocracymachinery.com/videos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videos – Autocracy Machinery",
    description:
      "Watch Autocracy Machinery in real-world operations delivering proven performance across utilities, agriculture, and infrastructure projects.",
  },
};

// Force dynamic rendering to ensure fresh data from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function VideosContent() {
  const [videos, industries, products, models] = await Promise.all([
    getActiveVideos(),
    getActiveIndustries(),
    getActiveProducts(),
    getActiveModels(),
  ]);

  return (
    <VideosClient
      videos={videos}
      industries={industries}
      products={products}
      models={models}
    />
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<VideosLoading />}>
      <VideosContent />
    </Suspense>
  );
}

