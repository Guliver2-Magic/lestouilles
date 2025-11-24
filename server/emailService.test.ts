import { describe, expect, it, vi, beforeEach } from "vitest";
import { sendEmail, sendOrderConfirmation, sendReservationConfirmation } from "./emailService";

// Mock the ENV module
vi.mock("./_core/env", () => ({
  ENV: {
    n8nChatbotWebhookUrl: "https://mock-webhook.example.com/webhook",
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendEmail", () => {
    it("should send email successfully", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        statusText: "OK",
      });

      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Test HTML</p>",
      });

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://mock-webhook.example.com/webhook",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.stringContaining("send_email"),
        })
      );
    });

    it("should return false when fetch fails", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Test HTML</p>",
      });

      expect(result).toBe(false);
    });

    it("should return false when fetch throws error", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Test HTML</p>",
      });

      expect(result).toBe(false);
    });
  });

  describe("sendOrderConfirmation", () => {
    it("should send order confirmation email in French", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        statusText: "OK",
      });

      const result = await sendOrderConfirmation({
        orderNumber: "ORD-12345",
        customerName: "Jean Dupont",
        customerEmail: "jean@example.com",
        items: [
          { name: "Poulet Rôti", quantity: 2, price: 2000 },
          { name: "Salade César", quantity: 1, price: 1200 },
        ],
        subtotal: 5200,
        tax: 780,
        deliveryFee: 500,
        total: 6480,
        deliveryMethod: "delivery",
        deliveryDate: new Date("2025-12-01"),
        deliveryTime: "18:00",
        deliveryAddress: "123 Rue Example, Montréal, QC",
        language: "fr",
      });

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalled();

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      expect(body.email.to).toBe("jean@example.com");
      expect(body.email.subject).toContain("Confirmation de commande");
      expect(body.email.subject).toContain("ORD-12345");
      expect(body.email.html).toContain("Jean Dupont");
      expect(body.email.html).toContain("Poulet Rôti");
    });

    it("should send order confirmation email in English", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        statusText: "OK",
      });

      const result = await sendOrderConfirmation({
        orderNumber: "ORD-12345",
        customerName: "John Smith",
        customerEmail: "john@example.com",
        items: [
          { name: "Roasted Chicken", quantity: 1, price: 2000 },
        ],
        subtotal: 2000,
        tax: 300,
        deliveryFee: 0,
        total: 2300,
        deliveryMethod: "pickup",
        deliveryDate: new Date("2025-12-01"),
        deliveryTime: "12:00",
        language: "en",
      });

      expect(result).toBe(true);
      
      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      expect(body.email.subject).toContain("Order Confirmation");
      expect(body.email.html).toContain("John Smith");
      expect(body.email.html).toContain("Pickup");
    });
  });

  describe("sendReservationConfirmation", () => {
    it("should send reservation confirmation email in French", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        statusText: "OK",
      });

      const result = await sendReservationConfirmation({
        reservationId: 42,
        customerName: "Marie Tremblay",
        customerEmail: "marie@example.com",
        eventType: "wedding",
        eventDate: new Date("2025-06-15"),
        eventTime: "17:00",
        guestCount: 150,
        venue: "Château Frontenac",
        specialRequirements: "Menu végétarien pour 10 personnes",
        dietaryRestrictions: "Sans gluten, sans noix",
        language: "fr",
      });

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalled();

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      expect(body.email.to).toBe("marie@example.com");
      expect(body.email.subject).toContain("Confirmation de réservation");
      expect(body.email.subject).toContain("#42");
      expect(body.email.html).toContain("Marie Tremblay");
      expect(body.email.html).toContain("Mariage");
      expect(body.email.html).toContain("150");
    });

    it("should send reservation confirmation email in English", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        statusText: "OK",
      });

      const result = await sendReservationConfirmation({
        reservationId: 43,
        customerName: "Sarah Johnson",
        customerEmail: "sarah@example.com",
        eventType: "corporate",
        eventDate: new Date("2025-07-20"),
        eventTime: "12:00",
        guestCount: 50,
        venue: "Downtown Convention Center",
        language: "en",
      });

      expect(result).toBe(true);

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      expect(body.email.subject).toContain("Reservation Confirmation");
      expect(body.email.html).toContain("Sarah Johnson");
      expect(body.email.html).toContain("Corporate Event");
    });

    it("should handle missing optional fields", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        statusText: "OK",
      });

      const result = await sendReservationConfirmation({
        reservationId: 44,
        customerName: "Test User",
        customerEmail: "test@example.com",
        eventType: "private_party",
        eventDate: new Date("2025-08-01"),
        eventTime: "19:00",
        guestCount: 30,
        language: "fr",
      });

      expect(result).toBe(true);
      
      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      // Should not contain venue or dietary restrictions sections
      expect(body.email.html).not.toContain("Château");
      expect(body.email.html).toContain("Test User");
    });
  });
});
