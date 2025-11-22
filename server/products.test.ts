import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@lestouilles.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("products.create", () => {
  it("allows admin to create a product", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.create({
      name: "Test Sandwich",
      description: "Un délicieux sandwich test",
      category: "sandwiches",
      price: 1200,
      image: "/images/test.jpg",
      isActive: true,
    });

    expect(result).toEqual({ success: true });
  });

  it("prevents non-admin from creating a product", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.products.create({
        name: "Test Sandwich",
        description: "Un délicieux sandwich test",
        category: "sandwiches",
        price: 1200,
        image: "/images/test.jpg",
        isActive: true,
      })
    ).rejects.toThrow("Unauthorized");
  });
});

describe("products.listActive", () => {
  it("returns active products for public users", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.listActive();

    expect(Array.isArray(products)).toBe(true);
    // All returned products should be active
    products.forEach((product) => {
      expect(product.isActive).toBe(true);
    });
  });
});

describe("products.listAll", () => {
  it("allows admin to list all products", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.listAll();

    expect(Array.isArray(products)).toBe(true);
  });

  it("prevents non-admin from listing all products", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.products.listAll()).rejects.toThrow("Unauthorized");
  });
});

describe("products.update", () => {
  it("allows admin to update a product", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a product
    await caller.products.create({
      name: "Product to Update",
      description: "Original description",
      category: "desserts",
      price: 800,
      image: "/images/original.jpg",
      isActive: true,
    });

    // Get the product ID (in real scenario, you'd track this)
    const products = await caller.products.listAll();
    const product = products.find((p) => p.name === "Product to Update");
    
    if (product) {
      const result = await caller.products.update({
        id: product.id,
        name: "Updated Product",
        price: 900,
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("prevents non-admin from updating a product", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.products.update({
        id: 1,
        name: "Hacked Product",
      })
    ).rejects.toThrow("Unauthorized");
  });
});

describe("products.delete", () => {
  it("allows admin to delete a product", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a product to delete
    await caller.products.create({
      name: "Product to Delete",
      description: "Will be deleted",
      category: "boissons",
      price: 500,
      image: "/images/delete.jpg",
      isActive: true,
    });

    const products = await caller.products.listAll();
    const product = products.find((p) => p.name === "Product to Delete");
    
    if (product) {
      const result = await caller.products.delete({ id: product.id });
      expect(result).toEqual({ success: true });
    }
  });

  it("prevents non-admin from deleting a product", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.products.delete({ id: 1 })
    ).rejects.toThrow("Unauthorized");
  });
});

describe("products.byCategory", () => {
  it("returns products filtered by category", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.byCategory({ category: "sandwiches" });

    expect(Array.isArray(products)).toBe(true);
    products.forEach((product) => {
      expect(product.category).toBe("sandwiches");
    });
  });
});

describe("products.price storage", () => {
  it("stores price in cents as integer", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create product with price in cents (e.g., $15.50 = 1550 cents)
    await caller.products.create({
      name: "Price Test Product",
      description: "Testing price storage",
      category: "sandwiches",
      price: 1550, // 15.50 in cents
      image: "/images/test-price.jpg",
      isActive: true,
    });

    const products = await caller.products.listAll();
    const product = products.find((p) => p.name === "Price Test Product");
    
    expect(product).toBeDefined();
    expect(product?.price).toBe(1550);
    expect(typeof product?.price).toBe("number");
    expect(Number.isInteger(product?.price)).toBe(true);
  });

  it("correctly handles decimal price conversion (frontend converts $15.50 to 1550 cents)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Simulate frontend conversion: $25.99 -> 2599 cents
    const dollarPrice = 25.99;
    const centsPrice = Math.round(dollarPrice * 100);

    await caller.products.create({
      name: "Decimal Price Test",
      description: "Testing decimal conversion",
      category: "desserts",
      price: centsPrice, // Should be 2599
      image: "/images/test-decimal.jpg",
      isActive: true,
    });

    const products = await caller.products.listAll();
    const product = products.find((p) => p.name === "Decimal Price Test");
    
    expect(product).toBeDefined();
    expect(product?.price).toBe(2599);
    
    // Verify we can convert back to dollars
    const displayPrice = (product?.price ?? 0) / 100;
    expect(displayPrice).toBe(25.99);
  });

  it("handles price update correctly", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create product
    await caller.products.create({
      name: "Update Price Test",
      description: "Testing price update",
      category: "traiteur",
      price: 3000, // $30.00
      image: "/images/test-update.jpg",
      isActive: true,
    });

    const products = await caller.products.listAll();
    const product = products.find((p) => p.name === "Update Price Test");
    
    if (product) {
      // Update to $35.50 (3550 cents)
      await caller.products.update({
        id: product.id,
        price: 3550,
      });

      const updatedProducts = await caller.products.listAll();
      const updatedProduct = updatedProducts.find((p) => p.id === product.id);
      
      expect(updatedProduct?.price).toBe(3550);
    }
  });
});
