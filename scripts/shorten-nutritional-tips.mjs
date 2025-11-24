import { drizzle } from "drizzle-orm/mysql2";
import { products } from "../drizzle/schema.js";
import { eq, isNotNull } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Mapping of long tips to shorter versions
const shortenedTips = {
  // French tips
  "Excellente source de protéines maigres": "Riche en protéines maigres",
  "Riche en fibres et en vitamines": "Riche en fibres et vitamines",
  "Bonne source de calcium et de protéines": "Source de calcium et protéines",
  "Riche en protéines et en fer": "Riche en protéines et fer",
  "Source de vitamines et d'antioxydants": "Source de vitamines et antioxydants",
  "Riche en vitamines C et en antioxydants": "Riche en vitamine C et antioxydants",
  "Excellente source de probiotiques": "Source de probiotiques",
  "Riche en oméga-3 et en protéines": "Riche en oméga-3 et protéines",
  "Source de glucides complexes": "Glucides complexes",
  "Riche en protéines végétales": "Protéines végétales",
  
  // English tips  
  "Excellent source of lean protein": "Lean protein source",
  "Rich in fiber and vitamins": "High in fiber & vitamins",
  "Good source of calcium and protein": "Calcium & protein source",
  "Rich in protein and iron": "High in protein & iron",
  "Source of vitamins and antioxidants": "Vitamins & antioxidants",
  "Rich in vitamin C and antioxidants": "High in vitamin C & antioxidants",
  "Excellent source of probiotics": "Probiotic source",
  "Rich in omega-3 and protein": "High in omega-3 & protein",
  "Source of complex carbohydrates": "Complex carbs",
  "Rich in plant-based protein": "Plant protein",
};

async function shortenTips() {
  console.log("Fetching products with nutritional tips...");
  
  const allProducts = await db.select().from(products)
    .where(isNotNull(products.nutritionalTip));
  
  console.log(`Found ${allProducts.length} products with nutritional tips`);
  
  let updated = 0;
  
  for (const product of allProducts) {
    let needsUpdate = false;
    let newTipFr = product.nutritionalTip;
    let newTipEn = product.nutritionalTipEn;
    
    // Check if French tip needs shortening
    if (newTipFr && newTipFr.length > 50) {
      // Try to find a shorter version
      for (const [long, short] of Object.entries(shortenedTips)) {
        if (newTipFr.includes(long)) {
          newTipFr = newTipFr.replace(long, short);
          needsUpdate = true;
          break;
        }
      }
      
      // If still too long, truncate intelligently
      if (newTipFr.length > 50) {
        // Keep first sentence or first 45 chars
        const firstSentence = newTipFr.split('.')[0];
        if (firstSentence.length <= 50) {
          newTipFr = firstSentence;
        } else {
          newTipFr = newTipFr.substring(0, 45) + '...';
        }
        needsUpdate = true;
      }
    }
    
    // Check if English tip needs shortening
    if (newTipEn && newTipEn.length > 50) {
      // Try to find a shorter version
      for (const [long, short] of Object.entries(shortenedTips)) {
        if (newTipEn.includes(long)) {
          newTipEn = newTipEn.replace(long, short);
          needsUpdate = true;
          break;
        }
      }
      
      // If still too long, truncate intelligently
      if (newTipEn.length > 50) {
        // Keep first sentence or first 45 chars
        const firstSentence = newTipEn.split('.')[0];
        if (firstSentence.length <= 50) {
          newTipEn = firstSentence;
        } else {
          newTipEn = newTipEn.substring(0, 45) + '...';
        }
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      await db.update(products)
        .set({
          nutritionalTip: newTipFr,
          nutritionalTipEn: newTipEn,
        })
        .where(eq(products.id, product.id));
      
      updated++;
      console.log(`✓ Updated product #${product.id}: ${product.name}`);
      console.log(`  FR: "${product.nutritionalTip}" → "${newTipFr}"`);
      if (newTipEn) {
        console.log(`  EN: "${product.nutritionalTipEn}" → "${newTipEn}"`);
      }
    }
  }
  
  console.log(`\nDone! Updated ${updated} out of ${allProducts.length} products`);
}

shortenTips().catch(console.error);
