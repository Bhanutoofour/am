import { getProductsWithIndustries } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import ProductsClient from "@/app/(main)/products/ProductsClient";
import ProductsListingLoading from "@/component/molecules/loading/ProductsListingLoading";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial & Infrastructure Machines in India | Autocracy Machinery",
  description:
    "Explore Autocracy Machinery products for India, including trenchers, aquatic weed harvesters, forklifts, attachments, and infrastructure equipment built for Indian worksites.",
  alternates: {
    canonical: "https://autocracymachinery.com/en-in/products",
    languages: {
      "en-IN": "https://autocracymachinery.com/en-in/products",
      "x-default": "https://autocracymachinery.com/products",
    },
  },
};

async function ProductsContent() {
  const [products, industries] = await Promise.all([
    getProductsWithIndustries(),
    getActiveIndustries(),
  ]);

  return (
    <ProductsClient
      products={products}
      industries={industries}
      basePath="/en-in"
      pageTitle="Products for India"
      pageSubtitle="Autocracy Machinery builds rugged trenchers, environmental machines, forklifts, attachments, and infrastructure equipment for Indian agriculture, telecom, water management, construction, solar, and defence projects. Our machines are engineered for Indian soil conditions, field uptime, and reliable after-sales support across demanding worksites."
    />
  );
}

export default function IndiaProductsPage() {
  return (
    <Suspense fallback={<ProductsListingLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
