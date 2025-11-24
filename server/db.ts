import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  conversations,
  InsertConversation,
  leads,
  InsertLead,
  contactSubmissions,
  InsertContactSubmission,
  newsletterSubscriptions,
  InsertNewsletterSubscription,
  dailySpecials,
  InsertDailySpecial,
  DailySpecial,
  faqs,
  FAQ
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Conversation helpers
export async function saveConversation(conversation: InsertConversation) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(conversations).values(conversation);
  return result;
}

export async function getConversationsBySessionId(sessionId: string) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId))
    .orderBy(conversations.createdAt);

  return result;
}

// Lead helpers
export async function saveLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(leads).values(lead);
  return result;
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const result = await db
    .select()
    .from(leads)
    .orderBy(leads.createdAt);

  return result;
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "converted" | "closed") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id));

  return result;
}

// Contact submission helpers
export async function saveContactSubmission(submission: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(contactSubmissions).values(submission);
  return result;
}

export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const result = await db
    .select()
    .from(contactSubmissions)
    .orderBy(contactSubmissions.createdAt);

  return result;
}

// Newsletter subscription helpers
export async function saveNewsletterSubscription(subscription: InsertNewsletterSubscription) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(newsletterSubscriptions).values(subscription);
    return result;
  } catch (error) {
    // Handle duplicate email
    console.error("[Database] Failed to save newsletter subscription:", error);
    throw error;
  }
}

export async function unsubscribeNewsletter(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .update(newsletterSubscriptions)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(eq(newsletterSubscriptions.email, email));

  return result;
}

// Reservation helpers
export async function createReservation(reservation: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: "wedding" | "corporate" | "private_party" | "other";
  eventDate: Date;
  eventTime: string;
  guestCount: number;
  venue?: string;
  specialRequirements?: string;
  dietaryRestrictions?: string;
  estimatedBudget?: number;
  status?: "pending" | "confirmed" | "cancelled";
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { reservations } = await import("../drizzle/schema");
  
  const result = await db.insert(reservations).values({
    customerName: reservation.customerName,
    customerEmail: reservation.customerEmail,
    customerPhone: reservation.customerPhone,
    eventType: reservation.eventType,
    eventDate: reservation.eventDate,
    eventTime: reservation.eventTime,
    guestCount: reservation.guestCount,
    venue: reservation.venue || null,
    specialRequirements: reservation.specialRequirements || null,
    dietaryRestrictions: reservation.dietaryRestrictions || null,
    estimatedBudget: reservation.estimatedBudget || null,
    status: reservation.status || "pending",
  });

  // Return the inserted ID (cast result to any to access insertId)
  const insertId = (result as any).insertId || 0;
  return {
    insertId: Number(insertId),
  };
}

export async function getAllReservations() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const { reservations } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  
  const result = await db
    .select()
    .from(reservations)
    .orderBy(desc(reservations.eventDate));

  return result;
}

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const { reservations } = await import("../drizzle/schema");
  
  const result = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateReservationStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { reservations } = await import("../drizzle/schema");
  
  const result = await db
    .update(reservations)
    .set({ status })
    .where(eq(reservations.id, id));

  return result;
}

export async function getReservationsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const { reservations } = await import("../drizzle/schema");
  const { and, gte, lte } = await import("drizzle-orm");
  
  const result = await db
    .select()
    .from(reservations)
    .where(
      and(
        gte(reservations.eventDate, startDate),
        lte(reservations.eventDate, endDate)
      )
    )
    .orderBy(reservations.eventDate);

  return result;
}

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getAllProducts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  const { products } = await import("../drizzle/schema");
  const result = await db.select().from(products).orderBy(products.displayOrder, products.name);
  return result;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return undefined;
  }

  const { products } = await import("../drizzle/schema");
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveProducts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get active products: database not available");
    return [];
  }

  const { products } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  const result = await db.select().from(products)
    .where(and(
      eq(products.isActive, true),
      eq(products.isVisible, true)
    ))
    .orderBy(products.displayOrder, products.name);
  return result;
}

export async function getProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products by category: database not available");
    return [];
  }

  const { products } = await import("../drizzle/schema");
  const result = await db.select().from(products)
    .where(eq(products.category, category))
    .orderBy(products.displayOrder, products.name);
  return result;
}

export async function createProduct(product: {
  name: string;
  nameEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  category: string;
  subcategory?: string | null;
  price: number;
  servingSize?: string | null;
  image: string;
  imageAlt?: string | null;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  nutritionalTip?: string | null;
  nutritionalTipEn?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create product: database not available");
    return undefined;
  }

  const { products } = await import("../drizzle/schema");
  const result = await db.insert(products).values(product);
  return result;
}

export async function updateProduct(id: number, updates: {
  name?: string;
  nameEn?: string | null;
  description?: string;
  descriptionEn?: string | null;
  category?: string;
  subcategory?: string | null;
  price?: number;
  servingSize?: string | null;
  image?: string;
  imageAlt?: string | null;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  nutritionalTip?: string | null;
  nutritionalTipEn?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update product: database not available");
    return undefined;
  }

  const { products } = await import("../drizzle/schema");
  const result = await db.update(products).set(updates).where(eq(products.id, id));
  return result;
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete product: database not available");
    return undefined;
  }

  const { products } = await import("../drizzle/schema");
  const result = await db.delete(products).where(eq(products.id, id));
  return result;
}


// ============================================
// Daily Specials Database Helpers
// ============================================

export async function getAllDailySpecials() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get daily specials: database not available");
    return [];
  }
  return await db.select().from(dailySpecials);
}

export async function getActiveDailySpecials() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get active daily specials: database not available");
    return [];
  }
  
  const now = new Date();
  const result = await db.select().from(dailySpecials);
  
  // Filter active specials within date range
  return result.filter(special => 
    special.isActive && 
    new Date(special.startDate) <= now && 
    new Date(special.endDate) >= now
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getDailySpecialById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get daily special: database not available");
    return undefined;
  }
  
  const result = await db.select().from(dailySpecials).where(eq(dailySpecials.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDailySpecial(special: InsertDailySpecial) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create daily special: database not available");
    throw new Error("Database not available");
  }
  
  const result = await db.insert(dailySpecials).values(special);
  return result;
}

export async function updateDailySpecial(id: number, special: Partial<InsertDailySpecial>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update daily special: database not available");
    throw new Error("Database not available");
  }
  
  await db.update(dailySpecials).set(special).where(eq(dailySpecials.id, id));
  return await getDailySpecialById(id);
}

export async function deleteDailySpecial(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete daily special: database not available");
    throw new Error("Database not available");
  }
  
  await db.delete(dailySpecials).where(eq(dailySpecials.id, id));
  return { success: true };
}

// ==================== FAQ Functions ====================

/**
 * Get all active FAQs
 */
export async function getAllFAQs() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get FAQs: database not available");
    return [];
  }
  
  const result = await db.select().from(faqs).where(eq(faqs.isActive, 1)).orderBy(faqs.displayOrder);
  return result;
}

/**
 * Search FAQ by message content using keyword matching
 * Returns the best matching FAQ or null if no match found
 */
export async function searchFAQ(message: string, language: "fr" | "en" = "fr"): Promise<FAQ | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search FAQ: database not available");
    return null;
  }
  
  // Get all active FAQs
  const allFAQs = await getAllFAQs();
  if (allFAQs.length === 0) {
    return null;
  }
  
  // Normalize message: lowercase and remove accents
  const normalizedMessage = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // Score each FAQ based on keyword matches
  const scoredFAQs = allFAQs.map((faq) => {
    const keywords = language === "fr" ? faq.keywordsFr : faq.keywordsEn;
    const keywordList = keywords.split(",").map(k => k.trim().toLowerCase());
    
    // Count how many keywords are found in the message
    let score = 0;
    for (const keyword of keywordList) {
      if (normalizedMessage.includes(keyword)) {
        score++;
      }
    }
    
    return { faq, score };
  });
  
  // Sort by score (highest first)
  scoredFAQs.sort((a, b) => b.score - a.score);
  
  // Return the best match if score > 0
  const bestMatch = scoredFAQs[0];
  if (bestMatch && bestMatch.score > 0) {
    return bestMatch.faq;
  }
  
  return null;
}

/**
 * Get FAQ by ID
 */
export async function getFAQById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get FAQ: database not available");
    return undefined;
  }
  
  const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
