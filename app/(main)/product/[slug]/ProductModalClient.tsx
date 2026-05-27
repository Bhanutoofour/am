"use client";
import React, { useState } from "react";
import styles from "./modalStyles.module.scss";
import Image from "next/image";
import ModelOverview from "@/component/molecules/modelDetailsCard/ModelDetailsCard";
import ModelCard from "@/component/sections/modelCard/ModelCard";
import ContactUs from "@/component/sections/contactUs/ContactUs";
import { ICONS } from "@/constants/Images/images";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import ModelResponsiveCard from "@/component/sections/modelResponsiveCard/ModelResponsiveCard";
import BrochureDownloadModal from "@/component/GetQuoteModal/BrochureDownloadModal";
import GetQuoteModal from "@/component/GetQuoteModal/GetQuoteModal";
import { titleToSlug } from "@/utils/slug";
import IndustryApplicationSections from "./IndustryApplicationSections";
import FaqAccordion from "@/component/sections/faqAccordion/FaqAccordion";

const DEFAULT_SPECS_TABLE_HEADING = "Precision Machines. Project-Ready.";
const DEFAULT_SPECS_TABLE_PARAGRAPH =
  "Built for performance. Trusted by contractors, municipalities, and EPC teams across sectors.";
const KEY_FEATURE_DESCRIPTION_LIMIT = 6;
const HTML_PATTERN = /<\/?[a-z][\s\S]*>/i;

type ProductModalClientProps = {
  modelData: ModelObjectTypes | null;
  seriesData: Model[] | null;
  pageVariant?: "product" | "productModel" | "industry";
  modelBasePath?: string;
  industryTitle?: string;
  industrySlug?: string;
};

type ProductModelMedia = {
  type: "image" | "video";
  src: string;
  thumbnail: string;
  alt: string;
  title: string;
};

type ProductModelFaq = {
  question: string;
  answer: string;
};

function RichDescription({
  paragraphs,
  className,
}: {
  paragraphs?: string[];
  className?: string;
}) {
  const lines = Array.isArray(paragraphs)
    ? paragraphs.filter((paragraph) => String(paragraph || "").trim())
    : [];

  if (!lines.length) return null;

  const richHtml = lines.length === 1 && HTML_PATTERN.test(lines[0]);

  if (richHtml) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: lines[0] }}
      />
    );
  }

  return (
    <div className={className}>
      {lines.map((paragraph, index) => (
        <p key={`${paragraph}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}

type ProductApplicationCard = {
  title: string;
  text: string;
};

type ProductIndustryFitCard = {
  title: string;
  text: string;
};

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;

  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );

  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
}

function buildProductModelMedia(
  modelData: ModelObjectTypes | null
): ProductModelMedia[] {
  if (!modelData) return [];

  const imageMedia: ProductModelMedia[] = [];
  const videoMedia: ProductModelMedia[] = [];

  if (modelData.coverImage) {
    imageMedia.push({
      type: "image",
      src: modelData.coverImage,
      thumbnail: modelData.coverImage,
      alt: modelData.coverImageAltText || `${modelData.modelNumber} cover image`,
      title: modelData.modelNumber || "Model image",
    });
  }

  asArray(modelData.modelDescription).forEach((item) => {
    if (item.image) {
      imageMedia.push({
        type: "image",
        src: item.image,
        thumbnail: item.image,
        alt: item.imageAltText || item.title || `${modelData.modelNumber} image`,
        title: item.title || modelData.modelNumber || "Model image",
      });
    }

    const embedUrl = getYouTubeEmbedUrl(item.youtubeLink);
    if (embedUrl) {
      videoMedia.push({
        type: "video",
        src: embedUrl,
        thumbnail: item.image || modelData.coverImage,
        alt: item.title || `${modelData.modelNumber} video`,
        title: item.title || `${modelData.modelNumber} video`,
      });
    }
  });

  return [...imageMedia, ...videoMedia].filter(
    (item, index, items) =>
      item.src &&
      items.findIndex((mediaItem) => mediaItem.src === item.src) === index
  );
}

function buildFeatureDescription(
  modelData: ModelObjectTypes | null,
  feature: ModelFeature,
  isIndiaMarket = false
): string {
  const modelName = modelData?.modelNumber || "this model";
  const productName = (modelData?.productName || "projects").toLowerCase();
  const featureName = feature.name || "This feature";
  const featureValue = feature.value || "project-ready performance";

  if (isIndiaMarket) {
    return `${featureValue} ${featureName.toLowerCase()} capability helps ${modelName} support ${productName} work in India with controlled output, dependable operation, and smoother execution across OFC, irrigation, utility, agriculture, and construction sites.`;
  }

  return `${featureValue} ${featureName.toLowerCase()} capability helps ${modelName} support practical ${productName} work with controlled output, dependable operation, and smoother field execution.`;
}

function buildProductModelFaqs(
  modelData: ModelObjectTypes | null,
  isIndiaMarket = false
): ProductModelFaq[] {
  const modelName = modelData?.modelNumber || "this model";
  const productName = modelData?.productName || "this product";
  const machineType = modelData?.machineType || "machine";
  const firstFeature = modelData?.keyFeatures?.[0];
  const secondFeature = modelData?.keyFeatures?.[1];
  const thirdFeature = modelData?.keyFeatures?.[2];

  return [
    {
      question: isIndiaMarket
        ? `What is ${modelName} used for in India?`
        : `What is ${modelName} used for?`,
      answer: isIndiaMarket
        ? `${modelName} is designed for ${productName.toLowerCase()} applications in India, including OFC trenching, irrigation, utility routes, agriculture, construction, solar cable trenching, and water management projects.`
        : `${modelName} is designed for ${productName.toLowerCase()} applications where teams need dependable field execution, controlled output, and practical deployment across project sites.`,
    },
    {
      question: `Is ${modelName} an attachment or equipment?`,
      answer: isIndiaMarket
        ? `${modelName} is listed as a ${machineType.toLowerCase()}, helping Indian contractors and project teams understand how it fits into existing tractors, carriers, fleets, and site workflows.`
        : `${modelName} is listed as a ${machineType.toLowerCase()}, helping buyers understand how it fits into their existing fleet and site workflow.`,
    },
    {
      question: firstFeature
        ? `What is the ${firstFeature.name.toLowerCase()} of ${modelName}?`
        : `What are the main specifications of ${modelName}?`,
      answer: firstFeature
        ? `${modelName} offers ${firstFeature.value} for ${firstFeature.name.toLowerCase()}, supporting better planning before deployment.`
        : `The specification cards above summarize the main working details for ${modelName}.`,
    },
    {
      question: secondFeature
        ? `How does ${secondFeature.name.toLowerCase()} help on site?`
        : `How do I confirm if ${modelName} fits my project?`,
      answer: secondFeature
        ? `${secondFeature.value} ${secondFeature.name.toLowerCase()} helps operators match the machine to project conditions, output goals, and field constraints.`
        : `Share your site conditions, output goals, and working requirements with Autocracy Machinery to confirm model fit.`,
    },
    {
      question: thirdFeature
        ? `Why is ${thirdFeature.name.toLowerCase()} important?`
        : `Can I request a brochure for ${modelName}?`,
      answer: thirdFeature
        ? `${thirdFeature.value} ${thirdFeature.name.toLowerCase()} supports predictable operation and helps project teams plan daily productivity more accurately.`
        : `Yes. Use the brochure button on this page to request or download available model information.`,
    },
    {
      question: `How do I get a quote for ${modelName}?`,
      answer: isIndiaMarket
        ? `Use the quote button and share your industry, location in India, carrier details, and project requirement. The Autocracy team can guide model fit, brochure details, and next steps for ${productName.toLowerCase()} requirements.`
        : `Use the quote button and share your project details. The Autocracy team can guide model fit, brochure details, and next steps for ${productName.toLowerCase()} requirements.`,
    },
    {
      question: `Which industries commonly use ${modelName}?`,
      answer: isIndiaMarket
        ? `${modelName} can support Indian telecom, water management, agriculture, construction, solar, defence, and utility infrastructure applications where reliable ${productName.toLowerCase()} output matters.`
        : `${modelName} can support industry applications where teams need reliable ${productName.toLowerCase()} output, controlled site execution, and practical equipment fit.`,
    },
    {
      question: `Can ${modelName} work in mixed site conditions?`,
      answer: isIndiaMarket
        ? `${modelName} is intended for practical Indian field deployment, helping operators plan around soil variation, access width, tractor or carrier fit, route length, productivity, and site constraints.`
        : `${modelName} is intended for practical field deployment, helping operators plan around soil, access, productivity, and site constraints before work begins.`,
    },
    {
      question: `What details should I share before buying ${modelName}?`,
      answer: `Share your industry, site location, working depth or output needs, available carrier or fleet details, and timeline so the team can recommend the right configuration.`,
    },
    {
      question: `Is brochure support available for ${modelName}?`,
      answer: `Yes. Use the brochure request option to receive available model information, specifications, and supporting details for ${modelName}.`,
    },
    {
      question: `Can Autocracy help confirm the right model for my location?`,
      answer: `Yes. Submit your contact details, industry, and location, and the Autocracy team can help review model fit for your project conditions.`,
    },
  ];
}

function buildProductApplicationCards(
  modelData: ModelObjectTypes | null,
  isIndiaMarket = false
): ProductApplicationCard[] {
  const modelName = modelData?.modelNumber || "this model";
  const productName = modelData?.productName || "this product";
  const machineType = modelData?.machineType || "machine";
  const firstFeature = modelData?.keyFeatures?.[0];
  const secondFeature = modelData?.keyFeatures?.[1];
  const thirdFeature = modelData?.keyFeatures?.[2];

  return [
    {
      title: isIndiaMarket ? "Applications in India" : "Project Applications",
      text: isIndiaMarket
        ? `${modelName} supports ${productName.toLowerCase()} work across Indian OFC routes, irrigation lines, rural roads, water management projects, construction utilities, solar sites, and practical field conditions.`
        : `${modelName} supports ${productName.toLowerCase()} work across utility routes, rural sites, and practical field conditions where consistent machine output matters.`,
    },
    {
      title: isIndiaMarket ? "Indian Site Planning" : "Site Planning",
      text: firstFeature
        ? `${firstFeature.value} ${firstFeature.name.toLowerCase()} helps teams plan equipment fit, route preparation, and day-to-day execution before deployment.`
        : `Teams can use the specifications above to plan deployment, route access, and output expectations before field work begins.`,
    },
    {
      title: "Fleet Fit",
      text: `${modelName} is configured as a ${machineType.toLowerCase()}, helping contractors and operators understand how it fits with existing fleet resources and site workflows.`,
    },
    {
      title: isIndiaMarket ? "Value for Indian Projects" : "Operational Value",
      text: secondFeature
        ? `${secondFeature.value} ${secondFeature.name.toLowerCase()} supports controlled operation, while ${
            thirdFeature
              ? `${thirdFeature.value} ${thirdFeature.name.toLowerCase()}`
              : "its working capability"
          } helps improve project predictability.`
        : `${modelName} is built to help teams improve execution speed, reduce manual effort, and keep worksite output more predictable.`,
    },
  ];
}

function buildBestSuitedIndustryCards(
  modelData: ModelObjectTypes | null,
  isIndiaMarket = false
): ProductIndustryFitCard[] {
  const modelName = modelData?.modelNumber || "This model";
  const productName = modelData?.productName || "machine";
  const productLower = productName.toLowerCase();
  const industryNames = asArray(modelData?.industries)
    .map((industry) => industry.trim())
    .filter(Boolean)
    .filter((industry, index, list) => list.indexOf(industry) === index)
    .slice(0, 6);

  return industryNames.map((industry) => ({
    title: industry,
    text: isIndiaMarket
      ? `${modelName} is suited for ${industry.toLowerCase()} projects in India that need dependable ${productLower} performance, cleaner site execution, and faster project handoff.`
      : `${modelName} is suited for ${industry.toLowerCase()} teams that need dependable ${productLower} performance, cleaner site execution, and faster project handoff.`,
  }));
}

function buildOverviewExtraParagraphs(
  modelData: ModelObjectTypes | null,
  isIndiaMarket = false
): string[] {
  if (!modelData) return [];

  const modelName = modelData.modelNumber || "This model";
  const productName = modelData.productName || "project work";
  const machineType = modelData.machineType || "machine";
  const featureSummary = asArray(modelData.keyFeatures)
    .filter((feature) => feature.name && feature.value)
    .slice(0, 4)
    .map((feature) => `${feature.name}: ${feature.value}`)
    .join(", ");

  return [
    featureSummary
      ? isIndiaMarket
        ? `${modelName} brings together key working specifications such as ${featureSummary}, helping Indian contractors compare machine fit before OFC, irrigation, utility, agriculture, construction, or water management deployment.`
        : `${modelName} brings together key working specifications such as ${featureSummary}, giving teams a clearer way to compare fit before deployment.`
      : isIndiaMarket
        ? `${modelName} is built to support practical ${productName.toLowerCase()} work in India where route access, soil conditions, output goals, and operating reliability matter.`
        : `${modelName} is built to support practical ${productName.toLowerCase()} work where site access, output goals, and operating reliability matter.`,
    isIndiaMarket
      ? `As a ${machineType.toLowerCase()}, ${modelName} helps Indian contractors, farmers, municipalities, and infrastructure teams plan daily work with better control over field execution, machine fit, and project handoff.`
      : `As a ${machineType.toLowerCase()}, ${modelName} helps contractors and operators plan daily work with better control over field execution, machine fit, and project handoff.`,
  ];
}

function seriesModelBasePath(
  seriesModel: Model,
  fallbackProductName: string | undefined,
  preferredBasePath?: string
): string | undefined {
  if (preferredBasePath) return preferredBasePath;

  const name = seriesModel?.productName ?? fallbackProductName ?? "";
  const segment = titleToSlug(name);
  return segment ? `/products/${segment}` : undefined;
}

function findTemplateSection(
  template: CmsPageTemplate | undefined,
  key: string
) {
  if (!Array.isArray(template?.sections)) return undefined;
  return template.sections.find((section) => section?.key === key);
}

function isTemplateSectionEnabled(
  template: CmsPageTemplate | undefined,
  key: string
) {
  if (!Array.isArray(template?.sections) || !template.sections.length) {
    return true;
  }

  const section = findTemplateSection(template, key);
  return Boolean(section) && section?.enabled !== false;
}

function templateText(
  template: CmsPageTemplate | undefined,
  key: string,
  field: "eyebrow" | "heading" | "intro",
  fallback: string
) {
  const value = findTemplateSection(template, key)?.[field];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function templateParagraphs(
  template: CmsPageTemplate | undefined,
  key: string
): string[] {
  const paragraphs = findTemplateSection(template, key)?.paragraphs;
  if (!Array.isArray(paragraphs)) return [];

  return paragraphs
    .map((paragraph) =>
      typeof paragraph === "string" ? paragraph.trim() : ""
    )
    .filter(Boolean);
}

function overrideCardText<T extends { text: string }>(
  cards: T[],
  template: CmsPageTemplate | undefined,
  key: string
): T[] {
  const paragraphs = templateParagraphs(template, key);
  if (!paragraphs.length) return cards;

  return cards.map((card, index) => ({
    ...card,
    text: paragraphs[index] || card.text,
  }));
}

function overrideCardContent<T extends { title: string; text: string }>(
  cards: T[],
  template: CmsPageTemplate | undefined,
  key: string
): T[] {
  const paragraphs = templateParagraphs(template, key);
  if (!paragraphs.length) return cards;

  return cards.map((card, index) => {
    const paragraph = paragraphs[index];
    if (!paragraph) return card;

    if (!/\|\|?/.test(paragraph)) {
      return {
        ...card,
        text: paragraph,
      };
    }

    const [title = "", ...textParts] = paragraph
      .split(/\s*(?:\|\||\|)\s*/)
      .map((part) => part.trim());
    const text = textParts.join(" ").trim();

    return {
      ...card,
      title: title || card.title,
      text: text || card.text,
    };
  });
}

function templateCards<T extends { title: string; text: string }>(
  template: CmsPageTemplate | undefined,
  key: string,
  fallbackCards: T[]
): T[] {
  const paragraphs = templateParagraphs(template, key);
  if (!paragraphs.length) return fallbackCards;

  const cards = paragraphs
    .map((paragraph, index) => {
      const [title = "", ...textParts] = paragraph
        .split(/\s*(?:\|\||\|)\s*/)
        .map((part) => part.trim());
      const text = textParts.join(" ").trim();

      if (!title && !text) return null;

      return {
        title: title || `Point ${index + 1}`,
        text: text || title,
      } as T;
    })
    .filter((card): card is T => Boolean(card));

  return cards.length ? cards : fallbackCards;
}

function appendTemplateCards(
  cards: ProductApplicationCard[],
  template: CmsPageTemplate | undefined,
  key: string
): ProductApplicationCard[] {
  const paragraphs = templateParagraphs(template, key).slice(cards.length);
  if (!paragraphs.length) return cards;

  const extraCards = paragraphs
    .map((paragraph, index) => {
      if (!/\|\|?/.test(paragraph)) {
        return {
          title: `Feature ${cards.length + index + 1}`,
          text: paragraph,
        };
      }

      const [title = "", ...textParts] = paragraph
        .split(/\s*(?:\|\||\|)\s*/)
        .map((part) => part.trim());
      const text = textParts.join(" ").trim();
      if (!title && !text) return null;

      return {
        title: title || `Feature ${cards.length + index + 1}`,
        text,
      };
    })
    .filter((card): card is ProductApplicationCard => Boolean(card));

  return [...cards, ...extraCards];
}

function productFaqsFromTemplate(
  template: CmsPageTemplate | undefined,
  fallbackFaqs: ProductModelFaq[]
): ProductModelFaq[] {
  const paragraphs = templateParagraphs(template, "faqs");
  if (!paragraphs.length) return fallbackFaqs;

  const faqs = paragraphs
    .map((paragraph) => {
      const [question, ...answerParts] = paragraph
        .split(/\s*(?:\|\||\|)\s*/)
        .map((part) => part.trim());
      const answer = answerParts.join(" ").trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is ProductModelFaq => Boolean(item));

  return faqs.length ? faqs : fallbackFaqs;
}

export default function ProductModalClient({
  modelData,
  seriesData,
  pageVariant = "product",
  modelBasePath,
  industryTitle,
  industrySlug,
}: ProductModalClientProps) {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const { width } = useWindowSize();
  const variantClassName =
    pageVariant === "industry"
      ? styles.industryModelContainer
      : pageVariant === "productModel"
        ? styles.productModelContainer
        : "";
  const containerClassName = variantClassName
    ? `${styles.modelContainer} ${variantClassName}`
    : styles.modelContainer;
  const isIndiaMarket = modelBasePath?.startsWith("/en-in") || false;
  const productModelMedia = buildProductModelMedia(modelData);
  const selectedMedia =
    productModelMedia[selectedMediaIndex] || productModelMedia[0];
  const modelDescriptions = Array.isArray(modelData?.modelDescription)
    ? modelData.modelDescription
    : [];
  const modelKeyFeatures = Array.isArray(modelData?.keyFeatures)
    ? modelData.keyFeatures
    : [];
  const seriesItems = Array.isArray(seriesData) ? seriesData : [];
  const overviewContent = modelDescriptions[0];
  const productModelDetails =
    pageVariant === "productModel"
      ? modelDescriptions.slice(1)
      : modelDescriptions;
  const visibleSpecs = modelKeyFeatures.slice(0, 3);
  const productTemplate = modelData?.seoMetadata?.pageTemplates?.productModel;
  const industryTemplate =
    modelData?.seoMetadata?.pageTemplates?.industryProductModel;
  const productModelFaqs = productFaqsFromTemplate(
    productTemplate,
    buildProductModelFaqs(modelData, isIndiaMarket)
  );
  const productApplicationCards = overrideCardContent(
    buildProductApplicationCards(modelData, isIndiaMarket),
    productTemplate,
    "applications"
  );
  const bestSuitedIndustryCards = templateCards(
    productTemplate,
    "industryFit",
    buildBestSuitedIndustryCards(modelData, isIndiaMarket)
  );
  const overviewExtraParagraphs =
    templateParagraphs(productTemplate, "hero").length > 0
      ? templateParagraphs(productTemplate, "hero")
      : buildOverviewExtraParagraphs(modelData, isIndiaMarket);
  const overviewDescriptionLines = Array.isArray(overviewContent?.description)
    ? overviewContent.description.filter((paragraph) =>
        String(paragraph || "").trim()
      )
    : [];
  const shouldClampOverview =
    overviewExtraParagraphs.length > 0 ||
    overviewDescriptionLines.length > 1 ||
    overviewDescriptionLines.join(" ").length > 520;
  const overviewTextClassName =
    shouldClampOverview && !isOverviewExpanded
      ? `${styles.productHeroOverviewText} ${styles.productHeroOverviewTextCollapsed}`
      : styles.productHeroOverviewText;
  const keyFeatureCards = appendTemplateCards(
    overrideCardContent(
      modelKeyFeatures.map((feature) => ({
        title: feature.name || "-",
        text: buildFeatureDescription(modelData, feature, isIndiaMarket),
      })),
      productTemplate,
      "keyFeatures"
    ),
    productTemplate,
    "keyFeatures"
  );
  const goToMedia = (direction: "previous" | "next") => {
    if (!productModelMedia.length) return;

    setSelectedMediaIndex((currentIndex) => {
      if (direction === "previous") {
        return currentIndex === 0
          ? productModelMedia.length - 1
          : currentIndex - 1;
      }

      return currentIndex === productModelMedia.length - 1
        ? 0
        : currentIndex + 1;
    });
  };

  return (
    <div className={containerClassName}>
      {pageVariant === "productModel" &&
      isTemplateSectionEnabled(productTemplate, "hero") ? (
        <section className={styles.productHeroSection}>
          <div className={styles.productHeroMediaColumn}>
            <div className={styles.productHeroMediaFrame}>
              {modelData?.series && (
                <span className={styles.productHeroBadge}>
                  {modelData.series}
                </span>
              )}
              {selectedMedia?.type === "video" ? (
                <iframe
                  src={selectedMedia.src}
                  title={selectedMedia.title}
                  width={912}
                  height={684}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.productHeroVideo}
                />
              ) : (
                selectedMedia?.src && (
                  <Image
                    src={selectedMedia.src}
                    alt={selectedMedia.alt}
                    width={912}
                    height={684}
                    className={styles.productHeroImage}
                    priority
                  />
                )
              )}
              {productModelMedia.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.productHeroArrow} ${styles.productHeroArrowPrev}`}
                    onClick={() => goToMedia("previous")}
                    aria-label="Previous media"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className={`${styles.productHeroArrow} ${styles.productHeroArrowNext}`}
                    onClick={() => goToMedia("next")}
                    aria-label="Next media"
                  >
                    &gt;
                  </button>
                  <div className={styles.productHeroDots}>
                    {productModelMedia.map((item, index) => (
                      <button
                        type="button"
                        key={`${item.src}-${index}`}
                        className={
                          index === selectedMediaIndex
                            ? `${styles.productHeroDot} ${styles.productHeroDotActive}`
                            : styles.productHeroDot
                        }
                        onClick={() => setSelectedMediaIndex(index)}
                        aria-label={`Show media ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {productModelMedia.length > 1 && (
              <div className={styles.productHeroThumbs}>
                {productModelMedia.slice(0, 4).map((item, index) => (
                  <button
                    type="button"
                    key={`${item.thumbnail}-${index}`}
                    className={
                      index === selectedMediaIndex
                        ? `${styles.productHeroThumb} ${styles.productHeroThumbActive}`
                        : styles.productHeroThumb
                    }
                    onClick={() => setSelectedMediaIndex(index)}
                    aria-label={`Open ${item.title}`}
                  >
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.alt}
                        width={176}
                        height={132}
                        className={styles.productHeroThumbImage}
                      />
                    ) : (
                      <span>{item.title}</span>
                    )}
                    {item.type === "video" && (
                      <span className={styles.productHeroPlayIcon} aria-hidden>
                        PLAY
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {visibleSpecs.length > 0 && (
              <div className={styles.productHeroSpecs}>
                {visibleSpecs.map((spec, index) => (
                  <div
                    key={`${spec.name}-${index}`}
                    className={styles.productHeroSpecCard}
                  >
                    <span className={styles.productHeroSpecLabel}>
                      {spec.name || "-"}
                    </span>
                    <p className={styles.productHeroSpecValue}>
                      {spec.value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.productHeroContent}>
            <p className={styles.productHeroProduct}>
              {isIndiaMarket
                ? `${modelData?.productName || "Machine"} in India`
                : modelData?.productName || "-"}
            </p>
            <h1 className={styles.productHeroTitle}>
              {modelData?.modelNumber || "-"}
            </h1>
            <p className={styles.productHeroSubtitle}>
              <strong>{modelData?.machineType || "-"}</strong>
            </p>
            <div className={styles.productHeroDivider} />
            <div className={styles.productHeroOverview}>
              <h2>Overview</h2>
              {overviewContent?.title && <h3>{overviewContent.title}</h3>}
              <div className={overviewTextClassName}>
                <RichDescription paragraphs={overviewContent?.description} />
                {isOverviewExpanded &&
                  overviewExtraParagraphs.map((paragraph, index) => (
                    <p key={`overview-extra-${index}`}>{paragraph}</p>
                  ))}
              </div>
              {shouldClampOverview && (
                <button
                  type="button"
                  className={styles.productHeroReadMore}
                  onClick={() => setIsOverviewExpanded((current) => !current)}
                  aria-expanded={isOverviewExpanded}
                >
                  {isOverviewExpanded ? "READ LESS" : "READ MORE"}
                </button>
              )}
            </div>
            <div className={styles.productHeroDivider} />
            <div className={styles.productHeroActions}>
              <button
                className={styles.productHeroQuote}
                onClick={() => setShowQuoteModal(true)}
              >
                GET A QUOTE
                <span aria-hidden>-&gt;</span>
              </button>
              <button
                className={styles.productHeroBrochure}
                onClick={() => setShowDownloadModal(true)}
                disabled={!modelData?.brochure}
              >
                <Image
                  src={ICONS.DOWNLOAD_ICON_BLACK}
                  alt=""
                  width={20}
                  height={20}
                />
                BROCHURE
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className={styles.imageWrapper}>
            {selectedMedia?.type === "video" ? (
              <iframe
                src={selectedMedia.src}
                title={selectedMedia.title}
                width={1500}
                height={768}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.imageVideo}
              />
            ) : (
              selectedMedia?.src && (
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  width={1500}
                  height={768}
                  className={styles.image}
                  priority
                />
              )
            )}
            {productModelMedia.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.mediaArrow} ${styles.mediaArrowPrev}`}
                  onClick={() => goToMedia("previous")}
                  aria-label="Previous media"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className={`${styles.mediaArrow} ${styles.mediaArrowNext}`}
                  onClick={() => goToMedia("next")}
                  aria-label="Next media"
                >
                  &gt;
                </button>
                <div className={styles.mediaDots}>
                  {productModelMedia.map((item, index) => (
                    <button
                      type="button"
                      key={`${item.src}-${index}`}
                      className={
                        index === selectedMediaIndex
                          ? `${styles.mediaDot} ${styles.mediaDotActive}`
                          : styles.mediaDot
                      }
                      onClick={() => setSelectedMediaIndex(index)}
                      aria-label={`Show ${item.type} ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <div className={styles.titleArea}>
                <h1 className={styles.title}>{modelData?.modelNumber || "-"}</h1>
                <p className={styles.subtitle}>
                  {modelData?.modelTitle || "-"}{" "}
                  <span>| {modelData?.machineType || "-"}</span>
                </p>
              </div>
              <div className={styles.ctaButtons}>
                <button
                  className={styles.brochure}
                  onClick={() => setShowDownloadModal(true)}
                  disabled={!modelData?.brochure}
                >
                  <Image
                    src={ICONS.DOWNLOAD_ICON_WHITE}
                    alt="download"
                    width={20}
                    height={20}
                  />
                  BROCHURE
                </button>
                <button
                  className={styles.quote}
                  onClick={() => setShowQuoteModal(true)}
                >
                  GET A QUOTE
                </button>
              </div>
            </div>
          </div>
          <div className={styles.specGrid}>
            {modelData?.keyFeatures &&
              modelData?.keyFeatures?.length > 0 &&
              modelData?.keyFeatures
                ?.slice(0, 7)
                .map((spec: any, index: number) => (
                  <div key={index} className={styles.eachCard}>
                    <span className={styles.label}>{spec.name || "-"}</span>
                    <p className={styles.value}>{spec.value || "-"}</p>
                  </div>
                ))}
          </div>
        </>
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "projectFit") && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          templateSection={findTemplateSection(industryTemplate, "projectFit")}
          section="projectFit"
        />
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "applicationFit") && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          mediaItems={modelData?.modelDescription}
          fallbackImage={modelData?.generalImage || modelData?.coverImage}
          fallbackImageAltText={
            modelData?.generalImageAltText || modelData?.coverImageAltText
          }
          templateSection={findTemplateSection(
            industryTemplate,
            "applicationFit"
          )}
          section="applicationFit"
        />
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "projectExecution") && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          mediaItems={modelData?.modelDescription}
          fallbackImage={modelData?.generalImage || modelData?.coverImage}
          fallbackImageAltText={
            modelData?.generalImageAltText || modelData?.coverImageAltText
          }
          templateSection={findTemplateSection(
            industryTemplate,
            "projectExecution"
          )}
          section="projectExecution"
        />
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "executionPriorities") && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          mediaItems={modelData?.modelDescription}
          fallbackImage={modelData?.generalImage || modelData?.coverImage}
          fallbackImageAltText={
            modelData?.generalImageAltText || modelData?.coverImageAltText
          }
          templateSection={findTemplateSection(
            industryTemplate,
            "executionPriorities"
          )}
          section="executionPriorities"
        />
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "workflow") && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          templateSection={findTemplateSection(industryTemplate, "workflow")}
          section="workflow"
        />
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "supportCta") && (
        <section className={styles.applicationSupportSection}>
          <div className={styles.applicationSupportCopy}>
            <p className={styles.applicationSupportEyebrow}>
              {templateText(
                industryTemplate,
                "supportCta",
                "eyebrow",
                "APPLICATION SUPPORT"
              )}
            </p>
            <h2 className={styles.applicationSupportHeading}>
              {templateText(
                industryTemplate,
                "supportCta",
                "heading",
                `Need ${modelData?.modelNumber || "this model"} for ${
                  industryTitle || "this application"
                }?`
              )}
            </h2>
            <p className={styles.applicationSupportText}>
              {templateText(
                industryTemplate,
                "supportCta",
                "intro",
                "Share your site conditions, output goals, and timeline so the Autocracy team can guide model fit, brochure details, and next steps for your project."
              )}
            </p>
          </div>
          <div className={styles.applicationSupportActions}>
            <button
              className={styles.applicationSupportQuote}
              onClick={() => setShowQuoteModal(true)}
            >
              GET A QUOTE
              <span aria-hidden>-&gt;</span>
            </button>
            <button
              className={styles.applicationSupportBrochure}
              onClick={() => setShowDownloadModal(true)}
              disabled={!modelData?.brochure}
            >
              <Image
                src={ICONS.DOWNLOAD_ICON_BLACK}
                alt=""
                width={20}
                height={20}
              />
              BROCHURE
            </button>
          </div>
        </section>
      )}

      {pageVariant !== "industry" && pageVariant !== "productModel" && (
        <div className={styles.modelDetails}>
          {productModelDetails &&
            productModelDetails?.length > 0 &&
            productModelDetails?.map((para: any, ind: number) => (
              <ModelOverview key={ind} data={para} />
            ))}
        </div>
      )}

      {pageVariant === "productModel" &&
        modelKeyFeatures.length > 0 && (
          <>
            {isTemplateSectionEnabled(productTemplate, "specs") && (
              <section className={styles.productSpecsSection}>
              <div className={styles.productSpecsHeader}>
                <h2 className={styles.productSpecsHeading}>
                  {templateText(
                    productTemplate,
                    "specs",
                    "heading",
                    modelData?.specsTableIntro?.heading?.trim() ||
                      DEFAULT_SPECS_TABLE_HEADING
                  )}
                </h2>
                <p className={styles.productSpecsIntro}>
                  {templateText(
                    productTemplate,
                    "specs",
                    "intro",
                    modelData?.specsTableIntro?.paragraph?.trim() ||
                      DEFAULT_SPECS_TABLE_PARAGRAPH
                  )}
                </p>
              </div>
              <div className={styles.productSpecsGrid}>
                {modelKeyFeatures.map((spec, index) => (
                  <article
                    key={`${spec.name}-${index}`}
                    className={styles.productSpecsCard}
                  >
                    <h3 className={styles.productSpecsLabel}>
                      {spec.name || "-"}
                    </h3>
                    <p className={styles.productSpecsValue}>
                      {spec.value || "-"}
                    </p>
                  </article>
                ))}
              </div>
              </section>
            )}

            {isTemplateSectionEnabled(productTemplate, "keyFeatures") && (
              <section className={styles.productKeyFeaturesSection}>
              <div className={styles.productKeyFeaturesHeader}>
                <h2 className={styles.productKeyFeaturesHeading}>
                  {templateText(
                    productTemplate,
                    "keyFeatures",
                    "heading",
                    "Key Features"
                  )}
                </h2>
                <p className={styles.productKeyFeaturesIntro}>
                  {templateText(
                    productTemplate,
                    "keyFeatures",
                    "intro",
                    `Discover what makes the ${
                      modelData?.modelNumber || "model"
                    } stand out from the competition`
                  )}
                </p>
              </div>
              <div className={styles.productKeyFeaturesGrid}>
                {keyFeatureCards
                  .slice(0, KEY_FEATURE_DESCRIPTION_LIMIT)
                  .map((feature, index) => (
                    <article
                      key={`${feature.title}-${index}`}
                      className={styles.productKeyFeatureItem}
                    >
                      <span
                        className={styles.productKeyFeatureIcon}
                        aria-hidden
                      />
                      <div className={styles.productKeyFeatureCopy}>
                        <h3 className={styles.productKeyFeatureTitle}>
                          {feature.title || "-"}
                        </h3>
                        <p className={styles.productKeyFeatureText}>
                          {feature.text}
                        </p>
                      </div>
                    </article>
                ))}
              </div>
              </section>
            )}

            {isTemplateSectionEnabled(productTemplate, "industryFit") &&
              bestSuitedIndustryCards.length > 0 && (
              <section className={styles.productIndustryFitSection}>
              <div className={styles.productIndustryFitHeader}>
                <p className={styles.productIndustryFitEyebrow}>
                  {templateText(
                    productTemplate,
                    "industryFit",
                    "eyebrow",
                    "BEST SUITED FOR INDUSTRIES"
                  )}
                </p>
                <h2 className={styles.productIndustryFitHeading}>
                  {templateText(
                    productTemplate,
                    "industryFit",
                    "heading",
                    `${modelData?.modelNumber || "This model"} fits demanding ${
                      modelData?.productName?.toLowerCase() || "machine"
                    } applications`
                  )}
                </h2>
                <p className={styles.productIndustryFitIntro}>
                  {templateText(
                    productTemplate,
                    "industryFit",
                    "intro",
                    `Match ${
                      modelData?.modelNumber || "this model"
                    } with industry use cases where equipment reliability, field output, and site readiness matter most.`
                  )}
                </p>
              </div>
              <div className={styles.productIndustryFitGrid}>
                {bestSuitedIndustryCards.map((card, index) => (
                  <article
                    key={`${card.title}-${index}`}
                    className={styles.productIndustryFitCard}
                  >
                    <span className={styles.productIndustryFitNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.productIndustryFitTitle}>
                      {card.title}
                    </h3>
                    <p className={styles.productIndustryFitText}>
                      {card.text}
                    </p>
                  </article>
                ))}
              </div>
              </section>
            )}

            {isTemplateSectionEnabled(productTemplate, "applications") && (
              <section className={styles.productApplicationsSection}>
              <div className={styles.productApplicationsHeader}>
                <p className={styles.productApplicationsEyebrow}>
                  {templateText(
                    productTemplate,
                    "applications",
                    "eyebrow",
                    "PRODUCT FIT"
                  )}
                </p>
                <h2 className={styles.productApplicationsHeading}>
                  {templateText(
                    productTemplate,
                    "applications",
                    "heading",
                    `${modelData?.modelNumber || "This model"} for practical ${
                      modelData?.productName?.toLowerCase() || "product"
                    } work`
                  )}
                </h2>
                <p className={styles.productApplicationsIntro}>
                  {templateText(
                    productTemplate,
                    "applications",
                    "intro",
                    `Understand how ${
                      modelData?.modelNumber || "this model"
                    } fits project planning, field deployment, and daily operating priorities.`
                  )}
                </p>
              </div>
              <div className={styles.productApplicationsGrid}>
                {productApplicationCards.map((card) => (
                  <article
                    key={card.title}
                    className={styles.productApplicationCard}
                  >
                    <h3 className={styles.productApplicationTitle}>
                      {card.title}
                    </h3>
                    <p className={styles.productApplicationText}>
                      {card.text}
                    </p>
                  </article>
                ))}
              </div>
              </section>
            )}

            {isTemplateSectionEnabled(productTemplate, "moreModels") &&
              seriesItems.length > 0 && (
              <div className={styles.moreModels}>
                <h2 className={styles.modelContainerHeading}>
                  {`More Models in ${modelData?.productName || "This Product"}`}
                </h2>
                <div className={styles.modelCardContainer}>
                  {seriesItems.map((eachModel: any, ids: number) => {
                    const basePath = seriesModelBasePath(
                      eachModel,
                      modelData?.productName,
                      modelBasePath
                    );
                    return width && width > SCREENS.TAB_MINI ? (
                      <ModelCard
                        model={eachModel}
                        key={ids}
                        basePath={basePath}
                      />
                    ) : (
                      <ModelResponsiveCard
                        model={eachModel}
                        key={ids}
                        basePath={basePath}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {isTemplateSectionEnabled(productTemplate, "faqs") && (
              <section className={styles.productFaqModelSection}>
              <div className={styles.productFaqModelHeader}>
                <h2 className={styles.productFaqModelHeading}>
                  {templateText(
                    productTemplate,
                    "faqs",
                    "heading",
                    "Frequently Asked Questions"
                  )}
                </h2>
                <p className={styles.productFaqModelIntro}>
                  {templateText(
                    productTemplate,
                    "faqs",
                    "intro",
                    `Common questions about ${
                      modelData?.modelNumber || "this model"
                    } specifications, applications, and project fit.`
                  )}
                </p>
              </div>
              <div className={styles.productFaqModelGrid}>
                {[productModelFaqs.slice(0, 5), productModelFaqs.slice(5, 10)].map(
                  (column, columnIndex) => (
                    <div
                      key={`faq-column-${columnIndex}`}
                      className={styles.productFaqModelColumn}
                    >
                      <FaqAccordion
                        items={column}
                      />
                    </div>
                  )
                )}
              </div>
              </section>
            )}
          </>
        )}

      {pageVariant === "productModel" &&
        isTemplateSectionEnabled(productTemplate, "contact") && (
        <ContactUs
          image={modelData?.generalImage || modelData?.coverImage || ""}
          altText={
            modelData?.generalImageAltText ||
            modelData?.coverImageAltText ||
            "Model support"
          }
          productName={modelData?.productName || "product"}
          model={modelData?.modelNumber}
        />
      )}

      {pageVariant !== "productModel" &&
        modelKeyFeatures.length > 7 && (
        <div className={styles.tableDetails}>
          <div className={styles.tableDesc}>
            <h2 className={styles.tableDescHeading}>
              {modelData?.specsTableIntro?.heading?.trim() ||
                DEFAULT_SPECS_TABLE_HEADING}
            </h2>
            <p className={styles.tableDescPara}>
              {modelData?.specsTableIntro?.paragraph?.trim() ||
                DEFAULT_SPECS_TABLE_PARAGRAPH}
            </p>
          </div>
          <table className={styles.specTable}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {modelKeyFeatures.length > 0 &&
                modelKeyFeatures
                  .slice(7, modelKeyFeatures.length)
                  .map((spec: any, index: number) => (
                    <tr key={index}>
                      <td>{spec.name}</td>
                      <td style={{ fontWeight: "600" }}>{spec.value}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {pageVariant !== "industry" && pageVariant !== "productModel" && (
        <div className={styles.yellowArea}>
          <h2 className={styles.yellowHeading}>
            {`Ready to power up your projects with the ${modelData?.modelNumber}?`}
          </h2>
          <div className={styles.ctaButtons}>
            <button
              className={styles.brochure}
              style={{
                color: "#0A0A0B",
                border: "1px solid #0A0A0B",
              }}
              onClick={() => setShowDownloadModal(true)}
              disabled={!modelData?.brochure}
            >
              <Image
                src={ICONS.DOWNLOAD_ICON_BLACK}
                alt="download"
                width={20}
                height={20}
              />
              BROCHURE
            </button>
            <button
              className={styles.quote}
              onClick={() => setShowQuoteModal(true)}
              style={{
                color: "#FFFFFF",
                backgroundColor: "#01060A",
              }}
            >
              GET A QUOTE
            </button>
          </div>
          <div className={styles.triangle}></div>
        </div>
      )}

      {pageVariant === "industry" &&
        isTemplateSectionEnabled(industryTemplate, "faqs") && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          templateSection={findTemplateSection(industryTemplate, "faqs")}
          section="faqs"
        />
      )}

      {pageVariant !== "productModel" && seriesItems.length > 0 && (
        <div className={styles.moreModels}>
          <h2 className={styles.modelContainerHeading}>
            {`More Models in ${modelData?.series} Series`}
          </h2>
          <div className={styles.modelCardContainer}>
            {seriesItems.map((eachModel: any, ids: number) => {
              const basePath = seriesModelBasePath(
                eachModel,
                modelData?.productName,
                modelBasePath
              );
              return width && width > SCREENS.TAB_MINI ? (
                <ModelCard
                  model={eachModel}
                  key={ids}
                  basePath={basePath}
                />
              ) : (
                <ModelResponsiveCard
                  model={eachModel}
                  key={ids}
                  basePath={basePath}
                />
              );
            })}
          </div>
        </div>
      )}
      {pageVariant !== "productModel" &&
        (pageVariant !== "industry" ||
          isTemplateSectionEnabled(industryTemplate, "contact")) && (
        <ContactUs
          image={modelData?.generalImage || ""}
          altText={
            modelData?.generalImageAltText || "Trencher Machine in Action"
          }
          productName={modelData?.productName || "product"}
          industry={industryTitle}
          model={modelData?.modelNumber}
        />
      )}
      {showDownloadModal && (
        <BrochureDownloadModal
          setShowModal={setShowDownloadModal}
          modelTitle={modelData?.modelNumber}
          productName={modelData?.productName}
          downloadUrl={modelData?.brochure || ""}
        />
      )}
      {showQuoteModal && (
        <GetQuoteModal
          showModal={showQuoteModal}
          setShowModal={setShowQuoteModal}
        />
      )}
    </div>
  );
}
