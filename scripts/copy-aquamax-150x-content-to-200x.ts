import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

function replaceModelVariant<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(/150X/g, "200X")
      .replace(/150x/g, "200x") as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceModelVariant(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceModelVariant(item)]),
    ) as T;
  }

  return value;
}

async function main() {
  const [{ default: db }, schema] = await Promise.all([
    import("../db/drizzle"),
    import("../db/schema"),
  ]);
  const { models } = schema;

  const [source] = await db
    .select()
    .from(models)
    .where(eq(models.modelNumber, "Rudra Aquamax 150X"))
    .limit(1);

  if (!source) {
    throw new Error("Source model not found: Rudra Aquamax 150X");
  }

  const [target] = await db
    .select()
    .from(models)
    .where(eq(models.modelNumber, "Rudra Aquamax 200X"))
    .limit(1);

  if (!target) {
    throw new Error("Target model not found: Rudra Aquamax 200X");
  }

  await db
    .update(models)
    .set({
      modelTitle: replaceModelVariant(source.modelTitle),
      machineType: source.machineType,
      series: source.series,
      thumbnail: source.thumbnail,
      thumbnailAltText: replaceModelVariant(source.thumbnailAltText),
      coverImage: source.coverImage,
      coverImageAltText: replaceModelVariant(source.coverImageAltText),
      keyFeatures: replaceModelVariant(source.keyFeatures),
      specsTableIntro: replaceModelVariant(source.specsTableIntro),
      brochure: source.brochure,
      modelDescription: replaceModelVariant(source.modelDescription),
      shortDescription: replaceModelVariant(source.shortDescription),
      seoDescription: replaceModelVariant(source.seoDescription),
      rentalAvailability: source.rentalAvailability,
      active: source.active,
      seoMetadata: replaceModelVariant(source.seoMetadata),
      updatedAt: new Date(),
    })
    .where(eq(models.id, target.id));

  console.log(
    JSON.stringify({
      copiedFrom: {
        id: source.id,
        modelNumber: source.modelNumber,
      },
      copiedTo: {
        id: target.id,
        modelNumber: target.modelNumber,
      },
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
