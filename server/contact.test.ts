import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("contact.submit", () => {
  it("should submit contact form with all fields", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@example.com",
      phone: "514-123-4567",
      subject: "Catering inquiry",
      eventType: "wedding",
      eventDate: "2024-12-31",
      guestCount: 150,
      message: "I would like to inquire about catering services for my wedding.",
      language: "en",
    });

    expect(result.success).toBe(true);
  });

  it("should submit contact form with required fields only", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Smith",
      email: "jane@example.com",
      message: "Please contact me about your services.",
      language: "fr",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid email", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "invalid-email",
        message: "Test message",
        language: "en",
      })
    ).rejects.toThrow();
  });

  it("should reject empty name", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "test@example.com",
        message: "Test message",
        language: "en",
      })
    ).rejects.toThrow();
  });

  it("should reject empty message", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        message: "",
        language: "en",
      })
    ).rejects.toThrow();
  });
});

describe("newsletter.subscribe", () => {
  it("should subscribe to newsletter", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: `test-${Date.now()}@example.com`,
      name: "Newsletter Subscriber",
      language: "fr",
    });

    expect(result.success).toBe(true);
  });

  it("should subscribe with email only", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: `minimal-${Date.now()}@example.com`,
      language: "en",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid email for newsletter", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.newsletter.subscribe({
        email: "not-an-email",
        language: "en",
      })
    ).rejects.toThrow();
  });
});
