import { config as loadEnv } from "dotenv";
import { asc, eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

type ProductSpec = {
  product: string;
  models: string[];
};

const productAliases: Record<string, string[]> = {
  "Walk Behind Trenchers": ["Walk Behind Trencher"],
  "Sand filler": ["Sand Filler"],
  "Tractor Attachments": ["Attachments"],
  "Barges / Floating Pontoon": ["Floating Pontoon"],
};

const modelAliases: Record<string, string[]> = {
  "Rudra Aquamax 100": ["Rudra AquaMax 100"],
  "Rudra Aquamax 100X": ["Rudra AquaMax 100X"],
  "Rudra Aquamax 150X": ["Rudra AquaMax 150X"],
  "Rudra Aquamax 200X": ["Rudra AquaMax 200X"],
  "Rudra Amphimax 100EX": ["Rudra Amphimax"],
  "Rudra Prime mini": ["Rudra Prime Mini"],
  "Sand filler": ["Padding Machine"],
  "Pole Stacker 100X": ["Pole Stacker"],
  "Rudra Infielder": ["Rudra Infileder"],
};

const productSpecs: ProductSpec[] = [
  {
    product: "Trenchers",
    models: [
      "Rudra 100T",
      "Rudra 100",
      "Rudra 100XT",
      "Rudra 150XT",
      "Rudra 200XT",
      "Rudra HYT",
      "Rudra HYTB",
      "Gaja 100",
      "Gaja 100XT",
      "Gaja 200XT",
      "Gaja 300XT",
      "Gaja 200XC",
      "Gaja 300XC",
      "Gaja 400XCA",
      "Gaja 400XC",
      "Mayura TO",
      "Mayura TW",
      "Mayura TL",
      "Mayura T",
      "Wheel Trencher Chakra RS100",
    ],
  },
  {
    product: "Walk Behind Trenchers",
    models: ["Dhruva 100", "Dhruva HYT"],
  },
  {
    product: "Self-propelled Multi Attachments Machine",
    models: ["Rudra Prime Pro", "Rudra Prime mini"],
  },
  {
    product: "Post Hole Digger",
    models: ["Vedhan 50", "Vedhan 100", "Vedhan 150", "Earth Augers", "Mayura P"],
  },
  {
    product: "Aquatic Weed Harvester",
    models: [
      "Rudra Aquamax 100",
      "Rudra Aquamax 100X",
      "Rudra Aquamax 150X",
      "Rudra Aquamax 200X",
    ],
  },
  {
    product: "Amphibious Excavator",
    models: [
      "Rudra Amphimax 100EX",
      "Rudra Amphimax 150EX",
      "Rudra Amphimax 200EX",
      "Rudra Amphimax 250EX",
      "Rudra Amphimax 300EX",
      "Undercarriage Rudra Amphimax X",
    ],
  },
  { product: "Amphibious Work boats", models: ["Rudra Aqua Boat"] },
  { product: "Barges / Floating Pontoon", models: ["Rudra Amphipod PX100"] },
  { product: "Landscaping Equipment", models: ["Sod harvester", "Sod Sprigger"] },
  {
    product: "Tractor Attachments",
    models: [
      "Forklift 3T",
      "Forklift 5T",
      "Dozer Single Blade",
      "Dozer 2 Blade",
      "Heavy Duty Dozer 18T",
      "Back hoe",
      "Decoiler",
      "Breaker",
      "Front Loader Bucket",
      "Stone Picker",
    ],
  },
  { product: "Sand filler", models: ["Sand filler"] },
  { product: "Pole Stacker", models: ["Pole Stacker 100X", "Pole Stacker 100XC"] },
  { product: "Dredgers", models: [] },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function seriesFor(modelName: string, productName: string) {
  if (/^rudra/i.test(modelName)) return "Rudra";
  if (/^gaja/i.test(modelName)) return "Gaja";
  if (/^dhruva/i.test(modelName)) return "Dhruva";
  if (/^mayura/i.test(modelName)) return "Mayura";
  if (/^vedhan/i.test(modelName)) return "Vedhan";
  if (/^forklift/i.test(modelName)) return "Forklift";
  if (/^pole stacker/i.test(modelName)) return "Pole Stacker";
  if (/^sod/i.test(modelName)) return "Sod";
  if (/wheel trencher/i.test(modelName)) return "Chakra";
  if (/sand filler/i.test(modelName)) return "Sand filler";
  return productName;
}

function machineTypeFor(productName: string) {
  if (
    [
      "Tractor Attachments",
      "Landscaping Equipment",
      "Sand filler",
      "Post Hole Digger",
    ].includes(productName)
  ) {
    return "Attachment";
  }
  return "Equipment";
}

async function main() {
  const [{ default: db }, schema] = await Promise.all([
    import("../db/drizzle"),
    import("../db/schema"),
  ]);
  const { products, models } = schema;
  const now = new Date();

  const existingProducts = await db
    .select()
    .from(products)
    .orderBy(asc(products.id));
  const productsByName = new Map(
    existingProducts.map((product) => [normalize(product.title), product]),
  );

  const productByTarget = new Map<string, (typeof existingProducts)[number]>();
  const changes: string[] = [];

  for (const spec of productSpecs) {
    const candidateNames = [spec.product, ...(productAliases[spec.product] || [])];
    let product = candidateNames
      .map((name) => productsByName.get(normalize(name)))
      .find(Boolean);

    const series = Array.from(
      new Set(spec.models.map((model) => seriesFor(model, spec.product))),
    );

    if (!product) {
      const [created] = await db
        .insert(products)
        .values({
          title: spec.product,
          description: `${spec.product} product range.`,
          thumbnail: "",
          thumbnailAltText: spec.product,
          series,
          active: true,
          generalImage: "",
          generalImageAltText: spec.product,
          seoDescription: spec.product,
          seoMetadata: {
            structuredData: {
              type: "Product",
              title: spec.product,
              description: `${spec.product} product range.`,
              brand: "Autocracy Machinery",
              category: spec.product,
              hasOfferCatalog: {
                name: spec.product,
                totalModels: spec.models.length,
                availableSeries: series,
                modelOverview: spec.models.map((model) => ({
                  name: model,
                  description: model,
                  series: seriesFor(model, spec.product),
                })),
              },
            },
          },
        })
        .returning();
      product = created;
      productsByName.set(normalize(spec.product), product);
      changes.push(`created product: ${spec.product}`);
    } else {
      await db
        .update(products)
        .set({
          title: spec.product,
          series,
          active: true,
          updatedAt: now,
        })
        .where(eq(products.id, product.id));
      product = { ...product, title: spec.product, series, active: true };
      productsByName.set(normalize(spec.product), product);
      productAliases[spec.product]?.forEach((alias) =>
        productsByName.set(normalize(alias), product!),
      );
      changes.push(`updated product: ${spec.product}`);
    }

    productByTarget.set(spec.product, product);
  }

  const existingModels = await db.select().from(models).orderBy(asc(models.id));
  const modelsByNumber = new Map(
    existingModels.map((model) => [normalize(model.modelNumber), model]),
  );

  for (const spec of productSpecs) {
    const product = productByTarget.get(spec.product);
    if (!product) continue;

    for (const modelName of spec.models) {
      const candidateNames = [modelName, ...(modelAliases[modelName] || [])];
      let model = candidateNames
        .map((name) => modelsByNumber.get(normalize(name)))
        .find(Boolean);
      const series = seriesFor(modelName, spec.product);

      if (!model) {
        const [created] = await db
          .insert(models)
          .values({
            modelNumber: modelName,
            modelTitle: modelName,
            machineType: machineTypeFor(spec.product),
            productId: product.id,
            series,
            thumbnail: product.thumbnail || "",
            thumbnailAltText: modelName,
            coverImage: product.generalImage || product.thumbnail || "",
            coverImageAltText: modelName,
            keyFeatures: [],
            specsTableIntro: {},
            brochure: "",
            modelDescription: [],
            shortDescription: modelName,
            seoDescription: modelName,
            rentalAvailability: false,
            active: true,
            seoMetadata: {
              structuredData: {
                type: "Product",
                name: modelName,
                description: modelName,
                brand: "Autocracy Machinery",
                category: spec.product,
              },
            },
          })
          .returning();
        model = created;
        changes.push(`created model: ${spec.product} > ${modelName}`);
      } else {
        await db
          .update(models)
          .set({
            modelNumber: modelName,
            productId: product.id,
            series,
            active: true,
            updatedAt: now,
          })
          .where(eq(models.id, model.id));
        changes.push(`mapped model: ${spec.product} > ${modelName}`);
      }

      modelsByNumber.set(normalize(modelName), {
        ...model,
        modelNumber: modelName,
        productId: product.id,
        series,
      });
    }
  }

  const agriculturalAttachments = productsByName.get(
    normalize("Agricultural Attachments"),
  );
  const rudraInfielder = modelsByNumber.get(normalize("Rudra Infielder"));
  if (agriculturalAttachments && rudraInfielder) {
    await db
      .update(models)
      .set({
        productId: agriculturalAttachments.id,
        series: "Rudra Infielder",
        updatedAt: now,
      })
      .where(eq(models.id, rudraInfielder.id));
    changes.push("moved legacy model: Agricultural Attachments > Rudra Infielder");
  }

  console.log(
    JSON.stringify(
      {
        productsInSheet: productSpecs.length,
        modelsInSheet: productSpecs.reduce(
          (count, spec) => count + spec.models.length,
          0,
        ),
        changes,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
