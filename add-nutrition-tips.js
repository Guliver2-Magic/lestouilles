const fs = require('fs');
const path = require('path');

// Nutritional tips by category
const nutritionalTipsByCategory = {
  "Sandwichs": {
    fr: "Riche en protéines et fibres. Parfait pour un déjeuner équilibré qui vous garde rassasié.",
    en: "Rich in protein and fiber. Perfect for a balanced lunch that keeps you satisfied."
  },
  "Salades": {
    fr: "Excellente source de vitamines et minéraux. Faible en calories, idéal pour une alimentation saine.",
    en: "Excellent source of vitamins and minerals. Low in calories, ideal for healthy eating."
  },
  "Soupes": {
    fr: "Réconfortante et nutritive. Aide à l'hydratation et favorise la digestion.",
    en: "Comforting and nutritious. Helps with hydration and promotes digestion."
  },
  "Plats Préparés": {
    fr: "Repas complet et équilibré. Contient tous les macronutriments essentiels pour votre énergie.",
    en: "Complete and balanced meal. Contains all essential macronutrients for your energy."
  },
  "Viandes": {
    fr: "Excellente source de protéines de haute qualité. Riche en fer et vitamines B.",
    en: "Excellent source of high-quality protein. Rich in iron and B vitamins."
  },
  "Légumes": {
    fr: "Riche en fibres et antioxydants. Favorise une bonne santé digestive et cardiovasculaire.",
    en: "Rich in fiber and antioxidants. Promotes good digestive and cardiovascular health."
  },
  "Bouchées": {
    fr: "Portions contrôlées parfaites pour les événements. Équilibre entre saveur et nutrition.",
    en: "Perfect portion-controlled for events. Balance between flavor and nutrition."
  },
  "Desserts": {
    fr: "À déguster avec modération. Source de plaisir et d'énergie rapide.",
    en: "Enjoy in moderation. Source of pleasure and quick energy."
  },
  "Buffets": {
    fr: "Variété équilibrée pour tous les goûts. Permet de composer un repas personnalisé et nutritif.",
    en: "Balanced variety for all tastes. Allows you to compose a personalized and nutritious meal."
  },
  "Boîtes à Lunch": {
    fr: "Repas complet et pratique. Portions calculées pour un apport nutritionnel optimal.",
    en: "Complete and convenient meal. Portions calculated for optimal nutritional intake."
  }
};

// Read the file
const menuFile = path.join(__dirname, 'client/src/data/completeMenuData.ts');
let content = fs.readFileSync(menuFile, 'utf8');

// Add nutritional tips to each item based on category
Object.keys(nutritionalTipsByCategory).forEach(category => {
  const tips = nutritionalTipsByCategory[category];
  const tipString = `nutritionalTips: { fr: "${tips.fr}", en: "${tips.en}" }`;
  
  // Find all items in this category and add tips if not present
  const categoryRegex = new RegExp(`category: "${category}"`, 'g');
  let match;
  let lastIndex = 0;
  let newContent = '';
  
  while ((match = categoryRegex.exec(content)) !== null) {
    const itemStart = content.lastIndexOf('{', match.index);
    const itemEnd = content.indexOf('}', match.index);
    const itemText = content.substring(itemStart, itemEnd + 1);
    
    // Check if nutritionalTips already exists
    if (!itemText.includes('nutritionalTips')) {
      // Add before the closing brace
      const insertPos = itemEnd;
      newContent += content.substring(lastIndex, insertPos);
      newContent += `,\n    ${tipString}`;
      lastIndex = insertPos;
    }
  }
  
  if (newContent) {
    newContent += content.substring(lastIndex);
    content = newContent;
  }
});

// Write back
fs.writeFileSync(menuFile, content, 'utf8');
console.log('✅ Nutritional tips added successfully!');
