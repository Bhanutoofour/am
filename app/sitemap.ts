import { MetadataRoute } from "next";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import { getActiveModels } from "@/actions/modelAction";
import { getActiveBlogs } from "@/actions/blogAction";
import { titleToSlug, modelNumberSlug } from "@/utils/slug";
import { SITE_URL } from "@/utils/locale";

const CONTENT_DATE = new Date("2025-01-01");

function sitemapDate(value?: Date | string | null) {
  if (!value) return CONTENT_DATE;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? CONTENT_DATE : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  try {
    // Get all active industries, products, and models
    const industries = await getActiveIndustries();
    const products = await getActiveProducts();
    const models = await getActiveModels();
    const activeBlogs = await getActiveBlogs();
    // Static pages — real dates, not build time
    const staticPages = [
      { url: baseUrl,                                        lastModified: new Date("2025-01-01"), changeFrequency: "daily"   as const, priority: 1.0 },
      { url: `${baseUrl}/products`,                         lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/about-us`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/contact-us`,                       lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/find-a-dealer`,                    lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/hire-rental-industry-equipment`,   lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/videos`,                           lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/blog`,                             lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/media`,                            lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/careers`,                          lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/brochure`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/faqs`,                             lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${baseUrl}/sitemap`,                          lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${baseUrl}/privacy-policy`,                   lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/terms-and-conditions`,             lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
    ];

    const staticIndiaPages = [
      { url: `${baseUrl}/en-in`,                              lastModified: new Date("2025-01-01"), changeFrequency: "daily"   as const, priority: 1.0 },
      { url: `${baseUrl}/en-in/products`,                     lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/en-in/industries`,                   lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/en-in/about-us`,                     lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/contact-us`,                   lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/en-in/find-a-dealer`,                lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/hire-rental-industry-equipment`, lastModified: new Date("2025-01-01"), changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/videos`,                       lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/blog`,                         lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/media`,                        lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/en-in/careers`,                      lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/brochure`,                     lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/faqs`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${baseUrl}/en-in/sitemap`,                      lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${baseUrl}/en-in/privacy-policy`,               lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/en-in/terms-and-conditions`,         lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
    ];

    // Industry pages
    const industryPages = industries.map((industry) => ({
      url: `${baseUrl}/industries/${titleToSlug(industry.title ?? "")}`,
      lastModified: sitemapDate(industry.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const indiaIndustryPages = industries.map((industry) => ({
      url: `${baseUrl}/en-in/industries/${titleToSlug(industry.title ?? "")}`,
      lastModified: sitemapDate(industry.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Product category pages (direct /products/[slug])
    const productCategoryPages = products.map((product) => ({
      url: `${baseUrl}/products/${titleToSlug(product.title ?? "")}`,
      lastModified: sitemapDate(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const indiaProductCategoryPages = products.map((product) => ({
      url: `${baseUrl}/en-in/products/${titleToSlug(product.title ?? "")}`,
      lastModified: sitemapDate(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Model pages — canonical nested URLs (same as app routes + metadata canonicals)
    const productNestedModelPages = models
      .map((model) => {
        const productSeg = titleToSlug(model.productName ?? "");
        const modelSeg = modelNumberSlug(model.modelNumber ?? "");
        if (!productSeg || !modelSeg) return null;
        return {
          url: `${baseUrl}/products/${productSeg}/${modelSeg}`,
          lastModified: sitemapDate(model.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> => entry !== null
      );

    const indiaProductNestedModelPages = models
      .map((model) => {
        const productSeg = titleToSlug(model.productName ?? "");
        const modelSeg = modelNumberSlug(model.modelNumber ?? "");
        if (!productSeg || !modelSeg) return null;
        return {
          url: `${baseUrl}/en-in/products/${productSeg}/${modelSeg}`,
          lastModified: sitemapDate(model.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> => entry !== null
      );

    const blogPages = activeBlogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: sitemapDate(blog.updatedAt ?? blog.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const indiaBlogPages = activeBlogs.map((blog) => ({
      url: `${baseUrl}/en-in/blog/${blog.slug}`,
      lastModified: sitemapDate(blog.updatedAt ?? blog.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [
      ...staticPages,
      ...staticIndiaPages,
      ...blogPages,
      ...indiaBlogPages,
      ...industryPages,
      ...indiaIndustryPages,
      ...productCategoryPages,
      ...indiaProductCategoryPages,
      ...productNestedModelPages,
      ...indiaProductNestedModelPages,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap — static pages only, same real dates
    return [
      { url: baseUrl,                                        lastModified: new Date("2025-01-01"), changeFrequency: "daily"   as const, priority: 1.0 },
      { url: `${baseUrl}/products`,                         lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/about-us`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/contact-us`,                       lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/find-a-dealer`,                    lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/hire-rental-industry-equipment`,   lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/videos`,                           lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/blog`,                             lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/media`,                            lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/careers`,                          lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/brochure`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/faqs`,                             lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${baseUrl}/sitemap`,                          lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${baseUrl}/privacy-policy`,                   lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/terms-and-conditions`,             lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/en-in`,                            lastModified: new Date("2025-01-01"), changeFrequency: "daily"   as const, priority: 1.0 },
      { url: `${baseUrl}/en-in/products`,                   lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/en-in/industries`,                 lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/en-in/about-us`,                   lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/contact-us`,                 lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/en-in/find-a-dealer`,              lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/hire-rental-industry-equipment`, lastModified: new Date("2025-01-01"), changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/videos`,                     lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/blog`,                       lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/media`,                      lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/en-in/careers`,                    lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/brochure`,                   lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/en-in/faqs`,                       lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${baseUrl}/en-in/sitemap`,                    lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${baseUrl}/en-in/privacy-policy`,             lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/en-in/terms-and-conditions`,       lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
    ];
  }
}
