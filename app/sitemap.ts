import { MetadataRoute } from "next";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import {
  getActiveModels,
  getIndustryNestedModelSitemapRows,
} from "@/actions/modelAction";
import { getActiveBlogs } from "@/actions/blogAction";
import { titleToSlug, modelNumberSlug } from "@/utils/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://autocracymachinery.com";

  try {
    // Get all active industries, products, and models
    const industries = await getActiveIndustries();
    const products = await getActiveProducts();
    const models = await getActiveModels();
    const industryNestedModels = await getIndustryNestedModelSitemapRows();
    const blogs = await getActiveBlogs();

    // Static pages — real dates, not build time
    const staticPages = [
      { url: baseUrl,                                        lastModified: new Date("2025-01-01"), changeFrequency: "daily"   as const, priority: 1.0 },
      { url: `${baseUrl}/products`,                         lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/blog`,                             lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/about-us`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/contact-us`,                       lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/find-a-dealer`,                    lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/hire-rental-industry-equipment`,   lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/videos`,                           lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/careers`,                          lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/brochure`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/faqs`,                             lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${baseUrl}/sitemap.html`,                     lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${baseUrl}/privacy-policy`,                   lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/terms-and-conditions`,             lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
    ];

    const CONTENT_DATE = new Date("2025-01-01");

    // Industry pages
    const industryPages = industries.map((industry) => ({
      url: `${baseUrl}/industries/${titleToSlug(industry.title ?? "")}`,
      lastModified: CONTENT_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Product category pages (direct /products/[slug])
    const productCategoryPages = products.map((product) => ({
      url: `${baseUrl}/products/${titleToSlug(product.title ?? "")}`,
      lastModified: CONTENT_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Industry-specific product pages (/industries/[slug]/[productSlug])
    const industryProductPages = industries.flatMap((industry) =>
      industry.products.map((product) => ({
        url: `${baseUrl}/industries/${titleToSlug(industry.title ?? "")}/${titleToSlug(product.title ?? "")}`,
        lastModified: CONTENT_DATE,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );

    // Model pages — canonical nested URLs (same as app routes + metadata canonicals)
    const productNestedModelPages = models
      .map((model) => {
        const productSeg = titleToSlug(model.productName ?? "");
        const modelSeg = modelNumberSlug(model.modelNumber ?? "");
        if (!productSeg || !modelSeg) return null;
        return {
          url: `${baseUrl}/products/${productSeg}/${modelSeg}`,
          lastModified: CONTENT_DATE,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> => entry !== null
      );

    const industryNestedModelPages = industryNestedModels
      .map((row) => {
        const ind = titleToSlug(row.industryTitle);
        const prod = titleToSlug(row.productTitle);
        const modelSeg = modelNumberSlug(row.modelNumber);
        if (!ind || !prod || !modelSeg) return null;
        return {
          url: `${baseUrl}/industries/${ind}/${prod}/${modelSeg}`,
          lastModified: CONTENT_DATE,
          changeFrequency: "weekly" as const,
          priority: 0.75,
        };
      })
      .filter(
        (entry): entry is NonNullable<typeof entry> => entry !== null
      );

    // Blog pages
    const blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...industryPages,
      ...productCategoryPages,
      ...industryProductPages,
      ...productNestedModelPages,
      ...industryNestedModelPages,
      ...blogPages,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap — static pages only, same real dates
    return [
      { url: baseUrl,                                        lastModified: new Date("2025-01-01"), changeFrequency: "daily"   as const, priority: 1.0 },
      { url: `${baseUrl}/products`,                         lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.9 },
      { url: `${baseUrl}/blog`,                             lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/about-us`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/contact-us`,                       lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${baseUrl}/find-a-dealer`,                    lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/hire-rental-industry-equipment`,   lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/videos`,                           lastModified: new Date("2025-01-01"), changeFrequency: "weekly"  as const, priority: 0.8 },
      { url: `${baseUrl}/careers`,                          lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/brochure`,                         lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${baseUrl}/faqs`,                             lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${baseUrl}/sitemap.html`,                     lastModified: new Date("2025-01-01"), changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${baseUrl}/privacy-policy`,                   lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
      { url: `${baseUrl}/terms-and-conditions`,             lastModified: new Date("2024-01-01"), changeFrequency: "yearly"  as const, priority: 0.3 },
    ];
  }
}
