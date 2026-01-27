import type { Express } from "express";
import type { Server } from "http";
import { users as usersTable } from "@shared/schema";
import { db } from "./db";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import twilioRoutes from "./routes/twilio";
import aiRoutes from "./routes/ai";
import whatsappRoutes from "./routes/whatsapp";
import retellRoutes from "./routes/retell";
import { getAIProviderStatus } from "./services/openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

async function analyzeSentiment(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Analyze the sentiment of this text. Return only one word: 'positive', 'negative', or 'neutral'." },
        { role: "user", content: text }
      ]
    });
    const sentiment = response.choices[0].message.content?.toLowerCase().trim();
    if (sentiment && ['positive', 'negative', 'neutral'].includes(sentiment)) return sentiment;
    return 'neutral';
  } catch (e) {
    console.error("AI Error:", e);
    return 'neutral';
  }
}

async function generateResponse(text: string, sentiment: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `You are a helpful customer support agent. The customer is feeling ${sentiment}. Draft a polite, concise response.` },
        { role: "user", content: text }
      ]
    });
    return response.choices[0].message.content || "I am unable to generate a response at this time.";
  } catch (e) {
    console.error("AI Error:", e);
    return "Thank you for your message. How can I assist you today?";
  }
}

import { projects as projectsTable, purchaseOrders as purchaseOrdersTable, salesGroups as salesGroupsTable, socialAccounts as socialAccountsTable, insertProjectSchema, insertPurchaseOrderSchema, insertSalesGroupSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Projects API ===
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await db.select().from(projectsTable);
      res.json(projects);
    } catch (e) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const parsed = insertProjectSchema.parse(req.body);
      const [project] = await db.insert(projectsTable).values(parsed).returning();
      res.json(project);
    } catch (e) {
      res.status(400).json({ message: "Invalid project input" });
    }
  });

  // === Purchase Orders API ===
  app.get("/api/purchase-orders", async (_req, res) => {
    try {
      const orders = await db.select().from(purchaseOrdersTable);
      res.json(orders);
    } catch (e) {
      res.status(500).json({ message: "Error fetching purchase orders" });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const parsed = insertPurchaseOrderSchema.parse(req.body);
      const [order] = await db.insert(purchaseOrdersTable).values(parsed).returning();
      res.status(201).json(order);
    } catch (e) {
      console.error("OC Create Error:", e);
      res.status(400).json({ message: "Invalid purchase order input" });
    }
  });

  // === Sales Groups API ===
  app.get("/api/sales-groups", async (_req, res) => {
    try {
      const groups = await db.select().from(salesGroupsTable);
      res.json(groups);
    } catch (e) {
      res.status(500).json({ message: "Error fetching sales groups" });
    }
  });

  app.post("/api/sales-groups", async (req, res) => {
    try {
      const parsed = insertSalesGroupSchema.parse(req.body);
      const [group] = await db.insert(salesGroupsTable).values(parsed).returning();
      res.json(group);
    } catch (e) {
      res.status(400).json({ message: "Invalid sales group input" });
    }
  });

  // === Channels API ===
  app.get("/api/channels", async (_req, res) => {
    try {
      const channels = await db.select().from(socialAccountsTable);
      res.json(channels);
    } catch (e) {
      res.status(500).json({ message: "Error fetching channels" });
    }
  });

  app.patch("/api/channels/:platform", async (req, res) => {
    try {
      const [account] = await db.update(socialAccountsTable)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(socialAccountsTable.platform, req.params.platform))
        .returning();
      res.json(account);
    } catch (e) {
      res.status(400).json({ message: "Error updating channel" });
    }
  });
  app.use("/api", twilioRoutes);
  app.use("/api", aiRoutes);
  app.use("/api", whatsappRoutes);

  // === Support Tickets API ===
  app.get("/api/tickets", async (_req, res) => {
    const tickets = await storage.getTickets();
    res.json(tickets);
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticket = await storage.createTicket(req.body);
      res.status(201).json(ticket);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch("/api/tickets/:id", async (req, res) => {
    try {
      const ticket = await storage.updateTicket(Number(req.params.id), req.body);
      res.json(ticket);
    } catch (e) {
      res.status(400).json({ message: "Invalid update" });
    }
  });
  app.get("/api/ai/status", (req, res) => {
    res.json(getAIProviderStatus());
  });

  // === Users API ===
  app.get("/api/users", async (_req, res) => {
    try {
      const allUsers = await db.select().from(usersTable);
      res.json(allUsers);
    } catch (e) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // === API Routes ===

  app.get(api.conversations.list.path, async (req, res) => {
    const conversations = await storage.getConversations();
    res.json(conversations);
  });

  app.get(api.conversations.get.path, async (req, res) => {
    const conversation = await storage.getConversation(Number(req.params.id));
    if (!conversation) return res.status(404).json({ message: "Not found" });
    res.json(conversation);
  });

  app.get(api.conversations.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages(Number(req.params.id));
    res.json(messages);
  });

  app.post(api.conversations.messages.create.path, async (req, res) => {
    try {
      const input = api.conversations.messages.create.input.parse(req.body);
      const message = await storage.createMessage({
        conversationId: Number(req.params.id),
        content: input.content,
        role: "agent",
        sentiment: "neutral"
      });
      res.status(201).json(message);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.conversations.analyze.path, async (req, res) => {
    const messages = await storage.getMessages(Number(req.params.id));
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage) return res.json({ sentiment: "neutral", suggestedResponse: "" });

    const sentiment = await analyzeSentiment(lastMessage.content);
    const suggestedResponse = await generateResponse(lastMessage.content, sentiment);

    res.json({ sentiment, suggestedResponse });
  });

  // === Webhooks ===

  app.get(api.webhooks.metaVerify.path, (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === (process.env.META_VERIFY_TOKEN || 'replit_token')) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  });

  app.post(api.webhooks.meta.path, async (req, res) => {
    // Basic handling of WhatsApp/Meta webhook
    try {
      const body = req.body;
      if (body.object) {
        // Process entries... 
        // For MVP, we'll log it. In production, we'd parse entry[0].changes[0].value.messages
        console.log("Received webhook:", JSON.stringify(body, null, 2));
      }
      res.status(200).send('EVENT_RECEIVED');
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });
  
  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getUserByUsername("admin");
  if (!users) {
    await storage.createUser({ username: "admin", password: "password", role: "admin" });
    
    const contact = await storage.createContact({
      platform: "whatsapp",
      platformId: "1234567890",
      name: "Alice Customer",
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
    });

    const conv = await storage.createConversation({
      contactId: contact.id,
      channel: "whatsapp",
      status: "active"
    });

    await storage.createMessage({
      conversationId: conv.id,
      content: "Hello, I have an issue with my order.",
      role: "user",
      sentiment: "negative"
    });
    
    await storage.createMessage({
      conversationId: conv.id,
      content: "Hi Alice, I can help with that. What is your order ID?",
      role: "agent",
      sentiment: "neutral"
    });
  }
}
