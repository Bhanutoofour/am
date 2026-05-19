"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "@/utils/auth";
import { modelSlug, titleToSlug } from "@/utils/slug";
import styles from "./dashboard.module.scss";

type CountState = {
  products: number | null;
  models: number | null;
  industries: number | null;
  blogs: number | null;
};

type SectionKey =
  | "home"
  | "hero"
  | "products"
  | "models"
  | "industries"
  | "blogs"
  | "media";

type NavItem = {
  label: string;
  section?: SectionKey;
  href?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Dashboard",
    items: [{ label: "Home", section: "home" }],
  },
  {
    title: "Content",
    items: [
      { label: "Hero Sliders", section: "hero" },
      { label: "Product-Models", section: "products" },
      { label: "Industries", section: "industries" },
      { label: "Blogs", section: "blogs" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Media Upload", section: "media" },
      { label: "View Website", href: "/" },
    ],
  },
];

const sectionPaths: Record<SectionKey, string> = {
  home: "/admin",
  hero: "/admin/hero-sliders",
  products: "/admin/prodcut-models",
  models: "/admin/models",
  industries: "/admin/industries",
  blogs: "/admin/blogs",
  media: "/admin/media-upload",
};

const sectionByPath: Record<string, SectionKey> = {
  "/admin": "home",
  "/admin/dashboard": "home",
  "/admin/hero-sliders": "hero",
  "/admin/prodcut-models": "products",
  "/admin/product-models": "products",
  "/admin/models": "models",
  "/admin/industries": "industries",
  "/admin/blogs": "blogs",
  "/admin/media-upload": "media",
};

const quickActions = [
  {
    title: "Add Product Model",
    text: "Create a model and assign it to an existing product.",
    section: "products" as const,
  },
  {
    title: "Add Model",
    text: "Upload model content and template section controls.",
    section: "products" as const,
  },
  {
    title: "Edit Templates",
    text: "Open model template controls for product and industry pages.",
    section: "products" as const,
  },
  {
    title: "Upload Media",
    text: "Send images and brochures to S3/CDN and copy the URL.",
    section: "media" as const,
  },
];

const sectionContent: Record<
  Exclude<SectionKey, "home" | "media">,
  {
    title: string;
    intro: string;
    primaryAction: string;
    cards: { title: string; text: string; action: string }[];
  }
> = {
  hero: {
    title: "Hero Sliders",
    intro:
      "Manage homepage carousel slides, heading text, descriptions, images, and call-to-action buttons.",
    primaryAction: "Add Hero Slide",
    cards: [
      {
        title: "Homepage hero",
        text: "Update slide order, hero image, heading, and description.",
        action: "Edit Slides",
      },
      {
        title: "Upload slide image",
        text: "Add a fresh banner image before assigning it to a slide.",
        action: "Upload Image",
      },
    ],
  },
  products: {
    title: "Product-Models",
    intro:
      "Create and update product model pages used by the product template.",
    primaryAction: "Add Model",
    cards: [
      {
        title: "Model details",
        text: "Edit model title, specs, sections, images, assignment, and meta fields.",
        action: "Edit Models",
      },
      {
        title: "Model media",
        text: "Upload thumbnails, cover images, brochures, and section images.",
        action: "Upload Model Image",
      },
    ],
  },
  models: {
    title: "Models",
    intro:
      "Control model pages, specifications, brochures, and product or industry template sections.",
    primaryAction: "Add Model",
    cards: [
      {
        title: "Product Template",
        text: "Update /products/{product-name}/{model-name} sections and visibility.",
        action: "Edit Product Template",
      },
      {
        title: "Industry Product Template",
        text: "Update /industries/{industry}/{product}/{model} section copy and visibility.",
        action: "Edit Industry Template",
      },
      {
        title: "Brochure upload",
        text: "Upload a brochure and copy its URL into the model record.",
        action: "Upload Brochure",
      },
    ],
  },
  industries: {
    title: "Industries",
    intro:
      "Manage industry landing pages and the product/model relationships under each industry.",
    primaryAction: "Add Industry",
    cards: [
      {
        title: "Industry details",
        text: "Edit title, description, images, SEO, and linked products.",
        action: "Edit Industries",
      },
      {
        title: "Industry image",
        text: "Upload thumbnails and detail images for industry pages.",
        action: "Upload Image",
      },
    ],
  },
  blogs: {
    title: "Blogs",
    intro:
      "Create articles and media posts for the site. Blog crawling is currently blocked in robots.",
    primaryAction: "Add Blog",
    cards: [
      {
        title: "Write article",
        text: "Create article copy, media, category relationships, and SEO fields.",
        action: "Create Blog",
      },
      {
        title: "Featured image",
        text: "Upload blog images and copy the CDN URL.",
        action: "Upload Image",
      },
    ],
  },
};

type ResourceRecord = Record<string, unknown> & { id?: number | string };

type ProductFormState = {
  id?: number | string;
  title: string;
  description: string;
  seoDescription: string;
  thumbnail: string;
  thumbnailAltText: string;
  generalImage: string;
  generalImageAltText: string;
  series: string[];
  industryIds: number[];
  active: boolean;
  seoPageTitle: string;
  seoPageDescription: string;
  seoPageKeywords: string;
  seoSocialTitle: string;
  seoSocialDescription: string;
  seoSocialImage: string;
};

type ModelDescriptionForm = {
  image: string;
  imageAltText: string;
  title: string;
  description: string[];
  youtubeLink?: string;
};

type TemplateSectionForm = {
  key: string;
  enabled: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
  paragraphs: string[];
};

type ModelFormState = {
  id?: number | string;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  productId: string;
  series: string;
  industryIds: number[];
  thumbnail: string;
  thumbnailAltText: string;
  coverImage: string;
  coverImageAltText: string;
  shortDescription: string;
  seoDescription: string;
  brochure: string;
  keyFeatures: { name: string; value: string }[];
  specsIntroHeading: string;
  specsIntroParagraph: string;
  modelDescription: ModelDescriptionForm[];
  rentalAvailability: boolean;
  active: boolean;
  seoPageTitle: string;
  seoPageDescription: string;
  seoPageKeywords: string;
  seoSocialTitle: string;
  seoSocialDescription: string;
  seoSocialImage: string;
  productTemplateSections: TemplateSectionForm[];
  industryProductTemplateSections: TemplateSectionForm[];
};

type IndustryOption = {
  id: number;
  title: string;
};

const resourceConfig: Record<
  Exclude<SectionKey, "home" | "media">,
  {
    endpoint: string;
    titleField: string;
    subtitleField?: string;
    emptyRecord: ResourceRecord;
  }
> = {
  hero: {
    endpoint: "hero-section",
    titleField: "title",
    subtitleField: "description",
    emptyRecord: {
      title: "",
      description: "",
      image: "",
      altText: "",
      active: true,
    },
  },
  products: {
    endpoint: "products",
    titleField: "title",
    subtitleField: "description",
    emptyRecord: {
      title: "",
      description: "",
      thumbnail: "",
      thumbnailAltText: "",
      active: true,
    },
  },
  models: {
    endpoint: "models",
    titleField: "modelNumber",
    subtitleField: "modelTitle",
    emptyRecord: {
      modelNumber: "",
      modelTitle: "",
      machineType: "Equipment",
      productId: "",
      series: "",
      thumbnail: "",
      thumbnailAltText: "",
      coverImage: "",
      coverImageAltText: "",
      shortDescription: "",
      active: true,
    },
  },
  industries: {
    endpoint: "industries",
    titleField: "title",
    subtitleField: "description",
    emptyRecord: {
      title: "",
      description: "",
      thumbnail: "",
      thumbnailAltText: "",
      active: true,
    },
  },
  blogs: {
    endpoint: "blogs",
    titleField: "title",
    subtitleField: "excerpt",
    emptyRecord: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      active: true,
    },
  },
};

function countFromContentRange(header: string | null) {
  if (!header) return null;
  const total = header.split("/").pop();
  if (!total) return null;
  const value = Number(total);
  return Number.isFinite(value) ? value : null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>(
    sectionByPath[pathname] || "home"
  );
  const [counts, setCounts] = useState<CountState>({
    products: null,
    models: null,
    industries: null,
    blogs: null,
  });
  const [folder, setFolder] = useState("cms/uploads");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      logoutAdmin();
      router.push("/admin/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  useEffect(() => {
    setActiveSection(sectionByPath[pathname] || "home");
  }, [pathname]);

  useEffect(() => {
    if (!isReady) return;

    const resources: Array<keyof CountState> = [
      "products",
      "models",
      "industries",
      "blogs",
    ];

    resources.forEach(async (resource) => {
      try {
        const response = await fetch(`/api/${resource}?page=1&perPage=1`);
        const total = countFromContentRange(
          response.headers.get("Content-Range")
        );
        setCounts((current) => ({ ...current, [resource]: total }));
      } catch {
        setCounts((current) => ({ ...current, [resource]: 0 }));
      }
    });
  }, [isReady]);

  const statCards = useMemo(
    () => [
      { label: "Products", value: counts.products },
      { label: "Models", value: counts.models },
      { label: "Industries", value: counts.industries },
      { label: "Blogs", value: counts.blogs },
    ],
    [counts]
  );

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const openSection = (section: SectionKey) => {
    setActiveSection(section);
    router.push(sectionPaths[section]);
    if (section === "media") {
      window.setTimeout(() => {
        document.getElementById("media-upload")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setIsUploading(true);
    setUploadStatus("");
    setUploadError("");
    setUploadedUrl("");

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Upload failed");
      }

      setUploadedUrl(payload.url || "");
      setUploadStatus(
        "Upload complete. Use this URL in any CMS image, video thumbnail, or brochure field."
      );
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isReady) {
    return <div className={styles.notice}>Loading dashboard...</div>;
  }

  const pageTitle =
    activeSection === "home"
      ? "Dashboard"
      : activeSection === "media"
        ? "Media Upload"
        : sectionContent[activeSection].title;

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/icons/logoWhite.svg" alt="Autocracy" className={styles.logo} />
          <div>
            <p className={styles.brandTitle}>Autocracy CMS</p>
            <p className={styles.brandSub}>Website content dashboard</p>
          </div>
        </div>
        {navGroups.map((group) => (
          <nav key={group.title} className={styles.navGroup}>
            <p className={styles.navLabel}>{group.title}</p>
            {group.items.map((item) =>
              item.section ? (
                <button
                  key={`${group.title}-${item.label}`}
                  type="button"
                  onClick={() => openSection(item.section as SectionKey)}
                  className={`${styles.navLink} ${
                    activeSection === item.section ? styles.navLinkActive : ""
                  }`}
                >
                  <span>{item.label}</span>
                  <span aria-hidden>&gt;</span>
                </button>
              ) : (
                <Link
                  key={`${group.title}-${item.label}`}
                  href={item.href || "/"}
                  className={styles.navLink}
                >
                  <span>{item.label}</span>
                  <span aria-hidden>&gt;</span>
                </Link>
              )
            )}
          </nav>
        ))}
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <div className={styles.topActions}>
            <Link className={styles.button} href="/">
              View Site
            </Link>
            <button className={styles.buttonGhost} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.notice}>
            Use this dashboard for uploads and content work. Choose a section
            from the left menu to open its editor area.
          </div>

          {activeSection === "home" && (
            <>
              <section className={styles.grid}>
                {statCards.map((card) => (
                  <article key={card.label} className={styles.statCard}>
                    <p className={styles.statLabel}>{card.label}</p>
                    <p className={styles.statValue}>
                      {card.value === null ? "..." : card.value}
                    </p>
                  </article>
                ))}
              </section>

              <section className={styles.panelGrid}>
                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>Quick Actions</h2>
                  </div>
                  <div className={styles.panelBody}>
                    <div className={styles.quickGrid}>
                      {quickActions.map((action) => (
                        <button
                          key={action.title}
                          type="button"
                          onClick={() => openSection(action.section)}
                          className={styles.quickCard}
                        >
                          <p className={styles.quickTitle}>{action.title}</p>
                          <p className={styles.quickText}>{action.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </article>

                <MediaUploadPanel
                  folder={folder}
                  setFolder={setFolder}
                  fileInputRef={fileInputRef}
                  handleUpload={handleUpload}
                  isUploading={isUploading}
                  uploadStatus={uploadStatus}
                  uploadError={uploadError}
                  uploadedUrl={uploadedUrl}
                />
              </section>

              <WorkflowPanel />
            </>
          )}

          {activeSection !== "home" && activeSection !== "media" && (
            <SectionPanel
              sectionKey={activeSection}
              section={sectionContent[activeSection]}
              openMedia={() => openSection("media")}
            />
          )}

          {activeSection === "media" && (
            <section className={styles.singlePanelGrid}>
              <MediaUploadPanel
                folder={folder}
                setFolder={setFolder}
                fileInputRef={fileInputRef}
                handleUpload={handleUpload}
                isUploading={isUploading}
                uploadStatus={uploadStatus}
                uploadError={uploadError}
                uploadedUrl={uploadedUrl}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function SectionPanel({
  sectionKey,
  section,
  openMedia,
}: {
  sectionKey: Exclude<SectionKey, "home" | "media">;
  section: (typeof sectionContent)[keyof typeof sectionContent];
  openMedia: () => void;
}) {
  const [createNonce, setCreateNonce] = useState(0);

  const openEditor = () => {
    document.getElementById(`${sectionKey}-content-editor`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const startCreate = () => {
    setCreateNonce((value) => value + 1);
    window.setTimeout(openEditor, 0);
  };

  return (
    <section className={styles.singlePanelGrid}>
      <article className={styles.panel}>
        <div className={styles.sectionHero}>
          <div>
            <h2>{section.title}</h2>
            <p>{section.intro}</p>
          </div>
          <button className={styles.buttonDark} type="button" onClick={startCreate}>
            {section.primaryAction}
          </button>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.quickGrid}>
            {section.cards.map((card) => (
              <button
                key={card.title}
                className={styles.quickCard}
                type="button"
                onClick={
                  card.action.toLowerCase().includes("upload")
                    ? openMedia
                    : openEditor
                }
              >
                <p className={styles.quickTitle}>{card.title}</p>
                <p className={styles.quickText}>{card.text}</p>
                <span className={styles.inlineAction}>{card.action}</span>
              </button>
            ))}
          </div>
        </div>
      </article>
      {sectionKey === "products" ? (
        <ProductModelManager createNonce={createNonce} />
      ) : sectionKey === "industries" ? (
        <IndustryProductModelManager createNonce={createNonce} />
      ) : (
        <ResourceManager
          config={resourceConfig[sectionKey]}
          sectionKey={sectionKey}
          createNonce={createNonce}
        />
      )}
    </section>
  );
}

const emptyProductForm: ProductFormState = {
  title: "",
  description: "",
  seoDescription: "",
  thumbnail: "",
  thumbnailAltText: "",
  generalImage: "",
  generalImageAltText: "",
  series: [""],
  industryIds: [],
  active: true,
  seoPageTitle: "",
  seoPageDescription: "",
  seoPageKeywords: "",
  seoSocialTitle: "",
  seoSocialDescription: "",
  seoSocialImage: "",
};

const emptyModelForm: ModelFormState = {
  modelNumber: "",
  modelTitle: "",
  machineType: "Equipment",
  productId: "",
  series: "",
  industryIds: [],
  thumbnail: "",
  thumbnailAltText: "",
  coverImage: "",
  coverImageAltText: "",
  shortDescription: "",
  seoDescription: "",
  brochure: "",
  keyFeatures: [{ name: "", value: "" }],
  specsIntroHeading: "",
  specsIntroParagraph: "",
  modelDescription: [
    {
      image: "",
      imageAltText: "",
      title: "",
      description: [""],
      youtubeLink: "",
    },
  ],
  rentalAvailability: false,
  active: true,
  seoPageTitle: "",
  seoPageDescription: "",
  seoPageKeywords: "",
  seoSocialTitle: "",
  seoSocialDescription: "",
  seoSocialImage: "",
  productTemplateSections: [],
  industryProductTemplateSections: [],
};

const defaultIndustryTemplateSections: TemplateSectionForm[] = [
  {
    key: "projectFit",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "applicationFit",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "projectExecution",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "executionPriorities",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "workflow",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "supportCta",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "faqs",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
];

function toNumberIds(value: unknown): number[] {
  return Array.isArray(value)
    ? value.map(Number).filter((item) => Number.isFinite(item))
    : [];
}

function productToForm(record: ResourceRecord): ProductFormState {
  const seo = (record.seoMetadata || {}) as Record<string, unknown>;
  return {
    ...emptyProductForm,
    id: record.id,
    title: String(record.title || ""),
    description: String(record.description || ""),
    seoDescription: String(record.seoDescription || ""),
    thumbnail: String(record.thumbnail || ""),
    thumbnailAltText: String(record.thumbnailAltText || ""),
    generalImage: String(record.generalImage || ""),
    generalImageAltText: String(record.generalImageAltText || ""),
    series: Array.isArray(record.series) ? (record.series as string[]) : [""],
    industryIds: toNumberIds(record.industryIds),
    active: record.active !== false,
    seoPageTitle: String(record.seoPageTitle || seo.pageTitle || ""),
    seoPageDescription: String(
      record.seoPageDescription || seo.pageDescription || ""
    ),
    seoPageKeywords: String(record.seoPageKeywords || seo.pageKeywords || ""),
    seoSocialTitle: String(record.seoSocialTitle || seo.socialTitle || ""),
    seoSocialDescription: String(
      record.seoSocialDescription || seo.socialDescription || ""
    ),
    seoSocialImage: String(record.seoSocialImage || seo.socialImage || ""),
  };
}

function modelToForm(record: ResourceRecord): ModelFormState {
  const seo = (record.seoMetadata || {}) as Record<string, unknown>;
  const intro = (record.specsTableIntro || {}) as Record<string, unknown>;
  const pageTemplates = (seo.pageTemplates || {}) as Record<string, any>;
  const productTemplate = pageTemplates.productModel as
    | { sections?: TemplateSectionForm[] }
    | undefined;
  const industryTemplate = pageTemplates.industryProductModel as
    | { sections?: TemplateSectionForm[] }
    | undefined;

  return {
    ...emptyModelForm,
    id: record.id,
    modelNumber: String(record.modelNumber || ""),
    modelTitle: String(record.modelTitle || ""),
    machineType: String(record.machineType || "Equipment"),
    productId: record.productId ? String(record.productId) : "",
    series: String(record.series || ""),
    industryIds: toNumberIds(record.industryIds),
    thumbnail: String(record.thumbnail || ""),
    thumbnailAltText: String(record.thumbnailAltText || ""),
    coverImage: String(record.coverImage || ""),
    coverImageAltText: String(record.coverImageAltText || ""),
    shortDescription: String(record.shortDescription || ""),
    seoDescription: String(record.seoDescription || ""),
    brochure: String(record.brochure || ""),
    keyFeatures:
      Array.isArray(record.keyFeatures) && record.keyFeatures.length
        ? (record.keyFeatures as { name: string; value: string }[])
        : [{ name: "", value: "" }],
    specsIntroHeading: String(record.specsIntroHeading || intro.heading || ""),
    specsIntroParagraph: String(
      record.specsIntroParagraph || intro.paragraph || ""
    ),
    modelDescription:
      Array.isArray(record.modelDescription) && record.modelDescription.length
        ? (record.modelDescription as ModelDescriptionForm[])
        : emptyModelForm.modelDescription,
    rentalAvailability: record.rentalAvailability === true,
    active: record.active !== false,
    seoPageTitle: String(record.seoPageTitle || seo.pageTitle || ""),
    seoPageDescription: String(
      record.seoPageDescription || seo.pageDescription || ""
    ),
    seoPageKeywords: String(record.seoPageKeywords || seo.pageKeywords || ""),
    seoSocialTitle: String(record.seoSocialTitle || seo.socialTitle || ""),
    seoSocialDescription: String(
      record.seoSocialDescription || seo.socialDescription || ""
    ),
    seoSocialImage: String(record.seoSocialImage || seo.socialImage || ""),
    productTemplateSections:
      Array.isArray(record.productTemplateSections) &&
      record.productTemplateSections.length
        ? (record.productTemplateSections as TemplateSectionForm[])
        : Array.isArray(productTemplate?.sections) &&
            productTemplate.sections.length
          ? productTemplate.sections.map((section) => ({
              key: section.key || "",
              enabled: section.enabled !== false,
              eyebrow: section.eyebrow || "",
              heading: section.heading || "",
              intro: section.intro || "",
              paragraphs: Array.isArray(section.paragraphs)
                ? section.paragraphs
                : [""],
            }))
          : [],
    industryProductTemplateSections:
      Array.isArray(record.industryProductTemplateSections) &&
      record.industryProductTemplateSections.length
        ? (record.industryProductTemplateSections as TemplateSectionForm[])
        : Array.isArray(industryTemplate?.sections) &&
            industryTemplate.sections.length
          ? industryTemplate.sections.map((section) => ({
              key: section.key || "",
              enabled: section.enabled !== false,
              eyebrow: section.eyebrow || "",
              heading: section.heading || "",
              intro: section.intro || "",
              paragraphs: Array.isArray(section.paragraphs)
                ? section.paragraphs
                : [""],
            }))
          : defaultIndustryTemplateSections,
  };
}

function buildProductPayload(form: ProductFormState) {
  const series = form.series.map((item) => item.trim()).filter(Boolean);
  const seoMetadata = {
    pageTitle: form.seoPageTitle || form.title,
    pageDescription: form.seoPageDescription || form.description,
    pageKeywords: form.seoPageKeywords,
    socialTitle: form.seoSocialTitle || form.title,
    socialDescription: form.seoSocialDescription || form.description,
    socialImage: form.seoSocialImage || form.thumbnail,
    structuredData: {
      type: "Product",
      title: form.title,
      description: form.description,
      brand: "Autocracy Machinery",
      category: form.title,
      hasOfferCatalog: {
        name: `${form.title} Models`,
        description: form.description,
        totalModels: 0,
        availableSeries: series,
        modelOverview: [],
      },
    },
  };

  return {
    ...(form.id ? { id: form.id } : {}),
    title: form.title,
    description: form.description,
    seoDescription: form.seoDescription,
    thumbnail: form.thumbnail,
    thumbnailAltText: form.thumbnailAltText,
    generalImage: form.generalImage,
    generalImageAltText: form.generalImageAltText,
    series,
    industryIds: form.industryIds,
    active: form.active,
    seoMetadata,
  };
}

function buildModelPayload(form: ModelFormState) {
  const cleanFeatures = form.keyFeatures.filter(
    (feature) => feature.name.trim() || feature.value.trim()
  );
  const cleanDescription = form.modelDescription
    .filter((item) => item.title.trim() || item.image.trim())
    .map((item) => ({
      ...item,
      description: item.description.filter((line) => line.trim()),
    }));
  const cleanIndustrySections = form.industryProductTemplateSections
    .filter((section) => section.key.trim())
    .map((section) => ({
      key: section.key.trim(),
      enabled: section.enabled !== false,
      ...(section.eyebrow.trim() ? { eyebrow: section.eyebrow.trim() } : {}),
      ...(section.heading.trim() ? { heading: section.heading.trim() } : {}),
      ...(section.intro.trim() ? { intro: section.intro.trim() } : {}),
      ...(section.paragraphs.some((line) => line.trim())
        ? { paragraphs: section.paragraphs.filter((line) => line.trim()) }
        : {}),
    }));
  const cleanProductSections = form.productTemplateSections
    .filter((section) => section.key.trim())
    .map((section) => ({
      key: section.key.trim(),
      enabled: section.enabled !== false,
      ...(section.eyebrow.trim() ? { eyebrow: section.eyebrow.trim() } : {}),
      ...(section.heading.trim() ? { heading: section.heading.trim() } : {}),
      ...(section.intro.trim() ? { intro: section.intro.trim() } : {}),
      ...(section.paragraphs.some((line) => line.trim())
        ? { paragraphs: section.paragraphs.filter((line) => line.trim()) }
        : {}),
    }));

  return {
    ...(form.id ? { id: form.id } : {}),
    modelNumber: form.modelNumber,
    modelTitle: form.modelTitle,
    machineType: form.machineType,
    productId: Number(form.productId),
    series: form.series,
    industryIds: form.industryIds,
    thumbnail: form.thumbnail,
    thumbnailAltText: form.thumbnailAltText,
    coverImage: form.coverImage,
    coverImageAltText: form.coverImageAltText,
    keyFeatures: cleanFeatures,
    specsIntroHeading: form.specsIntroHeading,
    specsIntroParagraph: form.specsIntroParagraph,
    brochure: form.brochure || null,
    modelDescription: cleanDescription,
    shortDescription: form.shortDescription,
    seoDescription: form.seoDescription,
    rentalAvailability: form.rentalAvailability,
    active: form.active,
    seoMetadata: {
      pageTitle: form.seoPageTitle || `${form.modelNumber} ${form.modelTitle}`,
      pageDescription: form.seoPageDescription || form.shortDescription,
      pageKeywords: form.seoPageKeywords,
      socialTitle: form.seoSocialTitle || `${form.modelNumber} ${form.modelTitle}`,
      socialDescription: form.seoSocialDescription || form.shortDescription,
      socialImage: form.seoSocialImage || form.thumbnail,
      structuredData: {
        type: "Product",
        name: `${form.modelNumber} ${form.modelTitle}`.trim(),
        description: form.shortDescription,
        brand: "Autocracy Machinery",
        sku: form.modelNumber,
        condition: "New",
        category: form.modelTitle,
        offers: { availability: "In Stock" },
      },
      ...(cleanIndustrySections.length || cleanProductSections.length
        ? {
            pageTemplates: {
              ...(cleanProductSections.length
                ? {
                    productModel: {
                      templateName: "Product Template",
                      sections: cleanProductSections,
                    },
                  }
                : {}),
              ...(cleanIndustrySections.length
                ? {
                    industryProductModel: {
                      templateName: "Industry Product Template",
                      sections: cleanIndustrySections,
                    },
                  }
                : {}),
            },
          }
        : {}),
    },
  };
}

function ProductModelManager({ createNonce }: { createNonce: number }) {
  const [products, setProducts] = useState<ResourceRecord[]>([]);
  const [models, setModels] = useState<ResourceRecord[]>([]);
  const [industries, setIndustries] = useState<IndustryOption[]>([]);
  const [modelForm, setModelForm] = useState<ModelFormState>(emptyModelForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedProduct = products.find(
    (product) => String(product.id) === modelForm.productId
  );
  const selectedProductTitle = String(selectedProduct?.title || "");
  const modelUrl =
    selectedProductTitle && modelForm.modelNumber
      ? `/products/${titleToSlug(selectedProductTitle)}/${modelSlug(
          selectedProductTitle,
          modelForm.modelTitle,
          modelForm.modelNumber
        )}`
      : "/products/{product-name}/{model-slug}";

  const loadAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [productResponse, modelResponse, industryResponse] =
        await Promise.all([
          fetch("/api/products?page=1&perPage=100"),
          fetch("/api/models?page=1&perPage=200"),
          fetch("/api/industries?page=1&perPage=100"),
        ]);
      const [productPayload, modelPayload, industryPayload] =
        await Promise.all([
          productResponse.json(),
          modelResponse.json(),
          industryResponse.json(),
        ]);
      setProducts(Array.isArray(productPayload) ? productPayload : []);
      setModels(Array.isArray(modelPayload) ? modelPayload : []);
      setIndustries(Array.isArray(industryPayload) ? industryPayload : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Load failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (createNonce > 0) {
      setModelForm({ ...emptyModelForm });
      setMessage("");
      setError("");
    }
  }, [createNonce]);

  const openModel = async (model: ResourceRecord) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/models/${model.id}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Model open failed");
      setModelForm(modelToForm(payload));
    } catch (openError) {
      setModelForm(modelToForm(model));
      setError(openError instanceof Error ? openError.message : "Open failed");
    }
  };

  const saveModel = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = buildModelPayload(modelForm);
      const response = await fetch(
        modelForm.id ? `/api/models/${modelForm.id}` : "/api/models",
        {
          method: modelForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result?.details || result?.error || "Save failed");
      setModelForm(modelToForm(result));
      setMessage(modelForm.id ? "Model updated." : "Model created.");
      await loadAll();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleIndustry = (
    value: number,
    current: number[],
    onChange: (next: number[]) => void
  ) => {
    onChange(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const setUploadedField = (field: keyof ModelFormState, url: string) => {
    setModelForm((current) => ({ ...current, [field]: url }));
  };

  return (
    <article className={styles.panel} id="products-content-editor">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Product Models</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadAll}>
            Refresh
          </button>
          <button
            className={styles.buttonDark}
            type="button"
            onClick={() => {
              setModelForm({ ...emptyModelForm });
              setMessage("");
              setError("");
            }}
          >
            New Model
          </button>
        </div>
      </div>

      <div className={styles.resourceLayout}>
        <div className={styles.recordList}>
          {isLoading && <p className={styles.statusText}>Loading content...</p>}
          <p className={styles.listHeading}>Existing product models</p>
          {models.map((model) => (
            <button
              key={`model-${model.id}`}
              className={`${styles.recordItem} ${
                modelForm.id === model.id
                  ? styles.recordItemActive
                  : ""
              }`}
              type="button"
              onClick={() => openModel(model)}
            >
              <span className={styles.recordTitle}>
                {String(model.modelNumber || "")}
              </span>
              <span className={styles.recordSubtitle}>
                {String(model.modelTitle || "")}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.editorPanel}>
            <div className={styles.cmsForm}>
              <div className={styles.editorHeader}>
                <h3>{modelForm.id ? "Edit product model" : "Create product model"}</h3>
                <button
                  className={styles.buttonDark}
                  type="button"
                  onClick={saveModel}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : modelForm.id ? "Update" : "Create"}
                </button>
              </div>
              <div>
                <p className={styles.listHeading}>Slug</p>
                <p className={styles.slugPreview}>{modelUrl}</p>
              </div>
              <div className={styles.formGrid}>
                <CmsInput
                  label="Model name / number"
                  value={modelForm.modelNumber}
                  onChange={(modelNumber) =>
                    setModelForm((current) => ({ ...current, modelNumber }))
                  }
                />
                <CmsInput
                  label="Model title"
                  value={modelForm.modelTitle}
                  onChange={(modelTitle) =>
                    setModelForm((current) => ({ ...current, modelTitle }))
                  }
                />
                <label className={styles.fieldControl}>
                  <span>Assign to product</span>
                  <select
                    value={modelForm.productId}
                    onChange={(event) =>
                      setModelForm((current) => ({
                        ...current,
                        productId: event.target.value,
                        series: "",
                      }))
                    }
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={String(product.id)}>
                        {String(product.title)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.fieldControl}>
                  <span>Series</span>
                  <select
                    value={modelForm.series}
                    onChange={(event) =>
                      setModelForm((current) => ({
                        ...current,
                        series: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select series</option>
                    {((selectedProduct?.series as string[]) || []).map(
                      (series) => (
                        <option key={series} value={series}>
                          {series}
                        </option>
                      )
                    )}
                  </select>
                </label>
                <label className={styles.fieldControl}>
                  <span>Machine type</span>
                  <select
                    value={modelForm.machineType}
                    onChange={(event) =>
                      setModelForm((current) => ({
                        ...current,
                        machineType: event.target.value,
                      }))
                    }
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Attachment">Attachment</option>
                  </select>
                </label>
              </div>
              <CmsTextarea
                label="Short description"
                value={modelForm.shortDescription}
                onChange={(shortDescription) =>
                  setModelForm((current) => ({ ...current, shortDescription }))
                }
              />
              <div className={styles.formGrid}>
                <FileUploadField
                  label="Thumbnail URL"
                  folder="models/thumbnails"
                  value={modelForm.thumbnail}
                  onChange={(thumbnail) =>
                    setModelForm((current) => ({ ...current, thumbnail }))
                  }
                  onUploaded={(url) => setUploadedField("thumbnail", url)}
                />
                <CmsInput
                  label="Thumbnail alt text"
                  value={modelForm.thumbnailAltText}
                  onChange={(thumbnailAltText) =>
                    setModelForm((current) => ({
                      ...current,
                      thumbnailAltText,
                    }))
                  }
                />
                <FileUploadField
                  label="Cover image URL"
                  folder="models/covers"
                  value={modelForm.coverImage}
                  onChange={(coverImage) =>
                    setModelForm((current) => ({ ...current, coverImage }))
                  }
                  onUploaded={(url) => setUploadedField("coverImage", url)}
                />
                <CmsInput
                  label="Cover image alt text"
                  value={modelForm.coverImageAltText}
                  onChange={(coverImageAltText) =>
                    setModelForm((current) => ({
                      ...current,
                      coverImageAltText,
                    }))
                  }
                />
                <FileUploadField
                  label="Brochure URL"
                  folder="models/brochures"
                  value={modelForm.brochure}
                  onChange={(brochure) =>
                    setModelForm((current) => ({ ...current, brochure }))
                  }
                  onUploaded={(url) => setUploadedField("brochure", url)}
                  accept="application/pdf,image/*"
                />
              </div>
              <DynamicKeyValueList
                label="Specs / key features"
                values={modelForm.keyFeatures}
                onChange={(keyFeatures) =>
                  setModelForm((current) => ({ ...current, keyFeatures }))
                }
              />
              <CmsInput
                label="Specs intro heading"
                value={modelForm.specsIntroHeading}
                onChange={(specsIntroHeading) =>
                  setModelForm((current) => ({
                    ...current,
                    specsIntroHeading,
                  }))
                }
              />
              <CmsTextarea
                label="Specs intro paragraph"
                value={modelForm.specsIntroParagraph}
                onChange={(specsIntroParagraph) =>
                  setModelForm((current) => ({
                    ...current,
                    specsIntroParagraph,
                  }))
                }
              />
              <ModelDescriptionEditor
                values={modelForm.modelDescription}
                setUploadedUrl={(sectionIndex, field, url) => {
                  setModelForm((current) => ({
                    ...current,
                    modelDescription: current.modelDescription.map(
                      (section, index) =>
                        index === sectionIndex
                          ? { ...section, [field]: url }
                          : section
                    ),
                  }));
                }}
                onChange={(modelDescription) =>
                  setModelForm((current) => ({
                    ...current,
                    modelDescription,
                  }))
                }
              />
              <IndustryPicker
                industries={industries}
                selected={modelForm.industryIds}
                toggle={(industryId) =>
                  toggleIndustry(
                    industryId,
                    modelForm.industryIds,
                    (industryIds) =>
                      setModelForm((current) => ({ ...current, industryIds }))
                  )
                }
              />
              <SeoFields
                pageTitle={modelForm.seoPageTitle}
                pageDescription={modelForm.seoPageDescription}
                pageKeywords={modelForm.seoPageKeywords}
                socialTitle={modelForm.seoSocialTitle}
                socialDescription={modelForm.seoSocialDescription}
                socialImage={modelForm.seoSocialImage}
                setField={(field, value) =>
                  setModelForm((current) => ({ ...current, [field]: value }))
                }
              />
            </div>

          {message && <p className={styles.statusText}>{message}</p>}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </article>
  );
}

function IndustryProductModelManager({
  createNonce,
}: {
  createNonce: number;
}) {
  const [industries, setIndustries] = useState<ResourceRecord[]>([]);
  const [products, setProducts] = useState<ResourceRecord[]>([]);
  const [models, setModels] = useState<ResourceRecord[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [modelForm, setModelForm] = useState<ModelFormState>({
    ...emptyModelForm,
    industryProductTemplateSections: defaultIndustryTemplateSections,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedIndustry = industries.find(
    (industry) => String(industry.id) === selectedIndustryId
  );
  const selectedProduct = products.find(
    (product) => String(product.id) === (modelForm.productId || selectedProductId)
  );
  const productsForIndustry = products.filter((product) =>
    toNumberIds(product.industryIds).includes(Number(selectedIndustryId))
  );
  const modelsForSelection = models.filter(
    (model) =>
      String(model.productId) === selectedProductId &&
      toNumberIds(model.industryIds).includes(Number(selectedIndustryId))
  );
  const industryModelUrl =
    selectedIndustry && selectedProduct && modelForm.modelNumber
      ? `/industries/${titleToSlug(String(selectedIndustry.title || ""))}/${titleToSlug(
          String(selectedProduct.title || "")
        )}/${modelSlug(
          String(selectedProduct.title || ""),
          modelForm.modelTitle,
          modelForm.modelNumber
        )}`
      : "/industries/{industry-name}/{product-name}/{model-slug}";

  const loadAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [industryResponse, productResponse, modelResponse] =
        await Promise.all([
          fetch("/api/industries?page=1&perPage=100"),
          fetch("/api/products?page=1&perPage=100"),
          fetch("/api/models?page=1&perPage=250"),
        ]);
      const [industryPayload, productPayload, modelPayload] =
        await Promise.all([
          industryResponse.json(),
          productResponse.json(),
          modelResponse.json(),
        ]);
      setIndustries(Array.isArray(industryPayload) ? industryPayload : []);
      setProducts(Array.isArray(productPayload) ? productPayload : []);
      setModels(Array.isArray(modelPayload) ? modelPayload : []);
      if (!selectedIndustryId && Array.isArray(industryPayload)) {
        setSelectedIndustryId(String(industryPayload[0]?.id || ""));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Load failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (createNonce > 0) startNewModel();
  }, [createNonce]);

  const startNewModel = (productId = selectedProductId) => {
    setModelForm({
      ...emptyModelForm,
      productId,
      industryIds: selectedIndustryId ? [Number(selectedIndustryId)] : [],
      industryProductTemplateSections: defaultIndustryTemplateSections,
    });
    setMessage("");
    setError("");
  };

  const openModel = async (model: ResourceRecord) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/models/${model.id}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Model open failed");
      setModelForm(modelToForm(payload));
      if (payload.productId) setSelectedProductId(String(payload.productId));
    } catch (openError) {
      setModelForm(modelToForm(model));
      if (model.productId) setSelectedProductId(String(model.productId));
      setError(openError instanceof Error ? openError.message : "Open failed");
    }
  };

  const saveModel = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const industryIds = Array.from(
        new Set([
          ...modelForm.industryIds,
          ...(selectedIndustryId ? [Number(selectedIndustryId)] : []),
        ])
      );
      const payload = buildModelPayload({
        ...modelForm,
        productId: modelForm.productId || selectedProductId,
        industryIds,
      });
      const response = await fetch(
        modelForm.id ? `/api/models/${modelForm.id}` : "/api/models",
        {
          method: modelForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.details || result?.error || "Save failed");
      }
      setModelForm(modelToForm(result));
      setMessage(
        modelForm.id
          ? "Industry product model updated."
          : "Industry product model created."
      );
      await loadAll();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const setUploadedField = (field: keyof ModelFormState, url: string) => {
    setModelForm((current) => ({ ...current, [field]: url }));
  };

  return (
    <article className={styles.panel} id="industries-content-editor">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Industry Product Models</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadAll}>
            Refresh
          </button>
          <button
            className={styles.buttonDark}
            type="button"
            onClick={() => startNewModel()}
          >
            New Model
          </button>
        </div>
      </div>

      <div className={styles.industryLayout}>
        <div className={styles.recordList}>
          {isLoading && <p className={styles.statusText}>Loading content...</p>}
          <p className={styles.listHeading}>Industries</p>
          {industries.map((industry) => (
            <button
              key={`industry-${industry.id}`}
              className={`${styles.recordItem} ${
                selectedIndustryId === String(industry.id)
                  ? styles.recordItemActive
                  : ""
              }`}
              type="button"
              onClick={() => {
                setSelectedIndustryId(String(industry.id));
                setSelectedProductId("");
                setModelForm({
                  ...emptyModelForm,
                  industryIds: [Number(industry.id)],
                  industryProductTemplateSections:
                    defaultIndustryTemplateSections,
                });
              }}
            >
              <span className={styles.recordTitle}>
                {String(industry.title || "")}
              </span>
              <span className={styles.recordSubtitle}>
                /industries/{titleToSlug(String(industry.title || ""))}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.recordList}>
          <p className={styles.listHeading}>Products in industry</p>
          {selectedIndustryId && productsForIndustry.length === 0 && (
            <p className={styles.statusText}>No products assigned.</p>
          )}
          {productsForIndustry.map((product) => (
            <button
              key={`industry-product-${product.id}`}
              className={`${styles.recordItem} ${
                selectedProductId === String(product.id)
                  ? styles.recordItemActive
                  : ""
              }`}
              type="button"
              onClick={() => {
                setSelectedProductId(String(product.id));
                startNewModel(String(product.id));
              }}
            >
              <span className={styles.recordTitle}>
                {String(product.title || "")}
              </span>
              <span className={styles.recordSubtitle}>
                {models.filter(
                  (model) =>
                    String(model.productId) === String(product.id) &&
                    toNumberIds(model.industryIds).includes(
                      Number(selectedIndustryId)
                    )
                ).length}{" "}
                models
              </span>
            </button>
          ))}

          {selectedProductId && (
            <>
              <p className={styles.listHeading}>Models</p>
              {modelsForSelection.map((model) => (
                <button
                  key={`industry-model-${model.id}`}
                  className={`${styles.recordItem} ${
                    modelForm.id === model.id ? styles.recordItemActive : ""
                  }`}
                  type="button"
                  onClick={() => openModel(model)}
                >
                  <span className={styles.recordTitle}>
                    {String(model.modelNumber || "")}
                  </span>
                  <span className={styles.recordSubtitle}>
                    {String(model.modelTitle || "")}
                  </span>
                </button>
              ))}
              <button
                className={styles.buttonDark}
                type="button"
                onClick={() => startNewModel(selectedProductId)}
              >
                New model for this product
              </button>
            </>
          )}
        </div>

        <div className={styles.editorPanel}>
          <div className={styles.cmsForm}>
            <div className={styles.editorHeader}>
              <h3>
                {modelForm.id
                  ? "Edit industry product model"
                  : "Create industry product model"}
              </h3>
              <button
                className={styles.buttonDark}
                type="button"
                onClick={saveModel}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : modelForm.id ? "Update" : "Create"}
              </button>
            </div>
            <div>
              <p className={styles.listHeading}>Slug</p>
              <p className={styles.slugPreview}>{industryModelUrl}</p>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.fieldControl}>
                <span>Assign to product</span>
                <select
                  value={modelForm.productId || selectedProductId}
                  onChange={(event) => {
                    setSelectedProductId(event.target.value);
                    setModelForm((current) => ({
                      ...current,
                      productId: event.target.value,
                      series: "",
                    }));
                  }}
                >
                  <option value="">Select product</option>
                  {productsForIndustry.map((product) => (
                    <option key={product.id} value={String(product.id)}>
                      {String(product.title)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.fieldControl}>
                <span>Series</span>
                <select
                  value={modelForm.series}
                  onChange={(event) =>
                    setModelForm((current) => ({
                      ...current,
                      series: event.target.value,
                    }))
                  }
                >
                  <option value="">Select series</option>
                  {((selectedProduct?.series as string[]) || []).map(
                    (series) => (
                      <option key={series} value={series}>
                        {series}
                      </option>
                    )
                  )}
                </select>
              </label>
              <CmsInput
                label="Model name / number"
                value={modelForm.modelNumber}
                onChange={(modelNumber) =>
                  setModelForm((current) => ({ ...current, modelNumber }))
                }
              />
              <CmsInput
                label="Model title"
                value={modelForm.modelTitle}
                onChange={(modelTitle) =>
                  setModelForm((current) => ({ ...current, modelTitle }))
                }
              />
            </div>

            <CmsTextarea
              label="Short description"
              value={modelForm.shortDescription}
              onChange={(shortDescription) =>
                setModelForm((current) => ({ ...current, shortDescription }))
              }
            />

            <div className={styles.formGrid}>
              <FileUploadField
                label="Thumbnail URL"
                folder="models/thumbnails"
                value={modelForm.thumbnail}
                onChange={(thumbnail) =>
                  setModelForm((current) => ({ ...current, thumbnail }))
                }
                onUploaded={(url) => setUploadedField("thumbnail", url)}
              />
              <CmsInput
                label="Thumbnail alt text"
                value={modelForm.thumbnailAltText}
                onChange={(thumbnailAltText) =>
                  setModelForm((current) => ({ ...current, thumbnailAltText }))
                }
              />
              <FileUploadField
                label="Cover image URL"
                folder="models/covers"
                value={modelForm.coverImage}
                onChange={(coverImage) =>
                  setModelForm((current) => ({ ...current, coverImage }))
                }
                onUploaded={(url) => setUploadedField("coverImage", url)}
              />
              <CmsInput
                label="Cover image alt text"
                value={modelForm.coverImageAltText}
                onChange={(coverImageAltText) =>
                  setModelForm((current) => ({
                    ...current,
                    coverImageAltText,
                  }))
                }
              />
            </div>

            <DynamicKeyValueList
              label="Specs / key features"
              values={modelForm.keyFeatures}
              onChange={(keyFeatures) =>
                setModelForm((current) => ({ ...current, keyFeatures }))
              }
            />

            <IndustryTemplateSectionsEditor
              values={modelForm.industryProductTemplateSections}
              onChange={(industryProductTemplateSections) =>
                setModelForm((current) => ({
                  ...current,
                  industryProductTemplateSections,
                }))
              }
            />

            <SeoFields
              pageTitle={modelForm.seoPageTitle}
              pageDescription={modelForm.seoPageDescription}
              pageKeywords={modelForm.seoPageKeywords}
              socialTitle={modelForm.seoSocialTitle}
              socialDescription={modelForm.seoSocialDescription}
              socialImage={modelForm.seoSocialImage}
              setField={(field, value) =>
                setModelForm((current) => ({ ...current, [field]: value }))
              }
            />
          </div>

          {message && <p className={styles.statusText}>{message}</p>}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </article>
  );
}

function CmsInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.fieldControl}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function FileUploadField({
  label,
  folder,
  value,
  onChange,
  onUploaded,
  accept = "image/*",
}: {
  label: string;
  folder: string;
  value: string;
  onChange: (value: string) => void;
  onUploaded: (url: string) => void;
  accept?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadFile = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setIsUploading(true);
    setUploadError("");

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Upload failed");
      }
      onUploaded(payload.url || "");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploadField}>
      <CmsInput label={label} value={value} onChange={onChange} />
      <label className={styles.fileButton}>
        <span>{isUploading ? "Uploading..." : "Upload file"}</span>
        <input
          type="file"
          accept={accept}
          disabled={isUploading}
          onChange={(event) => uploadFile(event.target.files?.[0])}
        />
      </label>
      {uploadError && <p className={styles.errorText}>{uploadError}</p>}
    </div>
  );
}

function CmsTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.fieldControl}>
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
      />
    </label>
  );
}

function DynamicStringList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const update = (index: number, value: string) => {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <p>{label}</p>
        <button
          className={styles.button}
          type="button"
          onClick={() => onChange([...values, ""])}
        >
          Add
        </button>
      </div>
      {values.map((item, index) => (
        <div key={`${label}-${index}`} className={styles.repeatRow}>
          <input value={item} onChange={(event) => update(index, event.target.value)} />
          <button
            className={styles.button}
            type="button"
            onClick={() =>
              onChange(values.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function DynamicKeyValueList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: { name: string; value: string }[];
  onChange: (values: { name: string; value: string }[]) => void;
}) {
  const update = (index: number, field: "name" | "value", value: string) => {
    onChange(
      values.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <p>{label}</p>
        <button
          className={styles.button}
          type="button"
          onClick={() => onChange([...values, { name: "", value: "" }])}
        >
          Add spec
        </button>
      </div>
      {values.map((item, index) => (
        <div key={`${label}-${index}`} className={styles.repeatRowTwo}>
          <input
            placeholder="Spec name"
            value={item.name}
            onChange={(event) => update(index, "name", event.target.value)}
          />
          <input
            placeholder="Spec value"
            value={item.value}
            onChange={(event) => update(index, "value", event.target.value)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={() =>
              onChange(values.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function ModelDescriptionEditor({
  values,
  onChange,
  setUploadedUrl,
}: {
  values: ModelDescriptionForm[];
  onChange: (values: ModelDescriptionForm[]) => void;
  setUploadedUrl: (
    sectionIndex: number,
    field: keyof Pick<ModelDescriptionForm, "image">,
    url: string
  ) => void;
}) {
  const update = (
    index: number,
    field: keyof ModelDescriptionForm,
    value: string | string[]
  ) => {
    onChange(
      values.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <p>Model detail sections</p>
        <button
          className={styles.button}
          type="button"
          onClick={() =>
            onChange([
              ...values,
              {
                image: "",
                imageAltText: "",
                title: "",
                description: [""],
                youtubeLink: "",
              },
            ])
          }
        >
          Add section
        </button>
      </div>
      {values.map((item, index) => (
        <div key={`description-${index}`} className={styles.detailEditor}>
          <p className={styles.listHeading}>Section {index + 1}</p>
          <div className={styles.formGrid}>
            <FileUploadField
              label="Detail image URL"
              folder="models/details"
              value={item.image}
              onChange={(value) => update(index, "image", value)}
              onUploaded={(url) => setUploadedUrl(index, "image", url)}
            />
            <CmsInput
              label="Detail image alt text"
              value={item.imageAltText}
              onChange={(value) => update(index, "imageAltText", value)}
            />
            <CmsInput
              label="Section title"
              value={item.title}
              onChange={(value) => update(index, "title", value)}
            />
            <CmsInput
              label="YouTube link"
              value={item.youtubeLink || ""}
              onChange={(value) => update(index, "youtubeLink", value)}
            />
          </div>
          <DynamicStringList
            label="Description lines"
            values={item.description}
            onChange={(description) => update(index, "description", description)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={() =>
              onChange(values.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            Remove section
          </button>
        </div>
      ))}
    </div>
  );
}

function IndustryPicker({
  industries,
  selected,
  toggle,
}: {
  industries: IndustryOption[];
  selected: number[];
  toggle: (industryId: number) => void;
}) {
  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <p>Industries</p>
      </div>
      <div className={styles.checkboxGrid}>
        {industries.map((industry) => (
          <label key={industry.id} className={styles.checkboxItem}>
            <input
              type="checkbox"
              checked={selected.includes(industry.id)}
              onChange={() => toggle(industry.id)}
            />
            <span>{industry.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function IndustryTemplateSectionsEditor({
  values,
  onChange,
}: {
  values: TemplateSectionForm[];
  onChange: (values: TemplateSectionForm[]) => void;
}) {
  const update = (
    index: number,
    field: keyof TemplateSectionForm,
    value: string | boolean | string[]
  ) => {
    onChange(
      values.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      )
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <p>Industry template sections</p>
        <button
          className={styles.button}
          type="button"
          onClick={() =>
            onChange([
              ...values,
              {
                key: "",
                enabled: true,
                eyebrow: "",
                heading: "",
                intro: "",
                paragraphs: [""],
              },
            ])
          }
        >
          Add section
        </button>
      </div>
      {values.map((section, index) => (
        <div key={`${section.key}-${index}`} className={styles.detailEditor}>
          <div className={styles.editorHeader}>
            <p className={styles.listHeading}>
              Section {index + 1}: {section.key || "New"}
            </p>
            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={section.enabled !== false}
                onChange={(event) =>
                  update(index, "enabled", event.target.checked)
                }
              />
              <span>Show section</span>
            </label>
          </div>
          <div className={styles.formGrid}>
            <CmsInput
              label="Section key"
              value={section.key}
              onChange={(value) => update(index, "key", value)}
            />
            <CmsInput
              label="Eyebrow"
              value={section.eyebrow}
              onChange={(value) => update(index, "eyebrow", value)}
            />
            <CmsInput
              label="Heading"
              value={section.heading}
              onChange={(value) => update(index, "heading", value)}
            />
            <CmsTextarea
              label="Intro"
              value={section.intro}
              onChange={(value) => update(index, "intro", value)}
            />
          </div>
          <DynamicStringList
            label="Paragraphs"
            values={section.paragraphs}
            onChange={(paragraphs) => update(index, "paragraphs", paragraphs)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={() =>
              onChange(values.filter((_, sectionIndex) => sectionIndex !== index))
            }
          >
            Remove section
          </button>
        </div>
      ))}
    </div>
  );
}

function SeoFields({
  pageTitle,
  pageDescription,
  pageKeywords,
  socialTitle,
  socialDescription,
  socialImage,
  setField,
}: {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  socialTitle: string;
  socialDescription: string;
  socialImage: string;
  setField: (
    field:
      | "seoPageTitle"
      | "seoPageDescription"
      | "seoPageKeywords"
      | "seoSocialTitle"
      | "seoSocialDescription"
      | "seoSocialImage",
    value: string
  ) => void;
}) {
  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <p>Meta Details</p>
      </div>
      <CmsInput
        label="Meta title"
        value={pageTitle}
        onChange={(value) => setField("seoPageTitle", value)}
      />
      <CmsTextarea
        label="Meta description"
        value={pageDescription}
        onChange={(value) => setField("seoPageDescription", value)}
      />
      <CmsInput
        label="Meta keywords"
        value={pageKeywords}
        onChange={(value) => setField("seoPageKeywords", value)}
      />
      <CmsInput
        label="Social title"
        value={socialTitle}
        onChange={(value) => setField("seoSocialTitle", value)}
      />
      <CmsTextarea
        label="Social description"
        value={socialDescription}
        onChange={(value) => setField("seoSocialDescription", value)}
      />
      <CmsInput
        label="Social image URL"
        value={socialImage}
        onChange={(value) => setField("seoSocialImage", value)}
      />
    </div>
  );
}

function ResourceManager({
  config,
  sectionKey,
  createNonce,
}: {
  config: (typeof resourceConfig)[keyof typeof resourceConfig];
  sectionKey: Exclude<SectionKey, "home" | "media">;
  createNonce: number;
}) {
  const [records, setRecords] = useState<ResourceRecord[]>([]);
  const [selected, setSelected] = useState<ResourceRecord | null>(null);
  const [editorValue, setEditorValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRecords = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/${config.endpoint}?page=1&perPage=50`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not load content");
      }
      setRecords(Array.isArray(payload) ? payload : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load content"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelected(null);
    setEditorValue("");
    setIsCreating(false);
    setMessage("");
    setError("");
    loadRecords();
  }, [config.endpoint]);

  useEffect(() => {
    if (createNonce > 0) startCreate();
  }, [createNonce]);

  const titleFor = (record: ResourceRecord) =>
    String(record[config.titleField] || `Untitled #${record.id || ""}`);

  const subtitleFor = (record: ResourceRecord) =>
    config.subtitleField ? String(record[config.subtitleField] || "") : "";

  const startCreate = () => {
    setIsCreating(true);
    setSelected(null);
    setMessage("");
    setError("");
    setEditorValue(JSON.stringify(config.emptyRecord, null, 2));
  };

  const startEdit = async (record: ResourceRecord) => {
    setIsCreating(false);
    setMessage("");
    setError("");
    setIsOpening(true);

    try {
      if (!record.id) {
        setSelected(record);
        setEditorValue(JSON.stringify(record, null, 2));
        return;
      }

      const response = await fetch(`/api/${config.endpoint}/${record.id}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not open content");
      }

      setSelected(payload);
      setEditorValue(JSON.stringify(payload, null, 2));
    } catch (openError) {
      setSelected(record);
      setEditorValue(JSON.stringify(record, null, 2));
      setError(
        openError instanceof Error
          ? openError.message
          : "Could not open content"
      );
    } finally {
      setIsOpening(false);
    }
  };

  const saveRecord = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const parsed = JSON.parse(editorValue) as ResourceRecord;
      if (!isCreating && !selected?.id) {
        throw new Error("Select content before updating.");
      }

      const endpoint = isCreating
        ? `/api/${config.endpoint}`
        : `/api/${config.endpoint}/${selected?.id}`;
      const response = await fetch(endpoint, {
        method: isCreating ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Save failed");
      }

      setMessage(isCreating ? "Content created." : "Content updated.");
      setSelected(payload);
      setIsCreating(false);
      setEditorValue(JSON.stringify(payload, null, 2));
      await loadRecords();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className={styles.panel} id={`${sectionKey}-content-editor`}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Existing Content</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadRecords}>
            Refresh
          </button>
          <button className={styles.buttonDark} type="button" onClick={startCreate}>
            Create New
          </button>
        </div>
      </div>
      <div className={styles.resourceLayout}>
        <div className={styles.recordList}>
          {isLoading && <p className={styles.statusText}>Loading content...</p>}
          {!isLoading && records.length === 0 && (
            <p className={styles.statusText}>No content found.</p>
          )}
          {records.map((record) => (
            <button
              key={String(record.id || titleFor(record))}
              type="button"
              className={`${styles.recordItem} ${
                selected?.id === record.id ? styles.recordItemActive : ""
              }`}
              onClick={() => startEdit(record)}
            >
              <span className={styles.recordTitle}>{titleFor(record)}</span>
              {subtitleFor(record) && (
                <span className={styles.recordSubtitle}>
                  {subtitleFor(record)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
            <h3>
              {isCreating
                ? "Create content"
                : selected
                  ? `Edit ${titleFor(selected)}`
                  : "Select content"}
            </h3>
            {(isCreating || selected) && (
              <div className={styles.editorActions}>
                <button
                  className={styles.button}
                  type="button"
                  onClick={startCreate}
                >
                  New
                </button>
                <button
                  className={styles.buttonDark}
                  type="button"
                  onClick={saveRecord}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : isCreating ? "Create" : "Update"}
                </button>
              </div>
            )}
          </div>
          {isOpening ? (
            <p className={styles.statusText}>Opening content...</p>
          ) : isCreating || selected ? (
            <textarea
              className={styles.jsonEditor}
              value={editorValue}
              onChange={(event) => setEditorValue(event.target.value)}
              spellCheck={false}
            />
          ) : (
            <p className={styles.statusText}>
              Pick an item from the list, or create new content.
            </p>
          )}
          {message && <p className={styles.statusText}>{message}</p>}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </article>
  );
}

function MediaUploadPanel({
  folder,
  setFolder,
  fileInputRef,
  handleUpload,
  isUploading,
  uploadStatus,
  uploadError,
  uploadedUrl,
}: {
  folder: string;
  setFolder: (value: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleUpload: (file?: File) => void;
  isUploading: boolean;
  uploadStatus: string;
  uploadError: string;
  uploadedUrl: string;
}) {
  return (
    <article className={styles.panel} id="media-upload">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Media Upload</h2>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.uploadBox}>
          <div className={styles.field}>
            <label htmlFor="upload-folder">Folder</label>
            <select
              id="upload-folder"
              className={styles.select}
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
            >
              <option value="cms/uploads">General uploads</option>
              <option value="models/covers">Model cover images</option>
              <option value="models/details">Model detail images</option>
              <option value="models/brochures">Model brochures</option>
              <option value="products/thumbnails">Product images</option>
              <option value="industries/thumbnails">Industry images</option>
              <option value="hero">Hero sliders</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="media-file">File</label>
            <input
              ref={fileInputRef}
              id="media-file"
              className={styles.fileInput}
              type="file"
              accept="image/*,application/pdf,video/*"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
          </div>

          <button
            className={styles.buttonDark}
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            {isUploading ? "Uploading..." : "Upload New Content"}
          </button>

          {uploadStatus && <p className={styles.statusText}>{uploadStatus}</p>}
          {uploadError && <p className={styles.errorText}>{uploadError}</p>}
          {uploadedUrl && (
            <div className={styles.uploadResult}>
              <textarea className={styles.urlBox} readOnly value={uploadedUrl} />
              <button
                className={styles.button}
                type="button"
                onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function WorkflowPanel() {
  return (
    <section className={styles.panelGrid}>
      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Template Workflow</h2>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.workflowList}>
            {[
              {
                title: "Upload assets",
                text: "Add images, brochures, and media URLs using the upload box.",
              },
              {
                title: "Open a section",
                text: "Use the left menu to choose Product-Models, Industries, Blogs, or Hero Sliders.",
              },
              {
                title: "Edit template sections",
                text: "Use Product Template or Industry Product Template controls to change headings, text, and visibility.",
              },
              {
                title: "Publish",
                text: "Save the content. Public pages keep the same route and use the latest published content.",
              },
            ].map((item, index) => (
              <div key={item.title} className={styles.workflowItem}>
                <span className={styles.workflowNumber}>{index + 1}</span>
                <div>
                  <p className={styles.workflowTitle}>{item.title}</p>
                  <p className={styles.workflowText}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
