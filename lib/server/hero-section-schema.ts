import db from "@/db/drizzle";
import { sql } from "drizzle-orm";

let columnReady = false;

export async function ensureHeroMobileImageColumn() {
  if (columnReady) return;

  await db.execute(
    sql`ALTER TABLE "hero-section" ADD COLUMN IF NOT EXISTS "mobile_image" text NOT NULL DEFAULT ''`
  );
  columnReady = true;
}
