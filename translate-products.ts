import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema";
import { invokeLLM } from "./server/_core/llm";

const db = drizzle(process.env.DATABASE_URL!);

async function translateProducts() {
  console.log("Fetching all products from database...");
  
  const allProducts = await db.select().from(products);
  
  console.log(`Found ${allProducts.length} products to translate`);
  
  for (const product of allProducts) {
    // Skip if already translated
    if (product.nameEn && product.descriptionEn) {
      console.log(`✓ Product "${product.name}" already translated, skipping`);
      continue;
    }
    
    console.log(`Translating product: ${product.name}...`);
    
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a professional translator specializing in culinary and food service translations from French to English. Translate the following product information accurately while maintaining the appetizing and professional tone. Return ONLY a valid JSON object with the translations, no additional text."
          },
          {
            role: "user",
            content: `Translate this product information from French to English:

Name: ${product.name}
Description: ${product.description}
${product.nutritionalTip ? `Nutritional Tip: ${product.nutritionalTip}` : ''}

Return a JSON object with this exact structure:
{
  "nameEn": "translated name",
  "descriptionEn": "translated description",
  "nutritionalTipEn": "translated nutritional tip or null if not provided"
}`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "product_translation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                nameEn: { type: "string" },
                descriptionEn: { type: "string" },
                nutritionalTipEn: { type: ["string", "null"] }
              },
              required: ["nameEn", "descriptionEn", "nutritionalTipEn"],
              additionalProperties: false
            }
          }
        }
      });
      
      const translation = JSON.parse(response.choices[0].message.content);
      
      // Update product with translations
      await db.update(products)
        .set({
          nameEn: translation.nameEn,
          descriptionEn: translation.descriptionEn,
          nutritionalTipEn: translation.nutritionalTipEn || null
        })
        .where({ id: product.id });
      
      console.log(`✓ Successfully translated: ${product.name} → ${translation.nameEn}`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`✗ Error translating product "${product.name}":`, error);
    }
  }
  
  console.log("\n✅ Translation complete!");
}

translateProducts().catch(console.error);
