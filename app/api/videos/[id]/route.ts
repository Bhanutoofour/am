import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import {
  videos,
  videoIndustries,
  videoProducts,
  videoModels,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function getIdFromRequest(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return id ? Number(id) : null;
}

// GET: Get one
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const data = await db.select().from(videos).where(eq(videos.id, id));
    if (!data.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Get industries, products, and models for the video
    const [industryIds, productIds, modelIds] = await Promise.all([
      db
        .select({ industryId: videoIndustries.industryId })
        .from(videoIndustries)
        .where(eq(videoIndustries.videoId, id)),
      db
        .select({ productId: videoProducts.productId })
        .from(videoProducts)
        .where(eq(videoProducts.videoId, id)),
      db
        .select({ modelId: videoModels.modelId })
        .from(videoModels)
        .where(eq(videoModels.videoId, id)),
    ]);

    const record = {
      ...data[0],
      industryIds: industryIds.map((vi) => vi.industryId),
      productIds: productIds.map((vp) => vp.productId),
      modelIds: modelIds.map((vm) => vm.modelId),
    };

    return NextResponse.json(record);
  } catch (err) {
    console.error("GET by ID error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update
export async function PUT(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();
    const { industryIds, productIds, modelIds, createdAt, updatedAt, ...videoData } = body;

    // Update video (exclude createdAt and updatedAt - these are managed by the database)
    const updated = await db
      .update(videos)
      .set({
        ...videoData,
        updatedAt: new Date(),
      })
      .where(eq(videos.id, id))
      .returning();

    if (!updated.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Update industries
    if (industryIds !== undefined) {
      // Delete existing relationships
      await db
        .delete(videoIndustries)
        .where(eq(videoIndustries.videoId, id));

      // Create new relationships
      if (industryIds.length > 0) {
        const newRelationships = industryIds.map((industryId: number) => ({
          videoId: id,
          industryId: industryId,
        }));
        await db.insert(videoIndustries).values(newRelationships);
      }
    }

    // Update products
    if (productIds !== undefined) {
      // Delete existing relationships
      await db.delete(videoProducts).where(eq(videoProducts.videoId, id));

      // Create new relationships
      if (productIds.length > 0) {
        const newRelationships = productIds.map((productId: number) => ({
          videoId: id,
          productId: productId,
        }));
        await db.insert(videoProducts).values(newRelationships);
      }
    }

    // Update models
    if (modelIds !== undefined) {
      // Delete existing relationships
      await db.delete(videoModels).where(eq(videoModels.videoId, id));

      // Create new relationships
      if (modelIds.length > 0) {
        const newRelationships = modelIds.map((modelId: number) => ({
          videoId: id,
          modelId: modelId,
        }));
        await db.insert(videoModels).values(newRelationships);
      }
    }

    // Get updated relationships
    const [updatedIndustryIds, updatedProductIds, updatedModelIds] =
      await Promise.all([
        db
          .select({ industryId: videoIndustries.industryId })
          .from(videoIndustries)
          .where(eq(videoIndustries.videoId, id)),
        db
          .select({ productId: videoProducts.productId })
          .from(videoProducts)
          .where(eq(videoProducts.videoId, id)),
        db
          .select({ modelId: videoModels.modelId })
          .from(videoModels)
          .where(eq(videoModels.videoId, id)),
      ]);

    // Revalidate pages
    revalidatePath("/videos");

    return NextResponse.json({
      ...updated[0],
      industryIds: updatedIndustryIds.map((vi) => vi.industryId),
      productIds: updatedProductIds.map((vp) => vp.productId),
      modelIds: updatedModelIds.map((vm) => vm.modelId),
    });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove
export async function DELETE(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    // First check if the video exists
    const exists = await db.select().from(videos).where(eq(videos.id, id));

    if (!exists.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete related records (cascade should handle this, but being explicit)
    await db.delete(videoIndustries).where(eq(videoIndustries.videoId, id));
    await db.delete(videoProducts).where(eq(videoProducts.videoId, id));
    await db.delete(videoModels).where(eq(videoModels.videoId, id));

    // Then delete the video
    const deleted = await db
      .delete(videos)
      .where(eq(videos.id, id))
      .returning();

    // Revalidate pages
    revalidatePath("/videos");

    return NextResponse.json(deleted[0]);
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

