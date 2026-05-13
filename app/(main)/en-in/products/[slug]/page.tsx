import ProductClient from "@/app/(main)/products/[slug]/ProductClient";
import ProductQueryCleanup from "@/app/(main)/products/[slug]/ProductQueryCleanup";
import ProductStructuredData from "@/app/(main)/products/[slug]/ProductStructuredData";
import ProductPageLoading from "@/component/molecules/loading/ProductPageLoading";
import { getProductBySlug, getActiveProducts } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  indiaProductDescription,
  indiaProductKeywords,
  indiaProductTitle,
} from "@/utils/indiaSeo";
import { SITE_URL } from "@/utils/locale";

interface IndiaProductPageProps {
  params: Promise<{ slug: string }>;
}

const SITE = SITE_URL;

export async function generateMetadata({
  params,
}: IndiaProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getProductBySlug(slug);

  if (!resolved) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const { productData } = resolved;
  const seoData = productData.seoMetadata;
  const canonical = `${SITE}/en-in/products/${slug}`;
  const title = indiaProductTitle(productData.title);
  const description = indiaProductDescription(
    productData.title,
    undefined,
    seoData?.pageDescription || productData.description
  );

  return {
    title,
    description,
    keywords: indiaProductKeywords(productData.title),
    authors: [{ name: "Autocracy Machinery" }],
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": `${SITE}/products/${slug}`,
      },
    },
    openGraph: {
      url: canonical,
      title,
      description,
      images: [
        {
          url: seoData?.socialImage || productData.thumbnail,
          width: 1200,
          height: 630,
          alt: productData.thumbnailAltText || productData.title,
        },
      ],
      siteName: "Autocracy Machinery India",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seoData?.socialImage || productData.thumbnail],
    },
  };
}

export default async function IndiaProductPage({
  params,
}: IndiaProductPageProps) {
  const { slug } = await params;
  const resolved = await getProductBySlug(slug);

  if (!resolved) notFound();

  const { productData: productObj, productId, industryId } = resolved;
  const [products, industries] = await Promise.all([
    getActiveProducts(),
    getActiveIndustries(),
  ]);
  const pageUrl = `${SITE}/en-in/products/${slug}`;

  return (
    <>
      <ProductQueryCleanup />
      <h1 className="sr-only">{productObj.title} in India</h1>
      <h2 className="sr-only">
        {productObj.seoDescription || productObj.description}
      </h2>
      <ProductStructuredData
        productData={productObj}
        slug={slug}
        pageUrl={pageUrl}
      />
      <Suspense fallback={<ProductPageLoading />}>
        <ProductClient
          productObj={productObj}
          products={products}
          industries={industries}
          industryId={industryId}
          productId={productId}
          modelBasePath={`/en-in/products/${slug}`}
          basePath="/en-in"
          market="india"
        />
      </Suspense>
    </>
  );
}
