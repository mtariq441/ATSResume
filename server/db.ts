import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL environment variable is not set. Using in-memory storage.");
} else {
  // Configure WebSocket for Neon in Node.js environment
  neonConfig.webSocketConstructor = ws;
}

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
export const db = pool ? drizzle(pool, { schema }) : null;
