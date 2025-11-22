import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Helper to generate unique future dates for tests (within 2 years)
// Uses current timestamp to ensure each test gets a truly unique date
let dateCounter = 0;
function getUniqueFutureDate(offsetDays: number = 0): string {
  const now = Date.now();
  dateCounter++;
  // Each call gets a unique day by combining offset, counter, and milliseconds
  const uniqueDays = offsetDays + dateCounter + (now % 100);
  const futureDate = new Date(now + uniqueDays * 24 * 60 * 60 * 1000);
  return futureDate.toISOString();
}

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
      eventDate: getUniqueFutureDate(100),
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
      eventDate: getUniqueFutureDate(200),
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
      eventDate: getUniqueFutureDate(300),
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

describe("reservations.getReservedDates", () => {
  it("returns list of reserved dates for pending and confirmed reservations", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Create two reservations for different dates
    await caller.reservations.create({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "514-555-1234",
      eventType: "wedding",
      eventDate: getUniqueFutureDate(400),
      eventTime: "18:00",
      guestCount: 100,
      language: "en",
    });

    await caller.reservations.create({
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "514-555-5678",
      eventType: "corporate",
      eventDate: getUniqueFutureDate(500),
      eventTime: "19:00",
      guestCount: 50,
      language: "en",
    });

    const reservedDates = await caller.reservations.getReservedDates();

    expect(reservedDates).toContain("2027-12-25");
    expect(reservedDates).toContain("2027-12-31");
    expect(reservedDates.length).toBeGreaterThanOrEqual(2);
  });
});

describe("reservations double booking prevention", () => {
  it("prevents double booking on the same date", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const sameDate = getUniqueFutureDate(600);

    // Create first reservation
    await caller.reservations.create({
      customerName: "First Customer",
      customerEmail: "first@example.com",
      customerPhone: "514-555-1111",
      eventType: "wedding",
      eventDate: sameDate,
      eventTime: "18:00",
      guestCount: 100,
      language: "en",
    });

    // Attempt to create second reservation on same date
    await expect(
      caller.reservations.create({
        customerName: "Second Customer",
        customerEmail: "second@example.com",
        customerPhone: "514-555-2222",
        eventType: "corporate",
        eventDate: sameDate,
        eventTime: "19:00",
        guestCount: 50,
        language: "en",
      })
    ).rejects.toThrow("This date is already reserved");
  });

  it("allows booking on same date after cancellation", async () => {
    const adminCtx = createAdminContext();
    const publicCtx = createPublicContext();
    const adminCaller = appRouter.createCaller(adminCtx);
    const publicCaller = appRouter.createCaller(publicCtx);

    const cancelDate = getUniqueFutureDate(700);

    // Create first reservation
    await publicCaller.reservations.create({
      customerName: "First Customer",
      customerEmail: "first-cancel@example.com",
      customerPhone: "514-555-1111",
      eventType: "wedding",
      eventDate: cancelDate,
      eventTime: "18:00",
      guestCount: 100,
      language: "en",
    });

    // Get the reservation and cancel it
    const reservations = await adminCaller.reservations.listAll();
    const reservation = reservations.find(r => r.customerEmail === "first-cancel@example.com");
    expect(reservation).toBeDefined();

    await adminCaller.reservations.updateStatus({
      id: reservation!.id,
      status: "cancelled",
    });

    // Now should be able to book the same date
    const result = await publicCaller.reservations.create({
      customerName: "Second Customer",
      customerEmail: "second-after-cancel@example.com",
      customerPhone: "514-555-2222",
      eventType: "corporate",
      eventDate: cancelDate,
      eventTime: "19:00",
      guestCount: 50,
      language: "en",
    });

    expect(result).toEqual({ success: true });
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
      eventDate: getUniqueFutureDate(800),
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
