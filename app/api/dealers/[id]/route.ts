import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { dealers } from "@/db/schema";
import { eq } from "drizzle-orm";

function getIdFromRequest(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  return Number(parts.pop());
}

// GET: fetch a single dealer
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const rows = await db.select().from(dealers).where(eq(dealers.id, id));
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const dealer = rows[0];

    // Split contactNumber into dialCode and phone for the edit form
    const contactNumber = dealer.contactNumber || "";
    const parts = contactNumber.trim().split(" ");
    const dialCode = parts.length > 0 ? parts[0] : "";
    const phone = parts.length > 1 ? parts.slice(1).join(" ") : "";

    return NextResponse.json({
      ...dealer,
      dialCode,
      phone,
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

// PUT: update a single dealer
export async function PUT(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await req.json();
    const [updated] = await db
      .update(dealers)
      .set(body)
      .where(eq(dealers.id, id))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
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

// DELETE: delete a single dealer
export async function DELETE(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const [deleted] = await db
      .delete(dealers)
      .where(eq(dealers.id, id))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
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
