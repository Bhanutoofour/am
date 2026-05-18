import Image from "next/image";
import FaqAccordion from "@/component/sections/faqAccordion/FaqAccordion";
import styles from "./modalStyles.module.scss";

type ProjectFitContent = {
  heading: string;
  paragraphs: string[];
  priorities: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

type ApplicationFitCard = {
  label: "USE CASE" | "EXECUTION NOTE";
  text: string;
};

type ApplicationFitContent = {
  heading: string;
  cards: ApplicationFitCard[];
};

type ProjectExecutionContent = {
  heading: string;
  subheading: string;
  paragraphs: string[];
};

type ExecutionPrioritiesContent = {
  heading: string;
  paragraphs: string[];
};

type WorkflowStep = {
  title: string;
  description: string;
};

type WorkflowContent = {
  heading: string;
  steps: WorkflowStep[];
};

type IndustryContentProfile = {
  application: string;
  corridor: string;
  outcome: string;
  planningFocus: string;
  handoff: string;
};

type IndustryApplicationSectionsProps = {
  industryTitle?: string;
  industrySlug?: string;
  productTitle?: string;
  modelName?: string;
  mediaItems?: ModelDescription[];
  fallbackImage?: string;
  fallbackImageAltText?: string;
  templateSection?: CmsTemplateSection;
  section?:
    | "projectFit"
    | "applicationFit"
    | "projectExecution"
    | "executionPriorities"
    | "workflow"
    | "faqs";
};

function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;

  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );

  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
}

function buildIndustryContentProfile(
  industryTitle?: string,
  industrySlug?: string
): IndustryContentProfile {
  const industryText = `${industrySlug || ""} ${industryTitle || ""}`.toLowerCase();

  if (industryText.includes("ofc") || industryText.includes("telecom")) {
    return {
      application: "telecom duct and optical-fiber deployment",
      corridor: "rural, semi-urban, and last-mile utility corridors",
      outcome:
        "route productivity, trench consistency, and faster duct restoration",
      planningFocus:
        "route length, trench depth, right-of-way access, soil variability, and restoration timelines",
      handoff:
        "duct laying, cable pulling, jointing, and surface restoration teams",
    };
  }

  if (industryText.includes("solar")) {
    return {
      application: "solar EPC cable trenching, earthing, and utility routing",
      corridor: "solar park rows, inverter blocks, and power evacuation corridors",
      outcome:
        "clean cable routes, controlled trench dimensions, and faster EPC execution",
      planningFocus:
        "row spacing, cable depth, earthing runs, soil condition, and access between arrays",
      handoff: "cable laying, earthing, backfilling, and commissioning teams",
    };
  }

  if (industryText.includes("defence") || industryText.includes("defense")) {
    return {
      application:
        "defence utility, tactical infrastructure, and protected corridor trenching",
      corridor: "border infrastructure, camp utilities, and rugged access routes",
      outcome:
        "dependable trench output, mobility, and consistent execution in demanding sites",
      planningFocus:
        "terrain access, deployment speed, trench dimensions, operator safety, and support readiness",
      handoff: "utility placement, protection works, and field infrastructure teams",
    };
  }

  if (industryText.includes("water") || industryText.includes("irrigation")) {
    return {
      application: "water pipeline, irrigation, and drainage trenching",
      corridor:
        "rural pipeline routes, municipal utility lines, and field irrigation networks",
      outcome: "uniform pipeline beds, faster installation, and reduced manual excavation",
      planningFocus:
        "pipe diameter, trench depth, soil moisture, route access, and reinstatement needs",
      handoff: "pipe laying, jointing, testing, and backfilling teams",
    };
  }

  if (industryText.includes("agriculture") || industryText.includes("landscap")) {
    return {
      application: "farm irrigation, drainage, landscaping, and plantation utility work",
      corridor:
        "farm lanes, park areas, plantation rows, and narrow landscaped spaces",
      outcome:
        "controlled trenching with less surface disturbance and faster irrigation setup",
      planningFocus:
        "row spacing, irrigation depth, soil type, access width, and turf restoration",
      handoff:
        "pipe placement, sprinkler installation, drainage, and landscape reinstatement teams",
    };
  }

  if (industryText.includes("construction") || industryText.includes("urban")) {
    return {
      application: "construction utility trenching and urban infrastructure work",
      corridor:
        "project sites, road edges, smart-city corridors, and underground utility zones",
      outcome:
        "clean utility trenches, predictable production, and smoother site coordination",
      planningFocus:
        "utility drawings, site access, trench dimensions, traffic constraints, and reinstatement plans",
      handoff: "utility laying, inspection, backfill, and civil finishing teams",
    };
  }

  if (industryText.includes("oil") || industryText.includes("gas")) {
    return {
      application: "pipeline corridor preparation and energy utility trenching",
      corridor:
        "pipeline rights-of-way, energy corridors, and long-distance utility routes",
      outcome:
        "consistent trench geometry, higher corridor productivity, and better installation readiness",
      planningFocus:
        "pipeline diameter, depth, soil class, route clearance, and safety controls",
      handoff: "pipeline lowering, bedding, welding support, and backfill teams",
    };
  }

  return {
    application: `${industryTitle || "industry"} field execution`,
    corridor: "project corridors, utility routes, and practical site conditions",
    outcome:
      "consistent output, dependable productivity, and cleaner handoff between teams",
    planningFocus:
      "site access, output goals, soil condition, trench dimensions, and project timeline",
    handoff: "installation, backfill, inspection, and support teams",
  };
}

function getProjectFitContent({
  industryTitle,
  industrySlug,
  productTitle,
  modelName,
}: IndustryApplicationSectionsProps): ProjectFitContent {
  const industryName = industryTitle || "Industry";
  const productName = productTitle || "equipment";
  const machineName = modelName || productName;
  const profile = buildIndustryContentProfile(industryTitle, industrySlug);

  return {
    heading: `${industryName} Project Fit`,
    paragraphs: [
      `${machineName} is configured for ${profile.application} where controlled output and reliable site performance are essential.`,
      `${machineName} helps teams working across ${profile.corridor} improve ${profile.outcome}.`,
    ],
    priorities: [
      `Suitable for ${profile.application} across ${profile.corridor}.`,
      `Supports ${profile.outcome}.`,
      `Helps maintain cleaner handoffs for ${profile.handoff}.`,
    ],
  };
}

function getIndustryProductFaqs({
  industryTitle,
  industrySlug,
  productTitle,
  modelName,
}: IndustryApplicationSectionsProps): FaqItem[] {
  const industryName = industryTitle || "this application";
  const productName = productTitle || "this equipment";
  const machineName = modelName || productName;
  const profile = buildIndustryContentProfile(industryTitle, industrySlug);

  return [
    {
      question: `Why use ${machineName} for ${industryName}?`,
      answer: `${machineName} supports ${profile.application} where consistent output, route control, and field productivity matter.`,
    },
    {
      question: `What project work does ${machineName} support?`,
      answer: `It is suited for work across ${profile.corridor}, especially where teams need ${profile.outcome}.`,
    },
    {
      question: `How do I confirm fit for a ${industryName} project?`,
      answer: `Share ${profile.planningFocus} with Autocracy Machinery so the team can guide model fit, brochure details, and next steps.`,
    },
    {
      question: `What should be planned before deploying ${machineName}?`,
      answer: `Plan the work sequence from setup through ${profile.handoff}, including site access, output targets, and support requirements.`,
    },
    {
      question: `Can ${machineName} improve handoff quality on ${industryName} sites?`,
      answer: `Yes. Consistent trench output helps downstream teams handle installation, inspection, backfill, and restoration work with fewer corrections.`,
    },
    {
      question: `Who should review the machine fit before work starts?`,
      answer: `Project, operations, and site teams should confirm route access, output goals, trench dimensions, and support needs before deployment.`,
    },
  ];
}

function getApplicationFitContent({
  industryTitle,
  industrySlug,
  productTitle,
  modelName,
}: IndustryApplicationSectionsProps): ApplicationFitContent {
  const industryName = industryTitle || "Industry";
  const productName = productTitle || "equipment";
  const machineName = modelName || productName;
  const profile = buildIndustryContentProfile(industryTitle, industrySlug);

  return {
    heading: `Built around ${industryName} execution needs`,
    cards: [
      {
        label: "USE CASE",
        text: `Suitable for ${profile.application} across ${profile.corridor}.`,
      },
      {
        label: "USE CASE",
        text: `Supports high route productivity for ${industryName} rollout programs.`,
      },
      {
        label: "USE CASE",
        text: `Helps maintain ${profile.outcome} for quicker installation and restoration.`,
      },
      {
        label: "EXECUTION NOTE",
        text: `${productName} is used for ${profile.application} where route consistency and execution speed directly impact rollout schedules.`,
      },
      {
        label: "EXECUTION NOTE",
        text: `Teams deploy ${machineName} across ${profile.corridor} with planning around ${profile.planningFocus}.`,
      },
      {
        label: "EXECUTION NOTE",
        text: `The machine helps maintain cleaner worksite output for ${profile.handoff}.`,
      },
    ],
  };
}

function getProjectExecutionContent({
  industryTitle,
  industrySlug,
  productTitle,
  modelName,
}: IndustryApplicationSectionsProps): ProjectExecutionContent {
  const industryName = industryTitle || "Industry";
  const productName = productTitle || "equipment";
  const machineName = modelName || productName;
  const profile = buildIndustryContentProfile(industryTitle, industrySlug);

  return {
    heading: `How the ${machineName} fits the worksite`,
    subheading: `Use Case Applications - ${industryName}, Utility Corridors & Last-Mile Connectivity`,
    paragraphs: [
      `${productName} is used for ${profile.application} where route consistency and execution speed directly impact rollout schedules.`,
      `Teams deploy it across ${profile.corridor} with planning around ${profile.planningFocus}.`,
      `The machine helps maintain cleaner worksite output for ${profile.handoff}.`,
    ],
  };
}

function getExecutionPrioritiesContent({
  industryTitle,
  industrySlug,
}: IndustryApplicationSectionsProps): ExecutionPrioritiesContent {
  const industryName = industryTitle || "Industry";
  const profile = buildIndustryContentProfile(industryTitle, industrySlug);

  return {
    heading: `Execution Priorities for ${industryName}`,
    paragraphs: [
      `Maintain consistent trench depth and alignment to reduce rework during ${profile.application} and site reinstatement.`,
      `Plan route productivity based on ${profile.planningFocus}.`,
      `Use predictable trench output to improve handoff quality between ${profile.handoff}.`,
    ],
  };
}

function getWorkflowContent({
  industrySlug,
  industryTitle,
  modelName,
}: IndustryApplicationSectionsProps): WorkflowContent {
  const machineName = modelName || "the machine";
  const profile = buildIndustryContentProfile(industryTitle, industrySlug);

  return {
    heading: "From route planning to handoff",
    steps: [
      {
        title: "Route Planning",
        description: `Map route requirements, trench depth, and site access before deploying ${machineName}.`,
      },
      {
        title: "Controlled Trenching",
        description: `Use the attachment setup to keep trench output consistent across ${profile.corridor}.`,
      },
      {
        title: "Installation Handoff",
        description: `Cleaner trench profiles help ${profile.handoff} proceed with less rework.`,
      },
      {
        title: "Support And Sizing",
        description: `Autocracy Machinery can help match machine configuration, brochure details, and application guidance to the project.`,
      },
    ],
  };
}

export default function IndustryApplicationSections({
  industryTitle,
  industrySlug,
  productTitle,
  modelName,
  mediaItems,
  fallbackImage,
  fallbackImageAltText,
  templateSection,
  section,
}: IndustryApplicationSectionsProps) {
  const projectFitContent = getProjectFitContent({
    industryTitle,
    industrySlug,
    productTitle,
    modelName,
  });
  const faqItems = getIndustryProductFaqs({
    industryTitle,
    industrySlug,
    productTitle,
    modelName,
  });
  const applicationFitContent = getApplicationFitContent({
    industryTitle,
    industrySlug,
    productTitle,
    modelName,
  });
  const projectExecutionContent = getProjectExecutionContent({
    industryTitle,
    industrySlug,
    productTitle,
    modelName,
  });
  const executionPrioritiesContent = getExecutionPrioritiesContent({
    industryTitle,
    industrySlug,
    productTitle,
    modelName,
  });
  const workflowContent = getWorkflowContent({
    industryTitle,
    industrySlug,
    productTitle,
    modelName,
  });
  const videoMedia = mediaItems?.find((item) => item.youtubeLink);
  const imageMedia =
    mediaItems?.find((item) => item.image && !item.youtubeLink) ||
    mediaItems?.find((item) => item.image);
  const embedUrl = getYouTubeEmbedUrl(videoMedia?.youtubeLink);
  const imageSrc = imageMedia?.image || fallbackImage || "";
  const imageAlt =
    imageMedia?.imageAltText || fallbackImageAltText || "Machine at worksite";
  const headingOverride = templateSection?.heading?.trim();
  const eyebrowOverride = templateSection?.eyebrow?.trim();
  const introOverride = templateSection?.intro?.trim();
  const paragraphOverrides =
    templateSection?.paragraphs?.filter((paragraph) => paragraph.trim()) || [];

  if (section === "projectFit") {
    const paragraphs = paragraphOverrides.length
      ? paragraphOverrides
      : projectFitContent.paragraphs;
    return (
      <section className={styles.projectFitSection}>
        <div className={styles.projectFitCopy}>
          <h2 className={styles.projectFitHeading}>
            {headingOverride || projectFitContent.heading}
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.projectFitParagraph}>
              {paragraph}
            </p>
          ))}
          <button className={styles.projectFitReadMore}>READ MORE</button>
        </div>
        <div className={styles.fieldPrioritiesCard}>
          <h3 className={styles.fieldPrioritiesTitle}>FIELD PRIORITIES</h3>
          <ul className={styles.fieldPrioritiesList}>
            {projectFitContent.priorities.map((priority) => (
              <li key={priority} className={styles.fieldPriorityItem}>
                <span className={styles.fieldPriorityIcon} aria-hidden />
                <span>{priority}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (section === "applicationFit") {
    return (
      <section className={styles.applicationFitSection}>
        <p className={styles.applicationFitEyebrow}>
          {eyebrowOverride || "APPLICATION FIT"}
        </p>
        <h2 className={styles.applicationFitHeading}>
          {headingOverride || applicationFitContent.heading}
        </h2>
        <div className={styles.applicationFitGrid}>
          {applicationFitContent.cards.map((card, index) => (
            <article
              key={`${card.label}-${index}`}
              className={styles.applicationFitCard}
            >
              <h3 className={styles.applicationFitCardLabel}>{card.label}</h3>
              <p className={styles.applicationFitCardText}>{card.text}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section === "projectExecution") {
    const paragraphs = paragraphOverrides.length
      ? paragraphOverrides
      : projectExecutionContent.paragraphs;
    return (
      <section className={styles.projectExecutionSection}>
        <div className={styles.projectExecutionHeader}>
          <p className={styles.projectExecutionEyebrow}>
            {eyebrowOverride || "PROJECT EXECUTION"}
          </p>
          <h2 className={styles.projectExecutionHeading}>
            {headingOverride || projectExecutionContent.heading}
          </h2>
        </div>
        <div className={styles.projectExecutionLayout}>
          <div className={styles.projectExecutionCopy}>
            <p className={styles.projectExecutionIndustry}>
              {industryTitle || "Industry"}
            </p>
            <h3 className={styles.projectExecutionSubheading}>
              {introOverride || projectExecutionContent.subheading}
            </h3>
            <div className={styles.projectExecutionParagraphs}>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className={styles.projectExecutionMedia}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${modelName || productTitle || "Model"} worksite video`}
                width={768}
                height={432}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.projectExecutionIframe}
              />
            ) : imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={768}
                height={432}
                className={styles.projectExecutionImage}
              />
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (section === "executionPriorities") {
    const paragraphs = paragraphOverrides.length
      ? paragraphOverrides
      : executionPrioritiesContent.paragraphs;
    return (
      <section className={styles.executionPrioritiesSection}>
        <div className={styles.executionPrioritiesImageWrap}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={768}
              height={486}
              className={styles.executionPrioritiesImage}
            />
          ) : null}
        </div>
        <div className={styles.executionPrioritiesCopy}>
          <p className={styles.executionPrioritiesEyebrow}>
            {eyebrowOverride || industryTitle || "Industry"}
          </p>
          <h2 className={styles.executionPrioritiesHeading}>
            {headingOverride || executionPrioritiesContent.heading}
          </h2>
          <div className={styles.executionPrioritiesParagraphs}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section === "workflow") {
    return (
      <section className={styles.workflowSection}>
        <div className={styles.workflowIntro}>
          <p className={styles.workflowEyebrow}>
            {eyebrowOverride || "WORKFLOW"}
          </p>
          <h2 className={styles.workflowHeading}>
            {headingOverride || workflowContent.heading}
          </h2>
        </div>
        <div className={styles.workflowGrid}>
          {workflowContent.steps.map((step, index) => (
            <article key={step.title} className={styles.workflowCard}>
              <span className={styles.workflowStepNumber}>{index + 1}</span>
              <h3 className={styles.workflowStepTitle}>{step.title}</h3>
              <p className={styles.workflowStepDescription}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section === "faqs") {
    return (
      <section className={styles.productFaqSection}>
        <div className={styles.productFaqHeader}>
          <h2 className={styles.productFaqHeading}>
            {headingOverride || `${industryTitle || "Industry"} FAQs`}
          </h2>
          <p className={styles.productFaqIntro}>
            {introOverride ||
              `Common questions about using ${
                modelName || productTitle || "this equipment"
              } in this application.`}
          </p>
        </div>
        <div className={styles.productFaqGrid}>
          {[
            faqItems.slice(0, Math.ceil(faqItems.length / 2)),
            faqItems.slice(Math.ceil(faqItems.length / 2)),
          ].map((column, columnIndex) => (
            <FaqAccordion
              key={`industry-application-faq-column-${columnIndex}`}
              items={column}
            />
          ))}
        </div>
      </section>
    );
  }

  return null;
}
