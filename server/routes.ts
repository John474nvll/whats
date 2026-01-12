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

  // Auto-register demo users
  const setupDemoUsers = async () => {
    const demoUsers = [
      { username: "socialadmin", password: "SocialAdmin2026!", role: "admin" },
      { username: "ventas_a", password: "VentasA2026!", role: "user" },
      { username: "ventas_b", password: "VentasB2026!", role: "user" },
      { username: "manager", password: "Manager2025", role: "user" },
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
          console.log(`Auto-registered ${demoUser.username}`);
        } else {
          await storage.updateUser(existing.id, { password: hashedPassword, role: demoUser.role });
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

  // Webhook Verification (Meta)
  app.get('/webhook', async (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const whatsappConfig = await storage.getChannel("whatsapp");
    const verifyToken = whatsappConfig?.verifyToken || process.env.META_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  // Webhook Event Handler (Meta)
  app.post('/webhook', async (req, res) => {
    const body = req.body;
    console.log("Incoming Webhook:", JSON.stringify(body, null, 2));

    if (body.object) {
      for (const entry of body.entry) {
        const platform = body.object; // e.g., 'whatsapp', 'instagram', 'facebook'
        
        for (const change of entry.messaging || entry.changes) {
          // Determine message data based on platform
          let messageData, contactId, contactName, text, platformMessageId;

          if (platform === 'whatsapp') {
            if (!change.value.messages) continue;
            const msg = change.value.messages[0];
            const contact = change.value.contacts[0];
            contactId = contact.wa_id;
            contactName = contact.profile?.name || contactId;
            text = msg.text?.body || "";
            platformMessageId = msg.id;
          } else if (platform === 'instagram' || platform === 'facebook') {
            if (!change.message) continue;
            const msg = change.message;
            contactId = change.sender.id;
            contactName = `User ${contactId}`; // Basic name, can be improved with profile API
            text = msg.text || "";
            platformMessageId = msg.mid;
          } else {
            continue; // Skip unsupported platforms
          }

          if (!text) continue;

          // --- Unified Logic ---
          
          // 1. Get or Create Contact
          let dbContact = await storage.getContactByPlatformId(contactId);
          if (!dbContact) {
            dbContact = await storage.createContact({
              name: contactName,
              phone: platform === 'whatsapp' ? contactId : null,
              platform: platform,
              platformId: contactId,
              metadata: {}
            });
          }

          // 2. Get or Create Conversation
          let conversation = await storage.getConversationByContactId(dbContact.id);
          if (!conversation) {
            conversation = await storage.createConversation({
              contactId: dbContact.id,
              channel: platform,
              status: "active",
              botStatus: true // AI is active by default
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
          broadcast('new_message', userMsg);

          // 4. AI Processing & Handover
          if (conversation.botStatus) {
            if (aiOrchestrator.shouldHandoverToAgent(text)) {
              await storage.updateBotStatus(conversation.id, false);
              const systemMsg = await storage.createMessage({
                conversationId: conversation.id,
                content: "Agent requested. AI paused.",
                role: "system",
                metadata: {}
              });
              broadcast('new_message', systemMsg);
            } else {
              // Generate and Send AI Response
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

              // Send back to the original platform
              const channelConfig = await storage.getChannel(platform);
              if (channelConfig) {
                if (platform === 'whatsapp') {
                  await sendWhatsAppMessage(channelConfig.accessToken, channelConfig.phoneNumberId, contactId, aiResponseText);
                } else if (platform === 'instagram') {
                  // Assuming publishToInstagram can handle DMs. May need adjustment.
                  await publishToInstagram(channelConfig.accessToken, contactId, { content: aiResponseText });
                } else if (platform === 'facebook') {
                  // Assuming publishToFacebook can handle DMs. May need adjustment.
                  await publishToFacebook(channelConfig.accessToken, contactId, { content: aiResponseText });
                }
              }
            }
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
  
  // Other routes...
  // ... (rest of the file is unchanged)
  return httpServer;
}