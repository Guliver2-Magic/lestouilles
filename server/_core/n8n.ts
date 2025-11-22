/**
 * n8n Integration Helper
 * 
 * Provides functions to interact with n8n workflows for lead capture and automation.
 * Uses the n8n API with credentials from environment variables.
 */

interface LeadData {
  sessionId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  eventType?: string | null;
  eventDate?: Date | null;
  guestCount?: number | null;
  message?: string | null;
  language: string;
  source: string;
  timestamp: string;
}

/**
 * Send lead data to n8n workflow
 * 
 * This function sends lead information to your n8n instance for processing.
 * Make sure you have a workflow set up in n8n with a Webhook trigger node.
 * 
 * @param leadData - The lead information to send
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function sendLeadToN8n(leadData: LeadData): Promise<boolean> {
  const n8nUrl = process.env.N8N_INSTANCE_URL;
  const n8nApiKey = process.env.N8N_API_KEY;

  // If webhook URL is directly configured, use it
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!webhookUrl && (!n8nUrl || !n8nApiKey)) {
    console.warn("[n8n] No n8n configuration found. Skipping lead capture.");
    return false;
  }

  try {
    if (webhookUrl) {
      // Direct webhook call
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        console.error(`[n8n] Webhook call failed: ${response.status} ${response.statusText}`);
        return false;
      }

      console.log("[n8n] Lead sent successfully via webhook");
      return true;
    } else {
      // Use n8n API to trigger workflow
      // Note: This requires you to have a workflow with ID configured
      // For now, we'll log the lead data
      console.log("[n8n] Lead data ready for n8n:", leadData);
      console.log("[n8n] Please configure N8N_WEBHOOK_URL environment variable with your webhook URL");
      return false;
    }
  } catch (error) {
    console.error("[n8n] Failed to send lead:", error);
    return false;
  }
}

/**
 * Extract lead information from conversation messages
 * 
 * Analyzes messages to extract contact information and event details
 */
export function extractLeadInfo(messages: string[]): Partial<LeadData> {
  const leadInfo: Partial<LeadData> = {};
  const combinedText = messages.join(" ");

  // Extract email
  const emailMatch = combinedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    leadInfo.email = emailMatch[0];
  }

  // Extract phone (various formats)
  const phoneMatch = combinedText.match(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  if (phoneMatch) {
    leadInfo.phone = phoneMatch[0];
  }

  // Extract name (simple heuristic: capitalized words before email/phone)
  const nameMatch = combinedText.match(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/);
  if (nameMatch) {
    leadInfo.name = nameMatch[1];
  }

  // Extract guest count
  const guestMatch = combinedText.match(/(\d+)\s*(invit[ée]s?|guests?|personnes?|people)/i);
  if (guestMatch) {
    leadInfo.guestCount = parseInt(guestMatch[1]);
  }

  // Detect event type
  if (/mariage|wedding/i.test(combinedText)) {
    leadInfo.eventType = "wedding";
  } else if (/corporatif|corporate|entreprise|business/i.test(combinedText)) {
    leadInfo.eventType = "corporate";
  } else if (/f[êe]te|party|priv[ée]/i.test(combinedText)) {
    leadInfo.eventType = "private";
  }

  return leadInfo;
}
