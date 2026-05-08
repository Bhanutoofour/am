// /api/hero-section/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { heroSection } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function getIdFromRequest(req: NextRequest): number | null {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return id ? Number(id) : null;
}

// GET: Get one
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const data = await db
      .select()
      .from(heroSection)
      .where(eq(heroSection.id, id));
    if (!data.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data[0]);
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
    const updated = await db
      .update(heroSection)
      .set(body)
      .where(eq(heroSection.id, id))
      .returning();
    if (!updated.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Force Next.js to revalidate homepage
    revalidatePath("/");
    
    console.log("🔄 Hero section updated - page revalidated");

    return NextResponse.json(updated[0]);
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

    const deleted = await db
      .delete(heroSection)
      .where(eq(heroSection.id, id))
      .returning();
    if (!deleted.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Force Next.js to revalidate homepage
    revalidatePath("/");
    
    console.log("🔄 Hero section deleted - page revalidated");

    return NextResponse.json(deleted[0]);
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
