import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { products, productIndustries } from "@/db/schema";
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
      orderBy && Object.prototype.hasOwnProperty.call(products, orderBy.field)
        ? db
            .select()
            .from(products)
            .orderBy(
              orderBy.order === "desc"
                ? desc((products as any)[orderBy.field])
                : asc((products as any)[orderBy.field])
            )
        : db.select().from(products);
    const data = await query.limit(limit).offset(offset);
    // ✅ Optimized: Use COUNT query instead of fetching all records
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(products);
    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get industries for each product
    const productsWithIndustries = await Promise.all(
      data.map(async (product) => {
        const productIndustryIds = await db
          .select({ industryId: productIndustries.industryId })
          .from(productIndustries)
          .where(eq(productIndustries.productId, product.id));

        return {
          ...product,
          industryIds: productIndustryIds.map((pi) => pi.industryId),
        };
      })
    );

    return new NextResponse(JSON.stringify(productsWithIndustries), {
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

// POST: Create new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { industryIds, ...productData } = body;
    // Ensure DB auto-generates primary key
    delete (productData as any).id;

    // Validate required fields
    if (
      !productData.title ||
      !productData.description ||
      !productData.thumbnail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert product
    const [product] = await db.insert(products).values(productData).returning();

    // Insert product-industry relationships
    if (industryIds && industryIds.length > 0) {
      await db.insert(productIndustries).values(
        industryIds.map((industryId: number) => ({
          productId: product.id,
          industryId,
        }))
      );
    }

    // Clear cache when product data changes

    return NextResponse.json({
      ...product,
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

// PUT: Update product
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, industryIds, ...productData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Update product
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update product-industry relationships
    if (industryIds) {
      // Delete existing relationships
      await db
        .delete(productIndustries)
        .where(eq(productIndustries.productId, id));

      // Insert new relationships
      if (industryIds.length > 0) {
        await db.insert(productIndustries).values(
          industryIds.map((industryId: number) => ({
            productId: id,
            industryId,
          }))
        );
      }
    }

    // Clear cache when product data changes

    return NextResponse.json({
      ...product,
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

// DELETE: Delete product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Delete product-industry relationships first
    await db
      .delete(productIndustries)
      .where(eq(productIndustries.productId, Number(id)));

    // Delete product
    const deleted = await db
      .delete(products)
      .where(eq(products.id, Number(id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Clear cache when product data changes

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
