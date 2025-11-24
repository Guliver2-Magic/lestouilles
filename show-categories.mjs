import { drizzle } from "drizzle-orm/d1";
import { createClient } from "@libsql/client";
import { products } from "./drizzle/schema.ts";
import { sql } from "drizzle-orm";

const client = createClient({
  url: process.env.DATABASE_URL!,
});

const db = drizzle(client);

const categories = await db.select({ category: products.category }).from(products).where(sql`isVisible = 1`).groupBy(products.category).orderBy(products.category);

console.log("Categories:", categories.map(c => c.category));
