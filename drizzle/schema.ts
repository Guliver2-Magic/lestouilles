import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Chatbot conversations table
 * Stores all chat messages between users and the bot
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  message: text("message").notNull(),
  sender: mysqlEnum("sender", ["user", "bot"]).notNull(),
  language: varchar("language", { length: 10 }).default("fr").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Leads table
 * Stores customer information collected through chatbot or contact forms
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  eventType: varchar("eventType", { length: 100 }),
  eventDate: timestamp("eventDate"),
  guestCount: int("guestCount"),
  message: text("message"),
  source: mysqlEnum("source", ["chatbot", "contact_form"]).notNull(),
  language: varchar("language", { length: 10 }).default("fr").notNull(),
  sessionId: varchar("sessionId", { length: 255 }),
  status: mysqlEnum("status", ["new", "contacted", "converted", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Contact form submissions table
 * Stores all contact form submissions
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  eventType: varchar("eventType", { length: 100 }),
  eventDate: timestamp("eventDate"),
  guestCount: int("guestCount"),
  message: text("message").notNull(),
  language: varchar("language", { length: 10 }).default("fr").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Newsletter subscriptions table
 */
export const newsletterSubscriptions = mysqlTable("newsletterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  language: varchar("language", { length: 10 }).default("fr").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;

/**
 * Orders table
 * Stores customer orders with delivery information
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  
  // Customer information
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  
  // Delivery information
  deliveryMethod: mysqlEnum("deliveryMethod", ["pickup", "delivery", "uber_eats"]).notNull(),
  deliveryDate: timestamp("deliveryDate").notNull(),
  deliveryTime: varchar("deliveryTime", { length: 20 }).notNull(),
  deliveryAddress: text("deliveryAddress"),
  deliveryInstructions: text("deliveryInstructions"),
  
  // Order details
  subtotal: int("subtotal").notNull(), // in cents
  tax: int("tax").notNull(), // in cents
  deliveryFee: int("deliveryFee").default(0).notNull(), // in cents
  total: int("total").notNull(), // in cents
  
  // Payment information (Stripe IDs only)
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  
  // Order status
  status: mysqlEnum("status", ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]).default("pending").notNull(),
  
  // Metadata
  language: varchar("language", { length: 10 }).default("fr").notNull(),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table
 * Stores individual items in each order
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  
  // Product information (snapshot at time of order)
  productId: varchar("productId", { length: 100 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productCategory: varchar("productCategory", { length: 100 }).notNull(),
  productImage: text("productImage"),
  
  // Pricing
  unitPrice: int("unitPrice").notNull(), // in cents
  quantity: int("quantity").notNull(),
  subtotal: int("subtotal").notNull(), // in cents
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Event reservations table
 * Stores event booking requests for weddings, corporate events, and private parties
 */
export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  
  // Customer information
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  
  // Event details
  eventType: mysqlEnum("eventType", ["wedding", "corporate", "private_party", "other"]).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  eventTime: varchar("eventTime", { length: 10 }).notNull(), // e.g., "18:00"
  guestCount: int("guestCount").notNull(),
  
  // Venue and requirements
  venue: varchar("venue", { length: 500 }),
  specialRequirements: text("specialRequirements"),
  dietaryRestrictions: text("dietaryRestrictions"),
  
  // Budget and status
  estimatedBudget: int("estimatedBudget"), // in cents
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  
  // Admin notes
  adminNotes: text("adminNotes"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

/**
 * Products table
 * Stores all menu items with complete information
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  
  // Basic information
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  
  // Classification
  category: varchar("category", { length: 100 }).notNull(), // sandwiches, salades, plats-principaux, etc.
  subcategory: varchar("subcategory", { length: 100 }),
  
  // Pricing
  price: int("price").notNull(), // in cents
  servingSize: varchar("servingSize", { length: 100 }), // e.g., "8-10 personnes"
  
  // Images
  image: text("image").notNull(),
  imageAlt: varchar("imageAlt", { length: 255 }),
  
  // Dietary information
  isVegetarian: boolean("isVegetarian").default(false).notNull(),
  isVegan: boolean("isVegan").default(false).notNull(),
  isGlutenFree: boolean("isGlutenFree").default(false).notNull(),
  isDairyFree: boolean("isDairyFree").default(false).notNull(),
  
  // Nutritional information
  calories: int("calories"),
  protein: int("protein"), // in grams
  carbs: int("carbs"), // in grams
  fat: int("fat"), // in grams
  nutritionalTip: text("nutritionalTip"),
  nutritionalTipEn: text("nutritionalTipEn"),
  
  // Availability and status
  isVisible: boolean("isVisible").default(true).notNull(), // Show/hide product (stock, seasonal)
  isCateringOnly: boolean("isCateringOnly").default(false).notNull(), // Special order only, not available online
  showDietaryTags: boolean("showDietaryTags").default(true).notNull(), // Display dietary tags on product card
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Daily specials table
 * Stores featured dishes that change daily/weekly
 */
export const dailySpecials = mysqlTable("dailySpecials", {
  id: int("id").autoincrement().primaryKey(),
  
  // Product reference (optional - can be null for custom specials)
  productId: int("productId"),
  
  // Custom special information (overrides product if provided)
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  
  // Pricing (can be different from regular product price)
  price: int("price").notNull(), // in cents
  originalPrice: int("originalPrice"), // in cents, for showing discount
  
  // Image
  image: text("image").notNull(),
  imageAlt: varchar("imageAlt", { length: 255 }),
  
  // Availability
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  
  // Display order
  displayOrder: int("displayOrder").default(0).notNull(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailySpecial = typeof dailySpecials.$inferSelect;
export type InsertDailySpecial = typeof dailySpecials.$inferInsert;

/**
 * FAQ (Frequently Asked Questions) table
 * Stores predefined questions and answers for instant chatbot responses
 */
export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  
  // Question and answer in both languages
  questionFr: text("questionFr").notNull(),
  questionEn: text("questionEn").notNull(),
  answerFr: text("answerFr").notNull(),
  answerEn: text("answerEn").notNull(),
  
  // Keywords for matching (comma-separated, lowercase)
  keywordsFr: text("keywordsFr").notNull(), // e.g., "horaire,heure,ouvert,fermeture"
  keywordsEn: text("keywordsEn").notNull(), // e.g., "hours,open,close,schedule"
  
  // Category for organization
  category: varchar("category", { length: 100 }).notNull(), // e.g., "hours", "delivery", "allergens", "pricing"
  
  // Display order and status
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = typeof faqs.$inferInsert;

/**
 * Meal Plans table
 * Stores weekly meal plans created by users
 */
export const mealPlans = mysqlTable("mealPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // References users.id
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Ma semaine du 20 jan"
  weekStartDate: timestamp("weekStartDate").notNull(), // Monday of the week
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = archived
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = typeof mealPlans.$inferInsert;

/**
 * Meal Plan Items table
 * Stores individual meal selections within a meal plan
 */
export const mealPlanItems = mysqlTable("mealPlanItems", {
  id: int("id").autoincrement().primaryKey(),
  mealPlanId: int("mealPlanId").notNull(), // References mealPlans.id
  productId: int("productId").notNull(), // References products.id
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Monday, 1=Tuesday, ..., 6=Sunday
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]).notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MealPlanItem = typeof mealPlanItems.$inferSelect;
export type InsertMealPlanItem = typeof mealPlanItems.$inferInsert;
