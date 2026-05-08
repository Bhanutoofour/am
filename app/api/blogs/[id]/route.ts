import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { blogs, blogIndustries, blogProducts, blogModels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET: Get single blog by ID
export async function GET(req: NextRequest, context: any) {
  try {
    const id = Number(context?.params?.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const [blog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Get related data
    const blogIndustryIds = await db
      .select({ industryId: blogIndustries.industryId })
      .from(blogIndustries)
      .where(eq(blogIndustries.blogId, id));

    const blogProductIds = await db
      .select({ productId: blogProducts.productId })
      .from(blogProducts)
      .where(eq(blogProducts.blogId, id));

    const blogModelIds = await db
      .select({ modelId: blogModels.modelId })
      .from(blogModels)
      .where(eq(blogModels.blogId, id));

    // Flatten SEO metadata for form editing
    const blogWithSEO: any = {
      ...blog,
      industryIds: blogIndustryIds.map((bi) => bi.industryId),
      productIds: blogProductIds.map((bp) => bp.productId),
      modelIds: blogModelIds.map((bm) => bm.modelId),
    };

    // Extract SEO metadata to individual fields for editing
    if (blog.seoMetadata) {
      blogWithSEO.seoPageTitle = blog.seoMetadata.pageTitle || "";
      blogWithSEO.seoPageDescription = blog.seoMetadata.pageDescription || "";
      blogWithSEO.seoPageKeywords = blog.seoMetadata.pageKeywords || "";
      blogWithSEO.seoSocialTitle = blog.seoMetadata.socialTitle || "";
      blogWithSEO.seoSocialDescription =
        blog.seoMetadata.socialDescription || "";
      blogWithSEO.seoSocialImage = blog.seoMetadata.socialImage || "";
    }

    return NextResponse.json(blogWithSEO);
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

// PUT: Update blog by ID
export async function PUT(req: NextRequest, context: any) {
  try {
    const id = Number(context?.params?.id);
    const body = await req.json();

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const { industryIds, productIds, modelIds, id: _, createdAt: __, ...blogData } = body;

    // Clean up blogData - remove fields that shouldn't be updated
    const { seoMetadata, ...blogUpdateData } = blogData;
    
    // Prepare update data
    const updateData: any = {
      ...blogUpdateData,
      updatedAt: new Date(),
    };
    
    // Handle seoMetadata if provided
    if (seoMetadata && typeof seoMetadata === 'object') {
      updateData.seoMetadata = seoMetadata;
    }

    // Update blog
    const [blog] = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, id))
      .returning();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update blog-industry relationships
    if (industryIds !== undefined) {
      await db
        .delete(blogIndustries)
        .where(eq(blogIndustries.blogId, id));

      if (industryIds.length > 0) {
        await db.insert(blogIndustries).values(
          industryIds.map((industryId: number) => ({
            blogId: id,
            industryId,
          }))
        );
      }
    }

    // Update blog-product relationships
    if (productIds !== undefined) {
      await db
        .delete(blogProducts)
        .where(eq(blogProducts.blogId, id));

      if (productIds && productIds.length > 0) {
        await db.insert(blogProducts).values(
          productIds.map((productId: number) => ({
            blogId: id,
            productId,
          }))
        );
      }
    }

    // Update blog-model relationships
    if (modelIds !== undefined) {
      await db
        .delete(blogModels)
        .where(eq(blogModels.blogId, id));

      if (modelIds && modelIds.length > 0) {
        await db.insert(blogModels).values(
          modelIds.map((modelId: number) => ({
            blogId: id,
            modelId,
          }))
        );
      }
    }

    // Get updated relationships for response
    const updatedBlogIndustries = await db
      .select({ industryId: blogIndustries.industryId })
      .from(blogIndustries)
      .where(eq(blogIndustries.blogId, id));

    const updatedBlogProducts = await db
      .select({ productId: blogProducts.productId })
      .from(blogProducts)
      .where(eq(blogProducts.blogId, id));

    const updatedBlogModels = await db
      .select({ modelId: blogModels.modelId })
      .from(blogModels)
      .where(eq(blogModels.blogId, id));

    // Flatten SEO metadata for form editing
    const blogWithSEO: any = {
      ...blog,
      industryIds: updatedBlogIndustries.map((bi) => bi.industryId),
      productIds: updatedBlogProducts.map((bp) => bp.productId),
      modelIds: updatedBlogModels.map((bm) => bm.modelId),
    };

    // Extract SEO metadata to individual fields for editing
    if (blog.seoMetadata) {
      blogWithSEO.seoPageTitle = blog.seoMetadata.pageTitle || "";
      blogWithSEO.seoPageDescription = blog.seoMetadata.pageDescription || "";
      blogWithSEO.seoPageKeywords = blog.seoMetadata.pageKeywords || "";
      blogWithSEO.seoSocialTitle = blog.seoMetadata.socialTitle || "";
      blogWithSEO.seoSocialDescription =
        blog.seoMetadata.socialDescription || "";
      blogWithSEO.seoSocialImage = blog.seoMetadata.socialImage || "";
    }

    // Revalidate pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(blogWithSEO);
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

