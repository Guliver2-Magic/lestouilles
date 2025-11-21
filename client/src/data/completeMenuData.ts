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
    category: "Sandwichs",
    image: "/images/sandwiches/classique.jpg",
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
    category: "Sandwichs",
    dietary: ["Vegetarian", "Vegan"],
    image: "/images/sandwiches/vege.jpg",
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
    category: "Sandwichs",
    image: "/images/sandwiches/poulet.jpg"
  },
  {
    id: "sand-004",
    name: { fr: "Le Smoked Meat", en: "Smoked Meat" },
    description: { fr: "Viande fumée de Montréal, moutarde", en: "Montreal smoked meat, mustard" },
    price: 12.00,
    servings: "1 personne",
    category: "Sandwichs",
    image: "/images/sandwiches/smoked-meat.jpg"
  },

  // SALADES
  {
    id: "sal-001",
    name: { fr: "Salade César", en: "Caesar Salad" },
    description: { fr: "Laitue romaine, croûtons, parmesan, sauce César", en: "Romaine lettuce, croutons, parmesan, Caesar dressing" },
    price: 9.50,
    servings: "1 personne",
    category: "Salades",
    image: "/images/salads/caesar.jpg"
  },
  {
    id: "sal-002",
    name: { fr: "Salade Grecque", en: "Greek Salad" },
    description: { fr: "Tomates, concombres, olives, feta, vinaigrette", en: "Tomatoes, cucumbers, olives, feta, vinaigrette" },
    price: 10.00,
    servings: "1 personne",
    category: "Salades",
    dietary: ["Vegetarian"],
    image: "/images/salads/greek.jpg"
  },
  {
    id: "sal-003",
    name: { fr: "Salade de Quinoa", en: "Quinoa Salad" },
    description: { fr: "Quinoa, légumes rôtis, vinaigrette au citron", en: "Quinoa, roasted vegetables, lemon vinaigrette" },
    price: 11.00,
    servings: "1 personne",
    category: "Salades",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    image: "/images/salads/quinoa.jpg"
  },

  // PLATS PRINCIPAUX (PRÊT À MANGER)
  {
    id: "plat-001",
    name: { fr: "Lasagne à la Viande", en: "Meat Lasagna" },
    description: { fr: "Lasagne maison avec sauce bolognaise", en: "Homemade lasagna with bolognese sauce" },
    price: 12.50,
    servings: "1-2 personnes",
    category: "Plats Principaux",
    image: "/images/mains/lasagna.jpg"
  },
  {
    id: "plat-002",
    name: { fr: "Poulet Rôti et Légumes", en: "Roasted Chicken and Vegetables" },
    description: { fr: "Poulet rôti avec légumes de saison", en: "Roasted chicken with seasonal vegetables" },
    price: 14.00,
    servings: "1-2 personnes",
    category: "Plats Principaux",
    dietary: ["Gluten-Free"],
    image: "/images/mains/roasted-chicken.jpg"
  },
  {
    id: "plat-003",
    name: { fr: "Saumon Teriyaki", en: "Teriyaki Salmon" },
    description: { fr: "Saumon grillé, sauce teriyaki, riz", en: "Grilled salmon, teriyaki sauce, rice" },
    price: 16.50,
    servings: "1-2 personnes",
    category: "Plats Principaux",
    image: "/images/mains/salmon.jpg"
  },
  {
    id: "plat-004",
    name: { fr: "Pâtes Carbonara", en: "Carbonara Pasta" },
    description: { fr: "Pâtes crémeuses au bacon et parmesan", en: "Creamy pasta with bacon and parmesan" },
    price: 11.50,
    servings: "1-2 personnes",
    category: "Plats Principaux",
    image: "/images/mains/carbonara.jpg"
  },

  // TRAITEUR - BOUCHÉES
  {
    id: "bou-001",
    name: { fr: "Assortiment de Bouchées", en: "Assorted Canapés" },
    description: { fr: "Sélection variée de bouchées froides et chaudes", en: "Varied selection of cold and hot canapés" },
    price: 45.00,
    servings: "10-12 personnes",
    category: "Traiteur - Bouchées",
    image: "/images/catering/canapes.jpg"
  },
  {
    id: "bou-002",
    name: { fr: "Mini Quiches", en: "Mini Quiches" },
    description: { fr: "Assortiment de mini quiches (lorraine, légumes, fromage)", en: "Assortment of mini quiches (lorraine, vegetables, cheese)" },
    price: 35.00,
    servings: "10-12 personnes",
    category: "Traiteur - Bouchées",
    dietary: ["Vegetarian"],
    image: "/images/catering/mini-quiches.jpg"
  },
  {
    id: "bou-003",
    name: { fr: "Brochettes de Poulet", en: "Chicken Skewers" },
    description: { fr: "Brochettes de poulet mariné grillé", en: "Grilled marinated chicken skewers" },
    price: 40.00,
    servings: "10-12 personnes",
    category: "Traiteur - Bouchées",
    dietary: ["Gluten-Free"],
    image: "/images/catering/chicken-skewers.jpg"
  },

  // TRAITEUR - BUFFETS
  {
    id: "buf-001",
    name: { fr: "Buffet Classique", en: "Classic Buffet" },
    description: { fr: "Sélection de viandes, salades, et accompagnements", en: "Selection of meats, salads, and sides" },
    price: 25.00,
    servings: "Par personne (min. 20)",
    category: "Traiteur - Buffets",
    image: "/images/catering/classic-buffet.jpg"
  },
  {
    id: "buf-002",
    name: { fr: "Buffet Végétarien", en: "Vegetarian Buffet" },
    description: { fr: "Assortiment de plats végétariens et salades", en: "Assortment of vegetarian dishes and salads" },
    price: 22.00,
    servings: "Par personne (min. 20)",
    category: "Traiteur - Buffets",
    dietary: ["Vegetarian"],
    image: "/images/catering/veggie-buffet.jpg"
  },
  {
    id: "buf-003",
    name: { fr: "Buffet Prestige", en: "Premium Buffet" },
    description: { fr: "Sélection premium avec fruits de mer et viandes fines", en: "Premium selection with seafood and fine meats" },
    price: 35.00,
    servings: "Par personne (min. 20)",
    category: "Traiteur - Buffets",
    image: "/images/catering/premium-buffet.jpg"
  },

  // BOÎTES À LUNCH
  {
    id: "box-001",
    name: { fr: "Boîte à Lunch Classique", en: "Classic Lunch Box" },
    description: { fr: "Sandwich, salade, dessert, et breuvage", en: "Sandwich, salad, dessert, and beverage" },
    price: 15.00,
    servings: "1 personne",
    category: "Boîtes à Lunch",
    image: "/images/catering/lunch-box-classic.jpg"
  },
  {
    id: "box-002",
    name: { fr: "Boîte à Lunch Végé", en: "Veggie Lunch Box" },
    description: { fr: "Wrap végétarien, salade, fruit, et breuvage", en: "Vegetarian wrap, salad, fruit, and beverage" },
    price: 14.00,
    servings: "1 personne",
    category: "Boîtes à Lunch",
    dietary: ["Vegetarian"],
    image: "/images/catering/lunch-box-veggie.jpg"
  },
  {
    id: "box-003",
    name: { fr: "Boîte à Lunch Exécutive", en: "Executive Lunch Box" },
    description: { fr: "Plat principal chaud, salade, dessert gourmand, breuvage", en: "Hot main dish, salad, gourmet dessert, beverage" },
    price: 18.00,
    servings: "1 personne",
    category: "Boîtes à Lunch",
    image: "/images/catering/lunch-box-executive.jpg"
  },

  // DESSERTS
  {
    id: "des-001",
    name: { fr: "Gâteau au Chocolat", en: "Chocolate Cake" },
    description: { fr: "Gâteau au chocolat riche et moelleux", en: "Rich and moist chocolate cake" },
    price: 35.00,
    servings: "8-10 personnes",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/desserts/chocolate-cake.jpg"
  },
  {
    id: "des-002",
    name: { fr: "Tarte aux Fruits", en: "Fruit Tart" },
    description: { fr: "Tarte aux fruits frais de saison", en: "Fresh seasonal fruit tart" },
    price: 30.00,
    servings: "8-10 personnes",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/desserts/fruit-tart.jpg"
  },
  {
    id: "des-003",
    name: { fr: "Tiramisu", en: "Tiramisu" },
    description: { fr: "Tiramisu classique au café et mascarpone", en: "Classic tiramisu with coffee and mascarpone" },
    price: 32.00,
    servings: "8-10 personnes",
    category: "Desserts",
    dietary: ["Vegetarian"],
    image: "/images/desserts/tiramisu.jpg"
  },

  // BOISSONS
  {
    id: "boi-001",
    name: { fr: "Café", en: "Coffee" },
    description: { fr: "Café fraîchement infusé", en: "Freshly brewed coffee" },
    price: 2.50,
    servings: "1 personne",
    category: "Boissons",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/beverages/coffee.jpg"
  },
  {
    id: "boi-002",
    name: { fr: "Jus Frais", en: "Fresh Juice" },
    description: { fr: "Jus de fruits frais pressés", en: "Fresh pressed fruit juice" },
    price: 4.00,
    servings: "1 personne",
    category: "Boissons",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/beverages/juice.jpg"
  },
  {
    id: "boi-003",
    name: { fr: "Thé Glacé Maison", en: "Homemade Iced Tea" },
    description: { fr: "Thé glacé fait maison", en: "Homemade iced tea" },
    price: 3.50,
    servings: "1 personne",
    category: "Boissons",
    dietary: ["Vegan", "Gluten-Free"],
    image: "/images/beverages/iced-tea.jpg"
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
