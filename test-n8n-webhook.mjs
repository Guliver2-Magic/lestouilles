// Test n8n webhook directly
const webhookUrl = process.env.N8N_CHATBOT_WEBHOOK_URL;

if (!webhookUrl) {
  console.error("❌ N8N_CHATBOT_WEBHOOK_URL not configured");
  process.exit(1);
}

console.log("🔗 Testing webhook:", webhookUrl);

const testPayload = {
  sessionId: "test-session-123",
  message: "Pouvez-vous me parler de vos services de traiteur?",
  language: "fr",
  conversationHistory: [
    { role: "user", content: "Bonjour" },
    { role: "assistant", content: "Bonjour! Comment puis-je vous aider?" }
  ]
};

console.log("📤 Sending payload:", JSON.stringify(testPayload, null, 2));

try {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testPayload),
  });

  console.log("📥 Response status:", response.status);
  console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));
  
  const text = await response.text();
  console.log("📥 Response body (raw):", text);
  
  if (text) {
    try {
      const json = JSON.parse(text);
      console.log("✅ Parsed JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e.message);
    }
  } else {
    console.error("❌ Empty response body");
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}
