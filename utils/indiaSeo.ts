const INDIA_MARKET_KEYWORDS = [
  "India",
  "Indian worksites",
  "OFC trenching",
  "telecom infrastructure",
  "irrigation",
  "water management",
  "agriculture",
  "construction",
  "solar cable trenching",
];

export function indiaProductTitle(productName?: string, industryName?: string) {
  const product = productName || "Machinery";
  if (industryName) {
    return `${product} for ${industryName} in India | Autocracy Machinery`;
  }
  return `${product} in India | Autocracy Machinery`;
}

export function indiaProductDescription(
  productName?: string,
  industryName?: string,
  fallbackDescription?: string
) {
  const product = productName || "machinery";
  const industryPhrase = industryName
    ? ` for ${industryName.toLowerCase()} projects`
    : "";
  const base =
    fallbackDescription ||
    `${product} engineered for dependable performance across Indian project sites.`;

  return `${base} Built for India${industryPhrase}, with practical usage across OFC trenching, irrigation, water management, agriculture, construction, solar, and utility infrastructure.`;
}

export function indiaProductKeywords(productName?: string, industryName?: string) {
  const product = productName || "machinery";
  const keywordBase = [
    `${product} in India`,
    `${product} manufacturer in India`,
    `${product} supplier in India`,
    `${product} for Indian projects`,
    `trenchers in India`,
    `trenching machine in India`,
    ...INDIA_MARKET_KEYWORDS,
  ];

  if (industryName) {
    keywordBase.unshift(
      `${product} for ${industryName} in India`,
      `${industryName} machinery in India`,
      `${industryName} equipment India`
    );
  }

  return keywordBase.join(", ");
}

export function indiaModelTitle(modelNumber?: string, modelTitle?: string) {
  const name = [modelNumber, modelTitle].filter(Boolean).join(" ");
  return `${name || "Machine Model"} in India | Autocracy Machinery`;
}

export function indiaModelDescription(model: ModelObjectTypes) {
  const modelName = model.modelNumber || model.modelTitle || "This model";
  const product = model.productName || "machine";
  const machineType = model.machineType?.toLowerCase() || "machine";

  return `${modelName} is a ${machineType} for ${product.toLowerCase()} applications in India, built for OFC trenching, irrigation, agriculture, construction, water management, solar utility routes, and demanding Indian field conditions.`;
}

export function indiaModelKeywords(model: ModelObjectTypes, industryName?: string) {
  const modelName = [model.modelNumber, model.modelTitle].filter(Boolean).join(" ");
  const product = model.productName || "machinery";
  const keywords = [
    `${modelName} in India`,
    `${product} in India`,
    `${product} manufacturer in India`,
    `${product} supplier in India`,
    "trenchers in India",
    "trenching machine in India",
    "OFC trenching machine India",
    "irrigation trenching machine India",
    "utility trenching equipment India",
    ...INDIA_MARKET_KEYWORDS,
  ];

  if (industryName) {
    keywords.unshift(
      `${modelName} for ${industryName} in India`,
      `${industryName} equipment India`
    );
  }

  return keywords.filter(Boolean).join(", ");
}
