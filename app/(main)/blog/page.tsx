import { Metadata } from "next";
import { Suspense } from "react";
import BlogsClient from "./BlogsClient";
import { getActiveBlogs } from "@/actions/blogAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import { getActiveModels } from "@/actions/modelAction";

type ActiveIndustry = {
  id: number;
  title: string;
};

type ActiveProduct = {
  id: number;
  title: string;
};

type ActiveModel = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  productName: string;
};
import BlogsLoading from "./BlogsLoading";

export const metadata: Metadata = {
  title: "Autocracy Machinery Blog – Latest Updates, Articles, Trends & Insights",
  description:
    "Autocracy Machinery global equipment suppliers provide industrial attachments techniques, articles, updates, and trends for the latest industry insights.",
  keywords: [
    "Industrial attachments Articles",
    "Global equipment suppliers",
    "Industry insights",
    "Machinery updates",
    "Machinery trends",
    "Industrial techniques",
    "Manufacturing updates",
    "Equipment techniques",
    "Equipment trends",
    "Latest industry articles",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: { canonical: "https://www.autocracymachinery.com/blog" },
  openGraph: {
    title: "Blog – Autocracy Machinery",
    description:
      "Autocracy Machinery global equipment suppliers provide industrial attachments techniques, articles, updates, and trends for the latest industry insights.",
    url: "https://www.autocracymachinery.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – Autocracy Machinery",
    description:
      "Autocracy Machinery global equipment suppliers provide industrial attachments techniques, articles, updates, and trends for the latest industry insights.",
  },
};

// Force dynamic rendering to ensure fresh data from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function BlogsContent() {
  const [blogs, industriesData, productsData, modelsData] = await Promise.all([
    getActiveBlogs(),
    getActiveIndustries(),
    getActiveProducts(),
    getActiveModels(),
  ]);

  // Map to the format expected by BlogsClient
  const industries: ActiveIndustry[] = industriesData.map((ind) => ({
    id: ind.id,
    title: ind.title,
  }));

  const products: ActiveProduct[] = productsData.map((prod) => ({
    id: prod.id,
    title: prod.title,
  }));

  const models: ActiveModel[] = modelsData;

  return (
    <BlogsClient
      blogs={blogs}
      industries={industries}
      products={products}
      models={models}
    />
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogsLoading />}>
      <BlogsContent />
    </Suspense>
  );
}
