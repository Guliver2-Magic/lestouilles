import { createClient } from "@libsql/client";

const client = createClient({ url: process.env.DATABASE_URL });

const result = await client.execute("SELECT DISTINCT category FROM products WHERE isVisible = 1 ORDER BY category");

console.log("\n=== CATEGORIES IN DATABASE ===");
result.rows.forEach((row, index) => {
  console.log(`${index + 1}. ${row.category}`);
});
console.log(`\nTotal: ${result.rows.length} categories\n`);

client.close();
