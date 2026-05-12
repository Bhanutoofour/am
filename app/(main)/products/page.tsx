import { getProductsWithIndustries } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import ProductsClient from "./ProductsClient";
import ProductsListingLoading from "@/component/molecules/loading/ProductsListingLoading";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Trencher Machines, Attachments & Utility Equipment | Autocracy Machinery",
  description:
    "Explore trencher machines, solar EPC equipment, tractor attachments, forklifts, aquatic weed harvesters, sod machines, and utility machinery from Autocracy Machinery.",
};

async function ProductsContent() {
  const [products, industries] = await Promise.all([
    getProductsWithIndustries(),
    getActiveIndustries(),
  ]);

  return <ProductsClient products={products} industries={industries} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsListingLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
