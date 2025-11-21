import { describe, expect, it } from "vitest";
import { completeMenu, categories } from "../client/src/data/completeMenuData";

describe("Menu Data", () => {
  it("should have all required menu items", () => {
    expect(completeMenu).toBeDefined();
    expect(completeMenu.length).toBeGreaterThan(0);
  });

  it("should have valid menu item structure", () => {
    completeMenu.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.name.fr).toBeDefined();
      expect(item.name.en).toBeDefined();
      expect(item.description.fr).toBeDefined();
      expect(item.description.en).toBeDefined();
      expect(item.price).toBeGreaterThan(0);
      expect(item.category).toBeDefined();
      expect(item.image).toBeDefined();
    });
  });

  it("should have serving sizes for catering items", () => {
    const cateringItems = completeMenu.filter(
      (item) =>
        item.category.includes("Traiteur") ||
        item.category.includes("Buffet") ||
        item.category.includes("Boîtes")
    );
    
    cateringItems.forEach((item) => {
      expect(item.servings).toBeDefined();
      expect(item.servings).toContain("personne");
    });
  });

  it("should have all categories defined", () => {
    expect(categories).toBeDefined();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("Tous");
  });

  it("should have items in each category", () => {
    categories.forEach((category) => {
      if (category !== "Tous") {
        const itemsInCategory = completeMenu.filter(
          (item) => item.category === category
        );
        expect(itemsInCategory.length).toBeGreaterThan(0);
      }
    });
  });

  it("should have reasonable prices", () => {
    completeMenu.forEach((item) => {
      expect(item.price).toBeGreaterThan(0);
      expect(item.price).toBeLessThan(1000); // Reasonable max price
    });
  });

  it("should have dietary tags for vegetarian items", () => {
    const vegetarianItems = completeMenu.filter((item) =>
      item.dietary?.includes("Vegetarian")
    );
    expect(vegetarianItems.length).toBeGreaterThan(0);
  });
});
