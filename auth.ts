
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { storage } from "../storage";

const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret-key";
const JWT_EXPIRY = "7d";

export interface AuthPayload {
  userId: string;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function setupDemoAccounts() {
  const adminUsername = "socialadmin";
  const managerUsername = "manager";

  try {
    const admin = await storage.getUserByUsername(adminUsername);
    if (!admin) {
      const hashedPassword = await hashPassword("SocialPass2025");
      await storage.createUser({
        id: randomUUID(),
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
        botId: "default",
      });
    }

    const manager = await storage.getUserByUsername(managerUsername);
    if (!manager) {
      const hashedPassword = await hashPassword("Manager2025");
      await storage.createUser({
        id: randomUUID(),
        username: managerUsername,
        password: hashedPassword,
        role: "manager",
        botId: "default",
      });
    }
  } catch (err) {
    console.error("Error setting up demo accounts:", err);
  }
}

export async function registerUser(username: string, password: string, botId: string) {
  const existing = await storage.getUserByUsername(username);
  if (existing) throw new Error("Username already exists");

  const hashedPassword = await hashPassword(password);
  const user = await storage.createUser({
    id: randomUUID(),
    username,
    password: hashedPassword,
    botId,
    role: "user",
  });

  return user;
}

export async function loginUser(username: string, password: string) {
  const user = await storage.getUserByUsername(username);
  if (!user) throw new Error("Invalid credentials");

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return user;
}
