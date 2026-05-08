import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { blogs, blogIndustries, blogProducts, blogModels } from "@/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";
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
      orderBy && Object.prototype.hasOwnProperty.call(blogs, orderBy.field)
        ? db
            .select()
            .from(blogs)
            .orderBy(
              orderBy.order === "desc"
                ? desc((blogs as any)[orderBy.field])
                : asc((blogs as any)[orderBy.field])
            )
        : db.select().from(blogs).orderBy(desc(blogs.createdAt));
    const data = await query.limit(limit).offset(offset);
    
    // ✅ Optimized: Use COUNT query instead of fetching all records
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(blogs);
    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get related data for each blog (optional - for future use)
    const blogsWithRelations = await Promise.all(
      data.map(async (blog) => {
        // Get industry IDs
        const blogIndustryIds = await db
          .select({ industryId: blogIndustries.industryId })
          .from(blogIndustries)
          .where(eq(blogIndustries.blogId, blog.id));

        // Get product IDs (multiple)
        const blogProductIds = await db
          .select({ productId: blogProducts.productId })
          .from(blogProducts)
          .where(eq(blogProducts.blogId, blog.id));

        // Get model IDs (multiple)
        const blogModelIds = await db
          .select({ modelId: blogModels.modelId })
          .from(blogModels)
          .where(eq(blogModels.blogId, blog.id));

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
          blogWithSEO.seoSocialDescription = blog.seoMetadata.socialDescription || "";
          blogWithSEO.seoSocialImage = blog.seoMetadata.socialImage || "";
        }

        return blogWithSEO;
      })
    );

    return new NextResponse(JSON.stringify(blogsWithRelations), {
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

// POST: Create new blog
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { industryIds, productIds, modelIds, ...blogData } = body;
    // Ensure DB auto-generates primary key
    delete (blogData as any).id;

    // Validate required fields
    if (
      !blogData.title ||
      !blogData.slug ||
      !blogData.description ||
      !blogData.banner ||
      !blogData.content
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert blog
    const [blog] = await db.insert(blogs).values(blogData).returning();

    // Insert blog-industry relationships
    if (industryIds && industryIds.length > 0) {
      await db.insert(blogIndustries).values(
        industryIds.map((industryId: number) => ({
          blogId: blog.id,
          industryId,
        }))
      );
    }

    // Insert blog-product relationships (multiple)
    if (productIds && productIds.length > 0) {
      await db.insert(blogProducts).values(
        productIds.map((productId: number) => ({
          blogId: blog.id,
          productId,
        }))
      );
    }

    // Insert blog-model relationships (multiple)
    if (modelIds && modelIds.length > 0) {
      await db.insert(blogModels).values(
        modelIds.map((modelId: number) => ({
          blogId: blog.id,
          modelId,
        }))
      );
    }

    // Revalidate pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json({
      ...blog,
      industryIds: industryIds || [],
      productIds: productIds || [],
      modelIds: modelIds || [],
    });
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

// PUT: Update blog
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, industryIds, productIds, modelIds, ...blogData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Update blog
    const [blog] = await db
      .update(blogs)
      .set({
        ...blogData,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update blog-industry relationships
    if (industryIds !== undefined) {
      // Delete existing relationships
      await db
        .delete(blogIndustries)
        .where(eq(blogIndustries.blogId, id));

      // Insert new relationships
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
      // Delete existing relationships
      await db
        .delete(blogProducts)
        .where(eq(blogProducts.blogId, id));

      // Insert new relationships if productIds are provided
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
      // Delete existing relationships
      await db
        .delete(blogModels)
        .where(eq(blogModels.blogId, id));

      // Insert new relationships if modelIds are provided
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

    // Revalidate pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json({
      ...blog,
      industryIds: updatedBlogIndustries.map((bi) => bi.industryId),
      productIds: updatedBlogProducts.map((bp) => bp.productId),
      modelIds: updatedBlogModels.map((bm) => bm.modelId),
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

// DELETE: Delete blog
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Delete blog relationships first
    await db
      .delete(blogIndustries)
      .where(eq(blogIndustries.blogId, Number(id)));
    
    await db
      .delete(blogProducts)
      .where(eq(blogProducts.blogId, Number(id)));
    
    await db
      .delete(blogModels)
      .where(eq(blogModels.blogId, Number(id)));

    // Delete blog
    const deleted = await db
      .delete(blogs)
      .where(eq(blogs.id, Number(id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Revalidate pages
    revalidatePath("/blog");

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

