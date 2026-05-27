import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

type Feature = {
  name?: string;
  value?: string;
};

type TemplateSection = {
  key: string;
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  paragraphs?: string[];
};

type ModelRecord = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  productId: number;
  series: string;
  keyFeatures?: Feature[] | null;
  specsTableIntro?: { heading?: string; paragraph?: string } | null;
  seoMetadata?: Record<string, any> | null;
};

type ProductRecord = {
  id: number;
  title: string;
};

type IndustryRecord = {
  id: number;
  title: string;
};

const DEFAULT_SPECS_TABLE_HEADING = "Precision Machines. Project-Ready.";
const DEFAULT_SPECS_TABLE_PARAGRAPH =
  "Built for performance. Trusted by contractors, municipalities, and EPC teams across sectors.";
const KEY_FEATURE_DESCRIPTION_LIMIT = 6;

function cleanList(values: Array<string | undefined>): string[] {
  return values.map((value) => value?.trim() || "").filter(Boolean);
}

function buildFeatureDescription(
  model: ModelRecord,
  productName: string,
  feature: Feature
) {
  const modelName = model.modelNumber || "this model";
  const productLower = (productName || "projects").toLowerCase();
  const featureName = feature.name || "This feature";
  const featureValue = feature.value || "project-ready performance";

  return `${featureValue} ${featureName.toLowerCase()} capability helps ${modelName} support practical ${productLower} work with controlled output, dependable operation, and smoother field execution.`;
}

function buildOverviewExtraParagraphs(model: ModelRecord, productName: string) {
  const modelName = model.modelNumber || "This model";
  const machineType = model.machineType || "machine";
  const featureSummary = model.keyFeatures
    ?.filter((feature) => feature.name && feature.value)
    .slice(0, 4)
    .map((feature) => `${feature.name}: ${feature.value}`)
    .join(", ");

  return [
    featureSummary
      ? `${modelName} brings together key working specifications such as ${featureSummary}, giving teams a clearer way to compare fit before deployment.`
      : `${modelName} is built to support practical ${productName.toLowerCase()} work where site access, output goals, and operating reliability matter.`,
    `As a ${machineType.toLowerCase()}, ${modelName} helps contractors and operators plan daily work with better control over field execution, machine fit, and project handoff.`,
  ];
}

function buildIndustryFitParagraphs(
  model: ModelRecord,
  productName: string,
  industryNames: string[]
) {
  const modelName = model.modelNumber || "This model";
  const productLower = (productName || "machine").toLowerCase();
  const industries = [
    ...industryNames,
    "OFC Telecommunications",
    "Water Management",
    "Agriculture",
    "Construction",
    "Solar Energy",
    "Defence",
  ]
    .map((industry) => industry.trim())
    .filter(Boolean)
    .filter((industry, index, list) => list.indexOf(industry) === index)
    .slice(0, 6);

  return industries.map(
    (industry) =>
      `${modelName} is suited for ${industry.toLowerCase()} teams that need dependable ${productLower} performance, cleaner site execution, and faster project handoff.`
  );
}

function buildApplicationParagraphs(model: ModelRecord, productName: string) {
  const modelName = model.modelNumber || "this model";
  const productLower = (productName || "this product").toLowerCase();
  const machineType = model.machineType || "machine";
  const [firstFeature, secondFeature, thirdFeature] = model.keyFeatures || [];

  return [
    `${modelName} supports ${productLower} work across utility routes, rural sites, and practical field conditions where consistent machine output matters.`,
    firstFeature
      ? `${firstFeature.value} ${firstFeature.name?.toLowerCase()} helps teams plan equipment fit, route preparation, and day-to-day execution before deployment.`
      : "Teams can use the specifications above to plan deployment, route access, and output expectations before field work begins.",
    `${modelName} is configured as a ${machineType.toLowerCase()}, helping contractors and operators understand how it fits with existing fleet resources and site workflows.`,
    secondFeature
      ? `${secondFeature.value} ${secondFeature.name?.toLowerCase()} supports controlled operation, while ${
          thirdFeature
            ? `${thirdFeature.value} ${thirdFeature.name?.toLowerCase()}`
            : "its working capability"
        } helps improve project predictability.`
      : `${modelName} is built to help teams improve execution speed, reduce manual effort, and keep worksite output more predictable.`,
  ];
}

function buildFaqParagraphs(model: ModelRecord, productName: string) {
  const modelName = model.modelNumber || "this model";
  const productLower = (productName || "this product").toLowerCase();
  const productTitle = productName || "this product";
  const machineType = model.machineType || "machine";
  const [firstFeature, secondFeature, thirdFeature] = model.keyFeatures || [];

  return [
    [
      `What is ${modelName} used for?`,
      `${modelName} is designed for ${productLower} applications where teams need dependable field execution, controlled output, and practical deployment across project sites.`,
    ],
    [
      `Is ${modelName} an attachment or equipment?`,
      `${modelName} is listed as a ${machineType.toLowerCase()}, helping buyers understand how it fits into their existing fleet and site workflow.`,
    ],
    [
      firstFeature
        ? `What is the ${firstFeature.name?.toLowerCase()} of ${modelName}?`
        : `What are the main specifications of ${modelName}?`,
      firstFeature
        ? `${modelName} offers ${firstFeature.value} for ${firstFeature.name?.toLowerCase()}, supporting better planning before deployment.`
        : `The specification cards above summarize the main working details for ${modelName}.`,
    ],
    [
      secondFeature
        ? `How does ${secondFeature.name?.toLowerCase()} help on site?`
        : `How do I confirm if ${modelName} fits my project?`,
      secondFeature
        ? `${secondFeature.value} ${secondFeature.name?.toLowerCase()} helps operators match the machine to project conditions, output goals, and field constraints.`
        : `Share your site conditions, output goals, and working requirements with Autocracy Machinery to confirm model fit.`,
    ],
    [
      thirdFeature
        ? `Why is ${thirdFeature.name?.toLowerCase()} important?`
        : `Can I request a brochure for ${modelName}?`,
      thirdFeature
        ? `${thirdFeature.value} ${thirdFeature.name?.toLowerCase()} supports predictable operation and helps project teams plan daily productivity more accurately.`
        : `Yes. Use the brochure button on this page to request or download available model information.`,
    ],
    [
      `How do I get a quote for ${modelName}?`,
      `Use the quote button and share your project details. The Autocracy team can guide model fit, brochure details, and next steps for ${productLower} requirements.`,
    ],
    [
      `Which industries commonly use ${modelName}?`,
      `${modelName} can support industry applications where teams need reliable ${productLower} output, controlled site execution, and practical equipment fit.`,
    ],
    [
      `Can ${modelName} work in mixed site conditions?`,
      `${modelName} is intended for practical field deployment, helping operators plan around soil, access, productivity, and site constraints before work begins.`,
    ],
    [
      `What details should I share before buying ${modelName}?`,
      `Share your industry, site location, working depth or output needs, available carrier or fleet details, and timeline so the team can recommend the right configuration.`,
    ],
    [
      `Is brochure support available for ${modelName}?`,
      `Yes. Use the brochure request option to receive available model information, specifications, and supporting details for ${modelName}.`,
    ],
    [
      `Can Autocracy help confirm the right model for my location?`,
      `Yes. Submit your contact details, industry, and location, and the Autocracy team can help review model fit for your project conditions.`,
    ],
  ].map(([question, answer]) => `${question} || ${answer}`);
}

function generatedSections(
  model: ModelRecord,
  productName: string,
  industryNames: string[]
): TemplateSection[] {
  const modelName = model.modelNumber || "this model";
  const productLower = (productName || "product").toLowerCase();
  const featureParagraphs = (model.keyFeatures || [])
    .slice(0, KEY_FEATURE_DESCRIPTION_LIMIT)
    .map((feature) => buildFeatureDescription(model, productName, feature));

  return [
    {
      key: "hero",
      enabled: true,
      paragraphs: buildOverviewExtraParagraphs(model, productName),
    },
    {
      key: "specs",
      enabled: true,
      heading:
        model.specsTableIntro?.heading?.trim() || DEFAULT_SPECS_TABLE_HEADING,
      intro:
        model.specsTableIntro?.paragraph?.trim() ||
        DEFAULT_SPECS_TABLE_PARAGRAPH,
    },
    {
      key: "keyFeatures",
      enabled: true,
      heading: "Key Features",
      intro: `Discover what makes the ${modelName} stand out from the competition`,
      paragraphs: featureParagraphs,
    },
    {
      key: "industryFit",
      enabled: true,
      eyebrow: "BEST SUITED FOR INDUSTRIES",
      heading: `${modelName} fits demanding ${productLower} applications`,
      intro: `Match ${modelName} with industry use cases where equipment reliability, field output, and site readiness matter most.`,
      paragraphs: buildIndustryFitParagraphs(model, productName, industryNames),
    },
    {
      key: "applications",
      enabled: true,
      eyebrow: "PRODUCT FIT",
      heading: `${modelName} for practical ${productLower} work`,
      intro: `Understand how ${modelName} fits project planning, field deployment, and daily operating priorities.`,
      paragraphs: buildApplicationParagraphs(model, productName),
    },
    {
      key: "moreModels",
      enabled: true,
      heading: `More Models in ${model.series} Series`,
    },
    {
      key: "faqs",
      enabled: true,
      heading: "Frequently Asked Questions",
      intro: `Common questions about ${modelName} specifications, applications, and project fit.`,
      paragraphs: buildFaqParagraphs(model, productName),
    },
    {
      key: "contact",
      enabled: true,
    },
  ];
}

function mergeSection(
  generated: TemplateSection,
  existing: TemplateSection | undefined
): TemplateSection {
  if (!existing) return generated;

  return {
    key: existing.key || generated.key,
    enabled: existing.enabled !== false,
    eyebrow: existing.eyebrow?.trim() || generated.eyebrow,
    heading: existing.heading?.trim() || generated.heading,
    intro: existing.intro?.trim() || generated.intro,
    paragraphs: cleanList(existing.paragraphs || []).length
      ? cleanList(existing.paragraphs || [])
      : generated.paragraphs,
  };
}

async function main() {
  const [{ default: db }, schema] = await Promise.all([
    import("../db/drizzle"),
    import("../db/schema"),
  ]);
  const { models, products, industries, modelIndustries } = schema;

  const [modelRows, productRows, industryRows, modelIndustryRows] =
    await Promise.all([
      db.select().from(models),
      db.select().from(products),
      db.select().from(industries),
      db.select().from(modelIndustries),
    ]);

  const productsById = new Map(
    (productRows as ProductRecord[]).map((product) => [product.id, product])
  );
  const industriesById = new Map(
    (industryRows as IndustryRecord[]).map((industry) => [industry.id, industry])
  );
  const industryNamesByModelId = new Map<number, string[]>();

  for (const row of modelIndustryRows as Array<{
    modelId: number;
    industryId: number;
  }>) {
    const industry = industriesById.get(row.industryId);
    if (!industry) continue;

    const names = industryNamesByModelId.get(row.modelId) || [];
    names.push(industry.title);
    industryNamesByModelId.set(row.modelId, names);
  }

  let updated = 0;

  for (const model of modelRows as ModelRecord[]) {
    const productName = productsById.get(model.productId)?.title || "this product";
    const industryNames = industryNamesByModelId.get(model.id) || [];
    const seoMetadata = model.seoMetadata || {};
    const pageTemplates = seoMetadata.pageTemplates || {};
    const productTemplate = pageTemplates.productModel || {};
    const existingSections = Array.isArray(productTemplate.sections)
      ? (productTemplate.sections as TemplateSection[])
      : [];
    const existingByKey = new Map(
      existingSections.map((section) => [section.key, section])
    );
    const sections = generatedSections(model, productName, industryNames).map(
      (section) => mergeSection(section, existingByKey.get(section.key))
    );

    await db
      .update(models)
      .set({
        seoMetadata: {
          ...seoMetadata,
          pageTemplates: {
            ...pageTemplates,
            productModel: {
              ...productTemplate,
              templateName: productTemplate.templateName || "Product Template",
              sections,
            },
          },
        },
        updatedAt: new Date(),
      })
      .where(eq(models.id, model.id));

    updated += 1;
  }

  console.log(JSON.stringify({ updated }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
