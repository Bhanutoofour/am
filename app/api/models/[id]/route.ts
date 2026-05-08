import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { models, modelIndustries } from "@/db/schema";
import { eq } from "drizzle-orm";

function getIdFromRequest(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  return Number(
    parts[parts.length - 2] === "[id]" ? parts[parts.length - 1] : parts.pop()
  );
}

// GET: Fetch a single model with its industries
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    const modelArr = await db.select().from(models).where(eq(models.id, id));
    if (!modelArr.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const model = modelArr[0];
    const modelIndustryIds = await db
      .select({ industryId: modelIndustries.industryId })
      .from(modelIndustries)
      .where(eq(modelIndustries.modelId, id));

    // Flatten SEO metadata for form population
    const flattenedModel: any = { ...model };
    const intro = model.specsTableIntro as
      | { heading?: string; paragraph?: string }
      | null
      | undefined;
    if (intro?.heading) flattenedModel.specsIntroHeading = intro.heading;
    if (intro?.paragraph) flattenedModel.specsIntroParagraph = intro.paragraph;
    if (model.seoMetadata) {
      const seo = model.seoMetadata as any;

      // Page SEO
      if (seo.pageTitle) flattenedModel.seoPageTitle = seo.pageTitle;
      if (seo.pageDescription)
        flattenedModel.seoPageDescription = seo.pageDescription;
      if (seo.pageKeywords) flattenedModel.seoPageKeywords = seo.pageKeywords;

      // Social SEO
      if (seo.socialTitle) flattenedModel.seoSocialTitle = seo.socialTitle;
      if (seo.socialDescription)
        flattenedModel.seoSocialDescription = seo.socialDescription;
      if (seo.socialImage) flattenedModel.seoSocialImage = seo.socialImage;

      // Structured Data
      if (seo.structuredData) {
        const sd = seo.structuredData;
        if (sd.type) flattenedModel.seoStructuredDataType = sd.type;
        if (sd.name) flattenedModel.seoStructuredDataName = sd.name;
        if (sd.description)
          flattenedModel.seoStructuredDataDescription = sd.description;
        if (sd.brand) flattenedModel.seoStructuredDataBrand = sd.brand;
        if (sd.sku) flattenedModel.seoStructuredDataSku = sd.sku;
        if (sd.material) flattenedModel.seoStructuredDataMaterial = sd.material;
        if (sd.condition)
          flattenedModel.seoStructuredDataCondition = sd.condition;
        if (sd.category) flattenedModel.seoStructuredDataCategory = sd.category;

        if (sd.offers?.availability)
          flattenedModel.seoStructuredDataAvailability = sd.offers.availability;

        if (sd.aggregateRating) {
          if (sd.aggregateRating.ratingValue)
            flattenedModel.seoStructuredDataRatingValue =
              sd.aggregateRating.ratingValue.toString();
          if (sd.aggregateRating.reviewCount)
            flattenedModel.seoStructuredDataReviewCount =
              sd.aggregateRating.reviewCount.toString();
        }

        if (sd.certifications)
          flattenedModel.seoCertifications = sd.certifications.join(", ");
        if (sd.warrantyDuration)
          flattenedModel.seoWarrantyDuration = sd.warrantyDuration;
      }
    }

    return NextResponse.json({
      ...flattenedModel,
      industryIds: modelIndustryIds.map((mi) => mi.industryId),
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

// PUT: Update a single model and its industries
export async function PUT(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    const body = await req.json();
    const {
      industryIds,
      specsIntroHeading,
      specsIntroParagraph,
      ...modelData
    } = body;

    if (
      specsIntroHeading !== undefined ||
      specsIntroParagraph !== undefined
    ) {
      const h =
        typeof specsIntroHeading === "string"
          ? specsIntroHeading.trim()
          : "";
      const p =
        typeof specsIntroParagraph === "string"
          ? specsIntroParagraph.trim()
          : "";
      (modelData as Record<string, unknown>).specsTableIntro = {
        ...(h ? { heading: h } : {}),
        ...(p ? { paragraph: p } : {}),
      };
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

// DELETE: Delete a single model and its industries
export async function DELETE(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    // Delete model-industry relationships
    await db.delete(modelIndustries).where(eq(modelIndustries.modelId, id));
    // Delete model
    const [deleted] = await db
      .delete(models)
      .where(eq(models.id, id))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
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
