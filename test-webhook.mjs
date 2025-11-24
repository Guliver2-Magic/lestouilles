#!/usr/bin/env node

/**
 * Test script for n8n chatbot webhook
 * Tests if the webhook responds correctly to messages
 */

const WEBHOOK_URL = process.env.N8N_CHATBOT_WEBHOOK_URL || 'https://vps-e53ac5fb.vps.ovh.ca/webhook/chatbot-response';

async function testWebhook(message, sessionId = 'test-session-123') {
  console.log(`\n🧪 Testing webhook with message: "${message}"`);
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  
  const payload = {
    message: message,
    sessionId: sessionId,
    uuid: sessionId // fallback for compatibility
  };
  
  console.log(`📤 Sending payload:`, JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error response:`, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ Response data:`, JSON.stringify(data, null, 2));
    
    if (data.response) {
      console.log(`\n💬 Bot response:\n${data.response}\n`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting n8n webhook tests for Les Touillés chatbot\n');
  console.log('=' .repeat(60));
  
  // Test 1: French greeting
  await testWebhook('Bonjour! Quels sont vos plats végétariens?');
  
  console.log('\n' + '='.repeat(60));
  
  // Test 2: English inquiry
  await testWebhook('Hello, do you have catering services for 50 people?');
  
  console.log('\n' + '='.repeat(60));
  
  // Test 3: Menu question
  await testWebhook('Quel est le prix de la boîte à lunch?');
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Tests completed!\n');
}

// Run tests
runTests().catch(console.error);
