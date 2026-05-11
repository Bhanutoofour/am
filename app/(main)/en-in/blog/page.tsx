import { Metadata } from "next";
import { Suspense } from "react";
import BlogsClient from "@/app/(main)/blog/BlogsClient";
import BlogsLoading from "@/app/(main)/blog/BlogsLoading";
import { getActiveBlogs } from "@/actions/blogAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import { getActiveModels } from "@/actions/modelAction";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Autocracy Machinery India Blog",
  description:
    "Read Autocracy Machinery India updates, machinery articles, equipment techniques, and infrastructure industry insights.",
  alternates: {
    canonical: indiaCanonical("/blog"),
    languages: {
      "en-IN": indiaCanonical("/blog"),
      "x-default": rootCanonical("/blog"),
    },
  },
};

async function BlogsContent() {
  const [blogs, industriesData, productsData, modelsData] = await Promise.all([
    getActiveBlogs(),
    getActiveIndustries(),
    getActiveProducts(),
    getActiveModels(),
  ]);

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

export default function IndiaBlogsPage() {
  return (
    <Suspense fallback={<BlogsLoading />}>
      <BlogsContent />
    </Suspense>
  );
}
