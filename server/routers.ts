import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { sendLeadToN8n } from "./_core/n8n";
import { z } from "zod";
import {
  saveConversation,
  getConversationsBySessionId,
  saveLead,
  saveContactSubmission,
  saveNewsletterSubscription,
  searchFAQ,
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
  auth: authRouter,

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

        // Get conversation history for context
        const conversationHistory = await getConversationsBySessionId(input.sessionId);
        
        // Format history for n8n (last 10 messages for context)
        const formattedHistory = conversationHistory
          .slice(-10)
          .map((conv) => ({
            role: conv.sender === "user" ? "user" : "assistant",
            content: conv.message,
          }));

        // First, check if there's a FAQ match for instant response
        const faqMatch = await searchFAQ(input.message, input.language);
        
        let botResponse: { response: string; shouldCaptureLead: boolean };
        
        if (faqMatch) {
          // Use FAQ answer for instant response
          const answer = input.language === "fr" ? faqMatch.answerFr : faqMatch.answerEn;
          botResponse = {
            response: answer,
            shouldCaptureLead: false,
          };
          console.log(`[FAQ] Matched FAQ #${faqMatch.id} for message: ${input.message.substring(0, 50)}...`);
        } else {
          // No FAQ match, get bot response from n8n webhook
          botResponse = await getBotResponseFromN8n({
            sessionId: input.sessionId,
            message: input.message,
            language: input.language,
            conversationHistory: formattedHistory,
          });
        }

        // Save bot response
        await saveConversation({
          sessionId: input.sessionId,
          message: botResponse.response,
          sender: "bot",
          language: input.language,
        });

        // Check if we should trigger n8n webhook for lead capture
        if (botResponse.shouldCaptureLead || checkIfLeadInfo(input.message)) {
          // Send lead data to n8n
          await sendLeadToN8n({
            sessionId: input.sessionId,
            message: input.message,
            language: input.language,
            source: "chatbot",
            timestamp: new Date().toISOString(),
          });
        }

        return { response: botResponse.response };
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
          deliveryMethod: z.enum(["pickup", "delivery", "uber_eats"]),
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

    getItems: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getOrderItems(input.orderId);
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
        const { sendReservationConfirmation } = await import("./emailService");
        
        // Check if date is already reserved
        const existingReservations = await getAllReservations();
        const requestedDate = new Date(input.eventDate).toISOString().split('T')[0];
        const isDateReserved = existingReservations.some(r => {
          const reservationDate = r.eventDate.toISOString().split('T')[0];
          return reservationDate === requestedDate && (r.status === 'pending' || r.status === 'confirmed');
        });
        
        if (isDateReserved) {
          throw new Error(
            input.language === 'fr' 
              ? 'Cette date est deja reservee. Veuillez choisir une autre date.'
              : 'This date is already reserved. Please choose another date.'
          );
        }
        
        const reservationResult = await createReservation({
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

        // Send confirmation email to customer
        try {
          await sendReservationConfirmation({
            reservationId: reservationResult.insertId,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            eventType: input.eventType,
            eventDate: new Date(input.eventDate),
            eventTime: input.eventTime,
            guestCount: input.guestCount,
            venue: input.venue,
            specialRequirements: input.specialRequirements,
            dietaryRestrictions: input.dietaryRestrictions,
            language: input.language,
          });
        } catch (error) {
          console.error("Failed to send reservation confirmation email:", error);
        }

        // Notify owner of new reservation
        const eventTypeLabels = {
          wedding: input.language === "fr" ? "Mariage" : "Wedding",
          corporate: input.language === "fr" ? "Evenement corporatif" : "Corporate event",
          private_party: input.language === "fr" ? "Fete privee" : "Private party",
          other: input.language === "fr" ? "Autre" : "Other",
        };

        const eventDate = new Date(input.eventDate).toLocaleDateString(input.language === "fr" ? "fr-CA" : "en-CA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const notificationContent = `
Nouvelle reservation recue:

Client: ${input.customerName}
Email: ${input.customerEmail}
Telephone: ${input.customerPhone}

Type d'evenement: ${eventTypeLabels[input.eventType]}
Date: ${eventDate}
Heure: ${input.eventTime}
Nombre d'invites: ${input.guestCount}
${input.venue ? `Lieu: ${input.venue}` : ""}
${input.estimatedBudget ? `Budget estime: ${(input.estimatedBudget / 100).toFixed(2)} CAD` : ""}
${input.specialRequirements ? `\nExigences speciales: ${input.specialRequirements}` : ""}
${input.dietaryRestrictions ? `\nRestrictions alimentaires: ${input.dietaryRestrictions}` : ""}
        `.trim();

        try {
          await notifyOwner({
            title: input.language === "fr" ? "Nouvelle reservation d'evenement" : "New event reservation",
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
      return reservations
        .filter(r => r.status === 'pending' || r.status === 'confirmed')
        .map(r => r.eventDate.toISOString().split('T')[0]);
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

  products: router({    
    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const { getAllProducts } = await import("./db");
      return await getAllProducts();
    }),

    listActive: publicProcedure.query(async () => {
      const { getActiveProducts } = await import("./db");
      return await getActiveProducts();
    }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const { getProductsByCategory } = await import("./db");
        return await getProductsByCategory(input.category);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getProductById } = await import("./db");
        return await getProductById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          nameEn: z.string().optional(),
          description: z.string(),
          descriptionEn: z.string().optional(),
          category: z.string(),
          subcategory: z.string().optional(),
          price: z.number(),
          servingSize: z.string().optional(),
          image: z.string(),
          imageAlt: z.string().optional(),
          isVegetarian: z.boolean().optional(),
          isVegan: z.boolean().optional(),
          isGlutenFree: z.boolean().optional(),
          isDairyFree: z.boolean().optional(),
          calories: z.number().optional(),
          protein: z.number().optional(),
          carbs: z.number().optional(),
          fat: z.number().optional(),
          nutritionalTip: z.string().optional(),
          nutritionalTipEn: z.string().optional(),
          isActive: z.boolean().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { createProduct } = await import("./db");
        await createProduct(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          nameEn: z.string().optional(),
          description: z.string().optional(),
          descriptionEn: z.string().optional(),
          category: z.string().optional(),
          subcategory: z.string().optional(),
          price: z.number().optional(),
          servingSize: z.string().optional(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          isVegetarian: z.boolean().optional(),
          isVegan: z.boolean().optional(),
          isGlutenFree: z.boolean().optional(),
          isDairyFree: z.boolean().optional(),
          calories: z.number().optional(),
          protein: z.number().optional(),
          carbs: z.number().optional(),
          fat: z.number().optional(),
          nutritionalTip: z.string().optional(),
          nutritionalTipEn: z.string().optional(),
          isActive: z.boolean().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { id, ...updates } = input;
        const { updateProduct } = await import("./db");
        await updateProduct(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { deleteProduct } = await import("./db");
        await deleteProduct(input.id);
        return { success: true };
      }),

    generateImage: protectedProcedure
      .input(z.object({
        productName: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { generateImage } = await import("./_core/imageGeneration");
        
        const prompt = `A professional, high-quality food photography image of ${input.productName}. ${input.description}. The image should be appetizing, well-lit, and suitable for a catering menu. Shot from a flattering angle with shallow depth of field, professional food styling.`;
        
        const result = await generateImage({ prompt });
        
        return {
          url: result.url,
        };
      }),

    suggestAttributes: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const prompt = `Tu es un expert en nutrition. Analyse ce produit alimentaire et fournis des estimations precises:

Nom: ${input.name}
Description: ${input.description}

Fournis UNIQUEMENT un objet JSON valide (sans markdown, sans \`\`\`) avec cette structure exacte:
{
  "calories": nombre (calories totales),
  "protein": nombre (proteines en grammes),
  "carbs": nombre (glucides en grammes),
  "fat": nombre (lipides en grammes),
  "nutritionalTip": "conseil nutritionnel en francais (1 phrase)",
  "isVegetarian": boolean,
  "isVegan": boolean,
  "isGlutenFree": boolean,
  "isDairyFree": boolean
}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Tu es un expert en nutrition. Tu reponds UNIQUEMENT avec du JSON valide, sans markdown." },
            { role: "user", content: prompt }
          ],
        });

        const content = response.choices[0]?.message?.content;
        const contentStr = typeof content === 'string' ? content : '{}';
        
        const cleanContent = contentStr.replace(/```json\n?|```\n?/g, "").trim();
        
        try {
          const suggestions = JSON.parse(cleanContent);
          return suggestions;
        } catch (error) {
          console.error("Failed to parse LLM response:", cleanContent);
          throw new Error("Failed to generate suggestions");
        }
      }),

    uploadImage: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          base64Data: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        
        const { storagePut } = await import("./storage");
        const { optimizeProductImage } = await import("./_core/imageOptimization");
        
        const buffer = Buffer.from(input.base64Data, 'base64');
        const optimized = await optimizeProductImage(buffer);
        
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const key = `products/${timestamp}-${randomStr}.${optimized.ext}`;
        
        const { url } = await storagePut(key, optimized.buffer, optimized.mimeType);
        
        return { url };
      }),
  }),

  dailySpecials: router({
    getActive: publicProcedure.query(async () => {
      const { getActiveDailySpecials } = await import("./db");
      return await getActiveDailySpecials();
    }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const { getAllDailySpecials } = await import("./db");
      return await getAllDailySpecials();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { getDailySpecialById } = await import("./db");
        return await getDailySpecialById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          productId: z.number().optional(),
          name: z.string(),
          nameEn: z.string().optional(),
          description: z.string(),
          descriptionEn: z.string().optional(),
          price: z.number(),
          originalPrice: z.number().optional(),
          image: z.string(),
          imageAlt: z.string().optional(),
          startDate: z.string(),
          endDate: z.string(),
          isActive: z.boolean().default(true),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { createDailySpecial } = await import("./db");
        return await createDailySpecial({
          ...input,
          productId: input.productId || null,
          nameEn: input.nameEn || null,
          descriptionEn: input.descriptionEn || null,
          originalPrice: input.originalPrice || null,
          imageAlt: input.imageAlt || null,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          productId: z.number().optional(),
          name: z.string().optional(),
          nameEn: z.string().optional(),
          description: z.string().optional(),
          descriptionEn: z.string().optional(),
          price: z.number().optional(),
          originalPrice: z.number().optional(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          isActive: z.boolean().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { id, ...data } = input;
        const { updateDailySpecial } = await import("./db");
        
        const updateData: any = { ...data };
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        
        return await updateDailySpecial(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { deleteDailySpecial } = await import("./db");
        return await deleteDailySpecial(input.id);
      }),
  }),

  faq: router({
    list: publicProcedure.query(async () => {
      const { getAllFAQs } = await import("./db");
      return await getAllFAQs();
    }),

    create: protectedProcedure
      .input(
        z.object({
          questionFr: z.string(),
          questionEn: z.string(),
          answerFr: z.string(),
          answerEn: z.string(),
          keywordsFr: z.string(),
          keywordsEn: z.string(),
          category: z.string(),
          isActive: z.number().default(1),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { faqs } = await import("../drizzle/schema");
        await db.insert(faqs).values(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          questionFr: z.string().optional(),
          questionEn: z.string().optional(),
          answerFr: z.string().optional(),
          answerEn: z.string().optional(),
          keywordsFr: z.string().optional(),
          keywordsEn: z.string().optional(),
          category: z.string().optional(),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { faqs } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const { id, ...data } = input;
        await db.update(faqs).set(data).where(eq(faqs.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { faqs } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.delete(faqs).where(eq(faqs.id, input.id));
        return { success: true };
      }),
  }),

  // ================================================
  // NEW ADMIN ROUTES - Menu Categories
  // ================================================
  menuCategories: router({
    list: publicProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { menuCategories } = await import("../drizzle/schema");
      const { asc } = await import("drizzle-orm");
      return await db.select().from(menuCategories).orderBy(asc(menuCategories.sortOrder));
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          nameEn: z.string().optional(),
          description: z.string().optional(),
          descriptionEn: z.string().optional(),
          image: z.string().optional(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { menuCategories } = await import("../drizzle/schema");
        const { desc } = await import("drizzle-orm");
        
        const [maxOrder] = await db
          .select({ maxSort: menuCategories.sortOrder })
          .from(menuCategories)
          .orderBy(desc(menuCategories.sortOrder))
          .limit(1);
        
        const sortOrder = (maxOrder?.maxSort || 0) + 1;
        
        await db.insert(menuCategories).values({
          ...input,
          sortOrder,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          nameEn: z.string().optional(),
          description: z.string().optional(),
          descriptionEn: z.string().optional(),
          image: z.string().optional(),
          sortOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { menuCategories } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const { id, ...data } = input;
        await db.update(menuCategories).set(data).where(eq(menuCategories.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { menuCategories } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.delete(menuCategories).where(eq(menuCategories.id, input.id));
        return { success: true };
      }),
  }),

  // ================================================
  // NEW ADMIN ROUTES - Testimonials
  // ================================================
  testimonials: router({
    list: publicProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { testimonials } = await import("../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    }),

    listFeatured: publicProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { testimonials } = await import("../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");
      return await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(desc(testimonials.isFeatured), desc(testimonials.createdAt))
        .limit(6);
    }),

    create: protectedProcedure
      .input(
        z.object({
          customerName: z.string(),
          customerTitle: z.string().optional(),
          content: z.string(),
          contentEn: z.string().optional(),
          rating: z.number().min(1).max(5).default(5),
          imageUrl: z.string().optional(),
          isActive: z.boolean().default(true),
          isFeatured: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { testimonials } = await import("../drizzle/schema");
        await db.insert(testimonials).values(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          customerName: z.string().optional(),
          customerTitle: z.string().optional(),
          content: z.string().optional(),
          contentEn: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
          imageUrl: z.string().optional(),
          isActive: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { testimonials } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const { id, ...data } = input;
        await db.update(testimonials).set(data).where(eq(testimonials.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { testimonials } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.delete(testimonials).where(eq(testimonials.id, input.id));
        return { success: true };
      }),
  }),

  // ================================================
  // NEW ADMIN ROUTES - Gallery
  // ================================================
  gallery: router({
    list: publicProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { gallery } = await import("../drizzle/schema");
      const { asc, desc } = await import("drizzle-orm");
      return await db.select().from(gallery).orderBy(asc(gallery.sortOrder), desc(gallery.createdAt));
    }),

    listPublic: publicProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { gallery } = await import("../drizzle/schema");
      const { eq, asc } = await import("drizzle-orm");
      return await db
        .select()
        .from(gallery)
        .where(eq(gallery.isActive, true))
        .orderBy(asc(gallery.sortOrder));
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          titleEn: z.string().optional(),
          description: z.string().optional(),
          descriptionEn: z.string().optional(),
          imageUrl: z.string(),
          category: z.string().default("Plats"),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { gallery } = await import("../drizzle/schema");
        const { desc } = await import("drizzle-orm");
        
        const [maxOrder] = await db
          .select({ maxSort: gallery.sortOrder })
          .from(gallery)
          .orderBy(desc(gallery.sortOrder))
          .limit(1);
        
        const sortOrder = (maxOrder?.maxSort || 0) + 1;
        
        await db.insert(gallery).values({
          ...input,
          sortOrder,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          titleEn: z.string().optional(),
          description: z.string().optional(),
          descriptionEn: z.string().optional(),
          imageUrl: z.string().optional(),
          category: z.string().optional(),
          sortOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { gallery } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const { id, ...data } = input;
        await db.update(gallery).set(data).where(eq(gallery.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { gallery } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.delete(gallery).where(eq(gallery.id, input.id));
        return { success: true };
      }),
  }),

  // ================================================
  // NEW ADMIN ROUTES - Site Settings
  // ================================================
  siteSettings: router({
    get: publicProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { siteSettings } = await import("../drizzle/schema");
      const allSettings = await db.select().from(siteSettings);
      
      const settingsObject: Record<string, any> = {};
      allSettings.forEach((setting) => {
        let value: any = setting.settingValue;
        if (setting.settingType === "json" && value) {
          try {
            value = JSON.parse(value);
          } catch {}
        } else if (setting.settingType === "number" && value) {
          value = parseFloat(value);
        } else if (setting.settingType === "boolean") {
          value = value === "true";
        }
        settingsObject[setting.settingKey] = value;
      });
      
      return settingsObject;
    }),

    update: protectedProcedure
      .input(z.record(z.string(), z.any()))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { siteSettings } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        for (const [key, value] of Object.entries(input)) {
          let settingValue: string;
          let settingType: string = "string";
          
          if (typeof value === "object" && value !== null) {
            settingValue = JSON.stringify(value);
            settingType = "json";
          } else if (typeof value === "number") {
            settingValue = String(value);
            settingType = "number";
          } else if (typeof value === "boolean") {
            settingValue = String(value);
            settingType = "boolean";
          } else {
            settingValue = String(value || "");
          }
          
          const [existing] = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.settingKey, key));
          
          if (existing) {
            await db
              .update(siteSettings)
              .set({ settingValue, settingType })
              .where(eq(siteSettings.settingKey, key));
          } else {
            await db.insert(siteSettings).values({
              settingKey: key,
              settingValue,
              settingType,
            });
          }
        }
        
        return { success: true };
      }),
  }),

  // ================================================
  // NEW ADMIN ROUTES - AI Image Generation
  // ================================================
  ai: router({
    generateImage: protectedProcedure
      .input(
        z.object({
          prompt: z.string(),
          size: z.enum(["1024x1024", "1792x1024", "1024x1792"]).default("1024x1024"),
          quality: z.enum(["standard", "hd"]).default("standard"),
          style: z.enum(["vivid", "natural"]).default("vivid"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key not configured");
        }
        
        try {
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: input.prompt,
            n: 1,
            size: input.size,
            quality: input.quality,
            style: input.style,
          });
          
          const imageUrl = response.data[0]?.url;
          const revisedPrompt = response.data[0]?.revised_prompt;
          
          if (!imageUrl) {
            throw new Error("Failed to generate image");
          }
          
          // Save to database
          const db = await import("./db").then(m => m.getDb());
          if (db) {
            const { aiGeneratedImages } = await import("../drizzle/schema");
            await db.insert(aiGeneratedImages).values({
              prompt: input.prompt,
              revisedPrompt,
              imageUrl,
              model: "dall-e-3",
              size: input.size,
              quality: input.quality,
              style: input.style,
            });
          }
          
          return {
            url: imageUrl,
            revisedPrompt,
          };
        } catch (error: any) {
          if (error?.error?.code === "content_policy_violation") {
            throw new Error("Content policy violation. Please modify your prompt.");
          }
          throw error;
        }
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { aiGeneratedImages } = await import("../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      return await db
        .select()
        .from(aiGeneratedImages)
        .orderBy(desc(aiGeneratedImages.createdAt))
        .limit(50);
    }),

    getSuggestedPrompts: publicProcedure
      .input(z.object({ category: z.string().default("general") }))
      .query(({ input }) => {
        const prompts: Record<string, string[]> = {
          plats: [
            "A beautifully plated gourmet dish with fresh herbs and vegetables, professional food photography, soft lighting",
            "Elegant French cuisine presentation on a white plate, fine dining style, artistic garnish",
            "Rustic homestyle cooking presentation with steam rising, warm cozy atmosphere",
            "Mediterranean feast spread with colorful fresh ingredients, olive oil drizzle, natural lighting",
          ],
          desserts: [
            "Elegant French pastry with chocolate decoration, professional bakery photography",
            "Colorful macarons arranged in artistic pattern, pastel colors, soft focus background",
            "Decadent chocolate cake slice with berry garnish, dark moody food photography",
            "Fresh fruit tart with glazed berries, golden crust, natural daylight",
          ],
          evenements: [
            "Elegant wedding reception buffet setup with floral arrangements, romantic lighting",
            "Corporate event catering display with professional presentation, modern style",
            "Garden party food spread with fresh flowers, outdoor summer setting",
            "Holiday feast table setting with candles and seasonal decorations",
          ],
          equipe: [
            "Professional chef in kitchen preparing gourmet dish, action shot, steam and movement",
            "Friendly catering team in uniform, welcoming pose, professional headshot style",
            "Behind the scenes kitchen preparation, busy restaurant atmosphere",
          ],
          general: [
            "Professional food photography of a catering spread, elegant presentation",
            "Fresh ingredients artistically arranged, farm to table concept",
            "Warm inviting restaurant interior with beautiful table settings",
          ],
        };
        
        return {
          category: input.category,
          prompts: prompts[input.category] || prompts.general,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function to get bot response from n8n webhook
async function getBotResponseFromN8n(data: {
  sessionId: string;
  message: string;
  language: "fr" | "en";
  conversationHistory: Array<{ role: string; content: string }>;
}): Promise<{ response: string; shouldCaptureLead: boolean }> {
  const webhookUrl = ENV.n8nChatbotWebhookUrl;

  if (!webhookUrl) {
    console.warn("N8N_CHATBOT_WEBHOOK_URL not configured, using fallback responses");
    return {
      response: generateFallbackResponse(data.message, data.language),
      shouldCaptureLead: false,
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`);
    }

    const result = await response.json();
    return {
      response: result.response || generateFallbackResponse(data.message, data.language),
      shouldCaptureLead: result.shouldCaptureLead || false,
    };
  } catch (error) {
    console.error("Error calling n8n chatbot webhook:", error);
    return {
      response: generateFallbackResponse(data.message, data.language),
      shouldCaptureLead: false,
    };
  }
}

function generateFallbackResponse(message: string, language: "fr" | "en"): string {
  const lowerMessage = message.toLowerCase();

  const responses = {
    fr: {
      greeting: "Bonjour! Je suis l'assistant virtuel de Les Touilles. Comment puis-je vous aider aujourd'hui?",
      menu: "Nous offrons une grande variete de plats: soupes, plats prepares, viandes, legumes, desserts et boites a lunch. Que souhaitez-vous commander?",
      catering: "Nous offrons des services de traiteur pour mariages, evenements corporatifs et fetes privees. Combien d'invites attendez-vous?",
      contact: "Vous pouvez nous joindre au (514) 123-4567 ou par email a info@lestouilles.ca. Preferez-vous qu'on vous contacte?",
      default: "Je comprends. Puis-je avoir votre nom et email pour qu'un membre de notre equipe vous contacte?",
    },
    en: {
      greeting: "Hello! I'm the Les Touilles virtual assistant. How can I help you today?",
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
  if (lowerMessage.includes("traiteur") || lowerMessage.includes("catering") || lowerMessage.includes("evenement") || lowerMessage.includes("event")) {
    return lang.catering;
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("telephone") || lowerMessage.includes("phone")) {
    return lang.contact;
  }

  return lang.default;
}

function checkIfLeadInfo(message: string): boolean {
  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/;
  return emailRegex.test(message) || phoneRegex.test(message);
}
