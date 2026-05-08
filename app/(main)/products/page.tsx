import { getProductsWithIndustries } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import ProductsClient from "./ProductsClient";
import ProductsListingLoading from "@/component/molecules/loading/ProductsListingLoading";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Autocracy Machinery – Heavy-Duty Industrial & Infrastructure Machines",
  description:
    "Autocracy Machinery offers heavy-duty industrial, infrastructure, and environmental machines, including trenchers, dredgers, forklifts, and aquatic weed harvesters.",
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
