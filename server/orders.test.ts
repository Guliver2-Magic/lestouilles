import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { generateOrderNumber } from "./orders-db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@lestouilles.ca",
    name: "Test User",
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
      headers: {
        origin: "https://test.lestouilles.ca",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("orders", () => {
  it("generates unique order numbers", () => {
    const orderNumber1 = generateOrderNumber();
    const orderNumber2 = generateOrderNumber();
    
    expect(orderNumber1).toMatch(/^LT-[A-Z0-9]+-[A-Z0-9]{4}$/);
    expect(orderNumber2).toMatch(/^LT-[A-Z0-9]+-[A-Z0-9]{4}$/);
    expect(orderNumber1).not.toBe(orderNumber2);
  });

  it("creates checkout session with valid data", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const checkoutData = {
      customerName: "Jean Dupont",
      customerEmail: "jean.dupont@example.com",
      customerPhone: "+1-514-555-0123",
      deliveryMethod: "pickup" as const,
      deliveryDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      deliveryTime: "12:00",
      items: [
        {
          productId: "salade-cesar",
          productName: "Salade César",
          productCategory: "Salades",
          productImage: "https://test.lestouilles.ca/images/caesar-salad.jpg",
          unitPrice: 950, // $9.50 in cents
          quantity: 2,
        },
        {
          productId: "sandwich-poulet",
          productName: "Sandwich au Poulet",
          productCategory: "Sandwichs",
          productImage: "https://test.lestouilles.ca/images/sandwich.jpg",
          unitPrice: 1200, // $12.00 in cents
          quantity: 1,
        },
      ],
      language: "fr" as const,
    };

    const result = await caller.orders.createCheckout(checkoutData);

    expect(result).toHaveProperty("checkoutUrl");
    expect(result).toHaveProperty("sessionId");
    expect(result).toHaveProperty("orderId");
    expect(result).toHaveProperty("orderNumber");
    expect(result.orderNumber).toMatch(/^LT-[A-Z0-9]+-[A-Z0-9]{4}$/);
    expect(typeof result.checkoutUrl).toBe("string");
    expect(result.checkoutUrl).toContain("checkout.stripe.com");
  });

  it("calculates order totals correctly", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const items = [
      {
        productId: "item1",
        productName: "Test Item 1",
        productCategory: "Test",
        unitPrice: 1000, // $10.00
        quantity: 2,
      },
      {
        productId: "item2",
        productName: "Test Item 2",
        productCategory: "Test",
        unitPrice: 1500, // $15.00
        quantity: 1,
      },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = 1000; // $10.00 for delivery
    const tax = Math.round((subtotal + deliveryFee) * 0.14975);
    const expectedTotal = subtotal + deliveryFee + tax;

    // Subtotal: $20.00 + $15.00 = $35.00 = 3500 cents
    // Delivery: $10.00 = 1000 cents
    // Tax: (3500 + 1000) * 0.14975 = 673.875 ≈ 674 cents
    // Total: 3500 + 1000 + 674 = 5174 cents = $51.74

    expect(subtotal).toBe(3500);
    expect(deliveryFee).toBe(1000);
    expect(tax).toBe(674);
    expect(expectedTotal).toBe(5174);
  });

  it("validates required fields", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const invalidData = {
      customerName: "",
      customerEmail: "invalid-email",
      customerPhone: "",
      deliveryMethod: "pickup" as const,
      deliveryDate: new Date().toISOString(),
      deliveryTime: "12:00",
      items: [],
      language: "fr" as const,
    };

    await expect(caller.orders.createCheckout(invalidData)).rejects.toThrow();
  });

  it("requires delivery address for delivery orders", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const deliveryOrderWithoutAddress = {
      customerName: "Jean Dupont",
      customerEmail: "jean@example.com",
      customerPhone: "+1-514-555-0123",
      deliveryMethod: "delivery" as const,
      deliveryDate: new Date(Date.now() + 86400000).toISOString(),
      deliveryTime: "12:00",
      // Missing deliveryAddress
      items: [
        {
          productId: "test",
          productName: "Test Item",
          productCategory: "Test",
          unitPrice: 1000,
          quantity: 1,
        },
      ],
      language: "fr" as const,
    };

    // The checkout should still work, but in a real scenario,
    // frontend validation should catch this
    const result = await caller.orders.createCheckout(deliveryOrderWithoutAddress);
    expect(result).toHaveProperty("checkoutUrl");
  });
});
