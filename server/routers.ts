import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  saveConversation,
  getConversationsBySessionId,
  saveLead,
  saveContactSubmission,
  saveNewsletterSubscription,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chatbot: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          message: z.string(),
          language: z.enum(["fr", "en"]),
        })
      )
      .mutation(async ({ input }) => {
        // Save user message
        await saveConversation({
          sessionId: input.sessionId,
          message: input.message,
          sender: "user",
          language: input.language,
        });

        // Generate bot response (simple logic for now)
        const botResponse = generateBotResponse(input.message, input.language);

        // Save bot response
        await saveConversation({
          sessionId: input.sessionId,
          message: botResponse,
          sender: "bot",
          language: input.language,
        });

        // Check if we should trigger n8n webhook for lead capture
        const shouldCaptureLead = checkIfLeadInfo(input.message);
        if (shouldCaptureLead) {
          // Trigger n8n webhook (if configured)
          const n8nUrl = process.env.N8N_WEBHOOK_URL;
          if (n8nUrl) {
            try {
              await fetch(n8nUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sessionId: input.sessionId,
                  message: input.message,
                  language: input.language,
                  timestamp: new Date().toISOString(),
                }),
              });
            } catch (error) {
              console.error("Failed to trigger n8n webhook:", error);
            }
          }
        }

        return { response: botResponse };
      }),

    getHistory: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const conversations = await getConversationsBySessionId(input.sessionId);
        return conversations;
      }),

    saveLead: publicProcedure
      .input(
        z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          eventType: z.string().optional(),
          eventDate: z.string().optional(),
          guestCount: z.number().optional(),
          message: z.string().optional(),
          sessionId: z.string(),
          language: z.enum(["fr", "en"]),
        })
      )
      .mutation(async ({ input }) => {
        await saveLead({
          name: input.name || null,
          email: input.email || null,
          phone: input.phone || null,
          eventType: input.eventType || null,
          eventDate: input.eventDate ? new Date(input.eventDate) : null,
          guestCount: input.guestCount || null,
          message: input.message || null,
          source: "chatbot",
          sessionId: input.sessionId,
          language: input.language,
          status: "new",
        });

        return { success: true };
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().optional(),
          eventType: z.string().optional(),
          eventDate: z.string().optional(),
          guestCount: z.number().optional(),
          message: z.string().min(1),
          language: z.enum(["fr", "en"]),
        })
      )
      .mutation(async ({ input }) => {
        await saveContactSubmission({
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          subject: input.subject || null,
          eventType: input.eventType || null,
          eventDate: input.eventDate ? new Date(input.eventDate) : null,
          guestCount: input.guestCount || null,
          message: input.message,
          language: input.language,
          status: "new",
        });

        // Also save as lead
        await saveLead({
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          eventType: input.eventType || null,
          eventDate: input.eventDate ? new Date(input.eventDate) : null,
          guestCount: input.guestCount || null,
          message: input.message,
          source: "contact_form",
          language: input.language,
          status: "new",
        });

        return { success: true };
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          language: z.enum(["fr", "en"]),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await saveNewsletterSubscription({
            email: input.email,
            name: input.name || null,
            language: input.language,
            isActive: true,
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: "Email already subscribed" };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function to generate bot responses
function generateBotResponse(message: string, language: "fr" | "en"): string {
  const lowerMessage = message.toLowerCase();

  const responses = {
    fr: {
      greeting: "Bonjour! Je suis l'assistant virtuel de Les Touillés. Comment puis-je vous aider aujourd'hui?",
      menu: "Nous offrons une grande variété de plats: soupes, plats préparés, viandes, légumes, desserts et boîtes à lunch. Que souhaitez-vous commander?",
      catering: "Nous offrons des services de traiteur pour mariages, événements corporatifs et fêtes privées. Combien d'invités attendez-vous?",
      contact: "Vous pouvez nous joindre au (514) 123-4567 ou par email à info@lestouilles.ca. Préférez-vous qu'on vous contacte?",
      default: "Je comprends. Puis-je avoir votre nom et email pour qu'un membre de notre équipe vous contacte?",
    },
    en: {
      greeting: "Hello! I'm the Les Touillés virtual assistant. How can I help you today?",
      menu: "We offer a wide variety of dishes: soups, prepared dishes, meats, vegetables, desserts and lunch boxes. What would you like to order?",
      catering: "We offer catering services for weddings, corporate events and private parties. How many guests are you expecting?",
      contact: "You can reach us at (514) 123-4567 or by email at info@lestouilles.ca. Would you prefer us to contact you?",
      default: "I understand. May I have your name and email so a member of our team can contact you?",
    },
  };

  const lang = responses[language];

  if (lowerMessage.includes("bonjour") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return lang.greeting;
  }
  if (lowerMessage.includes("menu") || lowerMessage.includes("plat") || lowerMessage.includes("dish")) {
    return lang.menu;
  }
  if (lowerMessage.includes("traiteur") || lowerMessage.includes("catering") || lowerMessage.includes("événement") || lowerMessage.includes("event")) {
    return lang.catering;
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("téléphone") || lowerMessage.includes("phone")) {
    return lang.contact;
  }

  return lang.default;
}

// Helper function to check if message contains lead information
function checkIfLeadInfo(message: string): boolean {
  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/;
  return emailRegex.test(message) || phoneRegex.test(message);
}
