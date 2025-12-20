import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { aiOrchestrator } from "./services/ai_orchestrator";

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

  return httpServer;
}
