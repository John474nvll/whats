import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Check for DATABASE_URL and provide a more informative error
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'your_database_connection_string_here') {
  console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.error('!!! DATABASE_URL is not set or is still the default placeholder.               !!!');
  console.error('!!! Please update the .env file with your actual database connection string. !!!');
  console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  throw new Error("DATABASE_URL is not configured. Please check your .env file.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
