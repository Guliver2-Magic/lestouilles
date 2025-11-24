import { drizzle } from 'drizzle-orm/mysql2';
import { products } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

// Mapping of truncated tips to properly shortened versions
const fixedTips = {
  // French tips
  "Riche en protéines maigres": "Riche en protéines maigres",
  "Excellente source de protéines maigres": "Excellente source de protéines maigres",
  "Source de glucides complexes et de fibres": "Source de glucides complexes et fibres",
  "Riche en vitamines et minéraux": "Riche en vitamines et minéraux",
  "Bon équilibre nutritionnel": "Bon équilibre nutritionnel",
  "Source de protéines végétales": "Source de protéines végétales",
  "Riche en antioxydants": "Riche en antioxydants",
  "Faible en calories, riche en saveurs": "Faible en calories, riche en saveurs",
  "Source de calcium et de protéines": "Source de calcium et protéines",
  "Riche en acides gras oméga-3": "Riche en acides gras oméga-3",
  "Source de fibres et de vitamines": "Source de fibres et vitamines",
  "Riche en fer et en protéines": "Riche en fer et protéines",
  "Bon apport en protéines et en fibres": "Bon apport en protéines et fibres",
  "Riche en vitamine C": "Riche en vitamine C",
  "Source d'énergie rapide": "Source d'énergie rapide",
  "Hydratant et rafraîchissant": "Hydratant et rafraîchissant",
  "Faible en calories": "Faible en calories",
  "Riche en probiotiques": "Riche en probiotiques",
  "Source de bêta-carotène": "Source de bêta-carotène",
  "Riche en saveurs, modéré en calories": "Riche en saveurs, modéré en calories",
  
  // English tips  
  "High in lean protein": "High in lean protein",
  "Excellent source of lean protein": "Excellent source of lean protein",
  "Source of complex carbs and fiber": "Source of complex carbs and fiber",
  "Rich in vitamins and minerals": "Rich in vitamins and minerals",
  "Good nutritional balance": "Good nutritional balance",
  "Source of plant-based protein": "Source of plant-based protein",
  "Rich in antioxidants": "Rich in antioxidants",
  "Low in calories, high in flavor": "Low in calories, high in flavor",
  "Source of calcium and protein": "Source of calcium and protein",
  "Rich in omega-3 fatty acids": "Rich in omega-3 fatty acids",
  "Source of fiber and vitamins": "Source of fiber and vitamins",
  "Rich in iron and protein": "Rich in iron and protein",
  "Good source of protein and fiber": "Good source of protein and fiber",
  "Rich in vitamin C": "Rich in vitamin C",
  "Quick energy source": "Quick energy source",
  "Hydrating and refreshing": "Hydrating and refreshing",
  "Low in calories": "Low in calories",
  "Rich in probiotics": "Rich in probiotics",
  "Source of beta-carotene": "Source of beta-carotene",
  "Flavorful, moderate in calories": "Flavorful, moderate in calories"
};

async function fixTruncatedTips() {
  console.log('Fetching products with truncated tips...');
  
  const allProducts = await db.select().from(products);
  
  let fixedCount = 0;
  
  for (const product of allProducts) {
    let needsUpdate = false;
    const updates = {};
    
    // Check French tip
    if (product.nutritionalTip && product.nutritionalTip.endsWith('...')) {
      const truncated = product.nutritionalTip.slice(0, -3);
      // Find matching fixed tip
      for (const [key, value] of Object.entries(fixedTips)) {
        if (key.startsWith(truncated) || truncated.startsWith(key.substring(0, 20))) {
          updates.nutritionalTip = value;
          needsUpdate = true;
          break;
        }
      }
    }
    
    // Check English tip
    if (product.nutritionalTipEn && product.nutritionalTipEn.endsWith('...')) {
      const truncated = product.nutritionalTipEn.slice(0, -3);
      // Find matching fixed tip
      for (const [key, value] of Object.entries(fixedTips)) {
        if (key.startsWith(truncated) || truncated.startsWith(key.substring(0, 20))) {
          updates.nutritionalTipEn = value;
          needsUpdate = true;
          break;
        }
      }
    }
    
    if (needsUpdate) {
      await db.update(products)
        .set(updates)
        .where(eq(products.id, product.id));
      
      fixedCount++;
      console.log(`Fixed: ${product.name}`);
      if (updates.nutritionalTip) {
        console.log(`  FR: "${product.nutritionalTip}" → "${updates.nutritionalTip}"`);
      }
      if (updates.nutritionalTipEn) {
        console.log(`  EN: "${product.nutritionalTipEn}" → "${updates.nutritionalTipEn}"`);
      }
    }
  }
  
  console.log(`\nFixed ${fixedCount} products with truncated tips.`);
}

fixTruncatedTips().catch(console.error);
