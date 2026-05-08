import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { dealers } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

// GET: List with pagination for React-Admin or filter by country
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");

    // If country filter is provided, return filtered results
    if (country) {
      const dealersList = await db
        .select()
        .from(dealers)
        .where(eq(dealers.country, country.trim()))
        .orderBy(dealers.id);

      return NextResponse.json({
        success: true,
        count: dealersList.length,
        country: country.trim(),
        data: dealersList,
      });
    }

    // Original pagination logic for React-Admin
    const rangeHeader = req.headers.get("Range");
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
    let orderBy: { field: string; order: "asc" | "desc" } | undefined =
      undefined;
    if (sortParam) {
      try {
        const [field, order] = JSON.parse(sortParam);
        orderBy = { field, order: (order as string).toLowerCase() as any };
      } catch (e) {}
    }

    const query =
      orderBy && Object.prototype.hasOwnProperty.call(dealers, orderBy.field)
        ? db
            .select()
            .from(dealers)
            .orderBy(
              orderBy.order === "desc"
                ? desc((dealers as any)[orderBy.field])
                : asc((dealers as any)[orderBy.field])
            )
        : db.select().from(dealers);

    const data = await query.limit(limit).offset(offset);

    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(dealers);
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
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// POST: Create dealer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Ensure DB auto-generates primary key
    delete (body as any).id;

    const requiredFields = [
      "name",
      "country",
      "state",
      "contactNumber",
      "email",
      "fullAddress",
    ];
    for (const f of requiredFields) {
      if (!body[f] || String(body[f]).trim() === "") {
        return NextResponse.json(
          { error: `${f} is required` },
          { status: 400 }
        );
      }
    }

    const [created] = await db.insert(dealers).values(body).returning();
    return NextResponse.json(created);
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

// PUT: Update dealer (expects id in body)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id)
      return NextResponse.json(
        { error: "Dealer ID is required" },
        { status: 400 }
      );

    const [updated] = await db
      .update(dealers)
      .set(data)
      .where(eq(dealers.id, id))
      .returning();
    if (!updated)
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    return NextResponse.json(updated);
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

// DELETE: Delete dealer (?id=)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Dealer ID is required" },
        { status: 400 }
      );

    const [deleted] = await db
      .delete(dealers)
      .where(eq(dealers.id, Number(id)))
      .returning();
    if (!deleted)
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
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
