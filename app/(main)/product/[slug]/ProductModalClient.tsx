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

const DEFAULT_SPECS_TABLE_HEADING = "Precision Machines. Project-Ready.";
const DEFAULT_SPECS_TABLE_PARAGRAPH =
  "Built for performance. Trusted by contractors, municipalities, and EPC teams across sectors.";
const KEY_FEATURE_DESCRIPTION_LIMIT = 6;

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

type ProductApplicationCard = {
  title: string;
  text: string;
};

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

  modelData.modelDescription?.forEach((item) => {
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
  feature: ModelFeature
): string {
  const modelName = modelData?.modelNumber || "this model";
  const productName = (modelData?.productName || "projects").toLowerCase();
  const featureName = feature.name || "This feature";
  const featureValue = feature.value || "project-ready performance";

  return `${featureValue} ${featureName.toLowerCase()} capability helps ${modelName} support practical ${productName} work with controlled output, dependable operation, and smoother field execution.`;
}

function buildProductModelFaqs(
  modelData: ModelObjectTypes | null
): ProductModelFaq[] {
  const modelName = modelData?.modelNumber || "this model";
  const productName = modelData?.productName || "this product";
  const machineType = modelData?.machineType || "machine";
  const firstFeature = modelData?.keyFeatures?.[0];
  const secondFeature = modelData?.keyFeatures?.[1];
  const thirdFeature = modelData?.keyFeatures?.[2];

  return [
    {
      question: `What is ${modelName} used for?`,
      answer: `${modelName} is designed for ${productName.toLowerCase()} applications where teams need dependable field execution, controlled output, and practical deployment across project sites.`,
    },
    {
      question: `Is ${modelName} an attachment or equipment?`,
      answer: `${modelName} is listed as a ${machineType.toLowerCase()}, helping buyers understand how it fits into their existing fleet and site workflow.`,
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
      answer: `Use the quote button and share your project details. The Autocracy team can guide model fit, brochure details, and next steps for ${productName.toLowerCase()} requirements.`,
    },
  ];
}

function buildProductApplicationCards(
  modelData: ModelObjectTypes | null
): ProductApplicationCard[] {
  const modelName = modelData?.modelNumber || "this model";
  const productName = modelData?.productName || "this product";
  const machineType = modelData?.machineType || "machine";
  const firstFeature = modelData?.keyFeatures?.[0];
  const secondFeature = modelData?.keyFeatures?.[1];
  const thirdFeature = modelData?.keyFeatures?.[2];

  return [
    {
      title: "Project Applications",
      text: `${modelName} supports ${productName.toLowerCase()} work across utility routes, rural sites, and practical field conditions where consistent machine output matters.`,
    },
    {
      title: "Site Planning",
      text: firstFeature
        ? `${firstFeature.value} ${firstFeature.name.toLowerCase()} helps teams plan equipment fit, route preparation, and day-to-day execution before deployment.`
        : `Teams can use the specifications above to plan deployment, route access, and output expectations before field work begins.`,
    },
    {
      title: "Fleet Fit",
      text: `${modelName} is configured as a ${machineType.toLowerCase()}, helping contractors and operators understand how it fits with existing fleet resources and site workflows.`,
    },
    {
      title: "Operational Value",
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

function buildOverviewExtraParagraphs(
  modelData: ModelObjectTypes | null
): string[] {
  if (!modelData) return [];

  const modelName = modelData.modelNumber || "This model";
  const productName = modelData.productName || "project work";
  const machineType = modelData.machineType || "machine";
  const featureSummary = modelData.keyFeatures
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
  const productModelMedia = buildProductModelMedia(modelData);
  const selectedMedia =
    productModelMedia[selectedMediaIndex] || productModelMedia[0];
  const overviewContent = modelData?.modelDescription?.[0];
  const productModelDetails =
    pageVariant === "productModel"
      ? modelData?.modelDescription?.slice(1)
      : modelData?.modelDescription;
  const visibleSpecs = modelData?.keyFeatures?.slice(0, 3) || [];
  const productModelFaqs = buildProductModelFaqs(modelData);
  const productApplicationCards = buildProductApplicationCards(modelData);
  const overviewExtraParagraphs = buildOverviewExtraParagraphs(modelData);
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
      {pageVariant === "productModel" ? (
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
              {modelData?.productName || "-"}
            </p>
            <h1 className={styles.productHeroTitle}>
              {modelData?.modelNumber || "-"}
            </h1>
            <p className={styles.productHeroSubtitle}>
              {modelData?.modelTitle || "-"}
              <span aria-hidden>|</span>
              <strong>{modelData?.machineType || "-"}</strong>
            </p>
            <div className={styles.productHeroDivider} />
            <div className={styles.productHeroOverview}>
              <h2>Overview</h2>
              {overviewContent?.title && <h3>{overviewContent.title}</h3>}
              <div className={styles.productHeroOverviewText}>
                {overviewContent?.description?.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
                {isOverviewExpanded &&
                  overviewExtraParagraphs.map((paragraph, index) => (
                    <p key={`overview-extra-${index}`}>{paragraph}</p>
                  ))}
              </div>
              {overviewExtraParagraphs.length > 0 && (
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

      {pageVariant === "industry" && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          section="projectFit"
        />
      )}

      {pageVariant === "industry" && (
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
          section="applicationFit"
        />
      )}

      {pageVariant === "industry" && (
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
          section="projectExecution"
        />
      )}

      {pageVariant === "industry" && (
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
          section="executionPriorities"
        />
      )}

      {pageVariant === "industry" && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          section="workflow"
        />
      )}

      {pageVariant === "industry" && (
        <section className={styles.applicationSupportSection}>
          <div className={styles.applicationSupportCopy}>
            <p className={styles.applicationSupportEyebrow}>
              APPLICATION SUPPORT
            </p>
            <h2 className={styles.applicationSupportHeading}>
              {`Need ${modelData?.modelNumber || "this model"} for ${
                industryTitle || "this application"
              }?`}
            </h2>
            <p className={styles.applicationSupportText}>
              Share your site conditions, output goals, and timeline so the
              Autocracy team can guide model fit, brochure details, and next
              steps for your project.
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
        modelData?.keyFeatures &&
        modelData?.keyFeatures?.length > 0 && (
          <>
            <section className={styles.productSpecsSection}>
              <div className={styles.productSpecsHeader}>
                <h2 className={styles.productSpecsHeading}>
                  {modelData?.specsTableIntro?.heading?.trim() ||
                    DEFAULT_SPECS_TABLE_HEADING}
                </h2>
                <p className={styles.productSpecsIntro}>
                  {modelData?.specsTableIntro?.paragraph?.trim() ||
                    DEFAULT_SPECS_TABLE_PARAGRAPH}
                </p>
              </div>
              <div className={styles.productSpecsGrid}>
                {modelData.keyFeatures.map((spec, index) => (
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

            <section className={styles.productKeyFeaturesSection}>
              <div className={styles.productKeyFeaturesHeader}>
                <h2 className={styles.productKeyFeaturesHeading}>
                  Key Features
                </h2>
                <p className={styles.productKeyFeaturesIntro}>
                  {`Discover what makes the ${
                    modelData.modelNumber || "model"
                  } stand out from the competition`}
                </p>
              </div>
              <div className={styles.productKeyFeaturesGrid}>
                {modelData.keyFeatures
                  .slice(0, KEY_FEATURE_DESCRIPTION_LIMIT)
                  .map((feature, index) => (
                    <article
                      key={`${feature.name}-${index}`}
                      className={styles.productKeyFeatureItem}
                    >
                      <span
                        className={styles.productKeyFeatureIcon}
                        aria-hidden
                      />
                      <div className={styles.productKeyFeatureCopy}>
                        <h3 className={styles.productKeyFeatureTitle}>
                          {feature.name || "-"}
                        </h3>
                        <p className={styles.productKeyFeatureText}>
                          {buildFeatureDescription(modelData, feature)}
                        </p>
                      </div>
                    </article>
                ))}
              </div>
            </section>

            <section className={styles.productApplicationsSection}>
              <div className={styles.productApplicationsHeader}>
                <p className={styles.productApplicationsEyebrow}>
                  PRODUCT FIT
                </p>
                <h2 className={styles.productApplicationsHeading}>
                  {`${modelData.modelNumber || "This model"} for practical ${
                    modelData.productName?.toLowerCase() || "product"
                  } work`}
                </h2>
                <p className={styles.productApplicationsIntro}>
                  {`Understand how ${
                    modelData.modelNumber || "this model"
                  } fits project planning, field deployment, and daily operating priorities.`}
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

            <section className={styles.productFaqModelSection}>
              <div className={styles.productFaqModelHeader}>
                <h2 className={styles.productFaqModelHeading}>
                  Frequently Asked Questions
                </h2>
                <p className={styles.productFaqModelIntro}>
                  {`Common questions about ${
                    modelData.modelNumber || "this model"
                  } specifications, applications, and project fit.`}
                </p>
              </div>
              <div className={styles.productFaqModelGrid}>
                {productModelFaqs.map((faq) => (
                  <article
                    key={faq.question}
                    className={styles.productFaqModelCard}
                  >
                    <h3 className={styles.productFaqModelQuestion}>
                      {faq.question}
                    </h3>
                    <p className={styles.productFaqModelAnswer}>
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

      {pageVariant !== "productModel" &&
        modelData?.keyFeatures &&
        modelData?.keyFeatures?.length > 7 && (
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
              {modelData?.keyFeatures &&
                modelData?.keyFeatures?.length > 0 &&
                modelData?.keyFeatures
                  ?.slice(7, modelData?.keyFeatures?.length)
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

      {pageVariant !== "industry" && (
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

      {pageVariant === "industry" && (
        <IndustryApplicationSections
          industryTitle={industryTitle}
          industrySlug={industrySlug}
          productTitle={modelData?.productName}
          modelName={modelData?.modelNumber}
          section="faqs"
        />
      )}

      {seriesData && seriesData.length > 0 && (
        <div className={styles.moreModels}>
          <h2 className={styles.modelContainerHeading}>
            {`More Models in ${modelData?.series} Series`}
          </h2>
          <div className={styles.modelCardContainer}>
            {seriesData.map((eachModel: any, ids: number) => {
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
      <ContactUs
        image={modelData?.generalImage || ""}
        altText={modelData?.generalImageAltText || "Trencher Machine in Action"}
        productName={modelData?.productName || "product"}
      />
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
