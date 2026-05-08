import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { products, models } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ProductWithModels,
  ProductsWithModelsResponse,
  ModelData,
} from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Fetch all active products with their active models
    const result = await db
      .select({
        productId: products.id,
        productName: products.title,
        productThumbnail: products.thumbnail,
        productThumbnailAltText: products.thumbnailAltText,
        modelId: models.id,
        modelName: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        brochure: models.brochure,
      })
      .from(products)
      .leftJoin(
        models,
        and(eq(products.id, models.productId), eq(models.active, true))
      )
      .where(eq(products.active, true))
      .orderBy(products.id, models.id);

    // Use Map for more efficient grouping - SAME OUTPUT, BETTER PERFORMANCE
    const productMap = new Map<number, ProductWithModels>();

    for (const row of result) {
      if (!productMap.has(row.productId)) {
        productMap.set(row.productId, {
          productId: row.productId,
          productName: row.productName,
          productThumbnail: row.productThumbnail,
          productThumbnailAltText: row.productThumbnailAltText,
          modelsList: {
            attachments: [],
            equipments: [],
          },
        });
      }

      const product = productMap.get(row.productId)!;
      if (row.modelId && row.brochure) {
        const modelData: ModelData = {
          modelName: row.modelName || "",
          modelTitle: row.modelTitle || "",
          brochure: row.brochure || "",
        };

        if (row.machineType === "Attachment") {
          // Check if model already exists in attachments
          const modelExists = product.modelsList.attachments.some(
            (model) => model.modelName === row.modelName
          );
          if (!modelExists) {
            product.modelsList.attachments.push(modelData);
          }
        } else if (row.machineType === "Equipment") {
          // Check if model already exists in equipments
          const modelExists = product.modelsList.equipments.some(
            (model) => model.modelName === row.modelName
          );
          if (!modelExists) {
            product.modelsList.equipments.push(modelData);
          }
        }
      }
    }

    // Filter products that have models with brochures
    const groupedProducts = Array.from(productMap.values()).filter(
      (product) =>
        product.modelsList.attachments.length > 0 ||
        product.modelsList.equipments.length > 0
    );

    const response: ProductsWithModelsResponse = {
      success: true,
      data: groupedProducts,
      count: groupedProducts.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products with models:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products with models",
      },
      { status: 500 }
    );
  }
}
