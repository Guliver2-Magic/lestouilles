import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { DailySpecial } from "../drizzle/schema";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("dailySpecials.getActive", () => {
  it("allows public access to active daily specials", async () => {
    const ctx: TrpcContext = {
      user: undefined,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.dailySpecials.getActive();

    expect(Array.isArray(result)).toBe(true);
    // Should only return active specials within date range
    result.forEach((special) => {
      expect(special.isActive).toBe(true);
      const now = new Date();
      expect(new Date(special.startDate) <= now).toBe(true);
      expect(new Date(special.endDate) >= now).toBe(true);
    });
  });
});

describe("dailySpecials.getAll", () => {
  it("allows admin to get all daily specials", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dailySpecials.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("denies regular users from getting all daily specials", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dailySpecials.getAll()).rejects.toThrow("Unauthorized");
  });
});

describe("dailySpecials.create", () => {
  it("allows admin to create a daily special", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const input = {
      name: "Test Special",
      nameEn: "Test Special EN",
      description: "A test daily special",
      descriptionEn: "A test daily special EN",
      price: 1500, // $15.00
      originalPrice: 2000, // $20.00
      image: "https://example.com/image.jpg",
      imageAlt: "Test image",
      startDate: now.toISOString(),
      endDate: nextWeek.toISOString(),
      isActive: true,
      displayOrder: 0,
    };

    const result = await caller.dailySpecials.create(input);
    expect(result).toBeDefined();
  });

  it("denies regular users from creating daily specials", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const input = {
      name: "Test Special",
      description: "A test daily special",
      price: 1500,
      image: "https://example.com/image.jpg",
      startDate: now.toISOString(),
      endDate: nextWeek.toISOString(),
      isActive: true,
      displayOrder: 0,
    };

    await expect(caller.dailySpecials.create(input)).rejects.toThrow("Unauthorized");
  });
});

describe("dailySpecials.update", () => {
  it("allows admin to update a daily special", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a special
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await caller.dailySpecials.create({
      name: "Original Name",
      description: "Original description",
      price: 1500,
      image: "https://example.com/image.jpg",
      startDate: now.toISOString(),
      endDate: nextWeek.toISOString(),
      isActive: true,
      displayOrder: 0,
    });

    // Get all specials to find the ID
    const allSpecials = await caller.dailySpecials.getAll();
    const testSpecial = allSpecials.find((s) => s.name === "Original Name");
    
    if (testSpecial) {
      // Update the special
      const updated = await caller.dailySpecials.update({
        id: testSpecial.id,
        name: "Updated Name",
        price: 1800,
      });

      expect(updated?.name).toBe("Updated Name");
      expect(updated?.price).toBe(1800);
    }
  });

  it("denies regular users from updating daily specials", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.dailySpecials.update({
        id: 1,
        name: "Updated Name",
      })
    ).rejects.toThrow("Unauthorized");
  });
});

describe("dailySpecials.delete", () => {
  it("allows admin to delete a daily special", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a special
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await caller.dailySpecials.create({
      name: "To Delete",
      description: "Will be deleted",
      price: 1500,
      image: "https://example.com/image.jpg",
      startDate: now.toISOString(),
      endDate: nextWeek.toISOString(),
      isActive: true,
      displayOrder: 0,
    });

    // Get all specials to find the ID
    const allSpecials = await caller.dailySpecials.getAll();
    const testSpecial = allSpecials.find((s) => s.name === "To Delete");

    if (testSpecial) {
      // Delete the special
      const result = await caller.dailySpecials.delete({ id: testSpecial.id });
      expect(result.success).toBe(true);

      // Verify it's deleted
      const afterDelete = await caller.dailySpecials.getAll();
      const deleted = afterDelete.find((s) => s.id === testSpecial.id);
      expect(deleted).toBeUndefined();
    }
  });

  it("denies regular users from deleting daily specials", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dailySpecials.delete({ id: 1 })).rejects.toThrow("Unauthorized");
  });
});
