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

describe("chatbot.sendMessage", () => {
  it("should save user message and generate bot response", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.sendMessage({
      sessionId: "test-session-123",
      message: "Bonjour",
      language: "fr",
    });

    expect(result).toHaveProperty("response");
    expect(typeof result.response).toBe("string");
    expect(result.response.length).toBeGreaterThan(0);
  });

  it("should respond in French when language is fr", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.sendMessage({
      sessionId: "test-session-456",
      message: "Bonjour",
      language: "fr",
    });

    expect(result.response).toContain("Bonjour");
  });

  it("should respond in English when language is en", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.sendMessage({
      sessionId: "test-session-789",
      message: "Hello",
      language: "en",
    });

    expect(result.response).toContain("Hello");
  });

  it("should handle menu-related questions", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.sendMessage({
      sessionId: "test-session-menu",
      message: "What's on the menu?",
      language: "en",
    });

    expect(result.response.toLowerCase()).toMatch(/menu|dish|soup|dessert/);
  });
});

describe("chatbot.saveLead", () => {
  it("should save lead information", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.saveLead({
      name: "Test User",
      email: "test@example.com",
      phone: "514-123-4567",
      eventType: "wedding",
      guestCount: 100,
      message: "Looking for catering services",
      sessionId: "test-session-lead",
      language: "en",
    });

    expect(result.success).toBe(true);
  });

  it("should save lead with minimal information", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.saveLead({
      sessionId: "test-session-minimal",
      language: "fr",
    });

    expect(result.success).toBe(true);
  });
});
