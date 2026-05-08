import IndustryPageLoading from "@/component/molecules/loading/IndustryPageLoading";

/**
 * First paint into `/industries/*` before a deeper `loading.tsx` applies.
 * Industry / product / model use `[slug]/`, `[slug]/[productSlug]/`, `[slug]/[productSlug]/[modelSlug]/loading.tsx`.
 */
export default function IndustriesLoading() {
  return <IndustryPageLoading />;
}
