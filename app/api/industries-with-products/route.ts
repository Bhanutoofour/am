import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { industries, products, productIndustries } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  IndustryWithProducts,
  IndustriesWithProductsResponse,
} from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Fetch all active industries with their active products
    const result = await db
      .select({
        industryId: industries.id,
        industryName: industries.title,
        productId: products.id,
        productName: products.title,
      })
      .from(industries)
      .leftJoin(
        productIndustries,
        eq(industries.id, productIndustries.industryId)
      )
      .leftJoin(
        products,
        and(
          eq(productIndustries.productId, products.id),
          eq(products.active, true)
        )
      )
      .where(eq(industries.active, true))
      .orderBy(industries.id, products.id);

    // Use Map for more efficient grouping - SAME OUTPUT, BETTER PERFORMANCE
    const industryMap = new Map<number, IndustryWithProducts>();

    for (const row of result) {
      if (!industryMap.has(row.industryId)) {
        industryMap.set(row.industryId, {
          industryId: row.industryId,
          industryName: row.industryName,
          productsList: [],
        });
      }

      const industry = industryMap.get(row.industryId)!;
      if (row.productId && row.productName) {
        // Check if product already exists to avoid duplicates
        const productExists = industry.productsList.some(
          (p) => p.productId === row.productId
        );
        if (!productExists) {
          industry.productsList.push({
            productId: row.productId,
            productName: row.productName,
          });
        }
      }
    }

    const groupedIndustries = Array.from(industryMap.values());

    const response: IndustriesWithProductsResponse = {
      success: true,
      data: groupedIndustries,
      count: groupedIndustries.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching industries with products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch industries with products",
      },
      { status: 500 }
    );
  }
}
