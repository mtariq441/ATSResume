import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Use pooler connection for serverless environments (Vercel, Netlify)
// Fall back to direct connection if pooler is not available
const connectionString = process.env.DATABASE_POOL_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL or DATABASE_POOL_URL environment variable is not set. Using in-memory storage.");
}

const client = connectionString ? postgres(connectionString) : null;
export const db = client ? drizzle(client, { schema }) : null;
