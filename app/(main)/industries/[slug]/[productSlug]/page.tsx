import { getIndustryBySlug } from "@/actions/industryAction";
import { getProductById, getActiveProducts } from "@/actions/productAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { titleToSlug } from "@/utils/slug";
import ProductClient from "@/app/(main)/products/[slug]/ProductClient";
import ProductStructuredData from "@/app/(main)/products/[slug]/ProductStructuredData";
import ProductPageLoading from "@/component/molecules/loading/ProductPageLoading";
import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IndustryProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

export async function generateMetadata({
  params,
}: IndustryProductPageProps): Promise<Metadata> {
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

  return {
    title: seoData?.pageTitle || `${productData.title} - Autocracy Machinery`,
    description: seoData?.pageDescription || productData.description,
    keywords:
      seoData?.pageKeywords ||
      `${productData.title}, construction equipment, machinery`,
    authors: [{ name: "Autocracy Machinery" }],
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://autocracymachinery.com/industries/${slug}/${productSlug}`,
    },
    openGraph: {
      title:
        seoData?.socialTitle ||
        seoData?.pageTitle ||
        `${productData.title} - Autocracy Machinery`,
      description:
        seoData?.socialDescription ||
        seoData?.pageDescription ||
        productData.description,
      images: [
        {
          url: seoData?.socialImage || productData.thumbnail,
          width: 1200,
          height: 630,
          alt: productData.thumbnailAltText || productData.title,
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
        `${productData.title} - Autocracy Machinery`,
      description:
        seoData?.socialDescription ||
        seoData?.pageDescription ||
        productData.description,
      images: [seoData?.socialImage || productData.thumbnail],
    },
    other: {
      "og:image:alt": productData.thumbnailAltText || productData.title,
    },
  };
}

export default async function IndustryProductPage({
  params,
}: IndustryProductPageProps) {
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

  return (
    <>
      <h1 className="sr-only">{productData.title}</h1>
      <h2 className="sr-only">
        {productData.seoDescription || productData.description}
      </h2>
      <ProductStructuredData
        productData={productData}
        slug={`${slug}/${productSlug}`}
        pageUrl={`https://autocracymachinery.com/industries/${slug}/${productSlug}`}
      />
      <Suspense fallback={<ProductPageLoading />}>
        <ProductClient
          productObj={productData}
          products={products}
          industries={industries}
          industryId={industryId}
          productId={matchedProduct.id}
          modelBasePath={`/industries/${slug}/${productSlug}`}
          pageVariant="industry"
        />
      </Suspense>
    </>
  );
}
