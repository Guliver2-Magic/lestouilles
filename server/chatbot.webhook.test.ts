import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("n8n chatbot webhook", () => {
  it("should have N8N_CHATBOT_WEBHOOK_URL configured", () => {
    expect(ENV.n8nChatbotWebhookUrl).toBeDefined();
    expect(ENV.n8nChatbotWebhookUrl).toContain("webhook");
  });

  it("should successfully call n8n webhook and receive response", async () => {
    if (!ENV.n8nChatbotWebhookUrl) {
      throw new Error("N8N_CHATBOT_WEBHOOK_URL is not configured");
    }

    const testPayload = {
      sessionId: "test-session",
      message: "Bonjour",
      language: "fr",
      conversationHistory: [],
    };

    const response = await fetch(ENV.n8nChatbotWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook error:", response.status, errorText);
      throw new Error(`Webhook returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    expect(data).toHaveProperty("response");
    expect(typeof data.response).toBe("string");
    expect(data.response.length).toBeGreaterThan(0);
  }, 10000); // 10 second timeout for webhook call
});
