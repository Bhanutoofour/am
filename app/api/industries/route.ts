import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { industries } from "@/db/schema";
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
      orderBy && Object.prototype.hasOwnProperty.call(industries, orderBy.field)
        ? db
            .select()
            .from(industries)
            .orderBy(
              orderBy.order === "desc"
                ? desc((industries as any)[orderBy.field])
                : asc((industries as any)[orderBy.field])
            )
        : db.select().from(industries);
    const data = await query.limit(limit).offset(offset);
    // ✅ Optimized: Use COUNT query instead of fetching all records
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(industries);
    const totalCount = Number(totalCountResult[0]?.count || 0);

    return new NextResponse(JSON.stringify(data), {
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
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create new industry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Ensure DB auto-generates primary key
    delete (body as any).id;
    const data = await db.insert(industries).values(body).returning();

    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update industry
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const result = await db
      .update(industries)
      .set(data)
      .where(eq(industries.id, id))
      .returning();
    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete industry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.delete(industries).where(eq(industries.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
