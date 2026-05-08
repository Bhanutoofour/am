"use server";

import db from "@/db/drizzle";
import {
  products,
  productIndustries,
  industries,
  models,
  modelIndustries,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { productSlug } from "@/utils/slug";
import { getActiveIndustries } from "@/actions/industryAction";

export const getActiveProducts = async (): Promise<ActiveProduct[]> => {
  try {
    const result = await db
      .select({
        id: products.id,
        title: products.title,
        thumbnail: products.thumbnail,
        thumbnailAltText: products.thumbnailAltText,
        active: products.active,
      })
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.id);

    const processedResult = result.map((product) => ({
      ...product,
      active: !!product.active,
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
};

export const getProductsWithIndustries = async (): Promise<
  ProductWithIndustries[]
> => {
  try {
    const result = await db
      .select({
        id: products.id,
        title: products.title,
        thumbnail: products.thumbnail,
        thumbnailAltText: products.thumbnailAltText,
        active: products.active,
      })
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.id);

    // Get industries for each product
    const productsWithIndustries = await Promise.all(
      result.map(async (product) => {
        const productIndustryRows = await db
          .select({ industryId: productIndustries.industryId })
          .from(productIndustries)
          .where(eq(productIndustries.productId, product.id));

        const industryIds = productIndustryRows.map((row) => row.industryId);

        const industriesArr = industryIds.length
          ? await db
              .select({ id: industries.id, title: industries.title })
              .from(industries)
              .where(inArray(industries.id, industryIds))
          : [];

        return {
          ...product,
          industries: industriesArr.map((ind) => ind.title),
          active: !!product.active,
        };
      }),
    );

    return productsWithIndustries;
  } catch (error) {
    console.error("Error fetching products with industries:", error);
    throw error;
  }
};

// Revalidate the home page when product data changes
export const revalidateProductData = async () => {
  revalidatePath("/");
};

/**
 * Resolve product by URL slug only (no query params).
 * Slug can be category-only (product title) or industry-product (industry-title-product-title).
 */
/** Normalize slug for matching (handles old URLs with & or double dashes). */
function normalizeProductSlug(s: string): string {
  return s.trim().replace(/&/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export const getProductBySlug = async (
  slug: string,
): Promise<{
  productData: ProductDataType;
  productId: number;
  industryId: number;
} | null> => {
  try {
    const normalizedSlug = normalizeProductSlug(slug);
    if (!normalizedSlug) return null;

    const [productsList, industriesList] = await Promise.all([
      getActiveProducts(),
      getActiveIndustries(),
    ]);

    const candidates: {
      slug: string;
      productId: number;
      industryId: number;
    }[] = [];

    for (const product of productsList) {
      const title = (product.title ?? "").trim();
      if (!title) continue;
      candidates.push({
        slug: productSlug(title, undefined),
        productId: product.id,
        industryId: 0,
      });
    }
    for (const industry of industriesList) {
      for (const p of industry.products || []) {
        if (!p?.id || !p?.title) continue;
        const productTitle = String(p.title).trim();
        const industryTitle = (industry.title ?? "").trim();
        candidates.push({
          slug: productSlug(productTitle, industryTitle || undefined),
          productId: p.id,
          industryId: industry.id,
        });
      }
    }

    const matched = candidates.find((c) => c.slug === normalizedSlug);
    if (!matched) return null;

    const productData = await getProductById(
      matched.productId,
      matched.industryId || undefined,
    );
    if (!productData) return null;

    return {
      productData,
      productId: matched.productId,
      industryId: matched.industryId,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export const getProductById = async (
  productId: number,
  industryId?: number,
): Promise<ProductDataType | null> => {
  try {
    // Fetch the product
    const productArr = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));
    if (!productArr.length) return null;
    const product = productArr[0];

    // Fetch industries for this product
    const productIndustryRows = await db
      .select({ industryId: productIndustries.industryId })
      .from(productIndustries)
      .where(eq(productIndustries.productId, productId));
    const industryIds = productIndustryRows.map((row) => row.industryId);

    // Fetch industry details
    const industriesArr = industryIds.length
      ? await db
          .select()
          .from(industries)
          .where(inArray(industries.id, industryIds))
      : [];
    const industryTitles = industriesArr
      .map((ind) => ind.title)
      .filter(
        (title): title is string => title !== null && title !== undefined,
      );

    // Fetch models for this product
    let modelRows = await db
      .select()
      .from(models)
      .where(eq(models.productId, productId))
      .orderBy(models.id);

    // If industryId is provided, filter models by modelIndustries
    if (industryId) {
      const modelIndustryRows = await db
        .select({ modelId: modelIndustries.modelId })
        .from(modelIndustries)
        .where(eq(modelIndustries.industryId, industryId));
      const allowedModelIds = modelIndustryRows.map((row) => row.modelId);
      modelRows = modelRows.filter((model) =>
        allowedModelIds.includes(model.id),
      );
    }

    // Only return required fields for each model
    const modelsFiltered = modelRows.map((model) => ({
      id: model.id,
      thumbnail: model.thumbnail,
      thumbnailAltText: model.thumbnailAltText,
      modelNumber: model.modelNumber,
      modelTitle: model.modelTitle,
      machineType: model.machineType,
      series: model.series,
      keyFeatures: Array.isArray(model.keyFeatures)
        ? model.keyFeatures.slice(0, 3)
        : [],
    }));

    // Get unique series from the filtered models
    const series = Array.from(new Set(modelsFiltered.map((m) => m.series)));

    const resultData = {
      id: product.id,
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail,
      thumbnailAltText: product.thumbnailAltText,
      series,
      active: product.active,
      generalImage: product.generalImage,
      generalImageAltText: product.generalImageAltText,
      industries: industryTitles,
      models: modelsFiltered,
      seoDescription: product.seoDescription || "",
      seoMetadata: product.seoMetadata || undefined,
    };

    return resultData;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};
