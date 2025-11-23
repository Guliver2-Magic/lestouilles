/**
 * Category translations for bilingual support
 */

export const categoryTranslations: Record<string, { fr: string; en: string }> = {
  "sandwiches": {
    fr: "Sandwiches",
    en: "Sandwiches"
  },
  "salades": {
    fr: "Salades",
    en: "Salads"
  },
  "plats-principaux": {
    fr: "Plats Principaux",
    en: "Main Dishes"
  },
  "traiteur-bouchees": {
    fr: "Traiteur - Bouchées",
    en: "Catering - Bites"
  },
  "traiteur-buffets": {
    fr: "Traiteur - Buffets",
    en: "Catering - Buffets"
  },
  "boites-lunch": {
    fr: "Boîtes à Lunch",
    en: "Lunch Boxes"
  },
  "desserts": {
    fr: "Desserts",
    en: "Desserts"
  },
  "boissons": {
    fr: "Boissons",
    en: "Beverages"
  }
};

export function translateCategory(category: string, language: "fr" | "en"): string {
  return categoryTranslations[category]?.[language] || category;
}
