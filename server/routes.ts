
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { registerPlatformRoutes } from "./routes/platforms";
import voiceRouter from "./routes/voice"; // Import the new voice router

const openai = new OpenAI({
  apiKey: "gpt4free-dummy-key",
  baseURL: "http://localhost:8080/v1", // <-- USER: Replace with your gpt4free server URL
});

async function analyzeSentiment(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Analyze the sentiment of this text. Return only one word: 'positive', 'negative', or 'neutral'.'" },
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
      model: "gpt-4o-mini",
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

  // === API Routes ===
  registerPlatformRoutes(app);
  app.use("/api/voice", voiceRouter); // Register the voice routes

  // Conversations
  app.get(api.conversations.list.path, async (req, res) => {
    const conversations = await storage.getConversations();
    res.json(conversations);
  });

  app.get(api.conversations.get.path, async (req, res) => {
    const conversation = await storage.getConversation(Number(req.params.id));
    if (!conversation) return res.status(404).json({ message: "Not found" });
    res.json(conversation);
  });

  // Messages
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

  // AI
  app.post(api.conversations.analyze.path, async (req, res) => {
    const messages = await storage.getMessages(Number(req.params.id));
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage) return res.json({ sentiment: "neutral", suggestedResponse: "" });

    const sentiment = await analyzeSentiment(lastMessage.content);
    const suggestedResponse = await generateResponse(lastMessage.content, sentiment);

    res.json({ sentiment, suggestedResponse });
  });

  app.post('/api/ai/generate/content', async (req, res) => {
    try {
      const { topic, platform, type } = req.body;
      const prompt = `Generate a social media ${type} for ${platform} about ${topic}.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert social media content creator." },
          { role: "user", content: prompt }
        ]
      });

      const content = response.choices[0].message.content;
      
      const hashtagResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
              { role: "system", content: "You are a hashtag generation expert." },
              { role: "user", content: `Generate 5 relevant hashtags for a post about: ${content}` }
          ]
      });
      const hashtags = hashtagResponse.choices[0].message.content;

      res.json({ content, hashtags });

    } catch (e) {
      console.error("AI Content Generation Error:", e);
      res.status(500).json({ message: "Error generating content." });
    }
  });

  app.post('/api/ai/generate/image', async (req, res) => {
      try {
          const { prompt } = req.body;
  
          const response = await openai.images.generate({
              model: "dall-e-3",
              prompt: prompt,
              n: 1,
              size: "1024x1024",
          });
  
          const imageUrl = response.data[0].url;
          res.json({ imageUrl });
  
      } catch (e) {
          console.error("AI Image Generation Error:", e);
          res.status(500).json({ message: "Error generating image." });
      }
  });

  // Contacts
  app.get('/api/contacts', async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post('/api/contacts', async (req, res) => {
    const newContact = await storage.createContact(req.body);
    res.status(201).json(newContact);
  });

  app.put('/api/contacts/:id', async (req, res) => {
    const updatedContact = await storage.updateContact(Number(req.params.id), req.body);
    if (!updatedContact) return res.status(404).json({ message: "Contact not found" });
    res.json(updatedContact);
  });

  app.delete('/api/contacts/:id', async (req, res) => {
    await storage.deleteContact(Number(req.params.id));
    res.status(204).send();
  });

  // Customers
  app.get('/api/customers', async (req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  });

  app.post('/api/customers', async (req, res) => {
    const newCustomer = await storage.createCustomer(req.body);
    res.status(201).json(newCustomer);
  });

  app.put('/api/customers/:id', async (req, res) => {
    const updatedCustomer = await storage.updateCustomer(Number(req.params.id), req.body);
    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });
    res.json(updatedCustomer);
  });

  app.delete('/api/customers/:id', async (req, res) => {
    await storage.deleteCustomer(Number(req.params.id));
    res.status(204).send();
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
    try {
      const body = req.body;
      if (body.object) {
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

    // Seed customers
    await storage.createCustomer({
      name: "Bob Farmer",
      email: "bob@farmer.com",
      phone: "555-1234",
      farmName: "Bob's Bovines",
      animalCount: 100,
      address: "123 Farm Road",
      status: "active",
      tags: "dairy, local"
    });

    await storage.createCustomer({
      name: "Charlie Rancher",
      email: "charlie@rancher.com",
      phone: "555-5678",
      farmName: "Charlie's Cattle Co.",
      animalCount: 250,
      address: "456 Rancher Ave",
      status: "active",
      tags: "beef, organic"
    });
  }
}
