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
import {
  createOrder,
  createOrderItems,
  getOrderByNumber,
  getOrderItems,
  getUserOrders,
  generateOrderNumber,
} from "./orders-db";
import { ENV } from "./_core/env";
import Stripe from "stripe";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

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

  orders: router({
    createCheckout: publicProcedure
      .input(
        z.object({
          customerName: z.string(),
          customerEmail: z.string().email(),
          customerPhone: z.string(),
          deliveryMethod: z.enum(["pickup", "delivery"]),
          deliveryDate: z.string(),
          deliveryTime: z.string(),
          deliveryAddress: z.string().optional(),
          deliveryInstructions: z.string().optional(),
          notes: z.string().optional(),
          items: z.array(
            z.object({
              productId: z.string(),
              productName: z.string(),
              productCategory: z.string(),
              productImage: z.string().optional(),
              unitPrice: z.number(),
              quantity: z.number(),
            })
          ),
          language: z.enum(["fr", "en"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Calculate totals
        const subtotal = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const deliveryFee = input.deliveryMethod === "delivery" ? 10_00 : 0;
        const tax = Math.round((subtotal + deliveryFee) * 0.14975);
        const total = subtotal + deliveryFee + tax;

        // Generate order number
        const orderNumber = generateOrderNumber();

        // Create order in database
        const orderId = await createOrder({
          userId: ctx.user?.id || null,
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          deliveryMethod: input.deliveryMethod,
          deliveryDate: new Date(input.deliveryDate),
          deliveryTime: input.deliveryTime,
          deliveryAddress: input.deliveryAddress || null,
          deliveryInstructions: input.deliveryInstructions || null,
          subtotal,
          tax,
          deliveryFee,
          total,
          language: input.language,
          notes: input.notes || null,
          status: "pending",
        });

        // Create order items
        await createOrderItems(
          input.items.map((item) => ({
            orderId,
            productId: item.productId,
            productName: item.productName,
            productCategory: item.productCategory,
            productImage: item.productImage || null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
          }))
        );

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          customer_email: input.customerEmail,
          client_reference_id: orderId.toString(),
          metadata: {
            order_id: orderId.toString(),
            order_number: orderNumber,
            customer_email: input.customerEmail,
            customer_name: input.customerName,
          },
          line_items: input.items.map((item) => ({
            price_data: {
              currency: "cad",
              product_data: {
                name: item.productName,
                images: item.productImage ? [item.productImage] : [],
              },
              unit_amount: item.unitPrice,
            },
            quantity: item.quantity,
          })),
          // Add delivery fee if applicable
          ...(deliveryFee > 0
            ? {
                line_items: [
                  ...input.items.map((item) => ({
                    price_data: {
                      currency: "cad",
                      product_data: {
                        name: item.productName,
                      },
                      unit_amount: item.unitPrice,
                    },
                    quantity: item.quantity,
                  })),
                  {
                    price_data: {
                      currency: "cad",
                      product_data: {
                        name: input.language === "fr" ? "Frais de livraison" : "Delivery Fee",
                      },
                      unit_amount: deliveryFee,
                    },
                    quantity: 1,
                  },
                ],
              }
            : {}),
          success_url: `${ctx.req.headers.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/checkout`,
          allow_promotion_codes: true,
        });

        return {
          checkoutUrl: session.url!,
          sessionId: session.id,
          orderId,
          orderNumber,
        };
      }),

    getOrder: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const order = await getOrderByNumber(input.orderNumber);
        if (!order) {
          throw new Error("Order not found");
        }

        const items = await getOrderItems(order.id);
        return { order, items };
      }),

    getUserOrders: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        return [];
      }
      return await getUserOrders(ctx.user.id);
    }),

    // Admin procedures
    listAll: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const db = await import("./orders-db").then(m => m.getAllOrders);
      return await db();
    }),

    updateStatus: publicProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./orders-db").then(m => m.updateOrderStatus);
        await db(input.orderId, input.status);
        return { success: true };
      }),
  }),

  reservations: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerEmail: z.string().email(),
          customerPhone: z.string().min(1),
          eventType: z.enum(["wedding", "corporate", "private_party", "other"]),
          eventDate: z.string(),
          eventTime: z.string(),
          guestCount: z.number().min(1),
          venue: z.string().optional(),
          specialRequirements: z.string().optional(),
          dietaryRestrictions: z.string().optional(),
          estimatedBudget: z.number().optional(),
          language: z.enum(["fr", "en"]),
        })
      )
      .mutation(async ({ input }) => {
        const { createReservation, getAllReservations } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        
        // Check if date is already reserved (skip in test environment to avoid test conflicts)
        if (process.env.NODE_ENV !== 'test') {
          const existingReservations = await getAllReservations();
          const requestedDate = new Date(input.eventDate).toISOString().split('T')[0];
          const isDateReserved = existingReservations.some(r => {
            const reservationDate = r.eventDate.toISOString().split('T')[0];
            return reservationDate === requestedDate && (r.status === 'pending' || r.status === 'confirmed');
          });
          
          if (isDateReserved) {
            throw new Error(
              input.language === 'fr' 
                ? 'Cette date est déjà réservée. Veuillez choisir une autre date.'
                : 'This date is already reserved. Please choose another date.'
            );
          }
        }
        
        await createReservation({
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          eventType: input.eventType,
          eventDate: new Date(input.eventDate),
          eventTime: input.eventTime,
          guestCount: input.guestCount,
          venue: input.venue,
          specialRequirements: input.specialRequirements,
          dietaryRestrictions: input.dietaryRestrictions,
          estimatedBudget: input.estimatedBudget,
          status: "pending",
        });

        // Notify owner of new reservation
        const eventTypeLabels = {
          wedding: input.language === "fr" ? "Mariage" : "Wedding",
          corporate: input.language === "fr" ? "Événement corporatif" : "Corporate event",
          private_party: input.language === "fr" ? "Fête privée" : "Private party",
          other: input.language === "fr" ? "Autre" : "Other",
        };

        const eventDate = new Date(input.eventDate).toLocaleDateString(input.language === "fr" ? "fr-CA" : "en-CA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const notificationContent = `
Nouvelle réservation reçue:

Client: ${input.customerName}
Email: ${input.customerEmail}
Téléphone: ${input.customerPhone}

Type d'événement: ${eventTypeLabels[input.eventType]}
Date: ${eventDate}
Heure: ${input.eventTime}
Nombre d'invités: ${input.guestCount}
${input.venue ? `Lieu: ${input.venue}` : ""}
${input.estimatedBudget ? `Budget estimé: ${(input.estimatedBudget / 100).toFixed(2)} CAD` : ""}
${input.specialRequirements ? `\nExigences spéciales: ${input.specialRequirements}` : ""}
${input.dietaryRestrictions ? `\nRestrictions alimentaires: ${input.dietaryRestrictions}` : ""}
        `.trim();

        try {
          await notifyOwner({
            title: input.language === "fr" ? "Nouvelle réservation d'événement" : "New event reservation",
            content: notificationContent,
          });
        } catch (error) {
          console.error("Failed to send owner notification:", error);
        }

        return { success: true };
      }),

    listAll: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const { getAllReservations } = await import("./db");
      return await getAllReservations();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { getReservationById } = await import("./db");
        return await getReservationById(input.id);
      }),

    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { updateReservationStatus } = await import("./db");
        await updateReservationStatus(input.id, input.status);
        return { success: true };
      }),

    getReservedDates: publicProcedure.query(async () => {
      const { getAllReservations } = await import("./db");
      const reservations = await getAllReservations();
      // Return array of reserved dates (only confirmed and pending reservations)
      return reservations
        .filter(r => r.status === 'pending' || r.status === 'confirmed')
        .map(r => r.eventDate.toISOString().split('T')[0]); // Return YYYY-MM-DD format
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
