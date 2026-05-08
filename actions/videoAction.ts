"use server";

import db from "@/db/drizzle";
import {
  videos,
  videoIndustries,
  videoProducts,
  videoModels,
  industries,
  products,
  models,
} from "@/db/schema";
import { eq, inArray, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type VideoWithRelations = {
  id: number;
  title: string;
  embedLink: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  industryIds: number[];
  productIds: number[];
  modelIds: number[];
  industries: { id: number; title: string }[];
  products: { id: number; title: string }[];
  models: { id: number; modelTitle: string }[];
};

// Fetch all active videos with their relationships
export const getActiveVideos = async (): Promise<VideoWithRelations[]> => {
  try {
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.active, true))
      .orderBy(desc(videos.createdAt));

    // Get relationships for each video
    const videosWithRelations = await Promise.all(
      result.map(async (video) => {
        // Get relationship IDs
        const [industryIds, productIds, modelIds] = await Promise.all([
          db
            .select({ industryId: videoIndustries.industryId })
            .from(videoIndustries)
            .where(eq(videoIndustries.videoId, video.id)),
          db
            .select({ productId: videoProducts.productId })
            .from(videoProducts)
            .where(eq(videoProducts.videoId, video.id)),
          db
            .select({ modelId: videoModels.modelId })
            .from(videoModels)
            .where(eq(videoModels.videoId, video.id)),
        ]);

        const industryIdsArray = industryIds.map((vi) => vi.industryId);
        const productIdsArray = productIds.map((vp) => vp.productId);
        const modelIdsArray = modelIds.map((vm) => vm.modelId);

        // Get detailed information for relationships
        const [industriesArr, productsArr, modelsArr] = await Promise.all([
          industryIdsArray.length > 0
            ? db
                .select({ id: industries.id, title: industries.title })
                .from(industries)
                .where(inArray(industries.id, industryIdsArray))
            : [],
          productIdsArray.length > 0
            ? db
                .select({ id: products.id, title: products.title })
                .from(products)
                .where(inArray(products.id, productIdsArray))
            : [],
          modelIdsArray.length > 0
            ? db
                .select({
                  id: models.id,
                  modelTitle: models.modelTitle,
                })
                .from(models)
                .where(inArray(models.id, modelIdsArray))
            : [],
        ]);

        return {
          id: video.id,
          title: video.title,
          embedLink: video.embedLink,
          active: !!video.active,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          industryIds: industryIdsArray,
          productIds: productIdsArray,
          modelIds: modelIdsArray,
          industries: industriesArr,
          products: productsArr,
          models: modelsArr,
        };
      })
    );

    return videosWithRelations;
  } catch (error) {
    console.error("Error fetching active videos:", error);
    throw error;
  }
};

// Revalidate pages when video data changes
export const revalidateVideoData = async () => {
  revalidatePath("/");
  revalidatePath("/videos");
};

