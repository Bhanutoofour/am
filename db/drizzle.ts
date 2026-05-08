import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const connectionString =
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "";

if (
  !connectionString ||
  connectionString === "NEON_DATABASE_URL" ||
  connectionString.includes("USER:PASSWORD@HOST")
) {
  throw new Error(
    "Set NEON_DATABASE_URL to your full Neon Postgres connection string, for example postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require."
  );
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

export default db;
