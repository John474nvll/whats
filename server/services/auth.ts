
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.SESSION_SECRET || 'dev-secret-key';
const JWT_EXPIRY = '7d';

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

export async function registerUser(username: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
    },
  });

  return user;
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  return user;
}
