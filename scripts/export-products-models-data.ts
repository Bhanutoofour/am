import { config as loadEnv } from "dotenv";
import { asc, eq } from "drizzle-orm";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const outputDir = path.join(process.cwd(), "outputs", "product-models");
const outputFile = path.join(outputDir, "product-models-data.json");

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function flattenModelDescription(
  blocks:
    | {
        title?: string;
        description?: string[];
      }[]
    | null
    | undefined,
) {
  return asArray(blocks)
    .map((block) => {
      const title = String(block?.title || "").trim();
      const description = asArray(block?.description)
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .join(" ");
      return [title, description].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join("\n\n");
}

function flattenSpecs(
  specs:
    | {
        name?: string;
        value?: string;
      }[]
    | null
    | undefined,
) {
  return asArray(specs)
    .map((spec) =>
      [String(spec?.name || "").trim(), String(spec?.value || "").trim()]
        .filter(Boolean)
        .join(": "),
    )
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const [{ default: db }, schema] = await Promise.all([
    import("../db/drizzle"),
    import("../db/schema"),
  ]);
  const { products, models } = schema;

  await mkdir(outputDir, { recursive: true });

  const productRows = await db
    .select()
    .from(products)
    .orderBy(asc(products.id));

  const modelRows = await db
    .select()
    .from(models)
    .orderBy(asc(models.productId), asc(models.id));

  const modelRowsByProduct = new Map<number, typeof modelRows>();
  for (const row of modelRows) {
    const existing = modelRowsByProduct.get(row.productId) || [];
    existing.push(row);
    modelRowsByProduct.set(row.productId, existing);
  }

  const rows: Record<string, unknown>[] = productRows.flatMap(
    (product, productIndex): Record<string, unknown>[] => {
    const children = modelRowsByProduct.get(product.id) || [];
    if (!children.length) {
      return [
        {
          productOrder: productIndex + 1,
          productId: product.id,
          productName: product.title,
          productActive: Boolean(product.active),
          productDescription: product.description || "",
          productSeries: asArray(product.series).join(", "),
          modelId: "",
          modelName: "",
          modelTitle: "",
          modelActive: "",
          machineType: "",
          series: "",
          shortDescription: "",
          seoDescription: "",
          fullDescription: "",
          specs: "",
          brochure: "",
        },
      ];
    }

    return children.map((model) => ({
      productOrder: productIndex + 1,
      productId: product.id,
      productName: product.title,
      productActive: Boolean(product.active),
      productDescription: product.description || "",
      productSeries: asArray(product.series).join(", "),
      modelId: model.id,
      modelName: model.modelNumber || "",
      modelTitle: model.modelTitle || "",
      modelActive: Boolean(model.active),
      machineType: model.machineType || "",
      series: model.series || "",
      shortDescription: model.shortDescription || "",
      seoDescription: model.seoDescription || "",
      fullDescription: flattenModelDescription(model.modelDescription),
      specs: flattenSpecs(model.keyFeatures),
      brochure: model.brochure || "",
    }));
  });

  const specsLong = modelRows.flatMap((model) =>
    asArray(model.keyFeatures).map((spec, index) => ({
      productId: model.productId,
      modelId: model.id,
      modelName: model.modelNumber || "",
      specOrder: index + 1,
      specName: String(spec?.name || "").trim(),
      specValue: String(spec?.value || "").trim(),
    })),
  );

  await writeFile(
    outputFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        products: productRows,
        models: modelRows,
        rows,
        specsLong,
      },
      null,
      2,
    ),
  );

  console.log(
    JSON.stringify({
      outputFile,
      products: productRows.length,
      models: modelRows.length,
      rows: rows.length,
      specs: specsLong.length,
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
