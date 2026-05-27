import { config } from "dotenv";
import { sql } from "drizzle-orm";

async function main() {
  config({ path: ".env.local" });
  config();

  const [{ default: db }, { defaultHomepageCmsContent }] = await Promise.all([
    import("../db/drizzle"),
    import("../data/homepageCmsDefaults"),
  ]);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "homepage_sections" (
      "id" serial PRIMARY KEY NOT NULL,
      "section_key" text NOT NULL,
      "title" text DEFAULT 'Homepage' NOT NULL,
      "content" json DEFAULT '{}'::json NOT NULL,
      "active" boolean DEFAULT true,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )
  `);

  const existing = await db.execute(sql`
    SELECT "id" FROM "homepage_sections"
    WHERE "section_key" = 'home'
    LIMIT 1
  `);

  if (!(existing as unknown as unknown[]).length) {
    await db.execute(sql`
      INSERT INTO "homepage_sections" ("section_key", "title", "content")
      VALUES ('home', 'Homepage', ${JSON.stringify(defaultHomepageCmsContent)}::json)
    `);
  }

  console.log("Homepage content migration applied.");
}

main().catch((error) => {
  console.error("Homepage content migration failed:", error);
  process.exit(1);
});
