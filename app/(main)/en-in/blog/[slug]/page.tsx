import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlogClient from "@/app/(main)/blog/[slug]/BlogClient";
import Loading from "@/app/(main)/blog/[slug]/loading";
import { getBlogBySlug, getRelatedBlogs } from "@/actions/blogAction";
import { indiaCanonical, rootCanonical, SITE_URL } from "@/utils/locale";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found - Autocracy Machinery India",
      description: "The requested blog could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const seo = blog.seoMetadata ?? undefined;
  const title = seo?.pageTitle ?? `${blog.title} | Autocracy Machinery India`;
  const description = seo?.pageDescription ?? blog.description;
  const ogTitle = seo?.socialTitle ?? blog.title;
  const ogDesc = seo?.socialDescription ?? blog.description;
  const imageUrl = seo?.socialImage ?? blog.banner;
  const canonicalUrl = indiaCanonical(`/blog/${slug}`);

  const publishedTime =
    blog.createdAt instanceof Date
      ? blog.createdAt.toISOString()
      : blog.createdAt
        ? new Date(blog.createdAt as string).toISOString()
        : undefined;
  const modifiedTime =
    blog.updatedAt instanceof Date
      ? blog.updatedAt.toISOString()
      : blog.updatedAt
        ? new Date(blog.updatedAt as string).toISOString()
        : undefined;

  return {
    title,
    description,
    keywords:
      seo?.pageKeywords ??
      `${blog.title}, autocracy machinery india, construction equipment, blog`,
    authors: [{ name: "Autocracy Machinery", url: SITE_URL }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
        "x-default": rootCanonical(`/blog/${slug}`),
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonicalUrl,
      siteName: "Autocracy Machinery India",
      locale: "en_IN",
      type: "article",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: blog.bannerAltText || blog.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      ...(imageUrl && { images: [imageUrl] }),
      site: "@autocracymachinery",
      creator: "@autocracymachinery",
    },
  };
}

async function BlogContent({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(
    blog.id,
    blog.industryIds,
    blog.productIds,
    blog.modelIds,
    3
  );

  return <BlogClient blog={blog} relatedBlogs={relatedBlogs} />;
}

export default function IndiaBlogPage(props: BlogPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <BlogContent {...props} />
    </Suspense>
  );
}
