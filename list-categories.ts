import { getDb } from "./server/db";
import { products } from "./drizzle/schema";
import { sql } from "drizzle-orm";

const db = await getDb();
if (!db) {
  console.error("Database not available");
  process.exit(1);
}

const categories = await db
  .select({ category: products.category })
  .from(products)
  .where(sql`${products.isVisible} = 1`)
  .groupBy(products.category)
  .orderBy(products.category);

console.log("\n=== ALL CATEGORIES IN DATABASE ===");
categories.forEach((row, i) => {
  console.log(`${i + 1}. "${row.category}"`);
});
console.log(`\nTotal: ${categories.length} categories\n`);
process.exit(0);
