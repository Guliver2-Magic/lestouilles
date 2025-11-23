import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { products } from "../drizzle/schema.js";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

const nutritionalTipsTranslations = {
  "Riche en fibres et en protéines végétales": "Rich in fiber and plant-based proteins",
  "Excellente source de protéines maigres": "Excellent source of lean protein",
  "Riche en protéines, à consommer avec modération": "High in protein, consume in moderation",
  "Pour réduire la teneur en matières grasses, demandez la vinaigrette César sur le côté et utilisez-en seulement une petite quantité.": "To reduce fat content, ask for Caesar dressing on the side and use only a small amount.",
  "Riche en antioxydants et en gras sains": "Rich in antioxidants and healthy fats",
  "Plat complet et réconfortant": "Complete and comforting dish",
  "Parfait pour les cocktails": "Perfect for cocktails",
  "Riche en protéines": "High in protein",
  "Privilégiez la cuisson au grill ou au four pour minimiser l'ajout de matières grasses et augmenter l'apport en protéines maigres.": "Prefer grilling or oven cooking to minimize added fat and increase lean protein intake.",
  "Varié et équilibré": "Varied and balanced",
  "Réconfortant et copieux": "Comforting and hearty",
  "Pour améliorer l'équilibre, optez pour un sandwich au pain complet, une vinaigrette légère pour la salade et un dessert à base de fruits frais.": "To improve balance, opt for a whole grain sandwich, light dressing for the salad, and a fresh fruit-based dessert.",
  "Option santé et savoureuse": "Healthy and tasty option",
  "Riche en chocolat noir": "Rich in dark chocolate",
  "Source naturelle de fibres": "Natural source of fiber",
  "Dessert onctueux et raffiné": "Creamy and refined dessert",
  "Bon pour le moral": "Good for morale",
  "Stimulant naturel": "Natural stimulant",
  "Riche en vitamine C": "Rich in vitamin C",
  "Rafraîchissant et désaltérant": "Refreshing and thirst-quenching"
};

async function addNutritionalTipsEnglish() {
  console.log("Starting to add English nutritional tips...");
  
  try {
    // Get all products
    const allProducts = await db.select().from(products);
    console.log(`Found ${allProducts.length} products`);
    
    let updatedCount = 0;
    
    for (const product of allProducts) {
      if (product.nutritionalTip && !product.nutritionalTipEn) {
        const englishTip = nutritionalTipsTranslations[product.nutritionalTip];
        
        if (englishTip) {
          await db
            .update(products)
            .set({ nutritionalTipEn: englishTip })
            .where(eq(products.id, product.id));
          
          console.log(`✓ Updated product ${product.id} (${product.name})`);
          updatedCount++;
        } else {
          console.log(`⚠ No translation found for: "${product.nutritionalTip}" (product ${product.id})`);
        }
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} products with English nutritional tips`);
  } catch (error) {
    console.error("Error updating nutritional tips:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

addNutritionalTipsEnglish();
