import { getProductsWithIndustries } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import ProductsClient from "@/app/(main)/products/ProductsClient";
import ProductsListingLoading from "@/component/molecules/loading/ProductsListingLoading";
import { Suspense } from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { productSlug, titleToSlug } from "@/utils/slug";

type IndiaProductsPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function redirectLegacyIndiaProductsQuery(
  searchParams?: IndiaProductsPageProps["searchParams"]
) {
  const query: { [key: string]: string | string[] | undefined } = searchParams
    ? await searchParams
    : {};
  const productId = getSingleQueryValue(query.productId);
  const industryId = getSingleQueryValue(query.industryId);

  if (!productId && !industryId) return;

  if (productId) {
    const products = await getProductsWithIndustries();
    const product = products.find((item) => String(item.id) === productId);
    permanentRedirect(
      product ? `/en-in/products/${productSlug(product.title)}` : "/en-in/products"
    );
  }

  if (industryId) {
    const industries = await getActiveIndustries();
    const industry = industries.find((item) => String(item.id) === industryId);
    permanentRedirect(
      industry
        ? `/en-in/industries/${titleToSlug(industry.title ?? "")}`
        : "/en-in/products"
    );
  }
}

export const metadata: Metadata = {
  title: "Trencher Machines & Utility Equipment in India | Autocracy Machinery",
  description:
    "Explore Autocracy Machinery products in India, including chain trenchers, rock wheel trenchers, solar EPC equipment, aquatic weed harvesters, forklifts, attachments, and infrastructure equipment.",
  alternates: {
    canonical: "https://www.autocracymachinery.com/en-in/products",
    languages: {
      "en-IN": "https://www.autocracymachinery.com/en-in/products",
      "x-default": "https://www.autocracymachinery.com/products",
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
      pageTitle="Trenchers and Utility Machines for India"
      pageSubtitle="Autocracy Machinery builds rugged trencher machines, solar EPC equipment, water body cleaning machines, forklifts, tractor attachments, and infrastructure equipment for Indian agriculture, telecom, water management, construction, solar, and defence projects. Our machines are engineered for Indian soil conditions, field uptime, and reliable after-sales support across demanding worksites."
    />
  );
}

export default async function IndiaProductsPage({
  searchParams,
}: IndiaProductsPageProps) {
  await redirectLegacyIndiaProductsQuery(searchParams);

  return (
    <Suspense fallback={<ProductsListingLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
