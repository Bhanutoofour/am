import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { models, modelIndustries } from "@/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";

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
      orderBy && Object.prototype.hasOwnProperty.call(models, orderBy.field)
        ? db
            .select()
            .from(models)
            .orderBy(
              orderBy.order === "desc"
                ? desc((models as any)[orderBy.field])
                : asc((models as any)[orderBy.field])
            )
        : db.select().from(models);
    const data = await query.limit(limit).offset(offset);
    // ✅ Optimized: Use COUNT query instead of fetching all records
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(models);
    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get industries for each model
    const modelsWithIndustries = await Promise.all(
      data.map(async (model) => {
        const modelIndustryIds = await db
          .select({ industryId: modelIndustries.industryId })
          .from(modelIndustries)
          .where(eq(modelIndustries.modelId, model.id));

        return {
          ...model,
          industryIds: modelIndustryIds.map((mi) => mi.industryId),
        };
      })
    );

    return new NextResponse(JSON.stringify(modelsWithIndustries), {
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

// POST: Create new model
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industryIds, ...modelData } = body;

    // Remove id field if present to let database auto-generate
    delete modelData.id;

    // Validate required fields
    if (
      !modelData.modelNumber ||
      !modelData.modelTitle ||
      !modelData.productId ||
      !modelData.series
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert model
    const [model] = await db.insert(models).values(modelData).returning();

    // Insert model-industry relationships
    if (industryIds && industryIds.length > 0) {
      await db.insert(modelIndustries).values(
        industryIds.map((industryId: number) => ({
          modelId: model.id,
          industryId,
        }))
      );
    }

    // Clear cache when model data changes

    return NextResponse.json({
      ...model,
      industryIds: industryIds || [],
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

// PUT: Update model
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, industryIds, ...modelData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Model ID is required" },
        { status: 400 }
      );
    }

    // Update model
    const [model] = await db
      .update(models)
      .set(modelData)
      .where(eq(models.id, id))
      .returning();

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Update model-industry relationships
    if (industryIds) {
      // Delete existing relationships
      await db.delete(modelIndustries).where(eq(modelIndustries.modelId, id));

      // Insert new relationships
      if (industryIds.length > 0) {
        await db.insert(modelIndustries).values(
          industryIds.map((industryId: number) => ({
            modelId: id,
            industryId,
          }))
        );
      }
    }

    // Clear cache when model data changes

    return NextResponse.json({
      ...model,
      industryIds: industryIds || [],
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

// DELETE: Delete model
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Model ID is required" },
        { status: 400 }
      );
    }

    // Delete model-industry relationships
    await db
      .delete(modelIndustries)
      .where(eq(modelIndustries.modelId, Number(id)));

    // Delete model
    const [deleted] = await db
      .delete(models)
      .where(eq(models.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Clear cache when model data changes

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
