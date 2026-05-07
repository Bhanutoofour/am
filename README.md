# Project Documentation

## 1. Project Overview

### What the project does

**Autocracy** is a full-stack marketing and product website for **Autocracy Machinery** — India’s manufacturer and supplier of heavy machinery and industrial equipment. The site showcases products (e.g. trenchers, padding machines, pole stacking, forklifts, lake cleaners, sod harvesters), industries served, dealer locations, rental options, and blog content. It also captures leads (Get Quote, Contact, Find a Dealer) and sends them to **Zoho CRM**.

### The problem it solves

- **Unified product and content management** — One place to manage hero sections, industries, products, models, dealers, videos, and blogs via an admin panel (React Admin).
- **SEO and discoverability** — Dynamic metadata, structured data, sitemap (including industry-scoped product and model URLs), and industry/product/model/blog pages tuned for search.
- **Lead generation** — Forms (quote, contact, dealer) validated on the server and forwarded to Zoho CRM.
- **Performance and DX** — Next.js App Router with server components, server actions, and TypeScript for fast, type-safe development.

### Key capabilities

- **Public site**: Home, Industries, Products, Models (equipment/attachments), Brochures, Blog, Videos, Find a Dealer, Hire/Rental, Careers, Contact, FAQ, Privacy/Terms.
- **SEO-friendly nested URLs**: Product categories live at `/products/[slug]`; models use `/products/[productSlug]/[modelNumberSlug]`. Industry context adds `/industries/[industrySlug]/[productSlug]` and `/industries/[industrySlug]/[productSlug]/[modelNumberSlug]`. Legacy `/product/[slug]?modelId=` URLs **301 redirect** to the canonical `/products/...` path.
- **Admin CMS** (`/admin`): CRUD for hero, industries, products, models, dealers, videos, and blogs (with rich-text editor).
- **REST-style API** under `/api` for the admin and for server-side data (compatible with `ra-data-simple-rest`).
- **Database**: PostgreSQL (Neon) with Drizzle ORM; relational models for industries, products, models, dealers, videos, blogs and their associations.
- **Integrations**: Google Tag Manager, GA4, Google Ads conversion, Facebook Pixel, Zoho SalesIQ, Zoho CRM (lead submission).

### Target users

- **End users**: B2B visitors (contractors, industries) looking for machinery info, dealers, quotes, and content.
- **Internal users**: Marketing and operations staff managing content and leads via the admin panel.
- **Developers**: Teams that need to run, maintain, and extend the codebase with clear architecture and docs.

---

## 2. Tech Stack

### Frontend

| Technology | Purpose |
|------------|--------|
| **Next.js 15** | React framework with App Router, RSC, server actions, API routes, and file-based routing. |
| **React 19** | UI components and client interactivity. |
| **TypeScript** | Static typing across app, API, and shared types. |
| **SCSS (Sass)** | Modular styles (`*.module.scss`), variables, breakpoints, and mixins. |
| **Keen Slider** | Carousel/sliders (e.g. hero, testimonials). |
| **React Loading Skeleton** | Placeholder loading states. |

**Why:** Next.js gives SSR/SSG/ISR and a single codebase for pages and API; TypeScript and SCSS keep the codebase maintainable and consistent.

### Backend

| Technology | Purpose |
|------------|--------|
| **Next.js API Routes** | REST-style endpoints under `app/api/*` for admin CRUD and lead submission. |
| **Server Actions** | Server-side data fetching and cache revalidation (e.g. `actions/productAction.ts`). |
| **Drizzle ORM** | Type-safe queries, migrations, and schema definition. |
| **@neondatabase/serverless** | Serverless PostgreSQL driver for Neon (edge/serverless-friendly). |

**Why:** API routes align with React Admin’s `ra-data-simple-rest`; server actions keep data co-located with routes and support revalidation.

### Database

| Technology | Purpose |
|------------|--------|
| **PostgreSQL** | Primary data store (hosted on Neon). |
| **Neon** | Serverless Postgres with HTTP driver suitable for serverless/edge. |
| **Drizzle Kit** | Migrations (`drizzle/`), `drizzle-kit studio`, push, generate. |

**Why:** PostgreSQL supports relational data (industries, products, models, many-to-many); Neon fits Vercel/serverless; Drizzle keeps schema and types in sync.

### CMS (Admin panel)

| Technology | Purpose |
|------------|--------|
| **React Admin 5** | Admin UI with list/create/edit views and REST adapter. |
| **ra-data-simple-rest** | Data provider that maps React Admin to `/api` (GET/POST/PUT/DELETE). |
| **TipTap** | Rich-text editor for blog content (StarterKit, Link, Image). |

**Why:** React Admin provides a ready-made CRUD CMS; `ra-data-simple-rest` matches the existing API shape; TipTap gives structured rich text and images.

### Deployment & tooling

| Technology | Purpose |
|------------|--------|
| **Vercel** | Hosting and serverless execution (recommended for Next.js). |
| **npm** | Package manager and scripts. |
| **dotenv** | Loads `.env` for local and build-time env vars. |

**Why:** Vercel integrates with Next.js and Neon; no separate backend server to manage.

### Analytics & third-party

- **Google Tag Manager (GTM)** — Tag orchestration.
- **Google Analytics 4 (GA4)** — Analytics.
- **Google Ads** — Conversion tracking.
- **Facebook Meta Pixel** — Ads and events.
- **Zoho SalesIQ** — Chat/widget (optional).
- **Zoho CRM** — Lead ingestion from `/api/submit-lead`.

---

## 3. System Architecture

### High-level flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC SITE (Next.js App)                          │
│  (main) layout: Header + main + Footer                                    │
│  Pages: /, /products, /industries/[slug], nested product/model URLs, etc. │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Server        │     │ API Routes      │     │ External        │
│ Actions       │     │ /api/*          │     │ (Zoho CRM,      │
│ (RSC data)    │     │ (Admin + Lead)  │     │  Analytics)      │
└───────┬───────┘     └────────┬────────┘     └─────────────────┘
        │                      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Database Layer      │
        │  Drizzle ORM          │
        │  db/drizzle.ts       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  PostgreSQL (Neon)   │
        │  Tables: hero,       │
        │  industries,         │
        │  products, models,   │
        │  dealers, videos,    │
        │  blogs + relations   │
        └──────────────────────┘
```

### CMS → Frontend data flow

```
Admin UI (React Admin)  →  simpleRestProvider("/api")  →  Next.js API Routes
         →  Drizzle  →  PostgreSQL

Frontend pages  →  Server Actions (e.g. getActiveProducts, getBlogBySlug)
         →  Drizzle  →  PostgreSQL  →  RSC render (SSR/SSG/ISR)
```

- **Admin:** All content changes go through React Admin → `/api` → Drizzle → PostgreSQL.
- **Public site:** Pages use server actions (and sometimes direct API calls) that read from the same DB; no separate CMS sync step.

### API structure

- **Base:** `/api` (same origin as the app).
- **Resources:**  
  `hero-section`, `industries`, `products`, `models`, `dealers`, `videos`, `blogs`  
  Each resource typically has:
  - `GET /api/<resource>` — List (with pagination/sort via headers or query).
  - `GET /api/<resource>/[id]` — One record.
  - `POST /api/<resource>` — Create.
  - `PUT /api/<resource>` — Update (body includes `id`).
  - `DELETE /api/<resource>?id=...` — Delete.
- **Custom:**  
  - `POST /api/auth` — Admin login (checks `USER_NAME` / `ADMIN_PASSWORD`).  
  - `POST /api/submit-lead` — Lead payload → Zoho CRM.  
  - `GET /api/industries-with-products`, `GET /api/products-with-models` — Aggregated data for menus/listing.

### Rendering strategy

| Area | Strategy | Notes |
|------|----------|--------|
| **Home, product/industry/model/blog pages** | **SSR** | Server components + server actions; fresh data per request. |
| **Static pages** (e.g. privacy, terms, FAQ) | **SSR/static** | Can be cached at edge. |
| **Admin** | **CSR** | Client-only React Admin after login. |
| **Sitemap / robots** | **Dynamic** | `app/sitemap.ts`, `app/robots.ts` generate from DB. |

No ISR (revalidate) is used in the current codebase; revalidation is done via `revalidatePath` in actions where needed.

### URL and routing conventions

| Pattern | Purpose |
|---------|---------|
| `/products/{productSlug}` | Product category (all models for that product). |
| `/products/{productSlug}/{modelNumberSlug}` | Canonical model detail page (`modelNumberSlug` is derived from the model’s `model_number` in the database). |
| `/industries/{industrySlug}/{productSlug}` | Same product listing as `/products/...` but scoped to an industry (canonical when industry context matters). |
| `/industries/{industrySlug}/{productSlug}/{modelNumberSlug}` | Model detail in industry → product → model hierarchy. |
| `/product/{legacySlug}?modelId=` | **Permanent redirect** to the matching `/products/{productSlug}/{modelNumberSlug}` URL. |

Slugs for titles use `titleToSlug` in `utils/slug.ts`; model URL segments use `modelNumberSlug`. The dynamic sitemap in `app/sitemap.ts` emits static pages, industries, product categories, industry-nested product pages, both nested model URL shapes, and blog posts.

---

## 4. Project Folder Structure

```
autocracy/
├── app/                          # Next.js App Router
│   ├── layout.tsx                 # Root layout: globals, GTM, GA4, FB Pixel, Zoho SalesIQ
│   ├── not-found.tsx / NotFoundClient.tsx
│   ├── sitemap.ts                 # Dynamic sitemap (nested industry/product/model URLs + static + blog)
│   ├── robots.ts                  # robots.txt
│   │
│   ├── (main)/                    # Public site route group
│   │   ├── layout.tsx             # Header + main + Footer
│   │   ├── page.tsx                # Home: hero, industries, products, recognitions, testimonials
│   │   ├── about-us/
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing
│   │   │   ├── [slug]/page.tsx     # Single blog (metadata + BlogClient)
│   │   │   └── ...
│   │   ├── brochure/
│   │   ├── careers/
│   │   ├── contact-us/
│   │   ├── faqs/
│   │   ├── find-a-dealer/
│   │   ├── hire-rental-industry-equipment/
│   │   ├── industries/
│   │   │   ├── loading.tsx         # Route loading UI (list + detail)
│   │   │   ├── [slug]/page.tsx     # Industry detail
│   │   │   ├── [slug]/[productSlug]/page.tsx          # Product in industry context + models
│   │   │   └── [slug]/[productSlug]/[modelSlug]/page.tsx  # Model in industry → product path
│   │   ├── privacy-policy/
│   │   ├── product/[slug]/         # Legacy: 301 → /products/.../... (model client + structured data modules here; nested routes import them)
│   │   ├── products/
│   │   │   ├── loading.tsx         # Listing + product loading states
│   │   │   ├── page.tsx            # Products listing
│   │   │   ├── [slug]/page.tsx    # Product category + models (+ optional industry soft redirect)
│   │   │   └── [slug]/[modelSlug]/page.tsx  # Canonical model page (productSlug + model number segment)
│   │   ├── terms-and-conditions/
│   │   └── videos/
│   │
│   ├── admin/                     # React Admin CMS
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Admin app: Resources (hero, industries, products, models, dealers, videos, blogs)
│   │   ├── login/page.tsx          # Admin login form → /api/auth
│   │   ├── components/             # List/Create/Edit for each resource
│   │   │   ├── HeroList, HeroCreate, HeroEdit
│   │   │   ├── IndustriesList, IndustriesCreate, IndustriesEdit
│   │   │   ├── ProductsList, ProductsCreate, ProductsEdit
│   │   │   ├── ModelsList, ModelsCreate, ModelsEdit
│   │   │   ├── DealersList, DealersCreate, DealersEdit
│   │   │   ├── VideosList, VideosCreate, VideosEdit
│   │   │   └── BannerImagesField.tsx
│   │   └── blog-cms/
│   │       └── components/         # Blog CRUD + RichTextInput (TipTap), ResizableImage
│   │           ├── BlogList, BlogCreate, BlogEdit
│   │           ├── RichTextInput.tsx
│   │           └── ResizableImage.tsx
│   │
│   └── api/                       # API routes (REST for admin + custom)
│       ├── auth/route.ts           # POST: admin login
│       ├── submit-lead/route.ts    # POST: lead → Zoho CRM
│       ├── hero-section/route.ts, hero-section/[id]/route.ts
│       ├── industries/route.ts, industries/[id]/route.ts
│       ├── industries-with-products/route.ts
│       ├── products/route.ts, products/[id]/route.ts
│       ├── products-with-models/route.ts
│       ├── models/route.ts, models/[id]/route.ts
│       ├── dealers/route.ts, dealers/[id]/route.ts
│       ├── videos/route.ts, videos/[id]/route.ts
│       ├── blogs/route.ts, blogs/[id]/route.ts
│       └── blogs/slug/[slug]/route.ts  # GET blog by slug
│
├── actions/                       # Server Actions (data + revalidation)
│   ├── heroAction.ts
│   ├── industryAction.ts
│   ├── productAction.ts
│   ├── modelAction.ts
│   ├── blogAction.ts
│   └── videoAction.ts
│
├── component/                     # Reusable UI (atoms/molecules/sections)
│   ├── header/                    # Header, mega menu, responsive menu
│   ├── Footer/
│   ├── GetQuoteModal/             # Quote form modal
│   ├── sections/                  # Page sections
│   │   ├── caraousel/             # Hero carousel
│   │   ├── Industries/
│   │   ├── products/
│   │   ├── modelCard/, modelResponsiveCard/
│   │   ├── recognitions/, certificate/, contentBuild/, media/
│   │   ├── testimonials/
│   │   ├── contactUs/, faqSection/, responsiveFaq/
│   │   ├── megaMenu/, responsiveMegamenu/
│   │   └── renderContent/          # Renders blog/content HTML
│   └── molecules/                 # Smaller building blocks
│       ├── button/, customDropdown/, quoteInputs/
│       ├── productCard/, industryCard/, brochureCard/
│       ├── modelDetailsCard/, dealersDetailsCard/, recognitionCard/
│       ├── rentalModelSkeletonCard/
│       └── loading/               # Skeletons for products, models, etc.
│
├── db/
│   ├── drizzle.ts                 # Neon client + Drizzle instance
│   └── schema.ts                  # Tables: heroSection, industries, products, models, dealers, videos, blogs + junction tables
│
├── drizzle/                       # Drizzle Kit migrations (generated)
├── drizzle.config.ts              # Drizzle config (schema path, dialect, NEON_DATABASE_URL)
│
├── styles/
│   ├── globals.scss
│   ├── _varriables.scss
│   ├── _breakpoints.scss
│   └── _mixins.scss
│
├── data/                          # Static content (non-CMS)
│   ├── recognitionsData.ts
│   ├── customerTestimonials.ts
│   ├── privacyPolicy.ts
│   ├── termsCondition.ts
│   ├── qnaForFaq.ts
│   └── countryCodes.ts
│
├── constants/                     # App constants
│   ├── index.ts
│   └── Images/images.ts
│
├── hooks/                         # Client hooks
│   ├── useWindowSize.ts
│   └── useOutsideClick.ts
│
├── utils/
│   ├── auth.ts                    # loginAdmin, logoutAdmin, isAdminAuthenticated (client)
│   ├── helper.ts
│   ├── slug.ts                    # titleToSlug, modelNumberSlug (URL segments for nested routes)
│   └── videoHelpers.ts
│
├── types/                         # Shared TypeScript types
│   ├── index.ts
│   └── api.ts                     # API response types
│
├── public/                        # Static assets
│   ├── icons/, fonts/
│   └── favicon.ico, favicon.png
│
├── scripts/                       # Optional automation scripts
├── next.config.ts                 # Next config (e.g. images)
├── tsconfig.json
├── package.json
└── .env.local                     # Not committed; see Environment Variables below
```

### Folder summary

| Folder | Role |
|--------|------|
| **app/** | All routes: public pages under `(main)`, admin under `admin`, API under `api`. |
| **app/(main)/** | Public-facing pages; share one layout (Header, Footer). |
| **app/admin/** | React Admin CMS; list/create/edit for all content types; blog uses TipTap. |
| **app/api/** | REST endpoints for admin + `/auth`, `/submit-lead`, and aggregated routes. |
| **actions/** | Server actions used by RSC to fetch data and revalidate paths. |
| **component/** | Shared UI: header, footer, sections (hero, industries, products, etc.), molecules (cards, buttons, dropdowns, loading). |
| **db/** | Drizzle schema and client; single source of truth for DB shape. |
| **styles/** | Global SCSS, variables, breakpoints, mixins. |
| **data/** | Static copy and config (e.g. FAQ, privacy, terms, country codes). |
| **utils/** | Auth helpers (client-side session), generic helpers, URL slug helpers (`slug.ts`), video helpers. |
| **types/** | Shared TS types and API response shapes. |

---

## 5. Environment Variables

Create a `.env.local` (or set these in Vercel) with:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEON_DATABASE_URL` | Yes | PostgreSQL connection string (Neon). |
| `USER_NAME` | Yes (for admin) | Admin login username. |
| `ADMIN_PASSWORD` | Yes (for admin) | Admin login password. |
| `ZOHO_XNQSJSDP` | For lead submit | Zoho CRM API key (or similar). |
| `ZOHO_XMIWTLD` | For lead submit | Zoho CRM identifier. |
| `NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET` | Optional | Zoho SalesIQ widget code. |

Do not commit `.env*`; they are in `.gitignore`.

---

## 6. Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn/pnpm)
- **PostgreSQL** (e.g. Neon) and a connection string

### Install and run

```bash
# Clone and install
git clone <repo-url>
cd autocracy
npm install

# Set environment variables (see section 5)
cp .env.example .env.local   # if you have an example; otherwise create .env.local

# Push schema to DB (or run migrations)
npm run db:push
# Or: npm run db:generate && npm run db:migrate

# Development
npm run dev
```

- **Site:** [http://localhost:3000](http://localhost:3000)  
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (redirects to `/admin/login` if not authenticated)

### Database

- **Studio (Drizzle):** `npm run db:studio` — open Drizzle Studio to browse/edit data.
- **Schema changes:** Edit `db/schema.ts`, then `npm run db:generate` and `npm run db:migrate` (or `db:push` for dev).

---

## 7. Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm run start` | Run production server. |
| `npm run lint` | Next.js ESLint. |
| `npm run db:studio` | Open Drizzle Studio. |
| `npm run db:push` | Push schema to DB (no migration files). |
| `npm run db:generate` | Generate migrations from schema. |
| `npm run db:migrate` | Run migrations. |

---

## 8. Deployment (Vercel)

1. Connect the repo to Vercel.
2. Set environment variables in the Vercel project (same as section 5).
3. Use **Neon** (or another Postgres) and set `NEON_DATABASE_URL`.
4. Deploy; Vercel will run `next build` and serve the app.

No cron or background workers are used in this project; lead submission and admin operations run on request.

---

## 9. Extending the Project

- **New content type:** Add table(s) in `db/schema.ts`, run migrations, add API routes under `app/api/<resource>/`, register a new `Resource` in `app/admin/page.tsx`, and add list/create/edit components in `app/admin/components/` or a subfolder.
- **New public page:** Add a route under `app/(main)/` and use server actions in `actions/` for data; reuse components from `component/sections` and `component/molecules`.
- **Product and model URLs:** Prefer nested paths under `app/(main)/products/` or `app/(main)/industries/` and keep slugs consistent with `utils/slug.ts` so links, metadata canonicals, and `app/sitemap.ts` stay aligned. If you add alternate entry points, consider a redirect to the canonical nested URL (see `app/(main)/product/[slug]/page.tsx`).
- **Model CMS fields:** Models support optional `specsTableIntro` (heading/paragraph above the extended specs table), editable in admin; ensure API `PUT`/`POST` for models includes new fields when extending the schema.
- **New API endpoint:** Add `app/api/<name>/route.ts` with GET/POST/PUT/DELETE as needed; use `db` from `db/drizzle.ts` and existing schema.
- **Styling:** Follow existing SCSS modules and use `styles/_varriables.scss` and `_breakpoints.scss` for consistency.

---

This README reflects the current architecture—including nested product and model URLs, legacy redirects, and sitemap coverage—so developers can understand, run, maintain, and extend the Autocracy project.
