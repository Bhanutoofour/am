import { getProductsWithIndustries } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import ProductsClient from "./ProductsClient";
import ProductsListingLoading from "@/component/molecules/loading/ProductsListingLoading";
import { Suspense } from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { indiaCanonical, rootCanonical } from "@/utils/locale";
import { productSlug, titleToSlug } from "@/utils/slug";

type ProductsPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function redirectLegacyProductsQuery(
  searchParams?: ProductsPageProps["searchParams"]
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
    permanentRedirect(product ? `/products/${productSlug(product.title)}` : "/products");
  }

  if (industryId) {
    const industries = await getActiveIndustries();
    const industry = industries.find((item) => String(item.id) === industryId);
    permanentRedirect(
      industry ? `/industries/${titleToSlug(industry.title ?? "")}` : "/products"
    );
  }
}

export const metadata: Metadata = {
  title:
    "Trencher Machines, Attachments & Utility Equipment | Autocracy Machinery",
  description:
    "Explore trencher machines, solar EPC equipment, tractor attachments, forklifts, aquatic weed harvesters, sod machines, and utility machinery from Autocracy Machinery.",
  alternates: {
    canonical: rootCanonical("/products"),
    languages: {
      "en-IN": indiaCanonical("/products"),
      "x-default": rootCanonical("/products"),
    },
  },
};

async function ProductsContent() {
  const [products, industries] = await Promise.all([
    getProductsWithIndustries(),
    getActiveIndustries(),
  ]);

  return <ProductsClient products={products} industries={industries} />;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  await redirectLegacyProductsQuery(searchParams);

  return (
    <Suspense fallback={<ProductsListingLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
