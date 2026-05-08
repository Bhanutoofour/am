import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { products, productIndustries } from "@/db/schema";
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

    const data = await db.select().from(products).where(eq(products.id, id));
    if (!data.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Get industries for the product
    const productIndustryIds = await db
      .select({ industryId: productIndustries.industryId })
      .from(productIndustries)
      .where(eq(productIndustries.productId, id));

    const record = {
      ...data[0],
      industryIds: productIndustryIds.map((pi) => pi.industryId),
    };

    // Create a new object with flattened seoMetadata for React Admin form
    const flattenedRecord: any = { ...record };

    // Flatten seoMetadata for React Admin form
    if (record.seoMetadata) {
      const seoMetadata = record.seoMetadata as any;
      const structuredData = seoMetadata.structuredData || {};
      const hasOfferCatalog = structuredData.hasOfferCatalog || {};

      // Add SEO fields to the flattened record
      flattenedRecord.seoPageTitle = seoMetadata.pageTitle || "";
      flattenedRecord.seoPageDescription = seoMetadata.pageDescription || "";
      flattenedRecord.seoPageKeywords = seoMetadata.pageKeywords || "";
      flattenedRecord.seoSocialTitle = seoMetadata.socialTitle || "";
      flattenedRecord.seoSocialDescription =
        seoMetadata.socialDescription || "";
      flattenedRecord.seoSocialImage = seoMetadata.socialImage || "";
      flattenedRecord.seoStructuredDataType = structuredData.type || "Product";
      flattenedRecord.seoStructuredDataTitle = structuredData.title || "";
      flattenedRecord.seoStructuredDataDescription =
        structuredData.description || "";
      flattenedRecord.seoStructuredDataBrand =
        structuredData.brand || "Autocracy Machinery";
      flattenedRecord.seoStructuredDataCategory = structuredData.category || "";
      flattenedRecord.seoCatalogName = hasOfferCatalog.name || "Product Models";
      flattenedRecord.seoCatalogDescription = hasOfferCatalog.description || "";
      flattenedRecord.seoCatalogTotalModels = hasOfferCatalog.totalModels || 0;
      flattenedRecord.seoCatalogModelOverview =
        hasOfferCatalog.modelOverview || [];
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
    const { industryIds, ...productData } = body;

    // Update product
    const updated = await db
      .update(products)
      .set({
        ...productData,
        updated_at: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    if (!updated.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Update industries
    if (industryIds) {
      // Delete existing relationships
      await db
        .delete(productIndustries)
        .where(eq(productIndustries.productId, id));

      // Create new relationships
      if (industryIds.length > 0) {
        const newRelationships = industryIds.map((industryId: number) => ({
          productId: id,
          industryId: industryId,
        }));
        await db.insert(productIndustries).values(newRelationships);
      }
    }

    // Get updated industry relationships
    const updatedIndustryIds = await db
      .select({ industryId: productIndustries.industryId })
      .from(productIndustries)
      .where(eq(productIndustries.productId, id));

    return NextResponse.json({
      ...updated[0],
      industryIds: updatedIndustryIds.map((pi) => pi.industryId),
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

    // First check if the product exists
    const exists = await db.select().from(products).where(eq(products.id, id));

    if (!exists.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete related records in product_industries first
    await db
      .delete(productIndustries)
      .where(eq(productIndustries.productId, id));

    // Then delete the product
    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
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
