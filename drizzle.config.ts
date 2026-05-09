import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./db/schema.ts",
  connectionString: process.env.NEON_DATABASE_URL!,
} satisfies Config;
