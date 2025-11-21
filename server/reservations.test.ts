import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@lestouilles.ca",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("reservations.create", () => {
  it("creates a new reservation successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservations.create({
      customerName: "Jean Dupont",
      customerEmail: "jean.dupont@example.com",
      customerPhone: "514-555-1234",
      eventType: "wedding",
      eventDate: new Date("2025-06-15").toISOString(),
      eventTime: "18:00",
      guestCount: 150,
      venue: "Château Vaudreuil",
      specialRequirements: "Vegetarian options needed",
      dietaryRestrictions: "2 guests with gluten intolerance",
      estimatedBudget: 5000 * 100, // $5000 in cents
      language: "fr",
    });

    expect(result).toEqual({ success: true });
  });

  it("creates a corporate event reservation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservations.create({
      customerName: "Marie Tremblay",
      customerEmail: "marie.tremblay@company.com",
      customerPhone: "514-555-5678",
      eventType: "corporate",
      eventDate: new Date("2025-07-20").toISOString(),
      eventTime: "12:00",
      guestCount: 50,
      venue: "Office Building Downtown",
      language: "en",
    });

    expect(result).toEqual({ success: true });
  });

  it("creates a private party reservation without optional fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservations.create({
      customerName: "Pierre Martin",
      customerEmail: "pierre.martin@example.com",
      customerPhone: "514-555-9999",
      eventType: "private_party",
      eventDate: new Date("2025-08-10").toISOString(),
      eventTime: "19:00",
      guestCount: 30,
      language: "fr",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("reservations.listAll", () => {
  it("allows admin to list all reservations", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reservations.listAll();

    expect(Array.isArray(result)).toBe(true);
  });

  it("prevents non-admin from listing reservations", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.reservations.listAll()).rejects.toThrow("Unauthorized");
  });
});

describe("reservations.updateStatus", () => {
  it("allows admin to update reservation status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a reservation
    await caller.reservations.create({
      customerName: "Test User",
      customerEmail: "test@example.com",
      customerPhone: "514-555-0000",
      eventType: "wedding",
      eventDate: new Date("2025-09-01").toISOString(),
      eventTime: "17:00",
      guestCount: 100,
      language: "fr",
    });

    // Update status (using ID 1 as example - in real scenario we'd get the actual ID)
    const result = await caller.reservations.updateStatus({
      id: 1,
      status: "confirmed",
    });

    expect(result).toEqual({ success: true });
  });

  it("prevents non-admin from updating reservation status", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reservations.updateStatus({
        id: 1,
        status: "confirmed",
      })
    ).rejects.toThrow("Unauthorized");
  });
});
