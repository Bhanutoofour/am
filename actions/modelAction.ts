"use server";

import db from "@/db/drizzle";
import {
  models,
  products,
  industries,
  modelIndustries,
  productIndustries,
} from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  modelSlug,
  titleToSlug,
  modelNumberSlug,
  normalizeUrlPathSegment,
} from "@/utils/slug";
import { getProductById, getActiveProducts } from "@/actions/productAction";
import { getIndustryBySlug } from "@/actions/industryAction";

export const getActiveModels = async (): Promise<
  {
    id: number;
    modelNumber: string;
    modelTitle: string;
    productName: string;
  }[]
> => {
  try {
    const result = await db
      .select({
        id: models.id,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        productName: products.title,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(eq(models.active, true))
      .orderBy(models.id);

    const processedResult = result.map((model) => ({
      id: model.id,
      modelNumber: model.modelNumber,
      modelTitle: model.modelTitle,
      productName: model.productName,
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching active models:", error);
    throw error;
  }
};

/** Active models under industry product pages (for sitemap URLs). */
export const getIndustryNestedModelSitemapRows = async (): Promise<
  { industryTitle: string; productTitle: string; modelNumber: string }[]
> => {
  try {
    const result = await db
      .select({
        industryTitle: industries.title,
        productTitle: products.title,
        modelNumber: models.modelNumber,
      })
      .from(modelIndustries)
      .innerJoin(models, eq(modelIndustries.modelId, models.id))
      .innerJoin(products, eq(models.productId, products.id))
      .innerJoin(industries, eq(modelIndustries.industryId, industries.id))
      .innerJoin(
        productIndustries,
        and(
          eq(productIndustries.productId, products.id),
          eq(productIndustries.industryId, industries.id),
        ),
      )
      .where(
        and(
          eq(models.active, true),
          eq(products.active, true),
          eq(industries.active, true),
        ),
      )
      .orderBy(industries.id, products.id, models.id);

    return result.map((r) => ({
      industryTitle: r.industryTitle ?? "",
      productTitle: r.productTitle ?? "",
      modelNumber: r.modelNumber ?? "",
    }));
  } catch (error) {
    console.error("Error fetching industry nested model sitemap rows:", error);
    throw error;
  }
};

/**
 * Resolve model by URL slug only (no query params).
 * Uses active models list then fetches full data for the match.
 */
export const getModelBySlug = async (
  slug: string,
): Promise<{ modelData: ModelObjectTypes; modelId: number } | null> => {
  try {
    const rows = await getActiveModels();
    const matched = rows.find(
      (row) =>
        modelSlug(
          row.productName ?? "",
          row.modelTitle ?? "",
          row.modelNumber ?? "",
        ) === slug,
    );
    if (!matched) return null;

    const modelData = await getModelById(matched.id);
    if (!modelData) return null;

    return { modelData, modelId: matched.id };
  } catch (error) {
    console.error("Error fetching model by slug:", error);
    return null;
  }
};

/**
 * Legacy `/product/[slug]?modelId=` — try combined `modelSlug` first, then active model by `modelId`.
 */
export async function resolveModelForLegacyProductPage(
  combinedSlug: string,
  modelIdQuery?: string | string[]
): Promise<ModelObjectTypes | null> {
  const bySlug = await getModelBySlug(combinedSlug);
  if (bySlug) return bySlug.modelData;

  const raw = Array.isArray(modelIdQuery) ? modelIdQuery[0] : modelIdQuery;
  if (raw === undefined || raw === "") return null;
  const id = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(id) || id < 1) return null;

  const row = await db
    .select({ id: models.id })
    .from(models)
    .where(and(eq(models.id, id), eq(models.active, true)))
    .limit(1);
  if (!row.length) return null;

  return getModelById(id);
}

function matchesModelNumberSlugInUrl(
  dbModelNumber: string,
  urlSegment: string,
): boolean {
  const a = normalizeUrlPathSegment(modelNumberSlug(dbModelNumber));
  const b = normalizeUrlPathSegment(urlSegment);
  return a === b && a.length > 0;
}

/**
 * Last URL segment: prefer slugified `model_number`, also accept legacy
 * `modelSlug("", modelTitle, modelNumber)` (e.g. mini-trencher-dhruva100).
 */
function matchesModelUrlSegment(
  modelNumber: string,
  modelTitle: string,
  urlSegment: string,
): boolean {
  if (matchesModelNumberSlugInUrl(modelNumber, urlSegment)) return true;
  const n = normalizeUrlPathSegment(urlSegment);
  if (!n) return false;
  const legacy = normalizeUrlPathSegment(
    modelSlug("", modelTitle ?? "", modelNumber ?? ""),
  );
  return legacy.length > 0 && legacy === n;
}

/** URL segment matches DB title via `titleToSlug`, normalized. */
function titleSlugMatchesUrlSegment(
  dbTitle: string,
  urlSegment: string,
): boolean {
  const a = normalizeUrlPathSegment(titleToSlug(dbTitle));
  const b = normalizeUrlPathSegment(urlSegment);
  return a === b && a.length > 0;
}

/** Same as strict match, plus singular/plural slug (e.g. trencher vs trenchers). */
function titleSlugMatchesUrlSegmentRelaxed(
  dbTitle: string,
  urlSegment: string,
): boolean {
  if (titleSlugMatchesUrlSegment(dbTitle, urlSegment)) return true;
  const a = normalizeUrlPathSegment(titleToSlug(dbTitle));
  const b = normalizeUrlPathSegment(urlSegment);
  if (!a || !b) return false;
  if (a.length >= 2 && a.endsWith("s") && a.slice(0, -1) === b) return true;
  if (b.length >= 2 && b.endsWith("s") && b.slice(0, -1) === a) return true;
  return false;
}

function findProductByTitleSlug<T extends { title: string | null }>(
  list: T[],
  urlSegment: string,
): T | undefined {
  const exact = list.find((p) =>
    titleSlugMatchesUrlSegment(p.title ?? "", urlSegment),
  );
  if (exact) return exact;
  return list.find((p) =>
    titleSlugMatchesUrlSegmentRelaxed(p.title ?? "", urlSegment),
  );
}

/**
 * `/industries/[industrySlug]/[productSlug]/[modelSlug]`
 * All three must match: industry title slug, product title slug (in that industry), model_number slug only.
 */
export const getModelByIndustryProductAndModelNumberSlug = async (
  industrySlug: string,
  productSlug: string,
  modelNumberSegment: string,
): Promise<{ modelData: ModelObjectTypes; modelId: number } | null> => {
  try {
    const industryResolved = await getIndustryBySlug(industrySlug);
    if (!industryResolved) return null;

    const { industryData, industryId } = industryResolved;
    const matchedProduct = findProductByTitleSlug(
      industryData.products,
      productSlug,
    );
    if (!matchedProduct?.id) return null;

    const productData = await getProductById(matchedProduct.id, industryId);
    if (!productData?.models?.length) return null;

    const modelRow = productData.models.find((m) =>
      matchesModelUrlSegment(
        String(m.modelNumber ?? ""),
        String(m.modelTitle ?? ""),
        modelNumberSegment,
      ),
    );
    if (!modelRow?.id) return null;

    const modelData = await getModelById(modelRow.id);
    if (!modelData) return null;

    return { modelData, modelId: modelRow.id };
  } catch (error) {
    console.error(
      "Error fetching model by industry + product + model number slug:",
      error,
    );
    return null;
  }
};

/**
 * `/products/[slug]/[modelSlug]`
 * Product title slug + model_number slug only (no industry in URL).
 */
export const getModelByProductSlugAndModelNumberSlug = async (
  productSlug: string,
  modelNumberSegment: string,
): Promise<{ modelData: ModelObjectTypes; modelId: number } | null> => {
  try {
    const productsList = await getActiveProducts();
    const matchedProduct = findProductByTitleSlug(productsList, productSlug);
    if (!matchedProduct?.id) return null;

    const productData = await getProductById(matchedProduct.id);
    if (!productData?.models?.length) return null;

    const modelRow = productData.models.find((m) =>
      matchesModelUrlSegment(
        String(m.modelNumber ?? ""),
        String(m.modelTitle ?? ""),
        modelNumberSegment,
      ),
    );
    if (!modelRow?.id) return null;

    const modelData = await getModelById(modelRow.id);
    if (!modelData) return null;

    return { modelData, modelId: modelRow.id };
  } catch (error) {
    console.error(
      "Error fetching model by product slug + model number slug:",
      error,
    );
    return null;
  }
};

export const getModelById = async (
  modelId: number,
): Promise<ModelObjectTypes | null> => {
  try {
    // Fetch the model with product information
    const result = await db
      .select({
        // Model fields
        id: models.id,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        series: models.series,
        coverImage: models.coverImage,
        coverImageAltText: models.coverImageAltText,
        keyFeatures: models.keyFeatures,
        specsTableIntro: models.specsTableIntro,
        brochure: models.brochure,
        modelDescription: models.modelDescription,
        seoDescription: models.seoDescription,
        seoMetadata: models.seoMetadata,
        // Product fields
        productName: products.title,
        generalImage: products.generalImage,
        generalImageAltText: products.generalImageAltText,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(eq(models.id, modelId));

    if (!result.length) {
      return null;
    }

    const modelData = result[0];

    const resultData = {
      id: modelData.id,
      modelNumber: modelData.modelNumber,
      modelTitle: modelData.modelTitle,
      machineType: modelData.machineType,
      productName: modelData.productName,
      series: modelData.series,
      coverImage: modelData.coverImage,
      coverImageAltText: modelData.coverImageAltText,
      keyFeatures: modelData.keyFeatures || [],
      specsTableIntro: modelData.specsTableIntro ?? null,
      brochure: modelData.brochure,
      modelDescription: modelData.modelDescription || [],
      seoDescription: modelData.seoDescription || "",
      seoMetadata: modelData.seoMetadata,
      generalImage: modelData.generalImage,
      generalImageAltText: modelData.generalImageAltText,
    };

    return resultData;
  } catch (error) {
    console.error("Error fetching model by id:", error);
    throw error;
  }
};

export const getModelsBySeries = async (
  seriesName: string,
): Promise<Model[]> => {
  try {
    // Fetch all models with the specified series name
    const result = await db
      .select({
        id: models.id,
        thumbnail: models.thumbnail,
        thumbnailAltText: models.thumbnailAltText,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        series: models.series,
        keyFeatures: models.keyFeatures,
        productName: products.title,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(ilike(models.series, seriesName))
      .orderBy(models.id);

    const processedResult = result.map((model) => ({
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
      productName: model.productName,
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching models by series:", error);
    throw error;
  }
};

export const getRentalModel = async (): Promise<RentalModelTypes[]> => {
  try {
    const result = await db
      .select({
        id: models.id,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        shortDescription: models.shortDescription,
        thumbnail: models.thumbnail,
        thumbnailAltText: models.thumbnailAltText,
        productName: products.title,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(eq(models.rentalAvailability, true))
      .orderBy(models.id);

    const processedResult = result.map((model) => ({
      id: model.id,
      modelNumber: model.modelNumber,
      modelTitle: model.modelTitle,
      machineType: model.machineType,
      shortDescription: model.shortDescription,
      thumbnail: model.thumbnail,
      thumbnailAltText: model.thumbnailAltText,
      productName: model.productName,
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching rental models:", error);
    throw error;
  }
};

// Revalidate the home page when model data changes
export const revalidateModelData = async () => {
  revalidatePath("/");
};
