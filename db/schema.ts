import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  primaryKey,
  json,
  timestamp,
} from "drizzle-orm/pg-core";

export const heroSection = pgTable("hero-section", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  altText: text("alt_text").notNull().default(""),
});

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  thumbnailAltText: text("thumbnail_alt_text").notNull().default(""),
  bannerImages: json("banner_images")
    .$type<{ imageUrl: string; altText: string }[]>()
    .notNull()
    .default([]),
  active: boolean("active").default(true),
  brochure: text("brochure").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  // SEO Metadata as JSON
  seoMetadata: json("seo_metadata").$type<{
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    structuredData?: {
      type?: string;
      title?: string;
      description?: string;
    };
  }>(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  thumbnailAltText: text("thumbnail_alt_text").notNull().default(""),
  series: json("series").$type<string[]>().notNull().default([]),
  active: boolean("active").default(true),
  generalImage: text("general_image").notNull().default(""),
  generalImageAltText: text("general_image_alt_text").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  // SEO Metadata for Product Category (Parent)
  seoMetadata: json("seo_metadata").$type<{
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    structuredData?: {
      type?: string;
      title?: string;
      description?: string;
      brand?: string;
      category?: string;
      hasOfferCatalog?: {
        name?: string;
        description?: string;
        totalModels?: number;
        availableSeries?: string[];
        modelOverview?: {
          name: string;
          description: string;
          series: string;
        }[];
      };
    };
  }>(),
});

export const productIndustries = pgTable(
  "product_industries",
  {
    productId: integer("product_id")
      .references(() => products.id)
      .notNull(),
    industryId: integer("industry_id")
      .references(() => industries.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.industryId] }),
  })
);

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  modelNumber: text("model_number").notNull(),
  modelTitle: text("model_title").notNull(),
  machineType: text("machine_type").notNull(), // 'attachment' or 'equipment'
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  series: text("series").notNull(), // must be a value from the selected product's series
  thumbnail: text("thumbnail").notNull(),
  thumbnailAltText: text("thumbnail_alt_text").notNull().default(""),
  coverImage: text("cover_image").notNull(),
  coverImageAltText: text("cover_image_alt_text").notNull().default(""),
  keyFeatures: json("key_features").$type<{ name: string; value: string }[]>(), // array of {name, value}
  /** Intro above the extended specs table (key features 8+); empty object = use site defaults in UI */
  specsTableIntro: json("specs_table_intro")
    .$type<{ heading?: string; paragraph?: string }>()
    .notNull()
    .default({}),
  brochure: text("brochure"), // optional
  modelDescription: json("model_description").$type<
    {
      image: string;
      imageAltText: string;
      title: string;
      description: string[];
      youtubeLink?: string;
    }[]
  >(),
  shortDescription: text("short_description").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  rentalAvailability: boolean("rental_availability").notNull().default(false),
  active: boolean("active").default(true),

  // SEO Metadata (Essential)
  seoMetadata: json("seo_metadata").$type<{
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    structuredData?: {
      type?: string;
      name?: string;
      description?: string;
      brand?: string;
      sku?: string;
      material?: string;
      condition?: string;
      category?: string;
      offers?: {
        availability?: string;
      };
      aggregateRating?: {
        ratingValue?: number;
        reviewCount?: number;
      };
      certifications?: string[];
      warrantyDuration?: string;
    };
  }>(),
});

export const modelIndustries = pgTable(
  "model_industries",
  {
    modelId: integer("model_id")
      .references(() => models.id)
      .notNull(),
    industryId: integer("industry_id")
      .references(() => industries.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.modelId, table.industryId] }),
  })
);

export const dealers = pgTable("dealers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  contactNumber: text("contact_number").notNull(),
  email: text("email").notNull(),
  fullAddress: text("full_address").notNull(),
  availability: text("availability").notNull().default(""),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  embedLink: text("embed_link").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Video-Industry many-to-many relationship
export const videoIndustries = pgTable(
  "video_industries",
  {
    videoId: integer("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    industryId: integer("industry_id")
      .references(() => industries.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.videoId, table.industryId] }),
  })
);

// Video-Product many-to-many relationship
export const videoProducts = pgTable(
  "video_products",
  {
    videoId: integer("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.videoId, table.productId] }),
  })
);

// Video-Model many-to-many relationship
export const videoModels = pgTable(
  "video_models",
  {
    videoId: integer("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    modelId: integer("model_id")
      .references(() => models.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.videoId, table.modelId] }),
  })
);

// Blog table
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  banner: text("banner").notNull(),
  bannerAltText: text("banner_alt_text").notNull().default(""),
  content: text("content").notNull(), // Rich text content (HTML/JSON)
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // SEO Metadata
  seoMetadata: json("seo_metadata").$type<{
    pageTitle?: string;
    pageDescription?: string;
    pageKeywords?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
  }>(),
});

// Blog-Industry many-to-many relationship
export const blogIndustries = pgTable(
  "blog_industries",
  {
    blogId: integer("blog_id")
      .references(() => blogs.id)
      .notNull(),
    industryId: integer("industry_id")
      .references(() => industries.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogId, table.industryId] }),
  })
);

// Blog-Product many-to-many relationship
export const blogProducts = pgTable(
  "blog_products",
  {
    blogId: integer("blog_id")
      .references(() => blogs.id)
      .notNull(),
    productId: integer("product_id")
      .references(() => products.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogId, table.productId] }),
  })
);

// Blog-Model many-to-many relationship
export const blogModels = pgTable(
  "blog_models",
  {
    blogId: integer("blog_id")
      .references(() => blogs.id)
      .notNull(),
    modelId: integer("model_id")
      .references(() => models.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogId, table.modelId] }),
  })
);
