import { getIndustryBySlug, getActiveIndustries } from "@/actions/industryAction";
import { getProductById, getActiveProducts } from "@/actions/productAction";
import { titleToSlug } from "@/utils/slug";
import ProductClient from "@/app/(main)/products/[slug]/ProductClient";
import ProductStructuredData from "@/app/(main)/products/[slug]/ProductStructuredData";
import ProductPageLoading from "@/component/molecules/loading/ProductPageLoading";
import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IndiaIndustryProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

const SITE = "https://autocracymachinery.com";

export async function generateMetadata({
  params,
}: IndiaIndustryProductPageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const industryResolved = await getIndustryBySlug(slug);
  if (!industryResolved) return { title: "Product Not Found" };

  const { industryData, industryId } = industryResolved;
  const matchedProduct = industryData.products.find(
    (p) => titleToSlug(p.title ?? "") === productSlug
  );
  if (!matchedProduct) return { title: "Product Not Found" };

  const productData = await getProductById(matchedProduct.id, industryId);
  if (!productData) return { title: "Product Not Found" };

  const seoData = productData.seoMetadata;
  const canonical = `${SITE}/en-in/industries/${slug}/${productSlug}`;
  const title =
    seoData?.pageTitle ||
    `${productData.title} for ${industryData.title} in India | Autocracy`;
  const description =
    seoData?.pageDescription ||
    `${productData.description} Built for Indian ${industryData.title} applications.`;

  return {
    title,
    description,
    keywords:
      seoData?.pageKeywords ||
      `${productData.title} India, ${industryData.title} machinery India`,
    authors: [{ name: "Autocracy Machinery" }],
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": `${SITE}/industries/${slug}/${productSlug}`,
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

export default async function IndiaIndustryProductPage({
  params,
}: IndiaIndustryProductPageProps) {
  const { slug, productSlug } = await params;
  const industryResolved = await getIndustryBySlug(slug);
  if (!industryResolved) notFound();

  const { industryData, industryId } = industryResolved;
  const matchedProduct = industryData.products.find(
    (p) => titleToSlug(p.title ?? "") === productSlug
  );
  if (!matchedProduct) notFound();

  const [productData, products, industries] = await Promise.all([
    getProductById(matchedProduct.id, industryId),
    getActiveProducts(),
    getActiveIndustries(),
  ]);
  if (!productData) notFound();

  const pageUrl = `${SITE}/en-in/industries/${slug}/${productSlug}`;

  return (
    <>
      <h1 className="sr-only">{productData.title} in India</h1>
      <h2 className="sr-only">
        {productData.seoDescription || productData.description}
      </h2>
      <ProductStructuredData
        productData={productData}
        slug={`en-in/industries/${slug}/${productSlug}`}
        pageUrl={pageUrl}
      />
      <Suspense fallback={<ProductPageLoading />}>
        <ProductClient
          productObj={productData}
          products={products}
          industries={industries}
          industryId={industryId}
          productId={matchedProduct.id}
          modelBasePath={`/en-in/industries/${slug}/${productSlug}`}
          basePath="/en-in"
          pageVariant="industry"
        />
      </Suspense>
    </>
  );
}
