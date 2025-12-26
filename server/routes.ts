import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { aiOrchestrator } from "./services/ai_orchestrator";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
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

  // Register OpenAI integrations
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Auto-register admin user for demo purposes if not exists
  const adminUsername = "admin";
  const adminPassword = "password123";
  const existingAdmin = await storage.getUserByUsername(adminUsername);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await storage.createUser({
      id: "admin-uuid-fixed",
      username: adminUsername,
      password: hashedPassword
    });
    console.log(`Auto-registered ${adminUsername} user with password: ${adminPassword}`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await storage.updateUser(existingAdmin.id, { password: hashedPassword });
    console.log(`Updated ${adminUsername} password to: ${adminPassword}`);
  }

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

  // SSE Endpoint
  app.get('/api/sse', (req, res) => {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on('close', () => {
      clients = clients.filter(c => c.id !== clientId);
    });
  });

  // Webhook Verification (Meta)
  app.get('/webhook', async (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // In a real app, verify against stored token. 
    // For now, accept if token matches env or DB.
    // We'll check against DB for "whatsapp" channel.
    const whatsappConfig = await storage.getChannel("whatsapp");
    const verifyToken = whatsappConfig?.verifyToken || process.env.META_VERIFY_TOKEN;

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400); // Bad Request if no params
    }
  });

  // Webhook Event Handler (Meta)
  app.post('/webhook', async (req, res) => {
    const body = req.body;
    
    // Log incoming webhook
    console.log("Incoming Webhook:", JSON.stringify(body, null, 2));

    if (body.object) {
      // Basic parsing for WhatsApp Cloud API structure
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const changes = body.entry[0].changes[0].value;
        const messageData = changes.messages[0];
        const contactData = changes.contacts[0];
        
        const phone = contactData.wa_id;
        const text = messageData.text?.body || "";
        const platformMessageId = messageData.id;

        // 1. Get or Create Contact
        let contact = await storage.getContactByPhone(phone);
        if (!contact) {
          contact = await storage.createContact({
            name: contactData.profile?.name || phone,
            phone: phone,
            platform: "whatsapp",
            metadata: {}
          });
        }

        // 2. Get or Create Conversation
        let conversation = await storage.getConversationByContactId(contact.id);
        if (!conversation) {
          conversation = await storage.createConversation({
            contactId: contact.id,
            channel: "whatsapp",
            status: "active",
            botStatus: true
          });
        }

        // 3. Save User Message
        const userMsg = await storage.createMessage({
          conversationId: conversation.id,
          content: text,
          role: "user",
          platformMessageId: platformMessageId,
          metadata: {}
        });

        // Broadcast to frontend
        broadcast('new_message', userMsg);

        // 4. AI Processing (if enabled and not paused)
        if (conversation.botStatus) {
          // Check for handover
          if (aiOrchestrator.shouldHandoverToAgent(text)) {
            await storage.updateBotStatus(conversation.id, false);
            await storage.updateConversationStatus(conversation.id, "agent_paused");
            
            // Notify agent
            const systemMsg = await storage.createMessage({
              conversationId: conversation.id,
              content: "Agent requested. AI paused.",
              role: "system",
              metadata: {}
            });
            broadcast('new_message', systemMsg);

          } else {
            // Generate AI Response
            // In a real app, context would come from previous messages (history)
            const context = "You are a helpful assistant for a business."; 
            const aiResponseText = await aiOrchestrator.generateResponse(text, context);
            
            // Save AI Message
            const aiMsg = await storage.createMessage({
              conversationId: conversation.id,
              content: aiResponseText,
              role: "assistant",
              metadata: {}
            });
            broadcast('new_message', aiMsg);

            // TODO: Send back to WhatsApp API
            // await metaService.sendMessage(phone, aiResponseText);
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  // === API ROUTES ===

  app.get(api.contacts.list.path, async (req, res) => {
    const result = await storage.getContacts();
    res.json(result);
  });

  app.get(api.contacts.get.path, async (req, res) => {
    const result = await storage.getContact(Number(req.params.id));
    if (!result) return res.sendStatus(404);
    res.json(result);
  });

  app.post(api.contacts.create.path, async (req, res) => {
    const input = api.contacts.create.input.parse(req.body);
    const result = await storage.createContact(input);
    res.status(201).json(result);
  });

  app.get(api.conversations.list.path, async (req, res) => {
    const result = await storage.getConversations();
    res.json(result);
  });

  app.get(api.conversations.get.path, async (req, res) => {
    const result = await storage.getConversation(Number(req.params.id));
    if (!result) return res.sendStatus(404);
    res.json(result);
  });

  app.patch(api.conversations.toggleBot.path, async (req, res) => {
    const { botStatus } = req.body;
    const result = await storage.updateBotStatus(Number(req.params.id), botStatus);
    res.json(result);
  });

  app.get(api.messages.list.path, async (req, res) => {
    const result = await storage.getMessages(Number(req.params.id));
    res.json(result);
  });

  app.post(api.messages.create.path, async (req, res) => {
    const input = api.messages.create.input.parse(req.body);
    const result = await storage.createMessage({
      ...input,
      conversationId: Number(req.params.id)
    });
    
    broadcast('new_message', result);
    
    res.status(201).json(result);
  });

  app.get(api.channels.list.path, async (req, res) => {
    const result = await storage.getChannels();
    res.json(result);
  });

  app.put(api.channels.update.path, async (req, res) => {
    const platform = req.params.platform;
    const input = api.channels.update.input.parse(req.body);
    
    // Check if exists, if not create (upsert logic for channels usually better)
    let channel = await storage.getChannel(platform);
    if (channel) {
      channel = await storage.updateChannel(platform, input);
    } else {
      // Need full config for create, but update input is partial. 
      // Simplified for this demo:
      if (input.accessToken && input.verifyToken) {
        channel = await storage.createChannel({ 
          platform, 
          accessToken: input.accessToken, 
          verifyToken: input.verifyToken,
          phoneNumberId: input.phoneNumberId
        });
      } else {
        return res.status(400).json({ message: "Missing fields for creation" });
      }
    }
    res.json(channel);
  });

  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = registerSchema.parse(req.body);
      const user = await registerUser(username, password);
      const token = generateToken({ userId: user.id, username: user.username });
      res.status(201).json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await loginUser(username, password);
      const token = generateToken({ userId: user.id, username: user.username });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : "Invalid credentials" });
    }
  });

  // Social accounts endpoints
  app.get("/api/social-accounts", authMiddleware as any, async (req: AuthRequest, res) => {
    try {
      const accounts = await storage.getSocialAccounts(req.userId!);
      // Ensure we always have the demo accounts for all platforms if none exist
      if (accounts.length === 0) {
        const demoAccounts = [
          { id: 100, platform: "whatsapp", accountName: "Demo WhatsApp", accountId: "demo_wa", isConnected: true, userId: req.userId! },
          { id: 101, platform: "instagram", accountName: "Demo Instagram", accountId: "demo_ig", isConnected: true, userId: req.userId! },
          { id: 102, platform: "facebook", accountName: "Demo Facebook", accountId: "demo_fb", isConnected: true, userId: req.userId! }
        ];
        return res.json(demoAccounts);
      }
      res.json(accounts);
    } catch {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  // Widgets endpoints
  app.get("/api/widgets", authMiddleware as any, async (req: AuthRequest, res) => {
    try {
      let widgets = await storage.getWidgets(req.userId!);
      if (widgets.length === 0) {
        // Create default widgets for new user
        const defaults = [
          { userId: req.userId!, type: "stats", title: "Estadísticas Generales", position: 0 },
          { userId: req.userId!, type: "social_feed", title: "Feed Reciente", position: 1 },
          { userId: req.userId!, type: "activity", title: "Actividad del Bot", position: 2 },
          { userId: req.userId!, type: "quick_actions", title: "Acciones Rápidas", position: 3 },
        ];
        for (const w of defaults) {
          await storage.createWidget(w);
        }
        widgets = await storage.getWidgets(req.userId!);
      }
      res.json(widgets);
    } catch {
      res.status(500).json({ error: "Failed to fetch widgets" });
    }
  });

  app.patch("/api/widgets/:id", authMiddleware as any, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const widget = await storage.updateWidget(id, req.body);
      res.json(widget);
    } catch {
      res.status(500).json({ error: "Failed to update widget" });
    }
  });

  app.post("/api/social-accounts/connect", authMiddleware as any, async (req: AuthRequest, res) => {
    try {
      const account = await storage.createSocialAccount({
        userId: req.userId!,
        platform: req.body.platform,
        accountId: req.body.accountId,
        accountName: req.body.accountName,
        accessToken: req.body.accessToken,
        refreshToken: req.body.refreshToken,
      });
      res.status(201).json(account);
    } catch {
      res.status(500).json({ error: "Failed to connect account" });
    }
  });

  // Publish endpoint
  app.post("/api/publish", authMiddleware as any, async (req: AuthRequest, res) => {
    try {
      const { platform, content, image } = req.body;
      const account = await storage.getSocialAccount(req.userId!, platform);
      
      if (!account) {
        return res.status(404).json({ error: "Account not connected" });
      }

      let result;
      if (platform === "instagram") {
        result = await publishToInstagram(account.accessToken, account.accountId, { content, image });
      } else if (platform === "facebook") {
        result = await publishToFacebook(account.accessToken, account.accountId, { content, image });
      } else if (platform === "whatsapp") {
        result = await sendWhatsAppMessage(account.accessToken, account.accountId, "", content);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Publishing failed" });
    }
  });

  return httpServer;
}
