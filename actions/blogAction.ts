"use server";

import db from "@/db/drizzle";
import { blogs, blogIndustries, blogProducts, blogModels } from "@/db/schema";
import { eq, desc, and, inArray, ne } from "drizzle-orm";

export async function getBlogBySlug(slug: string) {
  try {
    const [blog] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
      .limit(1);

    if (!blog) {
      return null;
    }

    // Get relationships
    const industryIds = await db
      .select({ industryId: blogIndustries.industryId })
      .from(blogIndustries)
      .where(eq(blogIndustries.blogId, blog.id));

    const productIds = await db
      .select({ productId: blogProducts.productId })
      .from(blogProducts)
      .where(eq(blogProducts.blogId, blog.id));

    const modelIds = await db
      .select({ modelId: blogModels.modelId })
      .from(blogModels)
      .where(eq(blogModels.blogId, blog.id));

    return {
      ...blog,
      industryIds: industryIds.map((i) => i.industryId),
      productIds: productIds.map((p) => p.productId),
      modelIds: modelIds.map((m) => m.modelId),
    };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

export async function getRelatedBlogs(
  currentBlogId: number,
  industryIds: number[],
  productIds: number[],
  modelIds: number[],
  limit: number = 3
) {
  try {
    // Get blogs that share at least one industry, product, or model
    const relatedBlogIds = new Set<number>();

    // Find blogs with same industries
    if (industryIds.length > 0) {
      const blogsWithSameIndustries = await db
        .select({ blogId: blogIndustries.blogId })
        .from(blogIndustries)
        .where(
          and(
            ne(blogIndustries.blogId, currentBlogId),
            inArray(blogIndustries.industryId, industryIds)
          )
        );
      blogsWithSameIndustries.forEach((b) => relatedBlogIds.add(b.blogId));
    }

    // Find blogs with same products
    if (productIds.length > 0) {
      const blogsWithSameProducts = await db
        .select({ blogId: blogProducts.blogId })
        .from(blogProducts)
        .where(
          and(
            ne(blogProducts.blogId, currentBlogId),
            inArray(blogProducts.productId, productIds)
          )
        );
      blogsWithSameProducts.forEach((b) => relatedBlogIds.add(b.blogId));
    }

    // Find blogs with same models
    if (modelIds.length > 0) {
      const blogsWithSameModels = await db
        .select({ blogId: blogModels.blogId })
        .from(blogModels)
        .where(
          and(
            ne(blogModels.blogId, currentBlogId),
            inArray(blogModels.modelId, modelIds)
          )
        );
      blogsWithSameModels.forEach((b) => relatedBlogIds.add(b.blogId));
    }

    // If no related blogs found by relationships, get recent blogs
    let relatedBlogs;
    if (relatedBlogIds.size === 0) {
      relatedBlogs = await db
        .select()
        .from(blogs)
        .where(and(eq(blogs.published, true), ne(blogs.id, currentBlogId)))
        .orderBy(desc(blogs.createdAt))
        .limit(limit);
    } else {
      relatedBlogs = await db
        .select()
        .from(blogs)
        .where(
          and(
            eq(blogs.published, true),
            ne(blogs.id, currentBlogId),
            inArray(blogs.id, Array.from(relatedBlogIds))
          )
        )
        .orderBy(desc(blogs.createdAt))
        .limit(limit);
    }

    // Get relationships for each related blog
    const relatedBlogsWithRelations = await Promise.all(
      relatedBlogs.map(async (blog) => {
        const industryIds = await db
          .select({ industryId: blogIndustries.industryId })
          .from(blogIndustries)
          .where(eq(blogIndustries.blogId, blog.id));

        const productIds = await db
          .select({ productId: blogProducts.productId })
          .from(blogProducts)
          .where(eq(blogProducts.blogId, blog.id));

        const modelIds = await db
          .select({ modelId: blogModels.modelId })
          .from(blogModels)
          .where(eq(blogModels.blogId, blog.id));

        return {
          ...blog,
          industryIds: industryIds.map((i) => i.industryId),
          productIds: productIds.map((p) => p.productId),
          modelIds: modelIds.map((m) => m.modelId),
        };
      })
    );

    return relatedBlogsWithRelations;
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

export async function getActiveBlogs() {
  try {
    const allBlogs = await db
      .select()
      .from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.createdAt));

    // Get relationships for each blog
    const blogsWithRelations = await Promise.all(
      allBlogs.map(async (blog) => {
        const industryIds = await db
          .select({ industryId: blogIndustries.industryId })
          .from(blogIndustries)
          .where(eq(blogIndustries.blogId, blog.id));

        const productIds = await db
          .select({ productId: blogProducts.productId })
          .from(blogProducts)
          .where(eq(blogProducts.blogId, blog.id));

        const modelIds = await db
          .select({ modelId: blogModels.modelId })
          .from(blogModels)
          .where(eq(blogModels.blogId, blog.id));

        return {
          ...blog,
          industryIds: industryIds.map((i) => i.industryId),
          productIds: productIds.map((p) => p.productId),
          modelIds: modelIds.map((m) => m.modelId),
        };
      })
    );

    return blogsWithRelations;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function revalidateBlogData() {
  try {
    // Revalidate the blogs page
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/blogs");
    return true;
  } catch (error) {
    console.error("Error revalidating blog data:", error);
    return false;
  }
}

