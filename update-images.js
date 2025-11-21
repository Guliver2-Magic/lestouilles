const fs = require('fs');
const path = require('path');

// Read the menu data file
const menuFile = path.join(__dirname, 'client/src/data/completeMenuData.ts');
let content = fs.readFileSync(menuFile, 'utf8');

// Available images
const images = [
  '/images/menu/WgESo0WjYDzG.jpg',     // salad, coffee, sandwich
  '/images/menu/6BnExjt67ce6.jpg',     // sandwich with soup
  '/images/menu/WU23K8Mz4HXE.jpg',     // duplicate of image 1
  '/images/menu/xGkxjMaoLLlM.jpg',     // duplicate of image 2
  '/images/menu/X5oLMAlBg8Q1.jpg',     // duplicate of image 3
  '/images/menu/TOfmOflBRqDW.jpg',     // meat dish
  '/images/menu/JMDUTzf6D48y.jpg',     // duplicate of image 5
];

// Replace all placeholder image paths
content = content.replace(/image: "\/images\/[^"]+"/g, (match, offset) => {
  // Use images in rotation
  const imageIndex = Math.floor(Math.random() * images.length);
  return `image: "${images[imageIndex]}"`;
});

// Write back
fs.writeFileSync(menuFile, content, 'utf8');
console.log('✅ Images updated successfully!');
