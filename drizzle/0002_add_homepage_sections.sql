CREATE TABLE IF NOT EXISTS "homepage_sections" (
  "id" serial PRIMARY KEY NOT NULL,
  "section_key" text NOT NULL,
  "title" text DEFAULT 'Homepage' NOT NULL,
  "content" json DEFAULT '{}'::json NOT NULL,
  "active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
