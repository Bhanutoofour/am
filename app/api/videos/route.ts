import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import {
  videos,
  videoIndustries,
  videoProducts,
  videoModels,
} from "@/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET: List with pagination for React-Admin
export async function GET(req: NextRequest) {
  try {
    const rangeHeader = req.headers.get("Range");
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 10;
    let offset = (page - 1) * perPage;

    let limit = perPage;

    if (rangeHeader) {
      const match = rangeHeader.match(/\w+=(\d+)-(\d+)/);
      if (match) {
        const [, start, end] = match;
        offset = Number(start);
        limit = Number(end) - Number(start) + 1;
      }
    }

    const sortParam = searchParams.get("sort");
    let orderBy = undefined;
    if (sortParam) {
      try {
        const [field, order] = JSON.parse(sortParam);
        orderBy = { field, order: order.toLowerCase() };
      } catch (e) {}
    }

    const query =
      orderBy && Object.prototype.hasOwnProperty.call(videos, orderBy.field)
        ? db
            .select()
            .from(videos)
            .orderBy(
              orderBy.order === "desc"
                ? desc((videos as any)[orderBy.field])
                : asc((videos as any)[orderBy.field])
            )
        : db.select().from(videos);
    const data = await query.limit(limit).offset(offset);
    // ✅ Optimized: Use COUNT query instead of fetching all records
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(videos);
    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get industries, products, and models for each video
    const videosWithRelations = await Promise.all(
      data.map(async (video) => {
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

        return {
          ...video,
          industryIds: industryIds.map((vi) => vi.industryId),
          productIds: productIds.map((vp) => vp.productId),
          modelIds: modelIds.map((vm) => vm.modelId),
        };
      })
    );

    return new NextResponse(JSON.stringify(videosWithRelations), {
      headers: {
        "Content-Type": "application/json",
        "Content-Range": `items ${offset}-${
          offset + data.length - 1
        }/${totalCount}`,
        "Access-Control-Expose-Headers": "Content-Range",
      },
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// POST: Create new video
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { industryIds, productIds, modelIds, createdAt, updatedAt, ...videoData } = body;
    // Ensure DB auto-generates primary key and timestamps
    delete (videoData as any).id;
    delete (videoData as any).createdAt;
    delete (videoData as any).updatedAt;

    // Validate required fields
    if (!videoData.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!videoData.embedLink) {
      return NextResponse.json(
        { error: "Embed link is required" },
        { status: 400 }
      );
    }

    // thumbnailUrl and thumbnailAltText are optional - frontend handles YouTube thumbnails automatically

    // Insert video
    const [video] = await db.insert(videos).values(videoData).returning();

    // Insert video-industry relationships
    if (industryIds && industryIds.length > 0) {
      await db.insert(videoIndustries).values(
        industryIds.map((industryId: number) => ({
          videoId: video.id,
          industryId,
        }))
      );
    }

    // Insert video-product relationships
    if (productIds && productIds.length > 0) {
      await db.insert(videoProducts).values(
        productIds.map((productId: number) => ({
          videoId: video.id,
          productId,
        }))
      );
    }

    // Insert video-model relationships
    if (modelIds && modelIds.length > 0) {
      await db.insert(videoModels).values(
        modelIds.map((modelId: number) => ({
          videoId: video.id,
          modelId,
        }))
      );
    }

    // Revalidate pages
    revalidatePath("/videos");

    return NextResponse.json({
      ...video,
      industryIds: industryIds || [],
      productIds: productIds || [],
      modelIds: modelIds || [],
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// PUT: Update video
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, industryIds, productIds, modelIds, createdAt, updatedAt, ...videoData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Update video (exclude createdAt and updatedAt - these are managed by the database)
    const [video] = await db
      .update(videos)
      .set({
        ...videoData,
        updatedAt: new Date(),
      })
      .where(eq(videos.id, id))
      .returning();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Update video-industry relationships
    if (industryIds !== undefined) {
      // Delete existing relationships
      await db
        .delete(videoIndustries)
        .where(eq(videoIndustries.videoId, id));

      // Insert new relationships
      if (industryIds.length > 0) {
        await db.insert(videoIndustries).values(
          industryIds.map((industryId: number) => ({
            videoId: id,
            industryId,
          }))
        );
      }
    }

    // Update video-product relationships
    if (productIds !== undefined) {
      // Delete existing relationships
      await db.delete(videoProducts).where(eq(videoProducts.videoId, id));

      // Insert new relationships
      if (productIds.length > 0) {
        await db.insert(videoProducts).values(
          productIds.map((productId: number) => ({
            videoId: id,
            productId,
          }))
        );
      }
    }

    // Update video-model relationships
    if (modelIds !== undefined) {
      // Delete existing relationships
      await db.delete(videoModels).where(eq(videoModels.videoId, id));

      // Insert new relationships
      if (modelIds.length > 0) {
        await db.insert(videoModels).values(
          modelIds.map((modelId: number) => ({
            videoId: id,
            modelId,
          }))
        );
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
      ...video,
      industryIds: updatedIndustryIds.map((vi) => vi.industryId),
      productIds: updatedProductIds.map((vp) => vp.productId),
      modelIds: updatedModelIds.map((vm) => vm.modelId),
    });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete video
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Delete video-industry relationships (cascade should handle this, but being explicit)
    await db
      .delete(videoIndustries)
      .where(eq(videoIndustries.videoId, Number(id)));

    // Delete video-product relationships
    await db
      .delete(videoProducts)
      .where(eq(videoProducts.videoId, Number(id)));

    // Delete video-model relationships
    await db.delete(videoModels).where(eq(videoModels.videoId, Number(id)));

    // Delete video
    const deleted = await db
      .delete(videos)
      .where(eq(videos.id, Number(id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Revalidate pages
    revalidatePath("/videos");

    return NextResponse.json({ success: true });
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

