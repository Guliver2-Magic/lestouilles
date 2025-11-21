// Complete menu data extracted from Les Touillés original website
// All prices in CAD, portions indicated as number of people served

export interface MenuItem {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  price: number;
  servings?: string; // Number of people served
  quantity?: string; // Weight or volume (e.g., "250g", "300ml")
  image: string;
  category: string;
  dietary?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  nutritionalTips?: {
    fr: string;
    en: string;
  };
}

export const completeMenu: MenuItem[] = [
  // SANDWICHS
  {
    id: "sand-001",
    name: { fr: "Le Classique", en: "The Classic" },
    description: { fr: "Jambon, fromage, laitue, tomate", en: "Ham, cheese, lettuce, tomato" },
    price: 8.50,
    servings: "1 personne",
    quantity: "250g",
    category: "Sandwichs",
    image: "/images/menu/WgESo0WjYDzG.jpg",
    nutrition: { calories: 350, protein: 15, carbs: 45, fat: 12 },
    nutritionalTips: { 
      fr: "Riche en protéines et fibres. Parfait pour un déjeuner équilibré qui vous garde rassasié.", 
      en: "Rich in protein and fiber. Perfect for a balanced lunch that keeps you satisfied." 
    }
  },
  {
    id: "sand-002",
    name: { fr: "Le Végé", en: "The Veggie" },
    description: { fr: "Légumes grillés, houmous, roquette", en: "Grilled vegetables, hummus, arugula" },
    price: 9.00,
    servings: "1 personne",
    quantity: "250g",
    category: "Sandwichs",
    dietary: ["Vegetarian", "Vegan"],
    image: "/images/menu/6BnExjt67ce6.jpg",
    nutrition: { calories: 320, protein: 12, carbs: 48, fat: 10 },
    nutritionalTips: { 
      fr: "Riche en fibres et vitamines. Excellente source de nutriments végétaux pour une santé optimale.", 
      en: "Rich in fiber and vitamins. Excellent source of plant nutrients for optimal health." 
    }
  },
  {
    id: "sand-003",
    name: { fr: "Le Poulet Grillé", en: "Grilled Chicken" },
    description: { fr: "Poulet grillé, mayo chipotle, avocat", en: "Grilled chicken, chipotle mayo, avocado" },
    price: 10.50,
    servings: "1 personne",
    quantity: "270g",
    category: "Sandwichs",
    image: "/images/products/sandwich-poulet.jpg",
    nutrition: { calories: 420, protein: 28, carbs: 38, fat: 16 },
    nutritionalTips: { 
      fr: "Excellente source de protéines maigres. L'avocat apporte des graisses saines pour le cœur.", 
      en: "Excellent source of lean protein. Avocado provides heart-healthy fats." 
    }
  },
  {
    id: "sand-004",
    name: { fr: "Le Smoked Meat", en: "Smoked Meat" },
    description: { fr: "Viande fumée de Montréal, moutarde", en: "Montreal smoked meat, mustard" },
    price: 12.00,
    servings: "1 personne",
    quantity: "280g",
    category: "Sandwichs",
    image: "/images/menu/smoked-meat.jpg",
    nutrition: { calories: 480, protein: 32, carbs: 42, fat: 18 },
    nutritionalTips: { 
      fr: "Riche en protéines. La viande fumée de Montréal est une spécialité locale savoureuse.", 
      en: "High in protein. Montreal smoked meat is a flavorful local specialty." 
    }
  },

  // SALADES
  {
    id: "sal-001",
    name: { fr: "Salade César", en: "Caesar Salad" },
    description: { fr: "Laitue romaine, croûtons, parmesan, sauce César", en: "Romaine lettuce, croutons, parmesan, Caesar dressing" },
    price: 9.50,
    servings: "1 personne",
    quantity: "300g",
    category: "Salades",
    image: "/images/products/salade-cesar.jpg",
    nutrition: { calories: 280, protein: 8, carbs: 22, fat: 18 },
    nutritionalTips: { 
      fr: "Source de calcium grâce au parmesan. Modérée en calories pour une salade complète.", 
      en: "Source of calcium from parmesan. Moderate in calories for a complete salad." 
    }
  },
  {
    id: "sal-002",
    name: { fr: "Salade Grecque", en: "Greek Salad" },
    description: { fr: "Tomates, concombres, olives, feta, vinaigrette", en: "Tomatoes, cucumbers, olives, feta, vinaigrette" },
    price: 10.00,
    servings: "1 personne",
    quantity: "320g",
    category: "Salades",
    dietary: ["Vegetarian"],
    image: "/images/products/salade-grecque.jpg",
    nutrition: { calories: 240, protein: 9, carbs: 14, fat: 16 },
    nutritionalTips: { 
      fr: "Riche en antioxydants et graisses saines. Les olives et la feta apportent des saveurs méditerranéennes.", 
      en: "Rich in antioxidants and healthy fats. Olives and feta provide Mediterranean flavors." 
    }
  },
  {
    id: "sal-003",
    name: { fr: "Salade de Quinoa", en: "Quinoa Salad" },
    description: { fr: "Quinoa, légumes rôtis, vinaigrette au citron", en: "Quinoa, roasted vegetables, lemon vinaigrette" },
    price: 11.00,
    servings: "1 personne",
    quantity: "350g",
    category: "Salades",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    image: "/images/products/salade-quinoa.jpg",
    nutrition: { calories: 320, protein: 12, carbs: 45, fat: 10 },
    nutritionalTips: { 
      fr: "Protéine complète végétale. Le quinoa est une excellente source de fibres et de minéraux.", 
      en: "Complete plant protein. Quinoa is an excellent source of fiber and minerals." 
    }
  },

  // PLATS PRINCIPAUX (PRÊT À MANGER)
  {
    id: "plat-001",
    name: { fr: "Lasagne à la Viande", en: "Meat Lasagna" },
    description: { fr: "Lasagne maison avec sauce bolognaise", en: "Homemade lasagna with bolognese sauce" },
    price: 12.50,
    servings: "1-2 personnes",
    quantity: "400g",
    category: "Plats Principaux",
    image: "/images/menu/lasagna.jpg",
    nutrition: { calories: 520, protein: 28, carbs: 52, fat: 22 },
    nutritionalTips: { 
      fr: "Plat complet riche en protéines. La sauce bolognaise maison apporte saveur et nutriments.", 
      en: "Complete dish rich in protein. Homemade bolognese sauce provides flavor and nutrients." 
    }
  },
  {
    id: "plat-002",
    name: { fr: "Poulet Rôti et Légumes", en: "Roasted Chicken and Vegetables" },
    description: { fr: "Poulet rôti avec légumes de saison", en: "Roasted chicken with seasonal vegetables" },
    price: 14.00,
    servings: "1-2 personnes",
    quantity: "450g",
    category: "Plats Principaux",
    dietary: ["Gluten-Free"],
    image: "/images/menu/6BnExjt67ce6.jpg",
    nutrition: { calories: 480, protein: 42, carbs: 28, fat: 20 },
    nutritionalTips: { 
      fr: "Excellente source de protéines maigres. Les légumes de saison ajoutent vitamines et fibres.", 
      en: "Excellent source of lean protein. Seasonal vegetables add vitamins and fiber." 
    }
  },
  {
    id: "plat-003",
    name: { fr: "Saumon Teriyaki", en: "Teriyaki Salmon" },
    description: { fr: "Saumon grillé, sauce teriyaki, riz", en: "Grilled salmon, teriyaki sauce, rice" },
    price: 16.50,
    servings: "1-2 personnes",
    quantity: "420g",
    category: "Plats Principaux",
    dietary: ["Gluten-Free"],
    image: "/images/products/plat-principal.jpg",
    nutrition: { calories: 560, protein: 38, carbs: 52, fat: 18 },
    nutritionalTips: { 
      fr: "Riche en oméga-3 et protéines. Le saumon est excellent pour la santé cardiovasculaire.", 
      en: "Rich in omega-3 and protein. Salmon is excellent for cardiovascular health." 
    }
  },
  {
    id: "plat-004",
    name: { fr: "Pâtes Carbonara", en: "Carbonara Pasta" },
    description: { fr: "Pâtes crémeuses au bacon et parmesan", en: "Creamy pasta with bacon and parmesan" },
    price: 11.50,
    servings: "1-2 personnes",
    quantity: "380g",
    category: "Plats Principaux",
    image: "/images/products/plat-principal.jpg",
    nutrition: { calories: 620, protein: 24, carbs: 58, fat: 32 },
    nutritionalTips: { 
      fr: "Plat réconfortant riche en saveurs. Le parmesan apporte calcium et protéines.", 
      en: "Comforting dish rich in flavors. Parmesan provides calcium and protein." 
    }
  },

  // TRAITEUR - BOUCHÉES
  {
    id: "bou-001",
    name: { fr: "Assortiment de Bouchées", en: "Assorted Canapés" },
    description: { fr: "Sélection variée de bouchées froides et chaudes", en: "Varied selection of cold and hot canapés" },
    price: 45.00,
    servings: "10-12 personnes",
    category: "Traiteur - Bouchées",
    image: "/images/menu/canapes.webp",
    nutrition: { calories: 180, protein: 8, carbs: 15, fat: 10 },
    nutritionalTips: { 
      fr: "Par portion. Variété équilibrée pour tous les goûts.", 
      en: "Per serving. Balanced variety for all tastes." 
    }
  },
  {
    id: "bou-002",
    name: { fr: "Mini Quiches", en: "Mini Quiches" },
    description: { fr: "Assortiment de mini quiches (lorraine, légumes, fromage)", en: "Assortment of mini quiches (lorraine, vegetables, cheese)" },
    price: 35.00,
    servings: "10-12 personnes",
    category: "Traiteur - Bouchées",
    dietary: ["Vegetarian"],
    image: "/images/menu/mini-quiches.jpg",
    nutrition: { calories: 220, protein: 10, carbs: 18, fat: 12 },
    nutritionalTips: { 
      fr: "Par portion. Riches en protéines et calcium.", 
      en: "Per serving. Rich in protein and calcium." 
    }
  },
  {
    id: "bou-003",
    name: { fr: "Brochettes de Poulet", en: "Chicken Skewers" },
    description: { fr: "Brochettes de poulet mariné grillé", en: "Grilled marinated chicken skewers" },
    price: 40.00,
    servings: "10-12 personnes",
    category: "Traiteur - Bouchées",
    dietary: ["Gluten-Free"],
    image: "/images/menu/chicken-skewers.jpg",
    nutrition: { calories: 160, protein: 22, carbs: 4, fat: 6 },
    nutritionalTips: { 
      fr: "Par portion. Excellente source de protéines maigres.", 
      en: "Per serving. Excellent source of lean protein." 
    }
  },

  // TRAITEUR - BUFFETS
  {
    id: "buf-001",
    name: { fr: "Buffet Classique", en: "Classic Buffet" },
    description: { fr: "Sélection de viandes, salades, et accompagnements", en: "Selection of meats, salads, and sides" },
    price: 25.00,
    servings: "Par personne (min. 20)",
    category: "Traiteur - Buffets",
    image: "/images/menu/buffet-classic.jpg",
    nutrition: { calories: 650, protein: 35, carbs: 58, fat: 28 },
    nutritionalTips: { 
      fr: "Par personne. Menu équilibré avec variété de protéines et légumes.", 
      en: "Per person. Balanced menu with variety of proteins and vegetables." 
    }
  },
  {
    id: "buf-002",
    name: { fr: "Buffet Végétarien", en: "Vegetarian Buffet" },
    description: { fr: "Assortiment de plats végétariens et salades", en: "Assortment of vegetarian dishes and salads" },
    price: 22.00,
    servings: "Par personne (min. 20)",
    category: "Traiteur - Buffets",
    dietary: ["Vegetarian"],
    image: "/images/menu/buffet-vegetarian.jpg",
    nutrition: { calories: 520, protein: 18, carbs: 68, fat: 18 },
    nutritionalTips: { 
      fr: "Par personne. Riche en fibres et nutriments végétaux.", 
      en: "Per person. Rich in fiber and plant nutrients." 
    }
  },
  {
    id: "buf-003",
    name: { fr: "Buffet Prestige", en: "Premium Buffet" },
    description: { fr: "Sélection premium avec fruits de mer et viandes fines", en: "Premium selection with seafood and fine meats" },
    price: 35.00,
    servings: "Par personne (min. 20)",
    category: "Traiteur - Buffets",
    image: "/images/menu/buffet-premium.jpg",
    nutrition: { calories: 780, protein: 48, carbs: 52, fat: 38 },
    nutritionalTips: { 
      fr: "Par personne. Sélection premium riche en protéines nobles et oméga-3.", 
      en: "Per person. Premium selection rich in quality proteins and omega-3." 
    }
  },

  // BOÎTES À LUNCH
  {
    id: "box-001",
    name: { fr: "Boîte à Lunch Classique", en: "Classic Lunch Box" },
    description: { fr: "Sandwich, salade, dessert, et breuvage", en: "Sandwich, salad, dessert, and beverage" },
    price: 15.00,
    servings: "1 personne",
    quantity: "600g",
    category: "Boîtes à Lunch",
    image: "/images/products/boite-lunch.jpg",
    nutrition: { calories: 580, protein: 24, carbs: 68, fat: 22 },
    nutritionalTips: { 
      fr: "Repas complet et équilibré. Idéal pour le déjeuner au bureau.", 
      en: "Complete and balanced meal. Ideal for office lunch." 
    }
  },
  {
    id: "box-002",
    name: { fr: "Boîte à Lunch Végé", en: "Veggie Lunch Box" },
    description: { fr: "Wrap végétarien, salade, fruit, et breuvage", en: "Vegetarian wrap, salad, fruit, and beverage" },
    price: 14.00,
    servings: "1 personne",
    quantity: "550g",
    category: "Boîtes à Lunch",
    dietary: ["Vegetarian"],
    image: "/images/products/boite-lunch.jpg",
    nutrition: { calories: 480, protein: 16, carbs: 72, fat: 14 },
    nutritionalTips: { 
      fr: "Option végétarienne riche en fibres et vitamines.", 
      en: "Vegetarian option rich in fiber and vitamins." 
    }
  },
  {
    id: "box-003",
    name: { fr: "Boîte à Lunch Exécutive", en: "Executive Lunch Box" },
    description: { fr: "Plat principal chaud, salade, dessert gourmand, breuvage", en: "Hot main dish, salad, gourmet dessert, beverage" },
    price: 18.00,
    servings: "1 personne",
    quantity: "700g",
    category: "Boîtes à Lunch",
    image: "/images/products/boite-lunch.jpg",
    nutrition: { calories: 720, protein: 32, carbs: 78, fat: 28 },
    nutritionalTips: { 
      fr: "Repas premium complet. Parfait pour les journées chargées.", 
      en: "Premium complete meal. Perfect for busy days." 
    }
  },

  // DESSERTS
  {
    id: "des-001",
    name: { fr: "Brownie au Chocolat", en: "Chocolate Brownie" },
    description: { fr: "Brownie fondant au chocolat noir", en: "Fudgy dark chocolate brownie" },
    price: 5.99,
    servings: "1 personne",
    quantity: "120g",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/menu/brownie.jpg",
    nutrition: { calories: 380, protein: 5, carbs: 48, fat: 20 },
    nutritionalTips: { 
      fr: "Dessert riche et indulgent. À savourer avec modération.", 
      en: "Rich and indulgent dessert. Enjoy in moderation." 
    }
  },
  {
    id: "des-002",
    name: { fr: "Carré aux Dattes", en: "Date Square" },
    description: { fr: "Carré traditionnel aux dattes", en: "Traditional date square" },
    price: 4.99,
    servings: "1 personne",
    quantity: "100g",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/menu/date-square.jpg",
    nutrition: { calories: 280, protein: 3, carbs: 42, fat: 12 },
    nutritionalTips: { 
      fr: "Dessert traditionnel québécois. Les dattes apportent fibres et douceur naturelle.", 
      en: "Traditional Quebec dessert. Dates provide fiber and natural sweetness." 
    }
  },
  {
    id: "des-003",
    name: { fr: "Tiramisu au Bailey's", en: "Bailey's Tiramisu" },
    description: { fr: "Tiramisu crémeux au Bailey's", en: "Creamy Bailey's tiramisu" },
    price: 7.99,
    servings: "1 personne",
    quantity: "150g",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/menu/tiramisu.jpg",
    nutrition: { calories: 420, protein: 8, carbs: 38, fat: 26 },
    nutritionalTips: { 
      fr: "Dessert crémeux et raffiné. Le Bailey's ajoute une touche unique.", 
      en: "Creamy and refined dessert. Bailey's adds a unique touch." 
    }
  },
  {
    id: "des-004",
    name: { fr: "Pain aux Bananes et Chocolat", en: "Banana Chocolate Bread" },
    description: { fr: "Pain moelleux aux bananes et pépites de chocolat", en: "Moist banana bread with chocolate chips" },
    price: 6.49,
    servings: "1 personne",
    quantity: "130g",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/menu/banana-bread.jpg",
    nutrition: { calories: 320, protein: 5, carbs: 48, fat: 14 },
    nutritionalTips: { 
      fr: "Dessert réconfortant. Les bananes apportent potassium et douceur.", 
      en: "Comforting dessert. Bananas provide potassium and sweetness." 
    }
  },

  // BOISSONS
  {
    id: "boi-001",
    name: { fr: "Café", en: "Coffee" },
    description: { fr: "Café fraîchement infusé", en: "Freshly brewed coffee" },
    price: 2.50,
    servings: "1 personne",
    quantity: "250ml",
    category: "Boissons",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/menu/coffee.jpg",
    nutrition: { calories: 5, protein: 0, carbs: 0, fat: 0 },
    nutritionalTips: { 
      fr: "Sans calories. Source naturelle de caféine pour un regain d'énergie.", 
      en: "Calorie-free. Natural source of caffeine for an energy boost." 
    }
  },
  {
    id: "boi-002",
    name: { fr: "Jus Frais", en: "Fresh Juice" },
    description: { fr: "Jus de fruits frais pressés", en: "Fresh pressed fruit juice" },
    price: 4.00,
    servings: "1 personne",
    quantity: "300ml",
    category: "Boissons",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/menu/fresh-juice.jpg",
    nutrition: { calories: 120, protein: 1, carbs: 28, fat: 0 },
    nutritionalTips: { 
      fr: "Riche en vitamines et antioxydants. 100% fruits frais sans sucre ajouté.", 
      en: "Rich in vitamins and antioxidants. 100% fresh fruit with no added sugar." 
    }
  },
  {
    id: "boi-003",
    name: { fr: "Thé Glacé Maison", en: "Homemade Iced Tea" },
    description: { fr: "Thé glacé fait maison", en: "Homemade iced tea" },
    price: 3.50,
    servings: "1 personne",
    quantity: "350ml",
    category: "Boissons",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/menu/iced-tea.jpg",
    nutrition: { calories: 45, protein: 0, carbs: 11, fat: 0 },
    nutritionalTips: { 
      fr: "Rafraîchissant et légèrement sucré. Contient des antioxydants naturels du thé.", 
      en: "Refreshing and lightly sweetened. Contains natural tea antioxidants." 
    }
  }
];

export const categories = [
  "Tous",
  "Sandwichs",
  "Salades",
  "Plats Principaux",
  "Traiteur - Bouchées",
  "Traiteur - Buffets",
  "Boîtes à Lunch",
  "Desserts",
  "Boissons"
];
