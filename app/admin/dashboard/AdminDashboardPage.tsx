"use client";

import Link from "next/link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapLink from "@tiptap/extension-link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "@/utils/auth";
import { modelSlug, titleToSlug } from "@/utils/slug";
import { ResizableImage } from "../blog-cms/components/ResizableImage";
import { UnderlineMark } from "../blog-cms/components/UnderlineMark";
import HomepageContentManager from "../components/HomepageContentManager";
import styles from "./dashboard.module.scss";

type CountState = {
  products: number | null;
  models: number | null;
  industries: number | null;
  blogs: number | null;
};

type SectionKey =
  | "home"
  | "homepageContent"
  | "hero"
  | "products"
  | "productModels"
  | "industries"
  | "industryProducts"
  | "models"
  | "blogs"
  | "media";

const KEY_FEATURE_DESCRIPTION_LIMIT = 6;

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
      { label: "Homepage Content", section: "homepageContent" },
      { label: "Product", section: "products" },
      { label: "Product Models", section: "productModels" },
      { label: "Industry", section: "industries" },
      { label: "Industry Products", section: "industryProducts" },
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
  homepageContent: "/admin/homepage-content",
  products: "/admin/products",
  productModels: "/admin/prodcut-models",
  models: "/admin/models",
  industries: "/admin/industries",
  industryProducts: "/admin/industry-products",
  blogs: "/admin/blogs",
  media: "/admin/media-upload",
};

function EditorToolbarIcon({
  name,
}: {
  name: "bulletList" | "orderedList" | "quote" | "link" | "image";
}) {
  const iconProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "bulletList":
      return (
        <svg {...iconProps}>
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );
    case "orderedList":
      return (
        <svg {...iconProps}>
          <path d="M10 6h11" />
          <path d="M10 12h11" />
          <path d="M10 18h11" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M3.5 14h2.5l-2.5 4h2.5" />
        </svg>
      );
    case "quote":
      return (
        <svg {...iconProps}>
          <path d="M8 12H5a3 3 0 0 1 3-3V7a5 5 0 0 0-5 5v5h5z" />
          <path d="M18 12h-3a3 3 0 0 1 3-3V7a5 5 0 0 0-5 5v5h5z" />
        </svg>
      );
    case "link":
      return (
        <svg {...iconProps}>
          <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 20.07l1.15-1.15" />
        </svg>
      );
    case "image":
      return (
        <svg {...iconProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="m21 15-5-5L5 19" />
        </svg>
      );
    default:
      return null;
  }
}

const sectionByPath: Record<string, SectionKey> = {
  "/admin": "home",
  "/admin/dashboard": "home",
  "/admin/hero-sliders": "hero",
  "/admin/homepage-content": "homepageContent",
  "/admin/products": "products",
  "/admin/prodcut-models": "productModels",
  "/admin/product-models": "productModels",
  "/admin/models": "models",
  "/admin/industries": "industries",
  "/admin/industry-products": "industryProducts",
  "/admin/blogs": "blogs",
  "/admin/media-upload": "media",
};

const quickActions = [
  {
    title: "Add Product",
    text: "Create a product family before adding its model variants.",
    section: "products" as const,
  },
  {
    title: "Add Product Model",
    text: "Upload model content and template section controls.",
    section: "productModels" as const,
  },
  {
    title: "Add Industry",
    text: "Create an industry page and connect products to it.",
    section: "industries" as const,
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
  homepageContent: {
    title: "Homepage Content",
    intro:
      "Edit homepage-only sections including built cards, awards, certifications, media, testimonials, clients, FAQs, and CTA images.",
    primaryAction: "Edit Homepage",
    cards: [
      {
        title: "Homepage sections",
        text: "Update text, repeatable rows, image URLs, and uploaded assets without changing code.",
        action: "Edit Content",
      },
      {
        title: "Upload homepage image",
        text: "Upload awards, certificate, media, client, and CTA images directly from this editor.",
        action: "Upload Image",
      },
    ],
  },
  products: {
    title: "Products",
    intro:
      "Create and update product families before adding model variants.",
    primaryAction: "Add Product",
    cards: [
      {
        title: "Product families",
        text: "Add or update products, series, images, SEO, and linked industries.",
        action: "Edit Products",
      },
    ],
  },
  productModels: {
    title: "Product Models",
    intro:
      "Create and update product model pages used under each product family.",
    primaryAction: "Add Product Model",
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
    title: "Industry",
    intro:
      "Create and update industry landing pages.",
    primaryAction: "Add Industry",
    cards: [
      {
        title: "Industry details",
        text: "Edit title, description, images, banners, brochure, and SEO.",
        action: "Edit Industry",
      },
      {
        title: "Industry image",
        text: "Upload thumbnails and detail images for industry pages.",
        action: "Upload Image",
      },
    ],
  },
  industryProducts: {
    title: "Industry Products",
    intro:
      "Assign products to industries, then add or edit product models for those industry pages.",
    primaryAction: "Add Industry Product Model",
    cards: [
      {
        title: "Industry products",
        text: "Choose an industry and product, then edit or add the product models under it.",
        action: "Edit Industry Products",
      },
      {
        title: "Product setup",
        text: "Create products from the Industry Products editor when one is missing.",
        action: "Add Product",
      },
    ],
  },
  blogs: {
    title: "Blogs",
    intro:
      "Create articles and media posts for the site. Published blogs are available for search engine crawling.",
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

type IndustryBannerForm = {
  imageUrl: string;
  altText: string;
};

type IndustryFormState = {
  id?: number | string;
  title: string;
  description: string;
  seoDescription: string;
  thumbnail: string;
  thumbnailAltText: string;
  bannerImages: IndustryBannerForm[];
  brochure: string;
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

type BlogFormState = {
  id?: number | string;
  title: string;
  slug: string;
  description: string;
  banner: string;
  bannerAltText: string;
  content: string;
  published: boolean;
  industryIds: number[];
  productIds: number[];
  modelIds: number[];
  seoPageTitle: string;
  seoPageDescription: string;
  seoPageKeywords: string;
  seoSocialTitle: string;
  seoSocialDescription: string;
  seoSocialImage: string;
};

const resourceConfig: Record<
  Exclude<
    SectionKey,
    "home" | "media" | "homepageContent" | "productModels" | "industryProducts"
  >,
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
    subtitleField: "description",
    emptyRecord: {
      title: "",
      slug: "",
      description: "",
      banner: "",
      bannerAltText: "",
      content: "",
      published: true,
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
  const showIntroPanel = ![
    "products",
    "homepageContent",
    "productModels",
    "industries",
    "industryProducts",
    "blogs",
  ].includes(sectionKey);

  return (
    <section className={styles.singlePanelGrid}>
      {showIntroPanel && (
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
      )}
      {sectionKey === "products" ? (
        <ProductCatalogManager createNonce={createNonce} />
      ) : sectionKey === "homepageContent" ? (
        <HomepageContentManager />
      ) : sectionKey === "productModels" ? (
        <ProductModelManager createNonce={createNonce} />
      ) : sectionKey === "industries" ? (
        <IndustryCatalogManager createNonce={createNonce} />
      ) : sectionKey === "industryProducts" ? (
        <IndustryProductModelManager createNonce={createNonce} />
      ) : sectionKey === "blogs" ? (
        <BlogManager
          config={resourceConfig.blogs}
          createNonce={createNonce}
        />
      ) : sectionKey === "hero" || sectionKey === "models" ? (
        <ResourceManager
          config={resourceConfig[sectionKey]}
          sectionKey={sectionKey}
          createNonce={createNonce}
        />
      ) : (
        null
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

const emptyIndustryForm: IndustryFormState = {
  title: "",
  description: "",
  seoDescription: "",
  thumbnail: "",
  thumbnailAltText: "",
  bannerImages: [{ imageUrl: "", altText: "" }],
  brochure: "",
  active: true,
  seoPageTitle: "",
  seoPageDescription: "",
  seoPageKeywords: "",
  seoSocialTitle: "",
  seoSocialDescription: "",
  seoSocialImage: "",
};

const defaultProductTemplateSections: TemplateSectionForm[] = [
  {
    key: "hero",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "specs",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "keyFeatures",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "industryFit",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "applications",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
  {
    key: "moreModels",
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
  {
    key: "contact",
    enabled: true,
    eyebrow: "",
    heading: "",
    intro: "",
    paragraphs: [""],
  },
];

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
  productTemplateSections: defaultProductTemplateSections,
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

function industryToForm(record: ResourceRecord): IndustryFormState {
  const seo = (record.seoMetadata || {}) as Record<string, unknown>;
  const banners = Array.isArray(record.bannerImages)
    ? (record.bannerImages as IndustryBannerForm[])
    : [];

  return {
    ...emptyIndustryForm,
    id: record.id,
    title: String(record.title || ""),
    description: String(record.description || ""),
    seoDescription: String(record.seoDescription || ""),
    thumbnail: String(record.thumbnail || ""),
    thumbnailAltText: String(record.thumbnailAltText || ""),
    bannerImages: banners.length
      ? banners.map((banner) => ({
          imageUrl: String(banner.imageUrl || ""),
          altText: String(banner.altText || ""),
        }))
      : [{ imageUrl: "", altText: "" }],
    brochure: String(record.brochure || ""),
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

function normalizeTemplateSection(section: Partial<TemplateSectionForm>) {
  return {
    key: String(section.key || ""),
    enabled: section.enabled !== false,
    eyebrow: String(section.eyebrow || ""),
    heading: String(section.heading || ""),
    intro: String(section.intro || ""),
    paragraphs: Array.isArray(section.paragraphs)
      ? section.paragraphs.map((paragraph) => String(paragraph || ""))
      : [""],
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
        ? (record.productTemplateSections as TemplateSectionForm[]).map(
            normalizeTemplateSection
          )
        : Array.isArray(productTemplate?.sections) &&
            productTemplate.sections.length
          ? productTemplate.sections.map(normalizeTemplateSection)
          : defaultProductTemplateSections,
    industryProductTemplateSections:
      Array.isArray(record.industryProductTemplateSections) &&
      record.industryProductTemplateSections.length
        ? (record.industryProductTemplateSections as TemplateSectionForm[]).map(
            normalizeTemplateSection
          )
        : Array.isArray(industryTemplate?.sections) &&
            industryTemplate.sections.length
          ? industryTemplate.sections.map(normalizeTemplateSection)
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

function buildIndustryPayload(form: IndustryFormState) {
  const bannerImages = form.bannerImages.filter(
    (banner) => banner.imageUrl.trim() || banner.altText.trim()
  );
  const seoMetadata = {
    pageTitle: form.seoPageTitle || form.title,
    pageDescription: form.seoPageDescription || form.description,
    pageKeywords: form.seoPageKeywords,
    socialTitle: form.seoSocialTitle || form.title,
    socialDescription: form.seoSocialDescription || form.description,
    socialImage: form.seoSocialImage || form.thumbnail,
    structuredData: {
      type: "organization",
      title: form.title,
      description: form.description,
    },
  };

  return {
    ...(form.id ? { id: form.id } : {}),
    title: form.title,
    description: form.description,
    seoDescription: form.seoDescription,
    thumbnail: form.thumbnail,
    thumbnailAltText: form.thumbnailAltText,
    bannerImages,
    brochure: form.brochure,
    active: form.active,
    seoMetadata,
  };
}

function buildModelPayload(
  form: ModelFormState,
  options: { industryOnly?: boolean } = {}
) {
  const cleanFeatures = form.keyFeatures.filter(
    (feature) => feature.name.trim() || feature.value.trim()
  );
  const cleanDescription = form.modelDescription
    .filter(
      (item) =>
        item.title.trim() ||
        item.image.trim() ||
        item.description.some((line) => line.trim())
    )
    .map((item) => ({
      ...item,
      description: item.description.filter((line) => line.trim()),
    }))
    .slice(0, 1);
  const cleanIndustrySections = form.industryProductTemplateSections
    .filter((section) => section.key.trim())
    .map((section) => {
      const key = section.key.trim();
      const storesParagraphs = [
        "applications",
        "faqs",
        "industryfit",
        "keyfeatures",
      ].includes(key.toLowerCase());

      return {
        key,
        enabled: section.enabled !== false,
        ...(section.eyebrow.trim() ? { eyebrow: section.eyebrow.trim() } : {}),
        ...(section.heading.trim() ? { heading: section.heading.trim() } : {}),
        ...(section.intro.trim() ? { intro: section.intro.trim() } : {}),
        ...(storesParagraphs && section.paragraphs.some((line) => line.trim())
          ? { paragraphs: section.paragraphs.filter((line) => line.trim()) }
          : {}),
      };
    });
  const cleanProductSections = form.productTemplateSections
    .filter((section) => section.key.trim())
    .map((section) => {
      const key = section.key.trim();
      const storesParagraphs = [
        "applications",
        "faqs",
        "industryfit",
        "keyfeatures",
      ].includes(key.toLowerCase());

      return {
        key,
        enabled: section.enabled !== false,
        ...(section.eyebrow.trim() ? { eyebrow: section.eyebrow.trim() } : {}),
        ...(section.heading.trim() ? { heading: section.heading.trim() } : {}),
        ...(section.intro.trim() ? { intro: section.intro.trim() } : {}),
        ...(storesParagraphs && section.paragraphs.some((line) => line.trim())
          ? { paragraphs: section.paragraphs.filter((line) => line.trim()) }
          : {}),
      };
    });

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
                      ...(options.industryOnly ? { industryOnly: true } : {}),
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

function ProductCatalogManager({ createNonce }: { createNonce: number }) {
  const [products, setProducts] = useState<ResourceRecord[]>([]);
  const [industries, setIndustries] = useState<IndustryOption[]>([]);
  const [productForm, setProductForm] = useState<ProductFormState>({
    ...emptyProductForm,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [productResponse, industryResponse] = await Promise.all([
        fetch("/api/products?page=1&perPage=100"),
        fetch("/api/industries?page=1&perPage=100"),
      ]);
      const [productPayload, industryPayload] = await Promise.all([
        productResponse.json(),
        industryResponse.json(),
      ]);
      setProducts(Array.isArray(productPayload) ? productPayload : []);
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
    if (createNonce > 0) startNewProduct();
  }, [createNonce]);

  const startNewProduct = () => {
    setProductForm({ ...emptyProductForm });
    setMessage("");
    setError("");
    window.setTimeout(() => {
      document.getElementById("product-family-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const openProduct = async (product: ResourceRecord) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/products/${product.id}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Product open failed");
      setProductForm(productToForm(payload));
    } catch (openError) {
      setProductForm(productToForm(product));
      setError(openError instanceof Error ? openError.message : "Open failed");
    }
  };

  const saveProduct = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = buildProductPayload(productForm);
      const response = await fetch(
        productForm.id ? `/api/products/${productForm.id}` : "/api/products",
        {
          method: productForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result?.details || result?.error || "Save failed");
      setProductForm(productToForm(result));
      setMessage(productForm.id ? "Product updated." : "Product created.");
      await loadAll();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (product: ResourceRecord) => {
    const title = String(product.title || "this product");
    if (!window.confirm(`Delete ${title}?`)) return;
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.details || result?.error || "Delete failed");
      if (productForm.id === product.id) setProductForm({ ...emptyProductForm });
      setMessage("Product deleted.");
      await loadAll();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    }
  };

  const toggleIndustry = (industryId: number) => {
    setProductForm((current) => ({
      ...current,
      industryIds: current.industryIds.includes(industryId)
        ? current.industryIds.filter((item) => item !== industryId)
        : [...current.industryIds, industryId],
    }));
  };

  return (
    <article className={`${styles.panel} ${styles.catalogPanel}`} id="products-content-editor">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Products</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadAll}>
            Refresh
          </button>
          <button className={styles.buttonDark} type="button" onClick={startNewProduct}>
            Add New Product
          </button>
        </div>
      </div>
      <div className={styles.catalogLayout}>
        <div className={styles.recordList}>
          {isLoading && <p className={styles.statusText}>Loading products...</p>}
          {products.map((product) => (
            <button
              key={`product-${product.id}`}
              className={`${styles.recordItem} ${
                productForm.id === product.id ? styles.recordItemActive : ""
              }`}
              type="button"
              onClick={() => openProduct(product)}
            >
              <span className={styles.recordTitle}>{String(product.title || "")}</span>
              <span className={styles.recordSubtitle}>{String(product.description || "")}</span>
              <span className={styles.recordMeta}>
                {product.active === false ? "Inactive" : "Active"}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.editorPanel} id="product-family-editor">
          <div className={styles.cmsForm}>
            <div className={styles.editorHeader}>
              <h3>{productForm.id ? "Edit product" : "Create product"}</h3>
              <div className={styles.editorActions}>
                {productForm.id && (
                  <button
                    className={styles.tableDeleteButton}
                    type="button"
                    onClick={() => deleteProduct(productForm)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className={styles.buttonDark}
                  type="button"
                  onClick={saveProduct}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : productForm.id ? "Update" : "Create"}
                </button>
              </div>
            </div>
            <div className={styles.slugCard}>
              <p className={styles.listHeading}>Slug</p>
              <p className={styles.slugPreview}>
                {productForm.title
                  ? `/products/${titleToSlug(productForm.title)}`
                  : "/products/{product-name}"}
              </p>
            </div>
            <FormSection title="Product Details" text="Create the parent product family shown on product listing pages.">
              <div className={styles.formGrid}>
                <CmsInput
                  label="Product title"
                  value={productForm.title}
                  onChange={(title) => setProductForm((current) => ({ ...current, title }))}
                />
                <CmsTextarea
                  label="Description"
                  value={productForm.description}
                  onChange={(description) =>
                    setProductForm((current) => ({ ...current, description }))
                  }
                />
                <CmsTextarea
                  label="SEO description"
                  value={productForm.seoDescription}
                  onChange={(seoDescription) =>
                    setProductForm((current) => ({ ...current, seoDescription }))
                  }
                />
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                  />
                  <span>Active</span>
                </label>
              </div>
              <DynamicStringList
                label="Series"
                values={productForm.series}
                onChange={(series) => setProductForm((current) => ({ ...current, series }))}
              />
            </FormSection>
            <FormSection title="Media" text="Upload product thumbnail and general product image.">
              <div className={styles.formGrid}>
                <FileUploadField
                  label="Thumbnail"
                  folder="products/thumbnails"
                  currentValue={productForm.thumbnail}
                  onUploaded={(thumbnail) =>
                    setProductForm((current) => ({ ...current, thumbnail }))
                  }
                />
                <CmsInput
                  label="Thumbnail alt text"
                  value={productForm.thumbnailAltText}
                  onChange={(thumbnailAltText) =>
                    setProductForm((current) => ({ ...current, thumbnailAltText }))
                  }
                />
                <FileUploadField
                  label="General image"
                  folder="products/general"
                  currentValue={productForm.generalImage}
                  onUploaded={(generalImage) =>
                    setProductForm((current) => ({ ...current, generalImage }))
                  }
                />
                <CmsInput
                  label="General image alt text"
                  value={productForm.generalImageAltText}
                  onChange={(generalImageAltText) =>
                    setProductForm((current) => ({ ...current, generalImageAltText }))
                  }
                />
              </div>
            </FormSection>
            <FormSection title="Industries" text="Choose where this product should appear.">
              <IndustryPicker
                industries={industries}
                selected={productForm.industryIds}
                toggle={toggleIndustry}
              />
            </FormSection>
            <FormSection title="SEO" text="Control metadata and social previews for this product page.">
              <SeoFields
                pageTitle={productForm.seoPageTitle}
                pageDescription={productForm.seoPageDescription}
                pageKeywords={productForm.seoPageKeywords}
                setField={(field, value) =>
                  setProductForm((current) => ({ ...current, [field]: value }))
                }
              />
            </FormSection>
          </div>
          {message && <p className={styles.statusText}>{message}</p>}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </article>
  );
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
  const [modelSearch, setModelSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );

  const selectedProduct = products.find(
    (product) => String(product.id) === modelForm.productId
  );
  const selectedProductTitle = String(selectedProduct?.title || "");
  const selectedProductIndustryIds = toNumberIds(selectedProduct?.industryIds);
  const productIndustries = selectedProduct
    ? industries.filter((industry) =>
        selectedProductIndustryIds.includes(Number(industry.id))
      )
    : [];
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
      const form = modelToForm(payload);
      const product = products.find(
        (item) => String(item.id) === String(form.productId)
      );
      const productIndustryIds = toNumberIds(product?.industryIds);
      setModelForm({
        ...form,
        industryIds: productIndustryIds.length
          ? form.industryIds.filter((id) => productIndustryIds.includes(id))
          : [],
      });
    } catch (openError) {
      const form = modelToForm(model);
      const product = products.find(
        (item) => String(item.id) === String(form.productId)
      );
      const productIndustryIds = toNumberIds(product?.industryIds);
      setModelForm({
        ...form,
        industryIds: productIndustryIds.length
          ? form.industryIds.filter((id) => productIndustryIds.includes(id))
          : [],
      });
      setError(openError instanceof Error ? openError.message : "Open failed");
    }
  };

  const saveModel = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      if (!modelForm.productId) {
        throw new Error("Select a product before saving this model.");
      }
      const allowedIndustryIds = selectedProductIndustryIds.length
        ? modelForm.industryIds.filter((id) =>
            selectedProductIndustryIds.includes(id)
          )
        : [];
      const payload = buildModelPayload({
        ...modelForm,
        industryIds: allowedIndustryIds,
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

  const startNewModel = () => {
    setModelForm({ ...emptyModelForm });
    setMessage("");
    setError("");
    window.setTimeout(() => {
      document.getElementById("product-model-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const editModel = async (model: ResourceRecord) => {
    await openModel(model);
    window.setTimeout(() => {
      document.getElementById("product-model-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const deleteModel = async (model: ResourceRecord) => {
    const modelName = String(model.modelNumber || model.modelTitle || "this model");
    if (!window.confirm(`Delete ${modelName}?`)) return;

    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/models?id=${model.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.details || result?.error || "Delete failed");
      }
      if (modelForm.id === model.id) {
        setModelForm({ ...emptyModelForm });
      }
      setMessage("Model deleted.");
      await loadAll();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    }
  };

  const filteredModels = useMemo(() => {
    const search = modelSearch.trim().toLowerCase();
    return models.filter((model) => {
      const product = products.find(
        (item) => String(item.id) === String(model.productId)
      );
      const active = model.active !== false;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active);
      if (!matchesStatus) return false;
      if (!search) return true;
      return [
        model.modelNumber,
        model.modelTitle,
        model.machineType,
        model.series,
        product?.title,
      ]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(search));
    });
  }, [modelSearch, models, products, statusFilter]);

  const selectedIndustryCount = modelForm.industryIds.length;
  const completedMediaCount = [
    modelForm.thumbnail,
    modelForm.coverImage,
    modelForm.brochure,
  ].filter(Boolean).length;
  const productModelStatus = modelForm.id ? "Editing existing model" : "Draft model";

  return (
    <article
      className={`${styles.panel} ${styles.productModelPanel}`}
      id="product-models-content-editor"
    >
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Product Models</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadAll}>
            Refresh
          </button>
          <button
            className={styles.buttonDark}
            type="button"
            onClick={startNewModel}
          >
            Add New Model
          </button>
        </div>
      </div>

      <div className={styles.productModelWorkspace}>
        <div className={styles.productModelTablePanel}>
          <div className={styles.modelTableToolbar}>
            <div className={styles.filterCluster}>
              <label className={styles.compactSelectLabel}>
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as typeof statusFilter)
                  }
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label className={styles.searchField}>
                <span>Search and filter</span>
                <input
                  value={modelSearch}
                  onChange={(event) => setModelSearch(event.target.value)}
                  placeholder="Search model, product, series"
                />
              </label>
            </div>
          </div>

          {isLoading && <p className={styles.statusText}>Loading content...</p>}
          <div className={styles.modelTableWrap}>
            <table className={styles.modelTable}>
              <thead>
                <tr>
                  <th aria-label="Select" />
                  <th>Product model</th>
                  <th>Status</th>
                  <th>Product family</th>
                  <th>Machine type</th>
                  <th>Series</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => {
                  const product = products.find(
                    (item) => String(item.id) === String(model.productId)
                  );
                  const active = model.active !== false;
                  return (
                    <tr
                      key={`model-row-${model.id}`}
                      className={modelForm.id === model.id ? styles.modelRowActive : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={modelForm.id === model.id}
                          onChange={() => editModel(model)}
                          aria-label={`Select ${String(
                            model.modelNumber || model.modelTitle || "model"
                          )}`}
                        />
                      </td>
                      <td>
                        <button
                          className={styles.modelIdentityButton}
                          type="button"
                          onClick={() => editModel(model)}
                        >
                          <span className={styles.modelThumb}>
                            {model.thumbnail ? (
                              <img
                                src={String(model.thumbnail)}
                                alt={String(
                                  model.thumbnailAltText ||
                                    model.modelNumber ||
                                    "Model thumbnail"
                                )}
                              />
                            ) : (
                              <span>{String(model.modelNumber || "?").slice(0, 1)}</span>
                            )}
                          </span>
                          <span>
                            <strong>{String(model.modelNumber || "Untitled model")}</strong>
                            <small>{String(model.modelTitle || "No title added")}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${
                            active ? styles.statusPillActive : styles.statusPillInactive
                          }`}
                        >
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{String(product?.title || "Unassigned")}</td>
                      <td>{String(model.machineType || "-")}</td>
                      <td>{String(model.series || "-")}</td>
                      <td>
                        <div className={styles.tableActions}>
                          <button
                            className={styles.tableEditButton}
                            type="button"
                            onClick={() => editModel(model)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.tableDeleteButton}
                            type="button"
                            onClick={() => deleteModel(model)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredModels.length && (
                  <tr>
                    <td colSpan={7}>
                      <p className={styles.statusText}>No matching models found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`${styles.editorPanel} ${styles.productModelEditor}`}
          id="product-model-editor"
        >
            <div className={styles.cmsForm}>
              <div className={`${styles.editorHeader} ${styles.stickyEditorHeader}`}>
                <div>
                  <p className={styles.editorEyebrow}>{productModelStatus}</p>
                  <h3>{modelForm.id ? "Edit product model" : "Create product model"}</h3>
                </div>
                <div className={styles.editorSummary}>
                  <span>{selectedProductTitle || "No product"}</span>
                  <span>{selectedIndustryCount} industries</span>
                  <span>{completedMediaCount}/3 media</span>
                </div>
                <button
                  className={styles.buttonDark}
                  type="button"
                  onClick={saveModel}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : modelForm.id ? "Update" : "Create"}
                </button>
              </div>
              <div className={styles.slugCard}>
                <p className={styles.listHeading}>Slug</p>
                <p className={styles.slugPreview}>{modelUrl}</p>
              </div>
              <FormSection
                title="Model Identity"
                text="Core information used across product pages and catalog cards."
              >
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
                    onChange={(event) => {
                      const nextProduct = products.find(
                        (product) => String(product.id) === event.target.value
                      );
                      const nextIndustryIds = toNumberIds(nextProduct?.industryIds);
                      setModelForm((current) => ({
                        ...current,
                        productId: event.target.value,
                        series: "",
                        industryIds: current.industryIds.filter((industryId) =>
                          nextIndustryIds.includes(industryId)
                        ),
                      }));
                    }}
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
              </FormSection>
              <FormSection
                title="Media Assets"
                text="Upload the images and brochure attached to this model."
              >
              <div className={styles.formGrid}>
                <FileUploadField
                  label="Thumbnail"
                  folder="models/thumbnails"
                  currentValue={modelForm.thumbnail}
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
                  label="Cover image"
                  folder="models/covers"
                  currentValue={modelForm.coverImage}
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
                  label="Brochure"
                  folder="models/brochures"
                  currentValue={modelForm.brochure}
                  onUploaded={(url) => setUploadedField("brochure", url)}
                  accept="application/pdf,image/*"
                />
              </div>
              </FormSection>
              <FormSection
                title="Specifications"
                text="Key feature specs shown in the model detail page. Edit the specs heading and intro in Product Page Sections."
              >
              <DynamicKeyValueList
                label="Specs / key features"
                values={modelForm.keyFeatures}
                onChange={(keyFeatures) =>
                  setModelForm((current) => ({ ...current, keyFeatures }))
                }
              />
              </FormSection>
              <FormSection
                title="Detail Content"
                text="Build the deeper page sections with images, titles, and copy."
              >
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
              </FormSection>
              <FormSection
                title="Product Page Sections"
                text="Control /products/{product-name}/{model-name}: show or hide sections, edit headings, and override generated section copy."
              >
              <TemplateSectionsEditor
                title="Product template sections"
                helperText="Section keys: hero, specs, keyFeatures, industryFit, applications, moreModels, faqs, contact. Use headings and intro here; model page description content belongs in the main editor. Key Features and FAQ sections show their own content boxes."
                values={modelForm.productTemplateSections}
                keyFeatures={modelForm.keyFeatures}
                industries={productIndustries.filter((industry) =>
                  modelForm.industryIds.includes(industry.id)
                )}
                modelLabel={modelForm.modelNumber}
                onChange={(productTemplateSections) =>
                  setModelForm((current) => ({
                    ...current,
                    productTemplateSections,
                  }))
                }
              />
              </FormSection>
              <FormSection
                title="Relationships"
                text="Choose from the industries connected to this product."
              >
              {selectedProduct ? (
                productIndustries.length ? (
                  <IndustryPicker
                    industries={productIndustries}
                    selected={modelForm.industryIds}
                    toggle={(industryId) =>
                      toggleIndustry(
                        industryId,
                        modelForm.industryIds,
                        (industryIds) =>
                          setModelForm((current) => ({
                            ...current,
                            industryIds: industryIds.filter((id) =>
                              selectedProductIndustryIds.includes(id)
                            ),
                          }))
                      )
                    }
                  />
                ) : (
                  <p className={styles.statusText}>
                    This product is not linked to any industries yet. Add industry
                    links in the Product section first.
                  </p>
                )
              ) : (
                <p className={styles.statusText}>
                  Select a product to see its related industries.
                </p>
              )}
              </FormSection>
              <FormSection
                title="SEO"
                text="Control metadata and social previews for this model page."
              >
              <SeoFields
                pageTitle={modelForm.seoPageTitle}
                pageDescription={modelForm.seoPageDescription}
                pageKeywords={modelForm.seoPageKeywords}
                setField={(field, value) =>
                  setModelForm((current) => ({ ...current, [field]: value }))
                }
              />
              </FormSection>
            </div>

          {message && <p className={styles.statusText}>{message}</p>}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </article>
  );
}

function IndustryCatalogManager({ createNonce }: { createNonce: number }) {
  const [industries, setIndustries] = useState<ResourceRecord[]>([]);
  const [industryForm, setIndustryForm] = useState<IndustryFormState>({
    ...emptyIndustryForm,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadIndustries = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/industries?page=1&perPage=100");
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Load failed");
      setIndustries(Array.isArray(payload) ? payload : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Load failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIndustries();
  }, []);

  useEffect(() => {
    if (createNonce > 0) startNewIndustry();
  }, [createNonce]);

  const startNewIndustry = () => {
    setIndustryForm({ ...emptyIndustryForm });
    setMessage("");
    setError("");
    window.setTimeout(() => {
      document.getElementById("industry-page-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const openIndustry = async (industry: ResourceRecord) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/industries/${industry.id}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Industry open failed");
      setIndustryForm(industryToForm(payload));
    } catch (openError) {
      setIndustryForm(industryToForm(industry));
      setError(openError instanceof Error ? openError.message : "Open failed");
    }
  };

  const saveIndustry = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = buildIndustryPayload(industryForm);
      const response = await fetch(
        industryForm.id ? `/api/industries/${industryForm.id}` : "/api/industries",
        {
          method: industryForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result?.details || result?.error || "Save failed");
      setIndustryForm(industryToForm(result));
      setMessage(industryForm.id ? "Industry updated." : "Industry created.");
      await loadIndustries();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteIndustry = async (industry: ResourceRecord) => {
    const title = String(industry.title || "this industry");
    if (!window.confirm(`Delete ${title}?`)) return;
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/industries/${industry.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.details || result?.error || "Delete failed");
      if (industryForm.id === industry.id) setIndustryForm({ ...emptyIndustryForm });
      setMessage("Industry deleted.");
      await loadIndustries();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    }
  };

  const updateBanner = (
    index: number,
    field: keyof IndustryBannerForm,
    value: string
  ) => {
    setIndustryForm((current) => ({
      ...current,
      bannerImages: current.bannerImages.map((banner, bannerIndex) =>
        bannerIndex === index ? { ...banner, [field]: value } : banner
      ),
    }));
  };

  return (
    <article className={`${styles.panel} ${styles.catalogPanel}`} id="industries-content-editor">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Industries</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadIndustries}>
            Refresh
          </button>
          <button className={styles.buttonDark} type="button" onClick={startNewIndustry}>
            Add New Industry
          </button>
        </div>
      </div>
      <div className={styles.catalogLayout}>
        <div className={styles.recordList}>
          {isLoading && <p className={styles.statusText}>Loading industries...</p>}
          {industries.map((industry) => (
            <button
              key={`industry-page-${industry.id}`}
              className={`${styles.recordItem} ${
                industryForm.id === industry.id ? styles.recordItemActive : ""
              }`}
              type="button"
              onClick={() => openIndustry(industry)}
            >
              <span className={styles.recordTitle}>{String(industry.title || "")}</span>
              <span className={styles.recordSubtitle}>{String(industry.description || "")}</span>
              <span className={styles.recordMeta}>
                {industry.active === false ? "Inactive" : "Active"}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.editorPanel} id="industry-page-editor">
          <div className={styles.cmsForm}>
            <div className={styles.editorHeader}>
              <h3>{industryForm.id ? "Edit industry" : "Create industry"}</h3>
              <div className={styles.editorActions}>
                {industryForm.id && (
                  <button
                    className={styles.tableDeleteButton}
                    type="button"
                    onClick={() => deleteIndustry(industryForm)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className={styles.buttonDark}
                  type="button"
                  onClick={saveIndustry}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : industryForm.id ? "Update" : "Create"}
                </button>
              </div>
            </div>
            <div className={styles.slugCard}>
              <p className={styles.listHeading}>Slug</p>
              <p className={styles.slugPreview}>
                {industryForm.title
                  ? `/industries/${titleToSlug(industryForm.title)}`
                  : "/industries/{industry-name}"}
              </p>
            </div>
            <FormSection title="Industry Details" text="Create the industry landing page shown on the website.">
              <div className={styles.formGrid}>
                <CmsInput
                  label="Industry title"
                  value={industryForm.title}
                  onChange={(title) => setIndustryForm((current) => ({ ...current, title }))}
                />
                <CmsTextarea
                  label="Description"
                  value={industryForm.description}
                  onChange={(description) =>
                    setIndustryForm((current) => ({ ...current, description }))
                  }
                />
                <CmsTextarea
                  label="SEO description"
                  value={industryForm.seoDescription}
                  onChange={(seoDescription) =>
                    setIndustryForm((current) => ({ ...current, seoDescription }))
                  }
                />
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={industryForm.active}
                    onChange={(event) =>
                      setIndustryForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                  />
                  <span>Active</span>
                </label>
              </div>
            </FormSection>
            <FormSection title="Media" text="Upload thumbnail, banner images, and brochure assets.">
              <div className={styles.formGrid}>
                <FileUploadField
                  label="Thumbnail"
                  folder="industries/thumbnails"
                  currentValue={industryForm.thumbnail}
                  onUploaded={(thumbnail) =>
                    setIndustryForm((current) => ({ ...current, thumbnail }))
                  }
                />
                <CmsInput
                  label="Thumbnail alt text"
                  value={industryForm.thumbnailAltText}
                  onChange={(thumbnailAltText) =>
                    setIndustryForm((current) => ({ ...current, thumbnailAltText }))
                  }
                />
                <FileUploadField
                  label="Brochure"
                  folder="industries/brochures"
                  currentValue={industryForm.brochure}
                  accept="application/pdf,image/*"
                  onUploaded={(brochure) =>
                    setIndustryForm((current) => ({ ...current, brochure }))
                  }
                />
              </div>
              <div className={styles.repeatGroup}>
                <div className={styles.repeatHeader}>
                  <p>Banner images</p>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() =>
                      setIndustryForm((current) => ({
                        ...current,
                        bannerImages: [
                          ...current.bannerImages,
                          { imageUrl: "", altText: "" },
                        ],
                      }))
                    }
                  >
                    Add banner
                  </button>
                </div>
                {industryForm.bannerImages.map((banner, index) => (
                  <div key={`industry-banner-${index}`} className={styles.repeatRowTwo}>
                    <FileUploadField
                      label={`Banner ${index + 1}`}
                      folder="industries/banners"
                      currentValue={banner.imageUrl}
                      onUploaded={(url) => updateBanner(index, "imageUrl", url)}
                    />
                    <CmsInput
                      label="Alt text"
                      value={banner.altText}
                      onChange={(altText) => updateBanner(index, "altText", altText)}
                    />
                    <button
                      className={styles.button}
                      type="button"
                      onClick={() =>
                        setIndustryForm((current) => ({
                          ...current,
                          bannerImages: current.bannerImages.filter(
                            (_, bannerIndex) => bannerIndex !== index
                          ),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </FormSection>
            <FormSection title="SEO" text="Control metadata and social previews for this industry page.">
              <SeoFields
                pageTitle={industryForm.seoPageTitle}
                pageDescription={industryForm.seoPageDescription}
                pageKeywords={industryForm.seoPageKeywords}
                setField={(field, value) =>
                  setIndustryForm((current) => ({ ...current, [field]: value }))
                }
              />
            </FormSection>
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
  const [productToAddId, setProductToAddId] = useState<string>("");
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
  const productsNotInIndustry = products.filter(
    (product) => !toNumberIds(product.industryIds).includes(Number(selectedIndustryId))
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
      }, { industryOnly: true });
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

  const addProductToIndustry = async () => {
    if (!selectedIndustryId || !productToAddId) return;
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/products/${productToAddId}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Product open failed");

      const form = productToForm(payload);
      const industryId = Number(selectedIndustryId);
      const nextIndustryIds = form.industryIds.includes(industryId)
        ? form.industryIds
        : [...form.industryIds, industryId];
      const updateResponse = await fetch(`/api/products/${productToAddId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildProductPayload({ ...form, industryIds: nextIndustryIds })
        ),
      });
      const result = await updateResponse.json();
      if (!updateResponse.ok) {
        throw new Error(result?.details || result?.error || "Product add failed");
      }

      setSelectedProductId(productToAddId);
      setProductToAddId("");
      setMessage("Product added to industry.");
      await loadAll();
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Product add failed");
    }
  };

  const setUploadedField = (field: keyof ModelFormState, url: string) => {
    setModelForm((current) => ({ ...current, [field]: url }));
  };

  return (
    <article className={styles.panel} id="industry-models-content-editor">
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
                setProductToAddId("");
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
          {selectedIndustryId && (
            <div className={styles.inlineAddBox}>
              <label className={styles.compactSelectLabel}>
                <span>Add product</span>
                <select
                  value={productToAddId}
                  onChange={(event) => setProductToAddId(event.target.value)}
                >
                  <option value="">Select existing product</option>
                  {productsNotInIndustry.map((product) => (
                    <option key={`add-product-${product.id}`} value={String(product.id)}>
                      {String(product.title || "")}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className={styles.buttonDark}
                type="button"
                disabled={!productToAddId}
                onClick={addProductToIndustry}
              >
                Add Product
              </button>
              <Link className={styles.button} href="/admin/products">
                Create New Product
              </Link>
            </div>
          )}
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
                className={`${styles.buttonDark} ${styles.industryModelCreateButton}`}
                type="button"
                onClick={() => startNewModel(selectedProductId)}
              >
                Add new model for this industry product
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
                label="Thumbnail"
                folder="models/thumbnails"
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
                label="Cover image"
                folder="models/covers"
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

            <TemplateSectionsEditor
              title="Industry template sections"
              helperText="Section keys: projectFit, applicationFit, projectExecution, executionPriorities, workflow, supportCta, faqs."
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

function FormSection({
  title,
  text,
  children,
}: {
  title?: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.formSection}>
      {(title || text) && (
        <div className={styles.formSectionHeader}>
          <div>
            {title && <h4>{title}</h4>}
            {text && <p>{text}</p>}
          </div>
        </div>
      )}
      <div className={styles.formSectionBody}>{children}</div>
    </section>
  );
}

function FileUploadField({
  label,
  folder,
  currentValue = "",
  onUploaded,
  accept = "image/*",
  uploadSuccessMessage = "Image has been uploaded.",
  replacementSuccessMessage = "A new image has been replaced.",
}: {
  label: string;
  folder: string;
  currentValue?: string;
  onUploaded: (url: string) => void;
  accept?: string;
  uploadSuccessMessage?: string;
  replacementSuccessMessage?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const isImage =
    typeof currentValue === "string" &&
    /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(currentValue);

  const uploadFile = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setIsUploading(true);
    setUploadError("");
    setUploadMessage("");

    try {
      const wasReplacing = Boolean(currentValue);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Upload failed");
      }
      onUploaded(payload.url || "");
      setUploadMessage(
        wasReplacing ? replacementSuccessMessage : uploadSuccessMessage
      );
      window.setTimeout(() => {
        setUploadMessage("");
      }, 4000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploadField}>
      <div className={styles.uploadFieldHeader}>
        <span className={styles.uploadLabel}>{label}</span>
        {currentValue && <span className={styles.uploadStatus}>Uploaded</span>}
      </div>
      <label className={styles.fileButton}>
        <span>{isUploading ? "Uploading..." : "Upload file"}</span>
        <input
          type="file"
          accept={accept}
          disabled={isUploading}
          onChange={(event) => uploadFile(event.target.files?.[0])}
        />
      </label>
      {uploadMessage && <p className={styles.statusText}>{uploadMessage}</p>}
      {uploadError && <p className={styles.errorText}>{uploadError}</p>}
      {isImage && (
        <a
          className={styles.uploadPreviewLink}
          href={currentValue}
          target="_blank"
          rel="noopener noreferrer"
        >
          View uploaded image
        </a>
      )}
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
  values?: string[];
  onChange: (values: string[]) => void;
}) {
  const listValues = Array.isArray(values) ? values : [""];

  const update = (index: number, value: string) => {
    onChange(
      listValues.map((item, itemIndex) =>
        itemIndex === index ? value : item
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
          onClick={() => onChange([...listValues, ""])}
        >
          Add
        </button>
      </div>
      {listValues.map((item, index) => (
        <div key={`${label}-${index}`} className={styles.repeatRow}>
          <input value={item} onChange={(event) => update(index, event.target.value)} />
          <button
            className={styles.button}
            type="button"
            onClick={() =>
              onChange(listValues.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function parseFaqParagraph(value: string) {
  const [question = "", ...answerParts] = String(value || "")
    .split(/\s*(?:\|\||\|)\s*/)
    .map((part) => part.trim());

  return {
    question,
    answer: answerParts.join(" ").trim(),
  };
}

function formatFaqParagraph(question: string, answer: string) {
  const cleanQuestion = question.trim();
  const cleanAnswer = answer.trim();

  if (!cleanQuestion && !cleanAnswer) return "";
  return `${cleanQuestion} || ${cleanAnswer}`.trim();
}

function DynamicFaqList({
  label,
  values,
  onChange,
}: {
  label: string;
  values?: string[];
  onChange: (values: string[]) => void;
}) {
  const listValues = Array.isArray(values) && values.length ? values : [""];

  const update = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    onChange(
      listValues.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const faq = parseFaqParagraph(item);
        return formatFaqParagraph(
          field === "question" ? value : faq.question,
          field === "answer" ? value : faq.answer
        );
      })
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <div>
          <p>{label}</p>
          <p className={styles.workflowText}>
            Add one question and answer per FAQ.
          </p>
        </div>
        <button
          className={styles.button}
          type="button"
          onClick={() => onChange([...listValues, ""])}
        >
          Add FAQ
        </button>
      </div>
      {listValues.map((item, index) => {
        const faq = parseFaqParagraph(item);

        return (
          <div key={`${label}-${index}`} className={styles.faqEditorRow}>
            <CmsInput
              label="Question"
              value={faq.question}
              onChange={(value) => update(index, "question", value)}
            />
            <CmsTextarea
              label="Answer"
              value={faq.answer}
              onChange={(value) => update(index, "answer", value)}
            />
            <button
              className={styles.button}
              type="button"
              onClick={() =>
                onChange(listValues.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Remove FAQ
            </button>
          </div>
        );
      })}
    </div>
  );
}

function parseCardParagraph(value: string) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return { title: "", text: "" };
  if (!/\|\|?/.test(rawValue)) return { title: "", text: rawValue };

  const [title = "", ...textParts] = String(value || "")
    .split(/\s*(?:\|\||\|)\s*/)
    .map((part) => part.trim());

  return {
    title,
    text: textParts.join(" ").trim(),
  };
}

function inferIndustryFitCard(
  value: string,
  modelLabel = ""
) {
  const card = parseCardParagraph(value);
  if (!card.title || !card.text) return card;

  const titleLower = card.title.toLowerCase();
  const modelLower = modelLabel.trim().toLowerCase();
  if (
    modelLower &&
    titleLower.startsWith(modelLower) &&
    titleLower.includes(" is suited for ")
  ) {
    return {
      title: "",
      text: value,
    };
  }

  return card;
}

function formatCardParagraph(title: string, text: string) {
  const cleanTitle = title.trim();
  const cleanText = text.trim();

  if (!cleanTitle && !cleanText) return "";
  return `${cleanTitle} || ${cleanText}`.trim();
}

function DynamicIndustryFitCardList({
  values,
  industries,
  modelLabel,
  onChange,
}: {
  values?: string[];
  industries?: IndustryOption[];
  modelLabel?: string;
  onChange: (values: string[]) => void;
}) {
  const industryRows = Array.isArray(industries) ? industries.slice(0, 6) : [];
  const rowCount = Math.max(1, values?.length || industryRows.length || 6);
  const listValues = Array.from({ length: rowCount }, (_, index) =>
    Array.isArray(values) ? values[index] || "" : ""
  );

  const update = (index: number, field: "title" | "text", value: string) => {
    onChange(
      listValues.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const card = inferIndustryFitCard(item, modelLabel);
        return formatCardParagraph(
          field === "title" ? value : card.title,
          field === "text" ? value : card.text
        );
      })
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <div>
          <p>Industry fit cards</p>
          <p className={styles.workflowText}>
            Add as many points as this model needs. Blank titles fall back to selected industries.
          </p>
        </div>
        <button
          className={styles.button}
          type="button"
          onClick={() => onChange([...listValues, ""])}
        >
          Add point
        </button>
      </div>
      {listValues.map((item, index) => {
        const card = inferIndustryFitCard(item, modelLabel);
        const industry = industryRows[index];

        return (
          <div key={`industry-fit-card-${index}`} className={styles.cardEditorRow}>
            <input
              placeholder={industry?.title || `Point ${index + 1} title`}
              value={card.title}
              onChange={(event) => update(index, "title", event.target.value)}
            />
            <input
              placeholder="Point description"
              value={card.text}
              onChange={(event) => update(index, "text", event.target.value)}
            />
            <span className={styles.countPill}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <button
              className={styles.button}
              type="button"
              onClick={() =>
                onChange(listValues.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DynamicApplicationCardList({
  values,
  onChange,
}: {
  values?: string[];
  onChange: (values: string[]) => void;
}) {
  const defaults = [
    "Project Applications",
    "Site Planning",
    "Fleet Fit",
    "Operational Value",
  ];
  const rowCount = Math.max(defaults.length, values?.length || 0);
  const listValues = Array.from({ length: rowCount }, (_, index) =>
    Array.isArray(values) ? values[index] || "" : ""
  );

  const update = (index: number, field: "title" | "text", value: string) => {
    onChange(
      listValues.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const card = parseCardParagraph(item);
        return formatCardParagraph(
          field === "title" ? value : card.title,
          field === "text" ? value : card.text
        );
      })
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <div>
          <p>Product fit cards</p>
          <p className={styles.workflowText}>
            These four cards appear in the Product Fit section.
          </p>
        </div>
      </div>
      {listValues.map((item, index) => {
        const card = parseCardParagraph(item);

        return (
          <div key={`application-card-${index}`} className={styles.repeatRowTwo}>
            <input
              placeholder={defaults[index] || `Card ${index + 1} title`}
              value={card.title}
              onChange={(event) => update(index, "title", event.target.value)}
            />
            <input
              placeholder="Card description"
              value={card.text}
              onChange={(event) => update(index, "text", event.target.value)}
            />
            <span className={styles.countPill}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DynamicKeyFeatureDescriptionList({
  values,
  keyFeatures,
  onChange,
}: {
  values?: string[];
  keyFeatures?: { name: string; value: string }[];
  onChange: (values: string[]) => void;
}) {
  const featureRows = Array.isArray(keyFeatures)
    ? keyFeatures
        .filter((feature) => feature.name.trim() || feature.value.trim())
        .slice(0, KEY_FEATURE_DESCRIPTION_LIMIT)
    : [];
  const rowCount = Math.max(featureRows.length, values?.length || 0, 1);
  const listValues = Array.from({ length: rowCount }, (_, index) =>
    Array.isArray(values) ? values[index] || "" : ""
  );

  const update = (index: number, field: "title" | "text", value: string) => {
    onChange(
      listValues.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const card = parseCardParagraph(item);
        return formatCardParagraph(
          field === "title" ? value : card.title,
          field === "text" ? value : card.text
        );
      })
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <div>
          <p>Key feature descriptions</p>
          <p className={styles.workflowText}>
            These headings and descriptions appear under the key feature cards in order.
          </p>
        </div>
        <button
          className={styles.button}
          type="button"
          onClick={() => onChange([...listValues, ""])}
        >
          Add feature
        </button>
      </div>
      {listValues.map((item, index) => {
        const feature = featureRows[index];
        const card = parseCardParagraph(item);
        const fallbackTitle =
          feature?.name || feature?.value || `Feature ${index + 1}`;

        return (
          <div
            key={`key-feature-description-${index}`}
            className={styles.detailEditor}
          >
            <CmsInput
              label="Feature heading"
              value={card.title}
              onChange={(value) => update(index, "title", value)}
            />
            <CmsTextarea
              label={`Description for ${card.title || fallbackTitle}`}
              value={card.text}
              onChange={(value) => update(index, "text", value)}
            />
            <button
              className={styles.button}
              type="button"
              onClick={() =>
                onChange(listValues.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Remove feature
            </button>
          </div>
        );
      })}
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  const descriptionItem = values[0] || emptyModelForm.modelDescription[0];
  const update = (
    field: keyof ModelDescriptionForm,
    value: string | string[]
  ) => {
    onChange([{ ...descriptionItem, [field]: value }]);
  };
  const toEditorValue = (description: string[]) => {
    const lines = Array.isArray(description) ? description.filter(Boolean) : [];
    if (lines.some((line) => /<\/?[a-z][\s\S]*>/i.test(line))) {
      return lines.join("");
    }

    return lines
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <div>
          <p>Model page description</p>
          <p className={styles.workflowText}>
            Use one content box for as much model page description as needed.
          </p>
        </div>
      </div>
        <div className={styles.detailEditor}>
          <div className={styles.formGrid}>
            <FileUploadField
              label="Detail image"
              folder="models/details"
              currentValue={descriptionItem.image}
              onUploaded={(url) => setUploadedUrl(0, "image", url)}
            />
            <CmsInput
              label="Detail image alt text"
              value={descriptionItem.imageAltText}
              onChange={(value) => update("imageAltText", value)}
            />
            <CmsInput
              label="Section title"
              value={descriptionItem.title}
              onChange={(value) => update("title", value)}
            />
            <CmsInput
              label="YouTube link"
              value={descriptionItem.youtubeLink || ""}
              onChange={(value) => update("youtubeLink", value)}
            />
          </div>
          <div className={styles.fieldControl}>
            <span>Model page description</span>
            <RichBlogEditor
              value={toEditorValue(descriptionItem.description)}
              onChange={(content) => update("description", [content])}
            />
          </div>
        </div>
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

function TemplateSectionsEditor({
  title,
  helperText,
  values,
  keyFeatures,
  industries,
  modelLabel,
  onChange,
}: {
  title: string;
  helperText: string;
  values?: TemplateSectionForm[];
  keyFeatures?: { name: string; value: string }[];
  industries?: IndustryOption[];
  modelLabel?: string;
  onChange: (values: TemplateSectionForm[]) => void;
}) {
  const sectionValues = Array.isArray(values) ? values : [];

  const update = (
    index: number,
    field: keyof TemplateSectionForm,
    value: string | boolean | string[]
  ) => {
    onChange(
      sectionValues.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      )
    );
  };

  return (
    <div className={styles.repeatGroup}>
      <div className={styles.repeatHeader}>
        <div>
          <p>{title}</p>
          <p className={styles.workflowText}>{helperText}</p>
        </div>
        <button
          className={styles.button}
          type="button"
          onClick={() =>
            onChange([
              ...sectionValues,
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
      {sectionValues.map((section, index) => (
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
          {section.key.trim().toLowerCase() === "faqs" ? (
            <DynamicFaqList
              label="FAQs"
              values={section.paragraphs}
              onChange={(paragraphs) => update(index, "paragraphs", paragraphs)}
            />
          ) : section.key.trim().toLowerCase() === "keyfeatures" ? (
            <DynamicKeyFeatureDescriptionList
              values={section.paragraphs}
              keyFeatures={keyFeatures}
              onChange={(paragraphs) => update(index, "paragraphs", paragraphs)}
            />
          ) : section.key.trim().toLowerCase() === "industryfit" ? (
            <DynamicIndustryFitCardList
              values={section.paragraphs}
              industries={industries}
              modelLabel={modelLabel}
              onChange={(paragraphs) => update(index, "paragraphs", paragraphs)}
            />
          ) : section.key.trim().toLowerCase() === "applications" ? (
            <DynamicApplicationCardList
              values={section.paragraphs}
              onChange={(paragraphs) => update(index, "paragraphs", paragraphs)}
            />
          ) : null}
          <button
            className={styles.button}
            type="button"
            onClick={() =>
              onChange(
                sectionValues.filter((_, sectionIndex) => sectionIndex !== index)
              )
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
  setField,
}: {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  setField: (
    field:
      | "seoPageTitle"
      | "seoPageDescription"
      | "seoPageKeywords",
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
    </div>
  );
}

function formatCmsDate(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const emptyBlogForm: BlogFormState = {
  title: "",
  slug: "",
  description: "",
  banner: "",
  bannerAltText: "",
  content: "",
  published: true,
  industryIds: [],
  productIds: [],
  modelIds: [],
  seoPageTitle: "",
  seoPageDescription: "",
  seoPageKeywords: "",
  seoSocialTitle: "",
  seoSocialDescription: "",
  seoSocialImage: "",
};

function slugifyBlog(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function plainTextFromHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blogToForm(record: ResourceRecord): BlogFormState {
  const seo = (record.seoMetadata || {}) as Record<string, string>;
  return {
    id: record.id,
    title: String(record.title || ""),
    slug: String(record.slug || ""),
    description: String(record.description || ""),
    banner: String(record.banner || ""),
    bannerAltText: String(record.bannerAltText || ""),
    content: String(record.content || ""),
    published: record.published !== false,
    industryIds: toNumberIds(record.industryIds),
    productIds: toNumberIds(record.productIds),
    modelIds: toNumberIds(record.modelIds),
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

function buildBlogPayload(form: BlogFormState) {
  const fallbackDescription =
    form.description.trim() ||
    form.seoPageDescription.trim() ||
    plainTextFromHtml(form.content).slice(0, 180) ||
    form.title;
  const seoMetadata = {
    pageTitle: form.seoPageTitle || form.title,
    pageDescription: form.seoPageDescription || fallbackDescription,
    pageKeywords: form.seoPageKeywords,
  };

  return {
    ...(form.id ? { id: form.id } : {}),
    title: form.title,
    slug: slugifyBlog(form.slug || form.title),
    description: fallbackDescription,
    banner: form.banner,
    bannerAltText: form.bannerAltText,
    content: form.content,
    published: form.published,
    industryIds: form.industryIds,
    productIds: form.productIds,
    modelIds: form.modelIds,
    seoMetadata,
  };
}

function BlogManager({
  config,
  createNonce,
}: {
  config: (typeof resourceConfig)["blogs"];
  createNonce: number;
}) {
  const [records, setRecords] = useState<ResourceRecord[]>([]);
  const [selected, setSelected] = useState<ResourceRecord | null>(null);
  const [blogForm, setBlogForm] = useState<BlogFormState>(emptyBlogForm);
  const [industries, setIndustries] = useState<ResourceRecord[]>([]);
  const [products, setProducts] = useState<ResourceRecord[]>([]);
  const [models, setModels] = useState<ResourceRecord[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isLoadingRelations, setIsLoadingRelations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blogMode, setBlogMode] = useState<"list" | "editor">("list");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const blogContentDraftRef = useRef(emptyBlogForm.content);
  const [blogSearch, setBlogSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "visible" | "hidden"
  >("all");

  const loadRecords = async () => {
    setIsLoading(true);
    setError("");
    try {
      const blogResponse = await fetch(`/api/${config.endpoint}?page=1&perPage=200`);
      const blogPayload = await blogResponse.json();
      if (!blogResponse.ok) {
        throw new Error(blogPayload?.error || "Could not load blogs");
      }
      setRecords(Array.isArray(blogPayload) ? blogPayload : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRelationOptions = async () => {
    if (industries.length || products.length || models.length || isLoadingRelations) {
      return;
    }

    setIsLoadingRelations(true);
    try {
      const [industryResponse, productResponse, modelResponse] = await Promise.all([
        fetch("/api/industries?page=1&perPage=100"),
        fetch("/api/products?page=1&perPage=100"),
        fetch("/api/models?page=1&perPage=250"),
      ]);
      const [industryPayload, productPayload, modelPayload] = await Promise.all([
        industryResponse.json(),
        productResponse.json(),
        modelResponse.json(),
      ]);

      if (industryResponse.ok && Array.isArray(industryPayload)) {
        setIndustries(industryPayload);
      }
      if (productResponse.ok && Array.isArray(productPayload)) {
        setProducts(productPayload);
      }
      if (modelResponse.ok && Array.isArray(modelPayload)) {
        setModels(modelPayload);
      }
    } catch (relationError) {
      setError(
        relationError instanceof Error
          ? relationError.message
          : "Could not load relationship options"
      );
    } finally {
      setIsLoadingRelations(false);
    }
  };

  useEffect(() => {
    setSelected(null);
    setBlogForm({ ...emptyBlogForm });
    setIsCreating(false);
    setBlogMode("list");
    setMessage("");
    setError("");
    loadRecords();
  }, [config.endpoint]);

  useEffect(() => {
    if (createNonce > 0) startCreate();
  }, [createNonce]);

  const titleFor = (record: ResourceRecord) =>
    String(record.title || `Untitled #${record.id || ""}`);

  const startCreate = () => {
    setIsCreating(true);
    setSelected(null);
    setMessage("");
    setError("");
    setBlogForm({ ...emptyBlogForm });
    blogContentDraftRef.current = emptyBlogForm.content;
    setBlogMode("editor");
    void loadRelationOptions();
  };

  const startEdit = async (record: ResourceRecord) => {
    setIsCreating(false);
    setMessage("");
    setError("");
    setIsOpening(true);
    setBlogMode("editor");

    try {
      const relationOptionsPromise = loadRelationOptions();
      if (!record.id) {
        setSelected(record);
        const nextForm = blogToForm(record);
        setBlogForm(nextForm);
        blogContentDraftRef.current = nextForm.content;
        await relationOptionsPromise;
        return;
      }

      const response = await fetch(`/api/${config.endpoint}/${record.id}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not open blog");
      }

      setSelected(payload);
      const nextForm = blogToForm(payload);
      setBlogForm(nextForm);
      blogContentDraftRef.current = nextForm.content;
      await relationOptionsPromise;
    } catch (openError) {
      setSelected(record);
      const nextForm = blogToForm(record);
      setBlogForm(nextForm);
      blogContentDraftRef.current = nextForm.content;
      setError(openError instanceof Error ? openError.message : "Could not open blog");
    } finally {
      setIsOpening(false);
    }
  };

  const closeEditor = () => {
    setBlogMode("list");
    setIsCreating(false);
    setSelected(null);
    setBlogForm({ ...emptyBlogForm });
    blogContentDraftRef.current = emptyBlogForm.content;
    setError("");
  };

  const saveRecord = async (publishState = blogForm.published) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const formToSave = {
        ...blogForm,
        content: blogContentDraftRef.current,
        published: publishState,
      };
      if (!isCreating && !selected?.id) {
        throw new Error("Select a blog before updating.");
      }
      if (!formToSave.title.trim()) throw new Error("Title is required.");
      if (!formToSave.banner.trim()) throw new Error("Banner image is required.");
      if (!formToSave.bannerAltText.trim()) {
        throw new Error("Banner alt text is required.");
      }
      if (!formToSave.content.trim()) throw new Error("Content is required.");

      const endpoint = isCreating
        ? `/api/${config.endpoint}`
        : `/api/${config.endpoint}/${selected?.id}`;
      const response = await fetch(endpoint, {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildBlogPayload(formToSave)),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Save failed");
      }

      setMessage(
        publishState
          ? isCreating
            ? "Blog published."
            : "Blog updated and published."
          : isCreating
            ? "Draft saved."
            : "Draft updated."
      );
      setSelected(payload);
      setIsCreating(false);
      const nextForm = blogToForm(payload);
      setBlogForm(nextForm);
      blogContentDraftRef.current = nextForm.content;
      setBlogMode("list");
      await loadRecords();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecord = async (record: ResourceRecord) => {
    if (!window.confirm(`Delete ${titleFor(record)}?`)) return;

    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/${config.endpoint}?id=${record.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Delete failed");
      }
      if (selected?.id === record.id) {
        setSelected(null);
        setBlogForm({ ...emptyBlogForm });
        blogContentDraftRef.current = emptyBlogForm.content;
        setIsCreating(false);
        setBlogMode("list");
      }
      setMessage("Blog deleted.");
      await loadRecords();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    }
  };

  const filteredRecords = useMemo(() => {
    const search = blogSearch.trim().toLowerCase();
    return records.filter((record) => {
      const visible = record.published !== false;
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && visible) ||
        (visibilityFilter === "hidden" && !visible);
      if (!matchesVisibility) return false;
      if (!search) return true;
      return [record.title, record.description, record.slug]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(search));
    });
  }, [blogSearch, records, visibilityFilter]);

  const updateBlogField = <K extends keyof BlogFormState>(
    field: K,
    value: BlogFormState[K]
  ) => {
    setBlogForm((current) => ({ ...current, [field]: value }));
  };

  const updateBlogContent = (content: string) => {
    blogContentDraftRef.current = content;
    updateBlogField("content", content);
  };

  const toggleBlogRelation = (
    field: "industryIds" | "productIds" | "modelIds",
    id: number
  ) => {
    setBlogForm((current) => {
      const selectedIds = current[field];
      return {
        ...current,
        [field]: selectedIds.includes(id)
          ? selectedIds.filter((item) => item !== id)
          : [...selectedIds, id],
      };
    });
  };

  return (
    <article
      className={`${styles.panel} ${styles.productModelPanel}`}
      id="blogs-content-editor"
    >
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Blog posts</h2>
        <div className={styles.panelActions}>
          <button className={styles.button} type="button" onClick={loadRecords}>
            Refresh
          </button>
          <button className={styles.buttonDark} type="button" onClick={startCreate}>
            Add blog post
          </button>
        </div>
      </div>

      <div
        className={`${styles.productModelWorkspace} ${
          blogMode === "editor" ? styles.blogEditorWorkspace : ""
        }`}
      >
        {blogMode === "list" && (
        <div className={styles.productModelTablePanel}>
          <div className={styles.modelTableToolbar}>
            <div className={styles.filterCluster}>
              <label className={styles.compactSelectLabel}>
                <span>Visibility</span>
                <select
                  value={visibilityFilter}
                  onChange={(event) =>
                    setVisibilityFilter(event.target.value as typeof visibilityFilter)
                  }
                >
                  <option value="all">All</option>
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
              </label>
              <label className={styles.searchField}>
                <span>Search and filter</span>
                <input
                  value={blogSearch}
                  onChange={(event) => setBlogSearch(event.target.value)}
                  placeholder="Search title, slug, description"
                />
              </label>
            </div>
          </div>

          {isLoading && <p className={styles.statusText}>Loading blogs...</p>}
          <div className={styles.modelTableWrap}>
            <table className={styles.modelTable}>
              <thead>
                <tr>
                  <th aria-label="Select" />
                  <th>Title</th>
                  <th>Visibility</th>
                  <th>Blog</th>
                  <th>Updated</th>
                  <th>Published</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const visible = record.published !== false;
                  return (
                    <tr
                      key={`blog-row-${record.id}`}
                      className={selected?.id === record.id ? styles.modelRowActive : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selected?.id === record.id}
                          onChange={() => startEdit(record)}
                          aria-label={`Select ${titleFor(record)}`}
                        />
                      </td>
                      <td>
                        <button
                          className={styles.modelIdentityButton}
                          type="button"
                          onClick={() => startEdit(record)}
                        >
                          <span className={styles.modelThumb}>
                            {record.banner ? (
                              <img
                                src={String(record.banner)}
                                alt={String(record.bannerAltText || titleFor(record))}
                              />
                            ) : (
                              <span>{titleFor(record).slice(0, 1)}</span>
                            )}
                          </span>
                          <span>
                            <strong>{titleFor(record)}</strong>
                            <small>{String(record.slug || "No slug")}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${
                            visible
                              ? styles.statusPillActive
                              : styles.statusPillInactive
                          }`}
                        >
                          {visible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td>News</td>
                      <td>{formatCmsDate(record.updatedAt)}</td>
                      <td>{formatCmsDate(record.createdAt)}</td>
                      <td>
                        <div className={styles.tableActions}>
                          <button
                            className={styles.tableEditButton}
                            type="button"
                            onClick={() => startEdit(record)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.tableDeleteButton}
                            type="button"
                            onClick={() => deleteRecord(record)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredRecords.length && (
                  <tr>
                    <td colSpan={7}>
                      <p className={styles.statusText}>No matching blog posts found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {blogMode === "editor" && (
        <div className={`${styles.editorPanel} ${styles.blogEditorPanel}`} id="blog-editor">
          <div
            className={`${styles.editorHeader} ${styles.stickyEditorHeader} ${styles.blogEditorHeader}`}
          >
            <div>
              <p className={styles.editorEyebrow}>
                {isCreating ? "New blog post" : selected ? "Editing blog post" : "Blog editor"}
              </p>
              <h3>
                {isCreating
                  ? "Create blog post"
                  : selected
                    ? `Edit ${titleFor(selected)}`
                    : "Select a blog post"}
              </h3>
            </div>
            {(isCreating || selected) && (
              <div className={styles.editorActions}>
                <button className={styles.button} type="button" onClick={closeEditor}>
                  Back to blogs
                </button>
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => saveRecord(false)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save draft"}
                </button>
                <button
                  className={styles.buttonDark}
                  type="button"
                  onClick={() => saveRecord(true)}
                  disabled={isSaving}
                >
                  {isSaving ? "Publishing..." : isCreating ? "Publish" : "Save & Publish"}
                </button>
              </div>
            )}
          </div>
          {isOpening ? (
            <p className={styles.statusText}>Opening blog post...</p>
          ) : isCreating || selected ? (
            <div className={styles.cmsForm}>
              <FormSection
                title=""
                text=""
              >
                <div className={styles.formGrid}>
                  <CmsInput
                    label="Title"
                    value={blogForm.title}
                    onChange={(title) =>
                      setBlogForm((current) => ({
                        ...current,
                        title,
                        slug: current.slug ? current.slug : slugifyBlog(title),
                      }))
                    }
                  />
                  <CmsInput
                    label="Slug"
                    value={blogForm.slug}
                    onChange={(slug) => updateBlogField("slug", slugifyBlog(slug))}
                  />
                </div>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(event) =>
                      updateBlogField("published", event.target.checked)
                    }
                  />
                  <span>Visible on website</span>
                </label>
              </FormSection>

              <FormSection
                title="Banner"
                text="Upload the main image used in blog cards and the blog detail page."
              >
                <div className={styles.formGrid}>
                  <FileUploadField
                    label="Banner image"
                    folder="blogs/banners"
                    currentValue={blogForm.banner}
                    onUploaded={(url) => updateBlogField("banner", url)}
                    uploadSuccessMessage="Image has been uploaded."
                    replacementSuccessMessage="A new image has been replaced."
                  />
                  <CmsInput
                    label="Banner alt text"
                    value={blogForm.bannerAltText}
                    onChange={(bannerAltText) =>
                      updateBlogField("bannerAltText", bannerAltText)
                    }
                  />
                </div>
              </FormSection>

              <FormSection
                title="Content"
                text="Write and format the blog body without touching HTML."
              >
                <label className={styles.fieldControl}>
                  <span>Blog content</span>
                  <RichBlogEditor
                    value={blogForm.content}
                    onDraftChange={(content) => {
                      blogContentDraftRef.current = content;
                    }}
                    onChange={updateBlogContent}
                  />
                </label>
              </FormSection>

              <FormSection
                title="Relationships"
                text="Connect this post to relevant industries, products, and models."
              >
                {isLoadingRelations ? (
                  <p className={styles.statusText}>Loading relationships...</p>
                ) : (
                  <div className={styles.relationshipGrid}>
                    <RelationPicker
                      title="Industries"
                      records={industries}
                      selected={blogForm.industryIds}
                      labelField="title"
                      onToggle={(id) => toggleBlogRelation("industryIds", id)}
                    />
                    <RelationPicker
                      title="Products"
                      records={products}
                      selected={blogForm.productIds}
                      labelField="title"
                      onToggle={(id) => toggleBlogRelation("productIds", id)}
                    />
                    <RelationPicker
                      title="Models"
                      records={models}
                      selected={blogForm.modelIds}
                      labelField="modelTitle"
                      fallbackField="modelNumber"
                      onToggle={(id) => toggleBlogRelation("modelIds", id)}
                    />
                  </div>
                )}
              </FormSection>

              <FormSection
                title="SEO"
                text="Control search result metadata."
              >
                <SeoFields
                  pageTitle={blogForm.seoPageTitle}
                  pageDescription={blogForm.seoPageDescription}
                  pageKeywords={blogForm.seoPageKeywords}
                  setField={(field, value) => updateBlogField(field, value)}
                />
              </FormSection>
            </div>
          ) : (
            <p className={styles.statusText}>
              Pick a blog post from the table, or create a new one.
            </p>
          )}
          {message && <p className={styles.statusText}>{message}</p>}
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
        )}
      </div>
    </article>
  );
}

function RelationPicker({
  title,
  records,
  selected,
  labelField,
  fallbackField,
  onToggle,
}: {
  title: string;
  records: ResourceRecord[];
  selected: number[];
  labelField: string;
  fallbackField?: string;
  onToggle: (id: number) => void;
}) {
  return (
    <div className={styles.relatedBox}>
      <div className={styles.repeatHeader}>
        <p>{title}</p>
        <span className={styles.countPill}>{selected.length}</span>
      </div>
      <div className={styles.relationList}>
        {records.map((record) => {
          const id = Number(record.id);
          const label = String(
            record[labelField] || (fallbackField ? record[fallbackField] : "") || id
          );
          return (
            <label key={`${title}-${id}`} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() => onToggle(id)}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function RichBlogEditor({
  value,
  onChange,
  onDraftChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onDraftChange?: (value: string) => void;
}) {
  const commitTimerRef = useRef<number | null>(null);
  const latestHtmlRef = useRef(value || "");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const linkSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  const commitContent = () => {
    if (commitTimerRef.current) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
    onChange(latestHtmlRef.current);
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        ResizableImage.configure({
          inline: true,
          allowBase64: true,
        }),
        UnderlineMark,
        TipTapLink.configure({
          openOnClick: false,
        }),
      ],
      content: value || "",
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        latestHtmlRef.current = html;
        onDraftChange?.(html);
        if (commitTimerRef.current) {
          window.clearTimeout(commitTimerRef.current);
        }
        commitTimerRef.current = window.setTimeout(() => {
          commitTimerRef.current = null;
          onChange(latestHtmlRef.current);
        }, 400);
      },
      editorProps: {
        attributes: {
          class: styles.richEditorContent,
        },
        handleDOMEvents: {
          blur: () => {
            commitContent();
            return false;
          },
        },
      },
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    if ((value || "") !== editor.getHTML()) {
      latestHtmlRef.current = value || "";
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) {
        window.clearTimeout(commitTimerRef.current);
      }
    };
  }, []);

  if (!editor) {
    return <div className={styles.richEditorShell}>Loading editor...</div>;
  }

  const openLinkModal = () => {
    const { from, to } = editor.state.selection;
    linkSelectionRef.current = { from, to };
    setLinkUrl(editor.getAttributes("link").href || "");
    setIsLinkModalOpen(true);
  };

  const restoreScrollPosition = (position: { x: number; y: number }) => {
    requestAnimationFrame(() => {
      window.scrollTo(position.x, position.y);
      requestAnimationFrame(() => window.scrollTo(position.x, position.y));
    });
  };

  const applyLink = () => {
    const scrollPosition = { x: window.scrollX, y: window.scrollY };

    if (linkSelectionRef.current) {
      editor.commands.setTextSelection(linkSelectionRef.current);
    }

    if (!linkUrl.trim()) {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .extendMarkRange("link")
        .unsetLink()
        .run();
      setIsLinkModalOpen(false);
      restoreScrollPosition(scrollPosition);
      return;
    }

    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .extendMarkRange("link")
      .setLink({ href: linkUrl.trim() })
      .run();
    setIsLinkModalOpen(false);
    restoreScrollPosition(scrollPosition);
  };

  const openImageModal = () => {
    setImageUrl("");
    setImageUploadError("");
    setIsImageModalOpen(true);
  };

  const uploadEditorImage = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "cms/blogs");

    setIsImageUploading(true);
    setImageUploadError("");
    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Upload failed");
      }

      setImageUrl(payload.url || "");
    } catch (error) {
      setImageUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsImageUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setIsImageModalOpen(false);
    }
  };

  return (
    <div className={styles.richEditorShell}>
      <div className={styles.richEditorToolbar}>
        <select
          value={
            editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "paragraph"
          }
          onChange={(event) => {
            const value = event.target.value;
            if (value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            } else if (value === "h3") {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            } else {
              editor.chain().focus().setParagraph().run();
            }
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <button
          type="button"
          className={editor.isActive("bold") ? styles.richButtonActive : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? styles.richButtonActive : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          aria-label="Underline"
          title="Underline"
          className={editor.isActive("underline") ? styles.richButtonActive : ""}
          onClick={() => editor.chain().focus().toggleMark("underline").run()}
        >
          U
        </button>
        <button
          type="button"
          aria-label="Bullet list"
          title="Bullet list"
          className={editor.isActive("bulletList") ? styles.richButtonActive : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <EditorToolbarIcon name="bulletList" />
        </button>
        <button
          type="button"
          aria-label="Numbered list"
          title="Numbered list"
          className={editor.isActive("orderedList") ? styles.richButtonActive : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <EditorToolbarIcon name="orderedList" />
        </button>
        <button
          type="button"
          aria-label="Quote"
          title="Quote"
          className={editor.isActive("blockquote") ? styles.richButtonActive : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <EditorToolbarIcon name="quote" />
        </button>
        <button
          type="button"
          aria-label="Link"
          title="Link"
          className={editor.isActive("link") ? styles.richButtonActive : ""}
          onClick={openLinkModal}
        >
          <EditorToolbarIcon name="link" />
        </button>
        <button
          type="button"
          aria-label="Remove link"
          title="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          Unlink
        </button>
        <button type="button" aria-label="Image" title="Image" onClick={openImageModal}>
          <EditorToolbarIcon name="image" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
      </div>
      <div className={styles.richEditorScrollArea}>
        <EditorContent editor={editor} />
      </div>
      {isLinkModalOpen && (
        <div className={styles.editorModalBackdrop} role="presentation">
          <div
            className={styles.editorModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-link-title"
          >
            <div className={styles.editorModalHeader}>
              <h3 id="editor-link-title">Add link</h3>
              <button
                type="button"
                aria-label="Close link modal"
                onClick={() => setIsLinkModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <label className={styles.editorModalField}>
              <span>Link URL</span>
              <input
                type="url"
                value={linkUrl}
                placeholder="https://example.com"
                onChange={(event) => setLinkUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLink();
                  }
                  if (event.key === "Escape") setIsLinkModalOpen(false);
                }}
                autoFocus
              />
            </label>
            <div className={styles.editorModalActions}>
              <button type="button" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={applyLink}>
                {linkUrl.trim() ? "Apply link" : "Remove link"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isImageModalOpen && (
        <div className={styles.editorModalBackdrop} role="presentation">
          <div
            className={styles.editorModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-image-title"
          >
            <div className={styles.editorModalHeader}>
              <h3 id="editor-image-title">Add image</h3>
              <button
                type="button"
                aria-label="Close image modal"
                onClick={() => setIsImageModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <label className={styles.editorModalField}>
              <span>Image URL</span>
              <input
                type="url"
                value={imageUrl}
                placeholder="https://example.com/image.jpg"
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addImage();
                  if (event.key === "Escape") setIsImageModalOpen(false);
                }}
                autoFocus
              />
            </label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className={styles.editorModalFileInput}
              onChange={(event) => uploadEditorImage(event.target.files?.[0])}
            />
            <button
              type="button"
              className={styles.editorModalUpload}
              disabled={isImageUploading}
              onClick={() => imageInputRef.current?.click()}
            >
              {isImageUploading ? "Uploading..." : "Upload file"}
            </button>
            {imageUrl && (
              <img className={styles.editorModalPreview} src={imageUrl} alt="" />
            )}
            {imageUploadError && (
              <p className={styles.errorText}>{imageUploadError}</p>
            )}
            <div className={styles.editorModalActions}>
              <button type="button" onClick={() => setIsImageModalOpen(false)}>
                Cancel
              </button>
              <button type="button" disabled={!imageUrl.trim()} onClick={addImage}>
                Insert image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceManager({
  config,
  sectionKey,
  createNonce,
}: {
  config: (typeof resourceConfig)[keyof typeof resourceConfig];
  sectionKey: "hero" | "models";
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

  const editorRecord = useMemo(() => {
    if (!editorValue.trim()) return null;

    try {
      return JSON.parse(editorValue) as ResourceRecord;
    } catch {
      return null;
    }
  }, [editorValue]);

  const updateEditorField = (field: string, value: unknown) => {
    let currentRecord: ResourceRecord = { ...config.emptyRecord };

    if (editorValue.trim()) {
      try {
        currentRecord = JSON.parse(editorValue) as ResourceRecord;
      } catch {
        currentRecord = { ...config.emptyRecord };
      }
    }

    setEditorValue(
      JSON.stringify(
        {
          ...currentRecord,
          [field]: value,
        },
        null,
        2
      )
    );
  };

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
            <>
              {sectionKey === "hero" && (
                <div className={styles.heroUploadPanel}>
                  <FileUploadField
                    label="Hero image"
                    folder="hero"
                    currentValue={String(editorRecord?.image || "")}
                    onUploaded={(url) => updateEditorField("image", url)}
                    uploadSuccessMessage="Hero image uploaded successfully."
                    replacementSuccessMessage="Hero image has been replaced."
                  />
                  <label className={styles.fieldControl}>
                    <span>Hero image alt text</span>
                    <input
                      type="text"
                      value={String(editorRecord?.altText || "")}
                      placeholder="Describe the hero image"
                      onChange={(event) =>
                        updateEditorField("altText", event.target.value)
                      }
                    />
                  </label>
                </div>
              )}
              <textarea
                className={styles.jsonEditor}
                value={editorValue}
                onChange={(event) => setEditorValue(event.target.value)}
                spellCheck={false}
              />
            </>
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
