import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import * as schema from "./schema/auth-schema.js";

const PostgresEnv = z.object({
  DATABASE_URL: z.string().url(),
});
const ProcessEnv = PostgresEnv.parse(process.env);

console.log(ProcessEnv.DATABASE_URL);

const sql = neon(ProcessEnv.DATABASE_URL);
export const db = drizzle(sql, { schema });
