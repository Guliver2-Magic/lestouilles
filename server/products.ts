/**
 * Stripe Products Configuration
 * This file defines the products available for purchase
 */

export const DELIVERY_FEE = 10_00; // $10.00 in cents
export const TAX_RATE = 0.14975; // Quebec tax rate (TPS + TVQ)

export interface Product {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  price: number; // in cents
  category: string;
}

// Products are managed in the menu data file
// This file is for Stripe-specific configuration
