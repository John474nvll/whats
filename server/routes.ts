
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
import { loginSchema, registerSchema, insertCustomerSchema } from "@shared/schema";
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

  // API routes (sin authMiddleware)
  app.get("/api/customers", async (req, res) => {
    // @ts-ignore
    const customers = await storage.getCustomers(req.user?.id || ""); // Se debe adaptar según la lógica de negocio
    res.json(customers);
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
       // @ts-ignore
      const newCustomer = await storage.createCustomer({ ...customerData, userId: req.user?.id || "" }); // Se debe adaptar
      res.status(201).json(newCustomer);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ message: e.errors[0].message, field: e.errors[0].path[0] });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteCustomer(id);
    res.status(204).send();
  });

  app.get(api.contacts.list.path, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post(api.contacts.create.path, async (req, res) => {
    try {
      const contact = api.contacts.create.input.parse(req.body);
      const newContact = await storage.createContact(contact);
      res.status(201).json(newContact);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ message: e.errors[0].message, field: e.errors[0].path[0] });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.conversations.list.path, async (req, res) => {
    const conversations = await storage.getConversations();
    res.json(conversations);
  });

  app.get(api.conversations.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const conversation = await storage.getConversation(id);
    if (conversation) {
      res.json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  });

  app.get(api.messages.list.path, async (req, res) => {
    const id = Number(req.params.id);
    const messages = await storage.getMessages(id);
    res.json(messages);
  });

  app.post(api.messages.create.path, async (req, res) => {
    try {
      const conversationId = Number(req.params.id);
      const messageData = api.messages.create.input.parse(req.body);
      const newMessage = await storage.createMessage({ ...messageData, conversationId });
      res.status(201).json(newMessage);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ message: e.errors[0].message, field: e.errors[0].path[0] });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.patch(api.conversations.toggleBot.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { botStatus } = api.conversations.toggleBot.input.parse(req.body);
      const updatedConversation = await storage.updateBotStatus(id, botStatus);
      res.json(updatedConversation);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ message: e.errors[0].message, field: e.errors[0].path[0] });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // ... (resto del archivo sin modificar)
  return httpServer;
}
