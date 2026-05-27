import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { homepageSections } from "@/db/schema";
import { defaultHomepageCmsContent } from "@/data/homepageCmsDefaults";
import type { HomepageCmsContent } from "@/types/homepage";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const HOME_SECTION_KEY = "home";

function mergeContent(content: Partial<HomepageCmsContent> | null | undefined) {
  return {
    ...defaultHomepageCmsContent,
    ...(content || {}),
    faqCta: {
      ...defaultHomepageCmsContent.faqCta,
      ...(content?.faqCta || {}),
      faqs: Array.isArray(content?.faqCta?.faqs)
        ? content.faqCta.faqs
        : defaultHomepageCmsContent.faqCta.faqs,
    },
  };
}

export async function GET() {
  try {
    const [row] = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.sectionKey, HOME_SECTION_KEY))
      .limit(1);

    return NextResponse.json({
      id: row?.id ?? null,
      sectionKey: HOME_SECTION_KEY,
      title: row?.title || "Homepage",
      active: row?.active !== false,
      content: mergeContent(row?.content as Partial<HomepageCmsContent>),
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    console.error("Homepage content GET error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const content = mergeContent(body?.content);
    const now = new Date();

    const [existing] = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.sectionKey, HOME_SECTION_KEY))
      .limit(1);

    const [row] = existing
      ? await db
          .update(homepageSections)
          .set({
            title: "Homepage",
            content,
            active: true,
            updatedAt: now,
          })
          .where(eq(homepageSections.id, existing.id))
          .returning()
      : await db
          .insert(homepageSections)
          .values({
            sectionKey: HOME_SECTION_KEY,
            title: "Homepage",
            content,
            active: true,
          })
          .returning();

    revalidatePath("/");
    revalidatePath("/en-in");

    return NextResponse.json({
      id: row.id,
      sectionKey: row.sectionKey,
      title: row.title,
      active: row.active,
      content: mergeContent(row.content as Partial<HomepageCmsContent>),
      updatedAt: row.updatedAt,
    });
  } catch (error) {
    console.error("Homepage content PUT error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
