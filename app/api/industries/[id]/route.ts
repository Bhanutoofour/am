import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { industries, productIndustries } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    const data = await db
      .select()
      .from(industries)
      .where(eq(industries.id, id));
    if (!data.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const record = data[0];
    // Create a new object with flattened seoMetadata for React Admin form
    const flattenedRecord: any = { ...record };

    // Flatten seoMetadata for React Admin form
    if (record.seoMetadata) {
      const seoMetadata = record.seoMetadata as any;
      const structuredData = seoMetadata.structuredData || {};

      // Add SEO fields to the flattened record
      flattenedRecord.seoPageTitle = seoMetadata.pageTitle || "";
      flattenedRecord.seoPageDescription = seoMetadata.pageDescription || "";
      flattenedRecord.seoPageKeywords = seoMetadata.pageKeywords || "";
      flattenedRecord.seoSocialTitle = seoMetadata.socialTitle || "";
      flattenedRecord.seoSocialDescription =
        seoMetadata.socialDescription || "";
      flattenedRecord.seoSocialImage = seoMetadata.socialImage || "";
      flattenedRecord.seoStructuredDataType =
        structuredData.type || "organization";
      flattenedRecord.seoStructuredDataTitle = structuredData.title || "";
      flattenedRecord.seoStructuredDataDescription =
        structuredData.description || "";
    }

    return NextResponse.json(flattenedRecord);
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
    const data = await db
      .update(industries)
      .set(body)
      .where(eq(industries.id, id))
      .returning();

    if (!data.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
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

    // First check if the industry exists
    const exists = await db
      .select()
      .from(industries)
      .where(eq(industries.id, id));

    if (!exists.length) {
      return NextResponse.json(
        { error: "Industry not found" },
        { status: 404 }
      );
    }

    // Delete related records in product_industries first
    await db
      .delete(productIndustries)
      .where(eq(productIndustries.industryId, id));

    // Then delete the industry
    const deleted = await db
      .delete(industries)
      .where(eq(industries.id, id))
      .returning();

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
