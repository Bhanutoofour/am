import { config as loadEnv } from "dotenv";
import { eq, inArray } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

type ChartIndustry =
  | "ofc"
  | "environmental"
  | "energy"
  | "water"
  | "agriculture"
  | "defence"
  | "construction"
  | "landscape";

type ChartRow = {
  product: string;
  model: string;
  industries: ChartIndustry[];
};

const industryAliases: Record<ChartIndustry, string[]> = {
  ofc: [
    "OFC",
    "OFC Telecommunications",
    "OFC (Optical Fibre Cable)",
    "Optical Fibre Cable",
  ],
  environmental: [
    "Environmental & Sustainability",
    "Environmental Sustainability",
  ],
  energy: [
    "Energy (Solar, Wind and Power Transmission)",
    "Energy & Power Transmission",
    "Solar Energy",
  ],
  water: ["Water Management"],
  agriculture: ["Agriculture"],
  defence: ["Army/Defence", "Army Defence", "Defence"],
  construction: ["Construction"],
  landscape: ["Landscape", "Landscaping"],
};

const productAliases: Record<string, string[]> = {
  "Walk Behind Trenchers": ["Walk Behind Trencher"],
  "Self-propelled Multi Attachments Machine": [
    "Self Propelled Multi Attachments Machine",
    "Self-propelled Multi Attachments",
  ],
  "Barges / Floating Pontoon": ["Floating Pontoon"],
  "Sand filler": ["Sand Filler", "Padding Machine"],
  "Solar Equipments": ["Solar Equipment", "Pole Stacker"],
  HDD: ["Horizontal Directional Drilling", "HDD"],
};

const modelAliases: Record<string, string[]> = {
  "Rudra Aquamax 100": ["Rudra AquaMax 100"],
  "Rudra Aquamax 100X": ["Rudra AquaMax 100X"],
  "Rudra Aquamax 150X": ["Rudra AquaMax 150X"],
  "Rudra Aquamax 200X": ["Rudra AquaMax 200X"],
  "Rudra Prime mini": ["Rudra Prime Mini"],
  "Rudra Amphimax 100EX": ["Rudra Amphimax"],
  "Rudra Amphimax 300EX": ["Rudra Amphimax 300X"],
  "Sand filler": ["Sand Filler", "Padding Machine"],
  "Pole Stacker 100X": ["Pole Stacker"],
  "Horizontal directional drilling machine": [
    "Horizontal Directional Drilling Machine",
  ],
};

const chartRows: ChartRow[] = [
  { product: "Trenchers", model: "Rudra 100T", industries: ["water", "agriculture"] },
  { product: "Trenchers", model: "Rudra 100", industries: ["water", "agriculture"] },
  { product: "Trenchers", model: "Rudra 100XT", industries: ["energy", "water", "agriculture", "defence", "construction"] },
  { product: "Trenchers", model: "Rudra 150XT", industries: ["ofc", "water", "defence", "construction"] },
  { product: "Trenchers", model: "Rudra 200XT", industries: ["ofc", "water", "agriculture", "defence", "construction"] },
  { product: "Trenchers", model: "Rudra HYT", industries: ["ofc"] },
  { product: "Trenchers", model: "Rudra HYTB", industries: ["ofc"] },
  { product: "Trenchers", model: "Gaja 100", industries: ["ofc", "agriculture"] },
  { product: "Trenchers", model: "Gaja 100XT", industries: ["ofc", "energy", "water", "agriculture", "construction"] },
  { product: "Trenchers", model: "Gaja 200XT", industries: ["ofc", "energy", "water", "agriculture", "defence", "construction"] },
  { product: "Trenchers", model: "Gaja 300XT", industries: ["water", "defence", "construction"] },
  { product: "Trenchers", model: "Gaja 200XC", industries: ["energy", "defence"] },
  { product: "Trenchers", model: "Gaja 300XC", industries: ["energy", "defence"] },
  { product: "Trenchers", model: "Gaja 400XCA", industries: ["energy", "defence"] },
  { product: "Trenchers", model: "Gaja 400XC", industries: ["energy", "defence"] },
  { product: "Trenchers", model: "Mayura TO", industries: ["ofc", "energy", "agriculture", "defence", "construction"] },
  { product: "Trenchers", model: "Mayura TW", industries: ["energy", "water", "agriculture", "defence", "construction", "landscape"] },
  { product: "Trenchers", model: "Mayura TL", industries: ["energy", "defence", "construction"] },
  { product: "Trenchers", model: "Mayura T", industries: ["energy", "defence", "construction"] },
  { product: "Trenchers", model: "Wheel Trencher Chakra RS100", industries: ["ofc", "construction"] },
  { product: "Walk Behind Trenchers", model: "Dhruva 100", industries: ["energy", "water", "agriculture", "construction", "landscape"] },
  { product: "Walk Behind Trenchers", model: "Dhruva HYT", industries: ["energy", "water", "agriculture", "construction", "landscape"] },
  { product: "Self-propelled Multi Attachments Machine", model: "Rudra Prime Pro", industries: ["energy", "water", "agriculture", "defence", "construction", "landscape"] },
  { product: "Self-propelled Multi Attachments Machine", model: "Rudra Prime mini", industries: ["energy", "agriculture", "defence", "construction", "landscape"] },
  { product: "Post Hole Digger", model: "Vedhan 50", industries: ["ofc", "construction", "landscape"] },
  { product: "Post Hole Digger", model: "Vedhan 100", industries: ["ofc", "construction", "landscape"] },
  { product: "Post Hole Digger", model: "Vedhan 150", industries: ["ofc", "construction", "landscape"] },
  { product: "Post Hole Digger", model: "Mayura P", industries: ["ofc", "energy", "agriculture", "defence"] },
  { product: "Aquatic Weed Harvester", model: "Rudra Aquamax 100", industries: ["environmental"] },
  { product: "Aquatic Weed Harvester", model: "Rudra Aquamax 100X", industries: ["environmental"] },
  { product: "Aquatic Weed Harvester", model: "Rudra Aquamax 150X", industries: ["environmental"] },
  { product: "Aquatic Weed Harvester", model: "Rudra Aquamax 200X", industries: ["environmental"] },
  { product: "Amphibious Excavator", model: "Rudra Amphimax 100EX", industries: ["environmental"] },
  { product: "Amphibious Excavator", model: "Rudra Amphimax 200EX", industries: ["environmental"] },
  { product: "Amphibious Excavator", model: "Rudra Amphimax 300EX", industries: ["environmental"] },
  { product: "Amphibious Excavator", model: "Rudra Amphimax 150EX", industries: ["environmental"] },
  { product: "Amphibious Excavator", model: "Rudra Amphimax 250EX", industries: ["environmental"] },
  { product: "Amphibious Excavator", model: "Undercarriage Rudra Amphimax X", industries: ["environmental"] },
  { product: "Amphibious Work boats", model: "Rudra Aqua Boat", industries: ["environmental"] },
  { product: "Barges / Floating Pontoon", model: "Rudra Amphipod PX100", industries: ["environmental"] },
  { product: "Landscaping Equipment", model: "Sod harvester", industries: ["agriculture", "landscape"] },
  { product: "Landscaping Equipment", model: "Sod Sprigger", industries: ["agriculture", "landscape"] },
  { product: "Tractor Attachments", model: "Forklift 3T", industries: ["ofc", "energy", "agriculture", "defence", "construction", "landscape"] },
  { product: "Tractor Attachments", model: "Forklift 5T", industries: ["ofc", "energy", "agriculture", "defence", "construction", "landscape"] },
  { product: "Tractor Attachments", model: "Earth Augers", industries: [] },
  { product: "Tractor Attachments", model: "Dozer Single Blade", industries: ["agriculture", "construction"] },
  { product: "Tractor Attachments", model: "Dozer 2 Blade", industries: ["agriculture", "construction"] },
  { product: "Tractor Attachments", model: "Heavy Duty Dozer 18T", industries: [] },
  { product: "Tractor Attachments", model: "Back hoe", industries: [] },
  { product: "Tractor Attachments", model: "Decoiler", industries: ["ofc"] },
  { product: "Tractor Attachments", model: "Breaker", industries: [] },
  { product: "Tractor Attachments", model: "Front Loader Bucket", industries: [] },
  { product: "Tractor Attachments", model: "Stone Picker", industries: ["agriculture"] },
  { product: "Sand filler", model: "Sand filler", industries: ["energy"] },
  { product: "Solar Equipments", model: "Pole Stacker 100X", industries: ["energy"] },
  { product: "Solar Equipments", model: "Pole Stacker 100XC", industries: ["energy"] },
  { product: "Dredgers", model: "Dredgers", industries: [] },
  { product: "HDD", model: "Horizontal directional drilling machine", industries: ["ofc"] },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function candidateNames(name: string, aliases: Record<string, string[]>) {
  return [name, ...(aliases[name] || [])];
}

async function main() {
  const apply = process.argv.includes("--apply");
  const [{ default: db }, schema] = await Promise.all([
    import("../db/drizzle"),
    import("../db/schema"),
  ]);
  const { industries, products, models, productIndustries, modelIndustries } =
    schema;

  const [industryRows, productRows, modelRows] = await Promise.all([
    db.select().from(industries),
    db.select().from(products),
    db.select().from(models),
  ]);

  const industriesByName = new Map(
    industryRows.map((row) => [normalize(row.title), row]),
  );
  const productsByName = new Map(
    productRows.map((row) => [normalize(row.title), row]),
  );
  const modelsByName = new Map(
    modelRows.map((row) => [normalize(row.modelNumber), row]),
  );

  const industryIdByKey = new Map<ChartIndustry, number>();
  const missingIndustries: string[] = [];
  for (const key of Object.keys(industryAliases) as ChartIndustry[]) {
    const industry = industryAliases[key]
      .map((name) => industriesByName.get(normalize(name)))
      .find(Boolean);
    if (industry) {
      industryIdByKey.set(key, industry.id);
    } else {
      missingIndustries.push(`${key}: ${industryAliases[key].join(" / ")}`);
    }
  }

  const modelMappings: {
    modelId: number;
    productId: number;
    currentProductId: number;
    industryIds: number[];
  }[] = [];
  const productIndustryIds = new Map<number, Set<number>>();
  const mappedProductIds = new Set<number>();
  const missingProducts: string[] = [];
  const missingModels: string[] = [];

  for (const row of chartRows) {
    const product = candidateNames(row.product, productAliases)
      .map((name) => productsByName.get(normalize(name)))
      .find(Boolean);
    const model = candidateNames(row.model, modelAliases)
      .map((name) => modelsByName.get(normalize(name)))
      .find(Boolean);

    if (!product) {
      missingProducts.push(row.product);
      continue;
    }

    mappedProductIds.add(product.id);
    const current = productIndustryIds.get(product.id) || new Set<number>();

    if (!model) {
      missingModels.push(row.model);
      productIndustryIds.set(product.id, current);
      continue;
    }

    const industryIds = unique(
      row.industries
        .map((key) => industryIdByKey.get(key))
        .filter((id): id is number => typeof id === "number"),
    );

    modelMappings.push({
      modelId: model.id,
      productId: product.id,
      currentProductId: model.productId,
      industryIds,
    });
    industryIds.forEach((industryId) => current.add(industryId));
    productIndustryIds.set(product.id, current);
  }

  const summary = {
    mode: apply ? "apply" : "dry-run",
    industries: industryRows.map((row) => `${row.id}: ${row.title}`),
    productsToUpdate: mappedProductIds.size,
    modelsToUpdate: modelMappings.length,
    modelProductReassignments: modelMappings.filter(
      (item) => item.currentProductId !== item.productId,
    ).length,
    missingIndustries,
    missingProducts: unique(missingProducts),
    missingModels: unique(missingModels),
  };

  console.log(JSON.stringify(summary, null, 2));

  if (!apply) return;
  if (missingIndustries.length) {
    throw new Error("Resolve missing industries before applying the mapping.");
  }

  const modelIds = modelMappings.map((item) => item.modelId);
  const productIds = Array.from(mappedProductIds);

  if (modelIds.length) {
    await db
      .delete(modelIndustries)
      .where(inArray(modelIndustries.modelId, modelIds));
  }
  if (productIds.length) {
    await db
      .delete(productIndustries)
      .where(inArray(productIndustries.productId, productIds));
  }
  for (const item of modelMappings) {
    if (item.currentProductId !== item.productId) {
      await db
        .update(models)
        .set({ productId: item.productId, updatedAt: new Date() })
        .where(eq(models.id, item.modelId));
    }
  }

  const modelJoinRows = modelMappings.flatMap((item) =>
    item.industryIds.map((industryId) => ({
      modelId: item.modelId,
      industryId,
    })),
  );
  const productJoinRows = Array.from(productIndustryIds.entries()).flatMap(
    ([productId, ids]) =>
      Array.from(ids).map((industryId) => ({
        productId,
        industryId,
      })),
  );

  if (modelJoinRows.length) {
    await db.insert(modelIndustries).values(modelJoinRows).onConflictDoNothing();
  }
  if (productJoinRows.length) {
    await db
      .insert(productIndustries)
      .values(productJoinRows)
      .onConflictDoNothing();
  }

  console.log(
    JSON.stringify(
      {
        updatedProducts: productIds.length,
        updatedModels: modelIds.length,
        modelProductReassignments: modelMappings.filter(
          (item) => item.currentProductId !== item.productId,
        ).length,
        productIndustryRows: productJoinRows.length,
        modelIndustryRows: modelJoinRows.length,
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
