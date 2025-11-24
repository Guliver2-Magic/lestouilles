const { createClient } = require("@libsql/client");

(async () => {
  const client = createClient({ url: process.env.DATABASE_URL });
  const result = await client.execute("SELECT DISTINCT category FROM products WHERE isVisible = 1 ORDER BY category");
  console.log("\n=== ALL CATEGORIES ===");
  result.rows.forEach((row, i) => console.log(`${i+1}. "${row.category}"`));
  console.log(`\nTotal: ${result.rows.length}\n`);
  client.close();
})();
