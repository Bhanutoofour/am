import ProductsListingLoading from "@/component/molecules/loading/ProductsListingLoading";

/** `/products` index only — deeper routes use `[slug]/loading.tsx` and `[slug]/[modelSlug]/loading.tsx`. */
export default function Loading() {
  return <ProductsListingLoading />;
}
