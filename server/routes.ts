import type { Express } from "express";
import type { Server } from "http";
import * as schema from "@shared/schema";
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
import { desc, eq } from "drizzle-orm";

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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Register route modules ===
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

  // === Purchase Orders API ===

  app.get("/api/orders", async (_req, res) => {
    const orders = await storage.getPurchaseOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getPurchaseOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(order);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = await storage.createPurchaseOrder(req.body);
      res.status(201).json(order);
    } catch (e) {
      res.status(400).json({ message: "Error al crear orden" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updatePurchaseOrder(Number(req.params.id), req.body);
      res.json(order);
    } catch (e) {
      res.status(400).json({ message: "Error al actualizar orden" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      await storage.deletePurchaseOrder(Number(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(400).json({ message: "Error al eliminar orden" });
    }
  });

  // === Funnels API ===

  app.get("/api/funnels", async (_req, res) => {
    try {
      const funnels = await storage.getFunnels();
      res.json(funnels);
    } catch (e) {
      res.status(500).json({ message: "Error al obtener funnels" });
    }
  });

  app.get("/api/funnels/:id", async (req, res) => {
    const funnel = await storage.getFunnel(Number(req.params.id));
    if (!funnel) return res.status(404).json({ message: "Funnel no encontrado" });
    res.json(funnel);
  });

  app.post("/api/funnels", async (req, res) => {
    try {
      const funnel = await storage.createFunnel(req.body);
      res.status(201).json(funnel);
    } catch (e) {
      res.status(400).json({ message: "Error al crear funnel" });
    }
  });

  app.patch("/api/funnels/:id", async (req, res) => {
    try {
      const funnel = await storage.updateFunnel(Number(req.params.id), req.body);
      res.json(funnel);
    } catch (e) {
      res.status(400).json({ message: "Error al actualizar funnel" });
    }
  });

  app.delete("/api/funnels/:id", async (req, res) => {
    try {
      await storage.deleteFunnel(Number(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(400).json({ message: "Error al eliminar funnel" });
    }
  });

  app.post("/api/funnels/:id/duplicate", async (req, res) => {
    try {
      const original = await storage.getFunnel(Number(req.params.id));
      if (!original) return res.status(404).json({ message: "Funnel no encontrado" });
      const copy = await storage.createFunnel({
        name: `${original.name} (Copia)`,
        description: original.description,
        type: original.type,
        stages: original.stages,
      });
      res.status(201).json(copy);
    } catch (e) {
      res.status(400).json({ message: "Error al duplicar funnel" });
    }
  });

  // === Voice & Twilio API ===

  app.get("/api/twilio/status", async (_req, res) => {
    const config = await storage.getVoiceConfig("twilio");
    res.json({ isConnected: config?.isConnected || false, phoneNumbers: config?.phoneNumbers || [] });
  });

  app.post("/api/twilio/configure", async (req, res) => {
    try {
      const { accountSid, authToken } = req.body;
      const config = await storage.upsertVoiceConfig("twilio", {
        provider: "twilio",
        accountSid,
        authToken,
        isConnected: true,
      });
      res.json(config);
    } catch (e) {
      res.status(400).json({ message: "Error al configurar Twilio" });
    }
  });

  app.get("/api/twilio/numbers", async (_req, res) => {
    const config = await storage.getVoiceConfig("twilio");
    res.json(config?.phoneNumbers || []);
  });

  app.post("/api/twilio/sync-numbers", async (_req, res) => {
    res.json({ message: "Sincronización simulada - números obtenidos de Twilio" });
  });

  app.get("/api/retell/status", async (_req, res) => {
    const config = await storage.getVoiceConfig("retell");
    res.json({ isConnected: config?.isConnected || false });
  });

  app.post("/api/retell/configure", async (req, res) => {
    try {
      const { apiKey } = req.body;
      const config = await storage.upsertVoiceConfig("retell", {
        provider: "retell",
        apiKey,
        isConnected: true,
      });
      res.json(config);
    } catch (e) {
      res.status(400).json({ message: "Error al configurar Retell" });
    }
  });

  app.get("/api/retell/agents", async (_req, res) => {
    const agents = await storage.getVoiceAgents();
    res.json(agents);
  });

  app.post("/api/retell/agents", async (req, res) => {
    try {
      const agent = await storage.createVoiceAgent(req.body);
      res.status(201).json(agent);
    } catch (e) {
      res.status(400).json({ message: "Error al crear agente" });
    }
  });

  app.get("/api/voice/calls", async (_req, res) => {
    const calls = await storage.getCallLogs();
    res.json(calls);
  });

  // === Sync & Widgets API ===

  app.get("/api/sync/status", async (_req, res) => {
    const logs = await db.select().from(schema.syncLogs).orderBy(desc(schema.syncLogs.createdAt)).limit(10);
    res.json(logs);
  });

  app.post("/api/sync/github", async (req, res) => {
    try {
      // Simular sincronización con GitHub v12
      await db.insert(schema.syncLogs).values({
        platform: "github",
        status: "success",
        message: "Sincronizado con v12 exitosamente",
        metadata: { version: "12.0.0", timestamp: new Date().toISOString() }
      });
      res.json({ message: "Sincronización con v12 completada" });
    } catch (e) {
      res.status(500).json({ message: "Error en sincronización" });
    }
  });

  app.get("/api/widgets", async (_req, res) => {
    const widgets = await db.select().from(schema.widgets).where(eq(schema.widgets.isActive, true));
    res.json(widgets);
  });

  app.post("/api/widgets", async (req, res) => {
    try {
      const widgetData = {
        ...req.body,
        config: req.body.config || {}
      } as any;
      const widget = await db.insert(schema.widgets).values(widgetData).returning();
      res.status(201).json(widget[0]);
    } catch (e) {
      res.status(400).json({ message: "Error al crear widget" });
    }
  });

  app.get("/api/sales-groups", async (_req, res) => {
    try {
      const groups = await db.select().from(schema.salesGroups);
      res.json(groups);
    } catch (e) {
      res.status(500).json({ message: "Error al obtener grupos de ventas" });
    }
  });

  app.post("/api/sales-groups", async (req, res) => {
    try {
      const group = await db.insert(schema.salesGroups).values(req.body).returning();
      res.status(201).json(group[0]);
    } catch (e) {
      res.status(400).json({ message: "Error al crear grupo de ventas" });
    }
  });

  // === Channels API ===

  app.get(api.channels.list.path, async (_req, res) => {
    const channels = await storage.getChannelConfigs();
    res.json(channels);
  });

  app.put(api.channels.update.path, async (req, res) => {
    try {
      const { platform } = req.params;
      const channel = await storage.upsertChannelConfig(platform, req.body);
      res.json(channel);
    } catch (e) {
      res.status(400).json({ message: "Invalid update" });
    }
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
