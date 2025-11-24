import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema.js';
import * as fs from 'fs';

const db = drizzle(process.env.DATABASE_URL);

// Read menu data
const menuData = JSON.parse(fs.readFileSync('./new-menu-items.json', 'utf-8'));

// Read image URLs
const imageUrls = fs.readFileSync('./image-urls-only.txt', 'utf-8').trim().split('\n');

// Create a mapping of image filenames to URLs
const imageUrlMap = {};
const uploadedLog = fs.readFileSync('./uploaded-urls.txt', 'utf-8');
const lines = uploadedLog.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('Uploading file:')) {
    const filename = lines[i].split(': ')[1].split(' ')[0];
    // Find the CDN URL in the next few lines
    for (let j = i + 1; j < i + 10 && j < lines.length; j++) {
      if (lines[j].startsWith('CDN URL:')) {
        const url = lines[j].split(': ')[1].trim();
        imageUrlMap[filename] = url;
        break;
      }
    }
  }
}

console.log('Image URL map created with', Object.keys(imageUrlMap).length, 'entries');

// Collect all products from all categories
const allProducts = [
  ...menuData.soups,
  ...menuData.preparedDishes,
  ...menuData.meats,
  ...menuData.vegetables,
  ...menuData.appetizers,
  ...menuData.desserts,
  ...menuData.lunchBoxesKids,
  ...menuData.lunchBoxesAdults,
  ...menuData.sauces,
  ...menuData.beverages,
];

console.log('Total products to insert:', allProducts.length);

// Insert all products
let insertedCount = 0;
for (const product of allProducts) {
  try {
    await db.insert(products).values({
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      descriptionEn: product.descriptionEn,
      price: product.price,
      category: product.category,
      image: imageUrlMap[product.imageFilename] || '',
      servingSize: product.servingSize,
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
      nutritionalTip: product.nutritionalTip,
      nutritionalTipEn: product.nutritionalTipEn,
    });
    insertedCount++;
    console.log(`✓ Inserted: ${product.name}`);
  } catch (error) {
    console.error(`✗ Failed to insert ${product.name}:`, error.message);
  }
}

console.log(`\n✅ Successfully inserted ${insertedCount} out of ${allProducts.length} products`);
process.exit(0);
