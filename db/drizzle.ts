import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const connectionString =
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "";

const missingConnection =
  !connectionString ||
  connectionString === "NEON_DATABASE_URL" ||
  connectionString.includes("USER:PASSWORD@HOST");

function missingDatabaseProxy() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Set NEON_DATABASE_URL or DATABASE_URL to your full Neon Postgres connection string, for example postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require."
        );
      },
    }
  ) as ReturnType<typeof drizzle<typeof schema>>;
}

const db = missingConnection
  ? missingDatabaseProxy()
  : drizzle(neon(connectionString), { schema });

export default db;
