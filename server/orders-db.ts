import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { orders, orderItems, InsertOrder, InsertOrderItem } from "../drizzle/schema";

export async function createOrder(orderData: InsertOrder) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(orders).values(orderData);
  return result[0].insertId;
}

export async function createOrderItems(items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.insert(orderItems).values(items);
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

export async function updateOrderPayment(orderId: number, paymentIntentId: string, customerId?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateData: any = {
    stripePaymentIntentId: paymentIntentId,
    status: "confirmed",
  };

  if (customerId) {
    updateData.stripeCustomerId = customerId;
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LT-${timestamp}-${random}`;
}
