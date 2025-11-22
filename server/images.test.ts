import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@lestouilles.com",
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Image Management", () => {
  describe("generateImage", () => {
    it("generates product image based on description", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.generateImage({
        productName: "Brownie au Chocolat",
        description: "Brownie fondant au chocolat noir",
      });

      expect(result).toHaveProperty("url");
      expect(result.url).toMatch(/^https?:\/\//);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createAdminContext();
      ctx.user!.role = "user";
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.products.generateImage({
          productName: "Test Product",
          description: "Test description",
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("uploadImage", () => {
    it("uploads and optimizes image successfully", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a small test image (1x1 red pixel PNG in base64)
      const testImageBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

      const result = await caller.products.uploadImage({
        filename: "test-image.png",
        contentType: "image/png",
        base64Data: testImageBase64,
      });

      expect(result).toHaveProperty("url");
      expect(result.url).toMatch(/^https?:\/\//);
      // Should be converted to WebP
      expect(result.url).toMatch(/\.webp$/);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createAdminContext();
      ctx.user!.role = "user";
      const caller = appRouter.createCaller(ctx);

      const testImageBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

      await expect(
        caller.products.uploadImage({
          filename: "test.png",
          contentType: "image/png",
          base64Data: testImageBase64,
        })
      ).rejects.toThrow("Unauthorized");
    });
  });
});
