import { config } from "dotenv";
import { sql } from "drizzle-orm";

async function main() {
  config({ path: ".env.local" });
  config();

  const { default: db } = await import("../db/drizzle");

  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL
  `);

  await db.execute(sql`
    ALTER TABLE "industries"
      ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL
  `);

  await db.execute(sql`
    ALTER TABLE "models"
      ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL,
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL
  `);

  console.log("Content timestamp migration applied.");
}

main().catch((error) => {
  console.error("Content timestamp migration failed:", error);
  process.exit(1);
});
