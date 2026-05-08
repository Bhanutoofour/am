// /api/hero-section/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { heroSection } from "@/db/schema";
import { asc, desc, sql } from "drizzle-orm";
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
      orderBy &&
      Object.prototype.hasOwnProperty.call(heroSection, orderBy.field)
        ? db
            .select()
            .from(heroSection)
            .orderBy(
              orderBy.order === "desc"
                ? desc((heroSection as any)[orderBy.field])
                : asc((heroSection as any)[orderBy.field])
            )
        : db.select().from(heroSection);
    const data = await query.limit(limit).offset(offset);
    // ✅ Optimized: Use COUNT query instead of fetching all records
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(heroSection);
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

// POST: Create a new item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Ensure DB auto-generates primary key
    delete (body as any).id;
    const result = await db.insert(heroSection).values(body).returning();

    // Force Next.js to revalidate homepage
    revalidatePath("/");

    console.log("🔄 New hero section created - page revalidated");

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
