/**
 * Local Authentication Helper
 * Provides password hashing and JWT token management for local authentication
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "./env";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d"; // 7 days

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: TokenPayload): string {
  if (!ENV.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(payload, ENV.jwtSecret, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!ENV.jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }
    const decoded = jwt.verify(token, ENV.jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Generate a random token for email verification or password reset
 */
export function generateRandomToken(): string {
  return require("crypto").randomBytes(32).toString("hex");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}
