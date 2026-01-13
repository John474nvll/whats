
import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { aiOrchestrator } from "./services/ai_orchestrator";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerUnifiedPlatformRoutes } from "./routes/unified-platforms";
import { loginUser, registerUser, generateToken, verifyToken } from "./services/auth";
import { publishToInstagram, publishToFacebook, sendWhatsAppMessage } from "./services/social-publisher";
import { loginSchema, registerSchema } from "@shared/schema";
import { authMiddleware, type AuthRequest } from "./middleware/auth";

// Simple SSE implementation
let clients: { id: number; res: any }[] = [];

function broadcast(event: string, data: any) {
  clients.forEach(client => {
    client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Register integrations
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerUnifiedPlatformRoutes(app);

  // Auto-register demo users for demo purposes if not exists
  const setupDemoUsers = async () => {
    const demoUsers = [
      { username: "socialadmin", password: "SocialAdmin2026!", role: "admin" },
      { username: "ventas_a", password: "VentasA2026!", role: "user" },
      { username: "ventas_b", password: "VentasB2026!", role: "user" },
      { username: "manager", password: "Manager2025", role: "user" },
      { username: "soporte_a", password: "SoporteA2026!", role: "user" },
      { username: "marketing_a", password: "MarketingA2026!", role: "user" },
      { username: "analista_a", password: "AnalistaA2026!", role: "user" },
      { username: "3197368698", password: "AdminPass2025", role: "admin" }
    ];
    
    for (const demoUser of demoUsers) {
      try {
        const existing = await storage.getUserByUsername(demoUser.username);
        const hashedPassword = await bcrypt.hash(demoUser.password, 10);
        
        if (!existing) {
          const { randomUUID } = await import("crypto");
          await storage.createUser({
            id: randomUUID(),
            username: demoUser.username,
            password: hashedPassword,
            role: demoUser.role
          });
          console.log(`Auto-registered ${demoUser.username} as ${demoUser.role}`);
        } else {
          // Always update password in demo/seeding to match expectations
          await storage.updateUser(existing.id, { 
            password: hashedPassword,
            role: demoUser.role 
          });
          console.log(`Updated ${demoUser.username} credentials`);
        }
      } catch (e) {
        console.error(`Error setting up ${demoUser.username}:`, e);
      }
    }
  };
  setupDemoUsers();

  // Seed data
  const channels = await storage.getChannels();
  if (channels.length === 0) {
    await storage.createChannel({
      platform: "whatsapp",
      accessToken: "placeholder",
      verifyToken: "placeholder",
      phoneNumberId: "placeholder"
    });
    console.log("Seeded WhatsApp channel config");
  }

  // ... (resto del archivo sin modificar)

}
