
import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import OpenAI from "openai";
import { registerPlatformRoutes } from "./routes/platforms";
import voiceRouter from "./routes/voice";
import botsRouter from "./routes/bots";
import crmRouter from "./routes/crm"; // Import the new CRM router

const openai = new OpenAI({
  apiKey: "gpt4free-dummy-key", // This will be replaced by user's key
  baseURL: "http://localhost:8080/v1", // Default for local gpt4free server
});

// Minimal AI functions remain for now
async function analyzeSentiment(text: string) {
  // This can be enhanced or moved later
  return 'neutral'; 
}

async function generateResponse(text: string, sentiment: string) {
  // This can be enhanced or moved later
  return "Thank you for your message."; 
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === API Routes ===
  registerPlatformRoutes(app);
  app.use("/api/voice", voiceRouter);
  app.use("/api/bots", botsRouter);
  app.use("/api", crmRouter); // Use the new CRM router for all /api CRM routes

  // === AI & Webhooks (kept separate for clarity) ===

  // AI Sentiment/Response (can be moved to a dedicated AI module later)
  app.post(api.conversations.analyze.path, async (req, res) => {
    // This is now a simplified placeholder. The core logic is in the frontend.
    res.json({ sentiment: "neutral", suggestedResponse: "" });
  });

  // AI Content Generation
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
      res.json({ content });
    } catch (e) {
      res.status(500).json({ message: "Error generating content." });
    }
  });
  
  // AI Image Generation
  app.post('/api/ai/generate/image', async (req, res) => {
      try {
          const { prompt } = req.body;
          const response = await openai.images.generate({
              model: "dall-e-3",
              prompt: prompt,
              n: 1,
              size: "1024x1024",
          });
          res.json({ imageUrl: response.data[0].url });
      } catch (e) {
          res.status(500).json({ message: "Error generating image." });
      }
  });

  // Webhooks
  app.get(api.webhooks.metaVerify.path, (req, res) => {
    // Meta verification logic...
    res.sendStatus(200);
  });

  app.post(api.webhooks.meta.path, async (req, res) => {
    // Webhook event handling...
    res.sendStatus(200);
  });
  
  // No more database seeding here, Prisma handles it.

  return httpServer;
}
