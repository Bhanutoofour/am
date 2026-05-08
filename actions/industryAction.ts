"use server";

import db from "@/db/drizzle";
import { industries, productIndustries, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { titleToSlug } from "@/utils/slug";

export const getActiveIndustries = async (): Promise<ActiveIndustry[]> => {
  try {
    const result = await db
      .select({
        id: industries.id,
        title: industries.title,
        active: industries.active,
        thumbnail: industries.thumbnail,
        thumbnailAltText: industries.thumbnailAltText,
        products: {
          id: products.id,
          title: products.title,
          thumbnail: products.thumbnail,
          thumbnailAltText: products.thumbnailAltText,
        },
      })
      .from(industries)
      .leftJoin(
        productIndustries,
        eq(industries.id, productIndustries.industryId)
      )
      .leftJoin(
        products,
        and(
          eq(productIndustries.productId, products.id),
          eq(products.active, true)
        )
      )
      .where(eq(industries.active, true))
      .orderBy(industries.id, products.id);

    // Use Map for more efficient grouping - SAME OUTPUT, BETTER PERFORMANCE
    const industryMap = new Map<number, ActiveIndustry>();

    for (const row of result) {
      if (!industryMap.has(row.id)) {
        industryMap.set(row.id, {
          id: row.id,
          title: row.title,
          active: row.active ?? true, // Ensure boolean type
          thumbnail: row.thumbnail,
          thumbnailAltText: row.thumbnailAltText,
          products: [],
        });
      }

      const industry = industryMap.get(row.id)!;
      if (row.products && row.products.id) {
        // Check if product already exists to avoid duplicates
        const productExists = industry.products.some(
          (p) => p.id === row.products!.id
        );
        if (!productExists) {
          industry.products.push(row.products);
        }
      }
    }

    const groupedIndustries = Array.from(industryMap.values());

    return groupedIndustries;
  } catch (error) {
    console.error("Error fetching active industries:", error);
    return [];
  }
};

// Revalidate the home page when industry data changes
export const revalidateIndustryData = async () => {
  revalidatePath("/");
};

/**
 * Resolve industry by URL slug only (no query params).
 * Does a lightweight id+title lookup, then fetches full data for the match only.
 */
export const getIndustryBySlug = async (
  slug: string
): Promise<{ industryData: IndustryDataType; industryId: number } | null> => {
  try {
    const rows = await db
      .select({ id: industries.id, title: industries.title })
      .from(industries)
      .where(eq(industries.active, true));

    const matched = rows.find((row) => titleToSlug(row.title ?? "") === slug);
    if (!matched) return null;

    const industryData = await getIndustryById(matched.id);
    if (!industryData) return null;

    return { industryData, industryId: matched.id };
  } catch (error) {
    console.error("Error fetching industry by slug:", error);
    return null;
  }
};

export const getIndustryById = async (
  industryId: number
): Promise<IndustryDataType | null> => {
  try {
    const result = await db
      .select({
        id: industries.id,
        title: industries.title,
        description: industries.description,
        active: industries.active,
        thumbnail: industries.thumbnail,
        thumbnailAltText: industries.thumbnailAltText,
        bannerImages: industries.bannerImages,
        brochure: industries.brochure,
        seoDescription: industries.seoDescription,
        seoMetadata: industries.seoMetadata,
        products: {
          id: products.id,
          title: products.title,
          thumbnail: products.thumbnail,
          thumbnailAltText: products.thumbnailAltText,
        },
      })
      .from(industries)
      .leftJoin(
        productIndustries,
        eq(industries.id, productIndustries.industryId)
      )
      .leftJoin(
        products,
        and(
          eq(productIndustries.productId, products.id),
          eq(products.active, true)
        )
      )
      .where(eq(industries.id, industryId))
      .orderBy(industries.id, products.id);

    // Use Map for more efficient grouping - SAME OUTPUT, BETTER PERFORMANCE
    const industryMap = new Map<number, IndustryDataType>();

    for (const row of result) {
      if (!industryMap.has(row.id)) {
        industryMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          active: row.active ?? true, // Ensure boolean type
          thumbnail: row.thumbnail,
          thumbnailAltText: row.thumbnailAltText,
          bannerImages: row.bannerImages,
          brochure: row.brochure,
          seoDescription: row.seoDescription || "",
          seoMetadata: row.seoMetadata || undefined,
          products: [],
        });
      }

      const industry = industryMap.get(row.id)!;
      if (row.products && row.products.id) {
        // Check if product already exists to avoid duplicates
        const productExists = industry.products.some(
          (p) => p.id === row.products!.id
        );
        if (!productExists) {
          industry.products.push(row.products);
        }
      }
    }

    const groupedIndustries = Array.from(industryMap.values());
    const resultData = groupedIndustries.length ? groupedIndustries[0] : null;

    return resultData;
  } catch (error) {
    console.error("Error fetching industry by ID:", error);
    throw error;
  }
};
