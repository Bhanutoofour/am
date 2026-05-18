import ProductClient from "./ProductClient";
import ProductQueryCleanup from "./ProductQueryCleanup";
import { getProductBySlug, getActiveProducts } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { titleToSlug } from "@/utils/slug";
import { Metadata } from "next";
import ProductStructuredData from "./ProductStructuredData";
import { Suspense } from "react";
import ProductPageLoading from "@/component/molecules/loading/ProductPageLoading";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/utils/locale";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const SITE = SITE_URL;

/** Canonical for product listings: always the primary `/products/{product}` URL. */
function productListingCanonical(
  slug: string,
  resolved: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>
): string {
  const productSegment = titleToSlug(resolved.productData.title ?? "");
  return `${SITE}/products/${productSegment || slug}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getProductBySlug(slug);

  if (!resolved) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const { productData: productObj } = resolved;
  const seoData = productObj.seoMetadata;
  const canonical = productListingCanonical(slug, resolved);

  return {
    title: seoData?.pageTitle || `${productObj.title} - Autocracy Machinery`,
    description: seoData?.pageDescription || productObj.description,
    keywords:
      seoData?.pageKeywords ||
      `${productObj.title}, construction equipment, machinery`,
    authors: [{ name: "Autocracy Machinery" }],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title:
        seoData?.socialTitle ||
        seoData?.pageTitle ||
        `${productObj.title} - Autocracy Machinery`,
      description:
        seoData?.socialDescription ||
        seoData?.pageDescription ||
        productObj.description,
      images: [
        {
          url: seoData?.socialImage || productObj.thumbnail,
          width: 1200,
          height: 630,
          alt: productObj.thumbnailAltText || productObj.title,
        },
      ],
      siteName: "Autocracy Machinery",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title:
        seoData?.socialTitle ||
        seoData?.pageTitle ||
        `${productObj.title} - Autocracy Machinery`,
      description:
        seoData?.socialDescription ||
        seoData?.pageDescription ||
        productObj.description,
      images: [seoData?.socialImage || productObj.thumbnail],
    },
    other: {
      "og:image:alt": productObj.thumbnailAltText || productObj.title,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const resolved = await getProductBySlug(slug);

  if (!resolved) notFound();

  const { productData: productObj, productId, industryId } = resolved;
  const [products, industries] = await Promise.all([
    getActiveProducts(),
    getActiveIndustries(),
  ]);

  const canonicalPageUrl = productListingCanonical(slug, resolved);

  return (
    <>
      <ProductQueryCleanup />
      <h1 className="sr-only">{productObj.title}</h1>
      <h2 className="sr-only">
        {productObj.seoDescription || productObj.description}
      </h2>
      <ProductStructuredData
        productData={productObj}
        slug={slug}
        pageUrl={canonicalPageUrl}
      />
      <Suspense fallback={<ProductPageLoading />}>
        <ProductClient
          productObj={productObj}
          products={products}
          industries={industries}
          industryId={industryId}
          productId={productId}
          modelBasePath={`/products/${slug}`}
        />
      </Suspense>
    </>
  );
}
